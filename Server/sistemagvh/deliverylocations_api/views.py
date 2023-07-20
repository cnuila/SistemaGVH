from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from auth_firebase.authentication import FirebaseAuthentication
from .models import DeliveryLocations
from .serializers import DeliveryLocationsSerializer

# methods under /deliverylocations
class DeliveryLocationsListApiView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [FirebaseAuthentication]

    # retrieve every delivery location on the db
    def get(self, request, *args, **kwargs):
        delivery_locations = DeliveryLocations.objects.order_by("id").select_related("deliveryZoneId")
        serializer = DeliveryLocationsSerializer(delivery_locations, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    # add a delivery location
    def post(self, request, *args, **kwargs):
        data = {
            'name': request.data.get('name'),
            'address': request.data.get('address'),
            'deliveryZoneId': request.data.get('deliveryZoneId')
        }
        serializer = DeliveryLocationsSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# methods under deliverylocations/<str:d_location_id>
class DeliveryLocationsDetailApiView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [FirebaseAuthentication]

    def get_delivery_location(self, d_location_id):
        try:
            return DeliveryLocations.objects.get(id=d_location_id)
        except DeliveryLocations.DoesNotExist:
            return None

    # get the delivery locaiton by id
    def get(self, request, d_location_id, *args, **kwargs):
        current_d_location = self.get_delivery_location(d_location_id)
        if not current_d_location:
            return Response(
                {"res": "No se encontró el Lugar de Entrega con ese Id."},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = DeliveryLocationsSerializer(current_d_location)
        return Response(serializer.data, status=status.HTTP_200_OK)

    # update the delivery location by id
    def put(self, request, d_location_id, *args, **kwargs):
        d_location_to_update = self.get_delivery_location(d_location_id)
        if not d_location_to_update:
            return Response(
                {"res": "No se encontró el Lugar de Entrega con ese Id."},
                status=status.HTTP_400_BAD_REQUEST
            )

        data = {
            'name': request.data.get('name'),
            'address': request.data.get('address'),
            'deliveryZoneId': request.data.get('deliveryZoneId')
        }
        serializer = DeliveryLocationsSerializer(instance = d_location_to_update, data=data, partial = True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # delete the delivary location by id
    def delete(self, request, d_location_id, *args, **kwargs):
        d_location_to_delete = self.get_delivery_location(d_location_id)
        if not d_location_to_delete:
            return Response(
                {"res": "No se encontró el Lugar de Entrega con ese Id."},
                status=status.HTTP_400_BAD_REQUEST
            )

        d_location_to_delete.delete()
        return Response(
            {"res": "Lugar de Entrega eliminado."},
            status=status.HTTP_200_OK
        )
    
class DeliveryLocationsNameListApiView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [FirebaseAuthentication]

    # retrieve every delivery location on the db and return only the name
    def get(self, request, *args, **kwargs):
        delivery_locations = DeliveryLocations.objects.order_by("name").values("name")
        #serializer = DeliveryLocationsSerializer(delivery_locations, many=True)
        return Response(list(delivery_locations), status=status.HTTP_200_OK)