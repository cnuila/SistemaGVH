from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from auth_firebase.authentication import FirebaseAuthentication
from .models import Product
from .serializers import ProductSerializer

# methods under /products
class ProductsListApiView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [FirebaseAuthentication]

    # retrieve every product on the db
    def get(self, request, *args, **kwargs):
        products = Product.objects.order_by("id").select_related('providerId')
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    # add a product
    def post(self, request, *args, **kwargs):
        data = {
            'code': request.data.get('code'),
            'description': request.data.get('description'),
            'cost': request.data.get('cost'),
            'sellingPrice': request.data.get('sellingPrice'),
            'quantity': request.data.get('quantity'),
            'providerId': request.data.get('providerId'),
        }
        serializer = ProductSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# methods under products/<str:product_id>
class ProductsDetailApiView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [FirebaseAuthentication]

    def get_product(self, product_id):
        try:
            return Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return None

    # get the product by id
    def get(self, request, product_id, *args, **kwargs):
        current_product = self.get_product(product_id)
        if not current_product:
            return Response(
                {"res": "No se encontró el producto con ese Id."},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = ProductSerializer(current_product)
        return Response(serializer.data, status=status.HTTP_200_OK)

    # update the product by id
    def put(self, request, product_id, *args, **kwargs):
        product_to_update = self.get_product(product_id)
        if not product_to_update:
            return Response(
                {"res": "No se encontró el producto con ese Id."},
                status=status.HTTP_400_BAD_REQUEST
            )

        data = {
            'code': request.data.get('code'),
            'description': request.data.get('description'),
            'cost': request.data.get('cost'),
            'sellingPrice': request.data.get('sellingPrice'),
            'quantity': request.data.get('quantity'),
            'providerId': request.data.get('providerId')
        }
        serializer = ProductSerializer(
            instance=product_to_update, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # delete the product by id
    def delete(self, request, product_id, *args, **kwargs):
        product_to_delete = self.get_product(product_id)
        if not product_to_delete:
            return Response(
                {"res": "No se encontró el producto con ese Id."},
                status=status.HTTP_400_BAD_REQUEST
            )

        product_to_delete.delete()
        return Response(
            {"res": "Producto eliminado."},
            status=status.HTTP_200_OK
        )
