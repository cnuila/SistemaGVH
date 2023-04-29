from rest_framework import serializers
from .models import DeliveryLocations

class DeliveryLocationsSerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField()

    class Meta:
        model = DeliveryLocations
        fields = ["id", "name", "address"]