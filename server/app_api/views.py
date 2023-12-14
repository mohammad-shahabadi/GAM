from django.db import transaction
from gitlab.exceptions import GitlabCreateError
from rest_framework import generics
from rest_framework import status
from rest_framework.response import Response

from app_auth.permissions import TeacherOrAdminPermission, AllAuthenticatedPermission, IsPartOfCourseOrAdmin, \
    AdminPermission
from app_auth.utils.mappers import map_user_role_to_group_access
from gitlab_wrapper.gitlab_dto import GroupDTO
from gitlab_wrapper.gitlab_wrapper import GitLabWrapper
from .models import Course, Membership
from .serializers import CourseSerializer, MembershipSerializer, MembershipCreationSerializer, CourseDetailSerializer


class CourseCreateView(generics.CreateAPIView):
    serializer_class = CourseSerializer
    permission_classes = [TeacherOrAdminPermission]

    def create(self, request, *args, **kwargs):
        try:
            return super().create(request, *args, **kwargs)
        except GitlabCreateError as e:
            return Response({'error': f'User failed to update in gitlab {e}'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': f'{e}'}, status=status.HTTP_400_BAD_REQUEST)

    def perform_create(self, serializer):
        # Save the course and add the current user as a member
        with transaction.atomic():
            course = serializer.save()
            user = self.request.user
            Membership.objects.create(course=course, user=user, role='teacher')

            gitlab = GitLabWrapper()
            create_group_gitlab_dto = GroupDTO(name=course.title,
                                               path=course.git_path,
                                               description=course.description)
            gitlab_group = gitlab.create_group(create_group_gitlab_dto)

            user_gitlab_access = map_user_role_to_group_access(user.role)

            if user.is_superuser is False:
                gitlab.add_user_to_group(user_id=user.git_reference_id, group_id=gitlab_group.id,
                                         access_level=user_gitlab_access)
            course.git_reference_id = gitlab_group.id
            course.save()
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
