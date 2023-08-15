from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from auth_firebase.authentication import FirebaseAuthentication
from .models import Providers
from .serializers import ProvidersSerializer
from logs_api.logs_logic import addLog


# methods under /providers
class ProvidersListApiView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [FirebaseAuthentication]

    # retrieve every providers on the db
    def get(self, request, *args, **kwargs):
        providers = Providers.objects.order_by("id")
        serializer = ProvidersSerializer(providers, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    # add a provider
    def post(self, request, *args, **kwargs):
        data = {
            'name': request.data.get('name')
        }
        serializer = ProvidersSerializer(data=data)
        if serializer.is_valid():
            provider = serializer.save()
            addLog(request=request, description=f"Proveedor {provider.name} Agregado", user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# methods under providers/<str:provider_id>
class ProvidersDetailApiView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [FirebaseAuthentication]

    def get_provider(self, provider_id):
        try:
            return Providers.objects.get(id=provider_id)
        except Providers.DoesNotExist:
            return None

    # get the provider by id
    def get(self, request, provider_id, *args, **kwargs):
        current_provider = self.get_provider(provider_id)
        if not current_provider:
            return Response(
                {"res": "No se encontró el Proveedor con ese Id."},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = ProvidersSerializer(current_provider)
        return Response(serializer.data, status=status.HTTP_200_OK)

    # update the provider_id by id
    def put(self, request, provider_id, *args, **kwargs):
        provider_to_update = self.get_provider(provider_id)
        if not provider_to_update:
            return Response(
                {"res": "No se encontró el Proveedor con ese Id."},
                status=status.HTTP_400_BAD_REQUEST
            )

        data = {
            'name': request.data.get('name')
        }
        serializer = ProvidersSerializer(instance = provider_to_update, data=data, partial = True)
        if serializer.is_valid():
            provider = serializer.save()
            addLog(request=request, description=f"Proveedor {provider.name} Editado", user=request.user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # delete the provider by id
    def delete(self, request, provider_id, *args, **kwargs):
        provider_to_delete = self.get_provider(provider_id)
        if not provider_to_delete:
            return Response(
                {"res": "No se encontró el Proveedor con ese Id."},
                status=status.HTTP_400_BAD_REQUEST
            )

        provider_to_delete.delete()
        addLog(request=request, description=f"Proveedor {provider_to_delete.name} Eliminado", user=request.user)

        return Response(
            {"res": "Proveedor eliminado."},
            status=status.HTTP_200_OK
        )