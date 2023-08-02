from rest_framework import serializers
from productdelivery_api.models import ProductDelivery

class DashboardSerializer(serializers.Serializer):
    productName = serializers.CharField(source='productId__description')
    quantity = serializers.IntegerField()
    
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