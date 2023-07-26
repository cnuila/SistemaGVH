from rest_framework import serializers
from deliveryzones_api.models import DeliveryZones
from productdelivery_api.models import ProductDelivery

class DashboardSerializer(serializers.Serializer):
    productName = serializers.CharField(source='productId__description')
    quantity = serializers.IntegerField()

class DashboardDeliveriesByZoneSerializer(serializers.ModelSerializer):
    zone_id = serializers.IntegerField(source='id')
    deliveries = serializers.IntegerField()

    class Meta:
        model = DeliveryZones
        fields = ('zone_id', 'name', 'deliveries')

class MonthlyProductDeliverySerializer(serializers.ModelSerializer):
    month = serializers.IntegerField()
    totalDelivered = serializers.IntegerField()
    totalReturned = serializers.IntegerField()

    class Meta:
        model = ProductDelivery
        fields = ('month', 'totalDelivered', 'totalReturned')

class ProductExpirySerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductDelivery
        fields = ['id', 'Producto', 'RemainingDays', 'Lugar', 'Zone']