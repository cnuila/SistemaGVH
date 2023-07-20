from rest_framework import serializers
from .models import Product

class ProductSerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField()
    providerName = serializers.ReadOnlyField(source='providerId.name')

    class Meta:
        model = Product
        fields = ["id", "code", "description", "cost", "sellingPrice", "quantity", "providerId", "providerName"]