from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from auth_firebase.authentication import FirebaseAuthentication
from productdelivery_api.models import ProductDelivery
from .serializers import DashboardSerializer
from django.db.models import Sum

# methods under /Dashboard/PBL
class DashboardProductsByLocationApiView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [FirebaseAuthentication]

    # retrieve products by Location selected on the db
    def get(self, request, location_id, *args, **kwargs):
        productsByLocation = ProductDelivery.objects.filter(deliveryLocationId = location_id).values('productId__description').annotate(quantity=Sum('quantityDelivered'))
        serializer = DashboardSerializer(productsByLocation, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)