from rest_framework import serializers

from .models import Course, Membership


class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = '__all__'


class MemberShipCourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ['title']


class MembershipSerializer(serializers.ModelSerializer):
    course = MemberShipCourseSerializer()

    class Meta:
        model = Membership
        fields = '__all__'


class MembershipCreationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Membership
        fields = ['course', 'user', 'role']


class UserMembershipSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source='user.email', read_only=True)

    class Meta:
        model = Membership
        fields = ['id', 'email', 'role']


class CourseDetailSerializer(serializers.ModelSerializer):
    memberships = UserMembershipSerializer(many=True, read_only=True)

    class Meta:
        model = Course
        fields = ['id', 'title', 'description', 'memberships', 'password', 'professor']
