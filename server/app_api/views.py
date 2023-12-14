from app_auth.permissions import TeacherOrAdminPermission, AllAuthenticatedPermission, IsPartOfCourseOrAdmin, \
    AdminPermission
from rest_framework import generics
from rest_framework import status
from rest_framework.response import Response

from .models import Course, Membership
from .serializers import CourseSerializer, MembershipSerializer, MembershipCreationSerializer, CourseDetailSerializer

from gitlab_wrapper.gitlab_wrapper import GitLabWrapper
from gitlab_wrapper.gitlab_dto import GroupDTO


class CourseCreateView(generics.CreateAPIView):
    serializer_class = CourseSerializer
    permission_classes = [TeacherOrAdminPermission]

    def perform_create(self, serializer):
        # Save the course and add the current user as a member
        course = serializer.save()
        user = self.request.user
        Membership.objects.create(course=course, user=user, role='teacher')
        # try:
        #     gitlab = GitLabWrapper()
        #     group_path = course.title.replace(' ', '-') if ' ' in course.title else course.title
        #     group_gitlab_dto = GroupDTO(name=course.title, path=group_path)
        #     gitlab.create_group(group_gitlab_dto)
        # except Exception as e:
        #     print(f'Failed to create group in gitlab {e}')
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class CourseListView(generics.ListAPIView):
    serializer_class = CourseSerializer
    permission_classes = [AdminPermission]

    def get_queryset(self):
        return Course.objects.all()


class CourseDetailView(generics.RetrieveAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseDetailSerializer
    permission_classes = [IsPartOfCourseOrAdmin]


class CourseUpdateView(generics.UpdateAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [TeacherOrAdminPermission, IsPartOfCourseOrAdmin]


class CourseDeleteView(generics.DestroyAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [TeacherOrAdminPermission, IsPartOfCourseOrAdmin]


class MembershipCreateView(generics.CreateAPIView):
    serializer_class = MembershipCreationSerializer
    permission_classes = [TeacherOrAdminPermission]

    def perform_create(self, serializer):
        course = serializer.validated_data['course']
        user = serializer.validated_data['user']

        # Check if the membership already exists
        existing_membership = Membership.objects.filter(course=course, user=user).first()

        if existing_membership:
            # If the membership exists, update the role
            existing_membership.role = serializer.validated_data.get('role', 'student')
            existing_membership.save()
            serializer.instance = existing_membership
        else:
            # If the membership doesn't exist, create it
            serializer.save()


class MembershipDeleteView(generics.DestroyAPIView):
    queryset = Membership.objects.all()
    serializer_class = MembershipSerializer
    permission_classes = [TeacherOrAdminPermission]

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)


class MembershipListForUser(generics.ListAPIView):
    serializer_class = MembershipSerializer
    permission_classes = [AllAuthenticatedPermission, IsPartOfCourseOrAdmin]

    def get_queryset(self):
        user = self.request.user
        return Membership.objects.filter(user=user).select_related('course')
