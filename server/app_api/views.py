from django.db import transaction
from gitlab.exceptions import GitlabCreateError, GitlabUpdateError, GitlabDeleteError
from rest_framework import generics
from rest_framework import status
from rest_framework.response import Response

from app_auth.permissions import TeacherOrAdminPermission, AllAuthenticatedPermission, IsPartOfCourseOrAdmin, \
    AdminPermission, IsTeacherOfCourseOrAdmin
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
            # Group for storing homeworks and assignments created in panel
            homeworks_group_gitlab_dto = GroupDTO(name='Homeworks',
                                                  path='homeworks',
                                                  parent_id=gitlab_group.id
                                                  )
            gitlab.create_group(homeworks_group_gitlab_dto)

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
    permission_classes = [IsTeacherOfCourseOrAdmin]

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
    permission_classes = [IsTeacherOfCourseOrAdmin]


class MembershipCreateView(generics.CreateAPIView):
    serializer_class = MembershipCreationSerializer
    permission_classes = [IsTeacherOfCourseOrAdmin]

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

                gitlab.update_user_access_group(user.git_reference_id,
                                                existing_membership.git_reference_id,
                                                user_gitlab_access)
            else:
                # If the membership doesn't exist, create it
                membership = serializer.save()

                sub_group_name = (user.first_name + user.last_name).strip().replace(' ', '')
                sub_group_path = (user.first_name + user.last_name).strip().replace(' ', '-')
                create_group_gitlab_dto = GroupDTO(name=sub_group_name,
                                                   path=sub_group_path,
                                                   description=course.description,
                                                   parent_id=course.git_reference_id
                                                   )
                gitlab_group = gitlab.create_group(create_group_gitlab_dto)
                gitlab.add_user_to_group(user.git_reference_id, gitlab_group.id, user_gitlab_access)
                membership.git_reference_id = gitlab_group.id
                membership.save()


class MembershipDeleteView(generics.DestroyAPIView):
    queryset = Membership.objects.all()
    serializer_class = MembershipSerializer
    permission_classes = [IsTeacherOfCourseOrAdmin]

    def destroy(self, request, *args, **kwargs):
        try:
            return super().destroy(request, *args, **kwargs)
        except GitlabDeleteError as e:
            return Response({'error': f'Membership failed to delete in gitlab {e}'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': f'{e}'}, status=status.HTTP_400_BAD_REQUEST)

    def perform_destroy(self, instance):
        print(instance, 'sdasasdads')
        with transaction.atomic():
            user_git_reference = instance.user.git_reference_id
            membership_get_reference = instance.git_reference_id
            instance.delete()

            gitlab = GitLabWrapper()
            gitlab.delete_user_from_group(user_git_reference, membership_get_reference)
            # Update title and path of membership subgroup to mark as deleted
            membership_group_git = gitlab.get_group(membership_get_reference)
            membership_group_git.name = f'{membership_group_git.name}-deleted-{membership_group_git.id}'
            membership_group_git.path = f'{membership_group_git.path}-deleted-{membership_group_git.id}'
            membership_group_git.save()


class MembershipListForUser(generics.ListAPIView):
    serializer_class = MembershipSerializer
    permission_classes = [AllAuthenticatedPermission, IsPartOfCourseOrAdmin]

    def get_queryset(self):
        user = self.request.user
        return Membership.objects.filter(user=user).select_related('course')
