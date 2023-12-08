from .models import User
from rest_framework import serializers

from .models import UserRoles


class UserRolesSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserRoles
        fields = '__all__'


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'student_number']

