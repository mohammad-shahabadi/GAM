from rest_framework import serializers

from accounts.serializers import UserSerializer
from .models import Course, Membership, ProblemSet, Problem, Submission, Repository
from accounts.models import User


class CourseSerializer(serializers.ModelSerializer):
    members = UserSerializer(many=True, read_only=True)

    class Meta:
        model = Course
        # git_secret_key authenticates GitLab CI and webhooks; it must never leave the server
        exclude = ['git_secret_key']
        read_only_fields = ['git_reference_id', 'git_homeworks_reference_id']


class MemberShipCourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ['title', 'description', 'id']


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


class SubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Submission
        fields = ['score_ratio', 'is_final']


class SubmissionListViewSerializer(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField()
    problem_title = serializers.SerializerMethodField()
    total_score = serializers.SerializerMethodField()

    class Meta:
        model = Submission
        fields = ['id', 'status', 'commit_sha', 'pipeline_id', 'repository', 'test_result',
                  'total_score', 'score_ratio', 'is_final', 'created_at', 'updated_at', 'user_name', 'problem_title']

    def get_user_name(self, obj):
        user = obj.repository.membership.user
        return user.first_name + " " + user.last_name

    def get_problem_title(self, obj):
        return obj.repository.problem.title

    def get_total_score(self, obj):
        return obj.repository.problem.points

class RepositorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Repository
        fields = '__all__'
