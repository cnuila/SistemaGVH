from rest_framework import serializers
from productdelivery_api.models import ProductDelivery

class DashboardSerializer(serializers.Serializer):
    productName = serializers.CharField(source='productId__description')
    quantity = serializers.IntegerField()
    
class AvgMonthlyDeliveredSerializer(serializers.Serializer):
    id = serializers.CharField(source='productId__id')
    productDescription = serializers.CharField(source='productId__description')
    totalDelivered = serializers.IntegerField()
    avgMonthlyDelivered = serializers.IntegerField()

class ProductExpirySerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductDelivery
        fields = ['id', 'Producto', 'RemainingDays', 'Lugar', 'Zone']