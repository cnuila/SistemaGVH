from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from auth_firebase.authentication import FirebaseAuthentication
from .serializers import DashboardSerializer, DashboardDeliveriesByZoneSerializer, MonthlyProductDeliverySerializer, ProductExpirySerializer
from django.db.models import Sum, Avg, F, Count, Value, Func, IntegerField, ExpressionWrapper, When, Case, DateField
from django.http import JsonResponse
from deliveryzones_api.models import DeliveryZones
from deliverylocations_api.models import DeliveryLocations
from productdelivery_api.models import ProductDelivery
from django.db.models.functions import ExtractMonth, Coalesce,Cast
from datetime import date, timedelta
from django.utils import timezone




# methods under /Dashboard/PBL
class DashboardProductsByLocationApiView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [FirebaseAuthentication]

    # retrieve products by Location selected on the db
    def get(self, request, location_id, *args, **kwargs):
        productsByLocation = ProductDelivery.objects.filter(deliveryLocationId = location_id).values('productId__description').annotate(quantity=Sum('quantityDelivered'))
        serializer = DashboardSerializer(productsByLocation, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class DashboardExpirationByProductApiView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [FirebaseAuthentication]

    # retrieve expiration avg by product selected on the db
    def get(self, request, product_id, *args, **kwargs):
        queryset = ProductDelivery.objects.filter( productId = product_id )
        queryset = queryset.annotate(avg_diff=Avg(F('expirationDate') - F('deliveryDate')))
        result = queryset.first()
        if result:
            expirationAVG = result.avg_diff
            if expirationAVG is not None:
                expiration_avg_days = round(expirationAVG.total_seconds() / (60 * 60 * 24))
        return Response(expiration_avg_days, status=status.HTTP_200_OK)

class DashboardDeliveriesByZoneApiView(APIView):
    def get(self, request):
        deliveries = DeliveryZones.objects.annotate(deliveries=Count('deliverylocations__productdelivery'))
        serializer = DashboardDeliveriesByZoneSerializer(deliveries, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

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
            RemainingDays=Avg(remaining_days_expression),
            Lugar=F('deliveryLocationId__address'),
            Zone=F('deliveryLocationId__deliveryZoneId__name'),
            Producto=F('productId__description')
        ).values('id', 'Producto', 'RemainingDays', 'Lugar', 'Zone')

        serializer = ProductExpirySerializer(queryset, many=True)

        raw_query = str(queryset.query)

        print(raw_query)
        return Response(serializer.data)

