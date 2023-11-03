import datetime
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from auth_firebase.authentication import FirebaseAuthentication
from .serializers import DashboardSerializer, AvgMonthlyDeliveredSerializer
from django.db.models import Sum, Avg, F, Value, Func, IntegerField, ExpressionWrapper, DurationField
from productdelivery_api.models import ProductDelivery
from django.db.models.functions import ExtractMonth, Coalesce
from django.utils import timezone
from datetime import date

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

class DashboardAvgMonthlyDeliveredApiView(APIView):

    def get(self, request, location_id, *args, **kwargs):

        current_date = date.today()
        start_date = current_date.replace(month=current_date.month - 3)

        queryset = ProductDelivery.objects.filter(
            deliveryLocationId = location_id,
            deliveryDate__gte=start_date,
            deliveryDate__lte=current_date,            
        ).values('productId__id', 'productId__description').annotate(
            avgMonthlyDelivered=Sum('quantityDelivered') / 3,
            totalDelivered=Sum('quantityDelivered')
        )

        serializer = AvgMonthlyDeliveredSerializer(queryset, many= True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class DashboardExpiredProductsApiView(APIView):
    def get(self, request, *args, **kwargs):

        remaining_days_expression = ExpressionWrapper(
            Func(
                timezone.now(),
                F('expirationDate'), 
                function='DATEDIFF', 
                template='%(function)s(day, %(expressions)s)'),
            output_field=IntegerField()
        )

        thirty_days_future = timezone.now() + timezone.timedelta(days=30)

        queryset = ProductDelivery.objects.filter(
            expirationDate__lte=thirty_days_future,
            observations__isnull=True,
            quantityReturned__isnull=True            
        ).annotate(
            remainingDays=Avg(remaining_days_expression),
            deliveryLocation=F('deliveryLocationId__name'),
            deliveryZone=F('deliveryLocationId__deliveryZoneId__name'),
            productName=F('productId__description')
        ).values('id', 'productName', 'remainingDays', 'deliveryLocation', 'deliveryZone')

        return Response(queryset, status=status.HTTP_200_OK)
