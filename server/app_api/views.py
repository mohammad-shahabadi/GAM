from app_auth.permissions import TeacherOrAdminPermission, AllAuthenticatedPermission, IsPartOfCourseOrAdmin, \
    AdminPermission
from rest_framework import generics
from rest_framework import status
from rest_framework.response import Response

from .models import Course, Membership
from .serializers import CourseSerializer, MembershipSerializer, MembershipCreationSerializer, CourseDetailSerializer


class CourseCreateView(generics.CreateAPIView):
    serializer_class = CourseSerializer
    permission_classes = [TeacherOrAdminPermission]

    def perform_create(self, serializer):
        # Save the course and add the current user as a member
        course = serializer.save()
        user = self.request.user
        Membership.objects.create(course=course, user=user, role='teacher')

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
    # todo how do i make it so that the user can only create a membership if they are part of the course?


class MembershipUpdateView(generics.UpdateAPIView):
    queryset = Membership.objects.all()
    serializer_class = MembershipSerializer
    permission_classes = [TeacherOrAdminPermission]
    # todo how do i make it so that the user can only create a membership if they are part of the course?


class MembershipListForUser(generics.ListAPIView):
    serializer_class = MembershipSerializer
    permission_classes = [AllAuthenticatedPermission, IsPartOfCourseOrAdmin]

    def get_queryset(self):
        user = self.request.user
        return Membership.objects.filter(user=user).select_related('course')
