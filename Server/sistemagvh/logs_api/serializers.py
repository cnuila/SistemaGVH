from rest_framework import serializers
from .models import Log

class LogSerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField()

    class Meta:
        model = Log
        fields = '__all__'