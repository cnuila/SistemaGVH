from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField()

    class Meta:
        model = User
        fields = ["id", "userName", "userUId", "firstName", "lastName", "isAdmin"]