from rest_framework import serializers
from .models import UserRoles
from django.contrib.auth.models import User

class UserRolesSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserRoles
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email']