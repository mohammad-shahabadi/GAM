from django.db import transaction
from gitlab.exceptions import GitlabCreateError, GitlabUpdateError, GitlabDeleteError
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
            return Response({'error': f'Class failed to create in gitlab {e}'}, status=status.HTTP_400_BAD_REQUEST)
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

    def update(self, request, *args, **kwargs):
        try:
            return super().update(request, *args, **kwargs)
        except GitlabUpdateError as e:
            return Response({'error': f'Class failed to update in gitlab {e}'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': f'{e}'}, status=status.HTTP_400_BAD_REQUEST)

    def perform_update(self, serializer):
        with transaction.atomic():
            course = serializer.save()
            gitlab = GitLabWrapper()
            create_group_gitlab_dto = GroupDTO(name=course.title,
                                               path=course.git_path,
                                               description=course.description)
            gitlab.update_group(course.git_reference_id, create_group_gitlab_dto)


class CourseDeleteView(generics.DestroyAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [TeacherOrAdminPermission, IsPartOfCourseOrAdmin]


class MembershipCreateView(generics.CreateAPIView):
    serializer_class = MembershipCreationSerializer
    permission_classes = [TeacherOrAdminPermission]

    def create(self, request, *args, **kwargs):
        try:
            return super().create(request, *args, **kwargs)
        except GitlabCreateError as e:
            return Response({'error': f'Membership failed to create in gitlab {e}'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': f'{e}'}, status=status.HTTP_400_BAD_REQUEST)

    def perform_create(self, serializer):
        with transaction.atomic():
            course = serializer.validated_data['course']
            user = serializer.validated_data['user']

            # Check if the membership already exists
            existing_membership = Membership.objects.filter(course=course, user=user).first()

            gitlab = GitLabWrapper()
            user_gitlab_access = map_user_role_to_group_access(user.role)

            if existing_membership:
                # If the membership exists, update the role
                existing_membership.role = serializer.validated_data.get('role', 'student')
                existing_membership.save()
                serializer.instance = existing_membership
                gitlab.update_user_access_group(user.git_reference_id, course.git_reference_id, user_gitlab_access)
            else:
                # If the membership doesn't exist, create it
                serializer.save()
                gitlab.add_user_to_group(user.git_reference_id, course.git_reference_id, user_gitlab_access)


class MembershipDeleteView(generics.DestroyAPIView):
    queryset = Membership.objects.all()
    serializer_class = MembershipSerializer
    permission_classes = [TeacherOrAdminPermission]

    def destroy(self, request, *args, **kwargs):
        try:
            return super().destroy(request, *args, **kwargs)
        except GitlabDeleteError as e:
            return Response({'error': f'Membership failed to delete in gitlab {e}'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': f'{e}'}, status=status.HTTP_400_BAD_REQUEST)

    def perform_destroy(self, instance):
        with transaction.atomic():
            user_git_reference = instance.user.git_reference_id
            course_git_reference = instance.course.git_reference_id
            instance.delete()

            gitlab = GitLabWrapper()
            gitlab.delete_user_from_group(user_git_reference, course_git_reference)


class MembershipListForUser(generics.ListAPIView):
    serializer_class = MembershipSerializer
    permission_classes = [AllAuthenticatedPermission, IsPartOfCourseOrAdmin]

    def get_queryset(self):
        user = self.request.user
        return Membership.objects.filter(user=user).select_related('course')
