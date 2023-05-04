from django.shortcuts import render
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

    # retrieve every productDelivery on the db
    # def get(self, request, *args, **kwargs):
    #     product_delivery = ProductDelivery.objects.order_by("expirationDate")
    #     serializer = ProductDeliverySerializer(product_delivery, many=True)
    #     return Response(serializer.data, status=status.HTTP_200_OK)
    def get(self, request, *args, **kwargs):
        one_day_ago = timezone.now() - timedelta(days=1)
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
            )
        return Response(product_delivery, status=status.HTTP_200_OK)

    
    # add a productDelivery
    # add a productDelivery
    def post(self, request, *args, **kwargs):
        delivery_location_name = request.data.get('deliveryLocationId__name')
        product_description = request.data.get('productId__description')

        try:
            delivery_location = DeliveryLocations.objects.get(name=delivery_location_name)
        except DeliveryLocations.DoesNotExist:
            return Response({"res": f"No se encontró la locación de entrega con el nombre: {delivery_location_name}"}, 
                status=status.HTTP_400_BAD_REQUEST)

        try:
            product = Product.objects.get(description=product_description)
        except Product.DoesNotExist:
            return Response({"res": f"No se encontró el producto con la descripción: {product_description}"}, 
                status=status.HTTP_400_BAD_REQUEST)

        data = {
            'deliveryLocationId': delivery_location.id,
            'productId': product.id,
            'expirationDate': request.data.get('expirationDate'),
            'quantityDelivered': request.data.get('quantityDelivered'),
            'quantityReturned': request.data.get('quantityReturned'),
            'soldPrice': request.data.get('soldPrice'),
        }
        serializer = ProductDeliverySerializer(data=data)
        if serializer.is_valid():
            serializer.save()
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
        prod_deliv_location = self.get_product_delivery(prod_deliv_id)
        if not prod_deliv_location:
            return Response(
                {"res": "No se encontró el Lugar de Entrega con ese Id."},
                status=status.HTTP_400_BAD_REQUEST
            )

        product_delivery = ProductDelivery.objects.values(
            'id',
            'deliveryLocationId__name',
            'productId__description',
            'expirationDate',
            'quantityDelivered',
            'quantityReturned',
            'soldPrice',
        ).first()
        if not product_delivery:
            return Response(
                {"res": "No se encontró el Product Delivery con ese Id."},
                status=status.HTTP_400_BAD_REQUEST
            )
        return Response(product_delivery, status=status.HTTP_200_OK)

    # update the delivery location by id
    def put(self, request, prod_deliv_id, *args, **kwargs):
        prod_deliv_to_update = self.get_product_delivery(prod_deliv_id)
        if not prod_deliv_to_update:
            return Response(
                {"res": "No se encontró el Product Delivery con ese Id."},
                status=status.HTTP_400_BAD_REQUEST
            )

        delivery_location_name = request.data.get('deliveryLocationId__name')
        product_description = request.data.get('productId__description')

        try:
            delivery_location = DeliveryLocations.objects.get(name=delivery_location_name)
        except DeliveryLocations.DoesNotExist:
            return Response({"res": f"No se encontró la locación de entrega con el nombre: {delivery_location_name}"}, 
                status=status.HTTP_400_BAD_REQUEST)

        try:
            product = Product.objects.get(description=product_description)
        except Product.DoesNotExist:
            return Response({"res": f"No se encontró el producto con la descripción: {product_description}"}, 
                status=status.HTTP_400_BAD_REQUEST)

        data = {
            'deliveryLocationId': delivery_location.id,
            'productId': product.id,
            'expirationDate': request.data.get('expirationDate'),
            'quantityDelivered': request.data.get('quantityDelivered'),
            'quantityReturned': request.data.get('quantityReturned'),
            'soldPrice': request.data.get('soldPrice')
        }
        serializer = ProductDeliverySerializer(instance = prod_deliv_to_update, data=data, partial = True)
        if serializer.is_valid():
            serializer.save()
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
        return Response(
            {"res": "Product Delivery eliminado."},
            status=status.HTTP_200_OK
        )
    

