from rest_framework import serializers

from app_auth.serializers import UserSerializer
from .models import Course, Membership, ProblemSet, Problem
from app_auth.models import User


class CourseSerializer(serializers.ModelSerializer):
    members = UserSerializer(many=True, read_only=True)

    class Meta:
        model = Course
        fields = '__all__'


class MemberShipCourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ['title', 'description']


class MembershipSerializer(serializers.ModelSerializer):
    course = MemberShipCourseSerializer()

    class Meta:
        model = Membership
        fields = '__all__'


class MembershipCreationSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(write_only=True)  # Add an email field

    class Meta:
        model = Membership
        fields = ['id', 'course', 'email', 'role']  # Replace 'user' with 'email'

    def create(self, validated_data):
        email = validated_data.pop('email')
        user = User.objects.get(email=email)
        membership = Membership.objects.create(user=user, **validated_data)
        return membership


class UserMembershipSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source='user.email', read_only=True)
    first_name = serializers.CharField(source='user.first_name', read_only=True)
    last_name = serializers.CharField(source='user.last_name', read_only=True)
    student_number = serializers.CharField(source='user.student_number', read_only=True)

    class Meta:
        model = Membership
        fields = ['id', 'email', 'role', 'first_name', 'last_name', 'student_number']


class CourseDetailSerializer(serializers.ModelSerializer):
    memberships = UserMembershipSerializer(many=True, read_only=True)

    class Meta:
        model = Course
        fields = ['id', 'title', 'description', 'memberships', 'password', 'professor', 'term']


class ProblemSetSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProblemSet
        fields = '__all__'


class ProblemSetUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProblemSet
        fields = ['title', 'start', 'end', 'published', 'git_path']


class ProblemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Problem
        fields = '__all__'


class ProblemUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Problem
        fields = ['title', 'priority', 'points', 'content', 'git_path']
