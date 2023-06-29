from rest_framework import serializers
from .models import Providers

class ProvidersSerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField()

    class Meta:
        model = Providers
        fields = ["id", "name"]