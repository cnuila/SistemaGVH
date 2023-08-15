from django.shortcuts import render
from logs_api.logs_logic import addLog
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from auth_firebase.authentication import FirebaseAuthentication
from django.utils import timezone
from datetime import timedelta

from .models import ProductDelivery
from .serializers import ProductDeliverySerializer
#APIs included in this view
from deliverylocations_api.models import DeliveryLocations
from products_api.models import Product

# methods under /productDelivery
class ProductDeliveryListApiView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [FirebaseAuthentication]

    def get(self, request, *args, **kwargs):
        product_delivery = ProductDelivery.objects.order_by('expirationDate').select_related(
                'deliveryLocationId', 'productId'
            ).values(
                'id',
                'deliveryLocationId__name',
                'productId__description',
                'expirationDate',
                'quantityDelivered',
                'quantityReturned',
                'soldPrice',
                'deliveryDate'
            )
        return Response(product_delivery, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):

        data = {
            'deliveryLocationId': request.data.get('deliveryLocationId'),
            'productId': request.data.get('productId'),
            'expirationDate': request.data.get('expirationDate'),
            'quantityDelivered': request.data.get('quantityDelivered'),
            'quantityReturned': None,
            'soldPrice': request.data.get('soldPrice'),
            'deliveryDate': request.data.get('deliveryDate')
        }
        
        serializer = ProductDeliverySerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            addLog(request=request, description="Delivery Creado", user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# methods under productDelivery/<str:productDelivery_id>
class ProductDeliveryDetailApiView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [FirebaseAuthentication]

    def get_product_delivery(self, prod_deliv_id):
        try:
            return ProductDelivery.objects.get(id=prod_deliv_id)
        except ProductDelivery.DoesNotExist:
            return None

    # get the productDelivery locaiton by id
    def get(self, request, prod_deliv_id, *args, **kwargs):
        product_delivery = self.get_product_delivery(prod_deliv_id)
        if not product_delivery:
            return Response(
                {"res": "No se encontró el Product Delivery con ese Id."},
                status=status.HTTP_400_BAD_REQUEST
            )
        serializer = ProductDeliverySerializer(product_delivery)
        return Response(serializer.data, status=status.HTTP_200_OK)

    # update the delivery location by id
    def put(self, request, prod_deliv_id, *args, **kwargs):
        prod_deliv_to_update = self.get_product_delivery(prod_deliv_id)
        if not prod_deliv_to_update:
            return Response(
                {"res": "No se encontró el Product Delivery con ese Id."},
                status=status.HTTP_400_BAD_REQUEST
            )
        data = {
            'deliveryLocationId': request.data.get('deliveryLocationId'),
            'productId': request.data.get('productId'),
            'expirationDate': request.data.get('expirationDate'),
            'quantityDelivered': request.data.get('quantityDelivered'),
            'quantityReturned': request.data.get('quantityReturned'),
            'soldPrice': request.data.get('soldPrice'),
            'deliveryDate': request.data.get('deliveryDate')

        }
        serializer = ProductDeliverySerializer(instance = prod_deliv_to_update, data=data, partial = True)
        if serializer.is_valid():
            serializer.save()
            addLog(request=request, description="Delivery Editado", user=request.user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # delete the Product Delivery location by id
    def delete(self, request, prod_deliv_id, *args, **kwargs):
        prod_deliv_to_delete = self.get_product_delivery(prod_deliv_id)
        if not prod_deliv_to_delete:
            return Response(
                {"res": "No se encontró el Product Delivery con ese Id."},
                status=status.HTTP_400_BAD_REQUEST
            )

        prod_deliv_to_delete.delete()
        addLog(request=request, description="Delivery Eliminado", user=request.user)
        return Response(
            {"res": "Product Delivery eliminado."},
            status=status.HTTP_200_OK
        )

class ProductDeliveryListWithReturnsApiView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [FirebaseAuthentication]

    def get(self, request, *args, **kwargs):
        product_delivery = ProductDelivery.objects.exclude(quantityReturned__isnull=True).order_by('deliveryLocationId__name').select_related(
                'deliveryLocationId', 'productId'
            ).values(
                'id',
                'deliveryLocationId__name',
                'productId__description',
                'expirationDate',
                'quantityDelivered',
                'quantityReturned',
                'soldPrice',
                'deliveryDate'
            )
        return Response(product_delivery, status=status.HTTP_200_OK)
 