from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from auth_firebase.authentication import FirebaseAuthentication
from .serializers import DashboardSerializer, DashboardDeliveriesByZoneSerializer, MonthlyProductDeliverySerializer
from django.db.models import Sum, Avg, F, Count, Value, Func, IntegerField, ExpressionWrapper, When, Case, DateField
from django.http import JsonResponse
from deliveryzones_api.models import DeliveryZones
from deliverylocations_api.models import DeliveryLocations
from productdelivery_api.models import ProductDelivery
from django.db.models.functions import ExtractMonth, Coalesce,Cast
from datetime import date, timedelta



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
        product_deliveries = ProductDelivery.objects.filter( expirationDate__lte = date.today() + timedelta(days=18) ).annotate(
            name=F('productId__description'),
            remainingDays=(F('expirationDate') - date.today()),
        ).values('id','name', 'remainingDays')

        return Response(product_deliveries, status=status.HTTP_200_OK)