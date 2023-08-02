import datetime
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from auth_firebase.authentication import FirebaseAuthentication
from .serializers import DashboardSerializer, MonthlyProductDeliverySerializer
from django.db.models import Sum, Avg, F, Value, Func, IntegerField, ExpressionWrapper, DurationField
from productdelivery_api.models import ProductDelivery
from django.db.models.functions import ExtractMonth, Coalesce
from django.utils import timezone


# methods under /Dashboard/PBL
class DashboardProductsByLocationApiView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [FirebaseAuthentication]

    # retrieve products by Location selected on the db
    def get(self, request, location_id, month, year, *args, **kwargs):
        productsByLocation = ProductDelivery.objects.filter(
            deliveryLocationId = location_id,
            deliveryDate__month=month,
            deliveryDate__year=year
        ).values('productId__description').annotate(quantity=Sum('quantityDelivered'))
        serializer = DashboardSerializer(productsByLocation, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class DashboardExpirationByProductApiView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [FirebaseAuthentication]

    # retrieve expiration avg by product selected on the db
    def get(self, request, product_id, *args, **kwargs):
        average_days_difference = ProductDelivery.objects.filter(productId_id=product_id).annotate(
            days_difference=ExpressionWrapper(
                F('expirationDate') - F('deliveryDate'),
                output_field=DurationField()
            )
        ).aggregate(average_days=Avg('days_difference'))['average_days']
        if average_days_difference is None:
            average_days_difference = 0
        else:
            average_days_difference /= (60 * 60 * 24)
        return Response({'ExpiryAVG': average_days_difference})

class DashboardMonthlyDeliveriesApiView(APIView):

    def get(self, request, year, *args, **kwargs):
        queryset = ProductDelivery.objects.filter(
            deliveryDate__year=year
        ).annotate(
            month=ExtractMonth('deliveryDate')
        ).values('month').annotate(
            totalDelivered=Coalesce(Sum('quantityDelivered'), Value(0)),
            totalReturned=Coalesce(Sum('quantityReturned'), Value(0))
        )
        serializer = MonthlyProductDeliverySerializer(queryset, many= True)

        return Response(serializer.data, status=status.HTTP_200_OK)
    
class DashboardExpiredProductsApiView(APIView):
    def get(self, request, *args, **kwargs):
        thirty_days_ago = timezone.now() - timezone.timedelta(days=30)

        remaining_days_expression = ExpressionWrapper(
            Func(F('expirationDate'), timezone.now(), function='DATEDIFF', template='%(function)s(day, %(expressions)s)'),
            output_field=IntegerField()
        )

        queryset = ProductDelivery.objects.filter(
            expirationDate__lte=timezone.now(),
            expirationDate__gte=thirty_days_ago
        ).annotate(
            remainingDays=Avg(remaining_days_expression),
            deliveryLocation=F('deliveryLocationId__address'),
            deliveryZone=F('deliveryLocationId__deliveryZoneId__name'),
            productName=F('productId__description')
        ).values('id', 'productName', 'remainingDays', 'deliveryLocation', 'deliveryZone')

        return Response(queryset, status=status.HTTP_200_OK)
