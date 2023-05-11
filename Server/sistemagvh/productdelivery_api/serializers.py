from rest_framework import serializers
from .models import ProductDelivery


# #import models from other apps
# from deliverylocations_api.models import DeliveryLocations
# from products_api.models import Product

class ProductDeliverySerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField()

    class Meta:
        model = ProductDelivery
        fields = ["id", "deliveryLocationId", "productId", "expirationDate", "quantityDelivered", "quantityReturned", "soldPrice"]
 