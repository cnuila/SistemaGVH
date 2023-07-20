from rest_framework import serializers
from .models import DeliveryLocations

class DeliveryLocationsSerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField()
    deliveryZoneName = serializers.ReadOnlyField(source="deliveryZoneId.name")

    class Meta:
        model = DeliveryLocations
        fields = ["id", "name", "address", "deliveryZoneId", "deliveryZoneName"]