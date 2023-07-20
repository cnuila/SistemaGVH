from rest_framework import serializers
from .models import DeliveryZones

class DeliveryZonesSerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField()

    class Meta:
        model = DeliveryZones
        fields = ["id", "name"]