from rest_framework import serializers

class DashboardSerializer(serializers.Serializer):
    productName = serializers.CharField(source='productId__description')
    quantity = serializers.IntegerField()