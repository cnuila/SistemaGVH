from rest_framework import serializers
from .models import ProductDelivery

class ProductDeliverySerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField()

    class Meta:
        model = ProductDelivery
        fields = ["id", "deliveryLocationId", "productId", "expirationDate", "quantityDelivered", "quantityReturned", "soldPrice","deliveryDate"]
 