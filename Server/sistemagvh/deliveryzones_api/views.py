from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from auth_firebase.authentication import FirebaseAuthentication
from .models import DeliveryZones
from .serializers import DeliveryZonesSerializer

# methods under /deliveryzones
class DeliveryZonesListApiView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [FirebaseAuthentication]

    # retrieve every delivery zone on the db
    def get(self, request, *args, **kwargs):
        delivery_zones = DeliveryZones.objects.order_by("id")
        serializer = DeliveryZonesSerializer(delivery_zones, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    # add a delivery zone
    def post(self, request, *args, **kwargs):
        data = {
            'name': request.data.get('name')
        }
        serializer = DeliveryZonesSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# methods under deliveryzones/<str:deliveryzone_id>
class DeliveryZonesDetailApiView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [FirebaseAuthentication]

    def get_delivery_zone(self, d_zone_id):
        try:
            return DeliveryZones.objects.get(id=d_zone_id)
        except DeliveryZones.DoesNotExist:
            return None

    # get the delivery zone by id
    def get(self, request, d_zone_id, *args, **kwargs):
        current_d_zone = self.get_delivery_zone(d_zone_id)
        if not current_d_zone:
            return Response(
                {"res": "No se encontró la Zona de Entrega con ese Id."},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = DeliveryZonesSerializer(current_d_zone)
        return Response(serializer.data, status=status.HTTP_200_OK)

    # update the delivery zone by id
    def put(self, request, d_zone_id, *args, **kwargs):
        d_zone_to_update = self.get_delivery_zone(d_zone_id)
        if not d_zone_to_update:
            return Response(
                {"res": "No se encontró la Zona de Entrega con ese Id."},
                status=status.HTTP_400_BAD_REQUEST
            )

        data = {
            'name': request.data.get('name')
        }
        serializer = DeliveryZonesSerializer(instance = d_zone_to_update, data=data, partial = True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # delete the delivery zone by id
    def delete(self, request, d_zone_id, *args, **kwargs):
        d_zone_to_delete = self.get_delivery_zone(d_zone_id)
        if not d_zone_to_delete:
            return Response(
                {"res": "No se encontró la Zona de Entrega con ese Id."},
                status=status.HTTP_400_BAD_REQUEST
            )

        d_zone_to_delete.delete()
        return Response(
            {"res": "Zona de Entrega eliminada."},
            status=status.HTTP_200_OK
        )