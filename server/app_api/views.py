from decouple import config
from django.db import transaction
from gitlab.exceptions import GitlabCreateError, GitlabUpdateError, GitlabDeleteError
from rest_framework import generics
from rest_framework import status
from rest_framework.response import Response

from app_auth.models import User
from app_auth.permissions import TeacherOrAdminPermission, AllAuthenticatedPermission, IsPartOfCourseOrAdmin, \
    AdminPermission, IsTeacherOfCourseOrAdmin, IsTeacherOfCourseOrAdminForMemberShip, IsPartOfCourseOrAdminForProblem, \
    IsPartOfCourseOrAdminForProblemSet, IsTeacherOrTaOfCourseOrAdminForProblemSet, \
    IsTeacherOrTaOfCourseOrAdminForProblem, CanModifySubmission, GetRepositoryPermission
from app_auth.utils.mappers import map_user_role_to_group_access
from gitlab_wrapper.gitlab_dto import GroupDTO, ProjectDTO, VariableDTO
from gitlab_wrapper.gitlab_wrapper import GitLabWrapper
from gitlab_wrapper.helper import gitlab_ci_renderer
from .models import Course, Membership, ProblemSet, Problem, Submission, Repository
from .serializers import CourseSerializer, MembershipSerializer, MembershipCreationSerializer, CourseDetailSerializer, \
    ProblemSetSerializer, ProblemSerializer, ProblemSetUpdateSerializer, ProblemUpdateSerializer, \
    SubmissionSerializer, RepositorySerializer, SubmissionListViewSerializer


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
            if user.is_superuser is False:
                Membership.objects.create(course=course, user=user, role='teacher')

            # gitlab = GitLabWrapper()
            # create_group_gitlab_dto = GroupDTO(name=course.title,
            #                                    path=course.git_path,
            #                                    description=course.description)
            # gitlab_group = gitlab.create_group(create_group_gitlab_dto)
            # # Group for storing homeworks and assignments created in panel
            # homeworks_group_gitlab_dto = GroupDTO(name='Homeworks',
            #                                       path='homeworks',
            #                                       parent_id=gitlab_group.id
            #                                       )
            # gitlab_homework_group = gitlab.create_group(homeworks_group_gitlab_dto)
            #
            # user_gitlab_access = map_user_role_to_group_access(user.role)
            #
            # if user.is_superuser is False:
            #     gitlab.add_user_to_group(user_id=user.git_reference_id, group_id=gitlab_group.id,
            #                              access_level=user_gitlab_access)
            course.git_reference_id = 12
            course.git_homeworks_reference_id = 12
            course.save()
            # self.create_course_variables_in_git(gitlab, course)

    def create_course_variables_in_git(self, git: GitLabWrapper, course: Course):
        print("COURSE SECRET : ")
        print(course.git_secret_key)
        course_reference_variable = VariableDTO(
            key='GAM_COURSE_ID',
            value=str(course.id),
            protected=False,
            masked=False
        )
        course_git_secret_key = VariableDTO(
            key='GAM_COURSE_SECRET',
            value=course.git_secret_key,
            protected=False,
            masked=True
        )
        gam_external_url = VariableDTO(
            key='GAM_EXTERNAL_URL',
            value=config('EXTERNAL_URL'),
            protected=False,
            masked=True
        )
        git.create_group_variable(course.git_reference_id, course_reference_variable)
        git.create_group_variable(course.git_reference_id, course_git_secret_key)
        git.create_group_variable(course.git_reference_id, gam_external_url)


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
            # gitlab = GitLabWrapper()
            # create_group_gitlab_dto = GroupDTO(name=course.title,
            #                                    path=course.git_path,
            #                                    description=course.description)
            # gitlab.update_group(course.git_reference_id, create_group_gitlab_dto)


class CourseDeleteView(generics.DestroyAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [IsTeacherOfCourseOrAdmin]

    def destroy(self, request, *args, **kwargs):
        try:
            return super().destroy(request, *args, **kwargs)
        except GitlabDeleteError as e:
            return Response({'error': f'Class failed to delete in gitlab {e}'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': f'{e}'}, status=status.HTTP_400_BAD_REQUEST)

    def perform_destroy(self, instance):
        with transaction.atomic():
            class_git_reference = instance.git_reference_id
            instance.delete()
            # gitlab = GitLabWrapper()
            # gitlab.delete_group(class_git_reference)


class MembershipCreateView(generics.CreateAPIView):
    serializer_class = MembershipCreationSerializer
    permission_classes = [IsTeacherOfCourseOrAdminForMemberShip]

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
            email = serializer.validated_data['email']
            user = User.objects.get(email=email)

            # Check if the membership already exists
            existing_membership = Membership.objects.filter(course=course, user=user).first()

            # gitlab = GitLabWrapper()
            user_gitlab_access = map_user_role_to_group_access(user.role)

            if user.is_superuser:
                return

            if existing_membership:
                # If the membership exists, update the role
                existing_membership.role = serializer.validated_data.get('role', 'student')
                existing_membership.save()
                serializer.instance = existing_membership

                # gitlab.update_user_access_group(user.git_reference_id,
                #                                 existing_membership.git_reference_id,
                #                                 user_gitlab_access)
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
                # gitlab_group = gitlab.create_group(create_group_gitlab_dto)
                # gitlab.add_user_to_group(user.git_reference_id, gitlab_group.id, user_gitlab_access)
                membership.git_reference_id = 12
                membership.save()


class MembershipDeleteView(generics.DestroyAPIView):
    queryset = Membership.objects.all()
    serializer_class = MembershipSerializer
    permission_classes = [IsTeacherOfCourseOrAdminForMemberShip]

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
            membership_get_reference = instance.git_reference_id
            instance.delete()

            # gitlab = GitLabWrapper()
            # gitlab.delete_user_from_group(user_git_reference, membership_get_reference)
            # Update title and path of membership subgroup to mark as deleted
            membership_group_git = 12
            membership_group_git.name = f'{membership_group_git.name}-deleted-'
            membership_group_git.path = f'{membership_group_git.path}-deleted-'
            membership_group_git.save()


class MembershipListForUser(generics.ListAPIView):
    serializer_class = MembershipSerializer
    permission_classes = [AllAuthenticatedPermission]

    def get_queryset(self):
        user = self.request.user
        return Membership.objects.filter(user=user).select_related('course')


class ProblemSetCreateView(generics.CreateAPIView):
    queryset = ProblemSet.objects.all()
    serializer_class = ProblemSetSerializer
    permission_classes = [IsTeacherOrTaOfCourseOrAdminForProblemSet]

    def create(self, request, *args, **kwargs):
        try:
            return super().create(request, *args, **kwargs)
        except GitlabCreateError as e:
            return Response({'error': f'Problem set failed to create in gitlab {e}'},
                            status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': f'{e}'}, status=status.HTTP_400_BAD_REQUEST)

    def perform_create(self, serializer):
        with transaction.atomic():
            problem_set = serializer.save()
            # gitlab = GitLabWrapper()
            git_parent_group_id = problem_set.course.git_homeworks_reference_id
            assert git_parent_group_id is not None, 'Course homeworks git reference id is not set'

            # problem_set_group_gitlab_dto = GroupDTO(name=problem_set.title,
            #                                         path=problem_set.git_path,
            #                                         parent_id=git_parent_group_id
            #                                         )
            # gitlab_group = gitlab.create_group(problem_set_group_gitlab_dto)
            problem_set.git_reference_id = 12
            serializer.save()
            # self.create_problem_set_variables_in_git(gitlab, problem_set)

    def create_problem_set_variables_in_git(self, git: GitLabWrapper, problem_set: ProblemSet):
        course_reference_variable = VariableDTO(
            key='GAM_PROBLEM_SET_ID',
            value=str(problem_set.id),
            protected=False,
            masked=False
        )
        git.create_group_variable(problem_set.git_reference_id, course_reference_variable)


class ProblemSetListView(generics.ListAPIView):
    queryset = ProblemSet.objects.all()
    serializer_class = ProblemSetSerializer
    permission_classes = [IsPartOfCourseOrAdminForProblemSet]

    def get_queryset(self):
        course_id = self.kwargs['course_id']
        return ProblemSet.objects.filter(course=course_id)


class ProblemSetDeleteView(generics.DestroyAPIView):
    queryset = ProblemSet.objects.all()
    serializer_class = ProblemSetSerializer
    permission_classes = [IsTeacherOrTaOfCourseOrAdminForProblemSet]

    def destroy(self, request, *args, **kwargs):
        try:
            return super().destroy(request, *args, **kwargs)
        except GitlabDeleteError as e:
            return Response({'error': f'Problem set failed to delete in gitlab {e}'},
                            status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': f'{e}'}, status=status.HTTP_400_BAD_REQUEST)

    def perform_destroy(self, instance):
        with transaction.atomic():
            problem_set_git_group_id = instance.git_reference_id
            instance.delete()
            # gitlab = GitLabWrapper()
            # gitlab.delete_group(problem_set_git_group_id)


class ProblemSetRetrieveView(generics.RetrieveAPIView):
    queryset = ProblemSet.objects.all()
    serializer_class = ProblemSetSerializer
    permission_classes = [IsPartOfCourseOrAdminForProblemSet]


class ProblemSetUpdateView(generics.UpdateAPIView):
    queryset = ProblemSet.objects.all()
    serializer_class = ProblemSetUpdateSerializer
    permission_classes = [IsTeacherOrTaOfCourseOrAdminForProblemSet]

    def update(self, request, *args, **kwargs):
        try:
            return super().update(request, *args, **kwargs)
        except GitlabUpdateError as e:
            return Response({'error': f'Problem set failed to update in gitlab {e}'},
                            status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': f'{e}'}, status=status.HTTP_400_BAD_REQUEST)

    def perform_update(self, serializer):
        with transaction.atomic():
            if serializer.instance.published:
                raise Exception('Cannot update published problem set')

            problem_set = serializer.save()
            # gitlab = GitLabWrapper()
            git_parent_group_id = problem_set.course.git_homeworks_reference_id
            assert git_parent_group_id is not None, 'Course homeworks git reference id is not set'

            # problem_set_group_gitlab_dto = GroupDTO(name=problem_set.title,
            #                                         path=problem_set.git_path,
            #                                         parent_id=git_parent_group_id
            #                                         )
            # gitlab.update_group(problem_set.git_reference_id, problem_set_group_gitlab_dto)


class ProblemSetPublishView(generics.UpdateAPIView):
    queryset = ProblemSet.objects.all()
    serializer_class = ProblemSetUpdateSerializer
    permission_classes = [IsTeacherOrTaOfCourseOrAdminForProblemSet]

    def update(self, request, *args, **kwargs):
        try:
            return super().update(request, *args, **kwargs)
        except GitlabCreateError as e:
            return Response({'error': f'Forking questions failed in gitlab {e}'},
                            status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': f'{e}'}, status=status.HTTP_400_BAD_REQUEST)

    def perform_update(self, serializer):
        with transaction.atomic():
            problem_set = serializer.instance
            problems = self.get_problems(problem_set.id)
            memberships = self.get_course_memberships(problem_set.course.id)

            if problem_set.published:
                raise Exception('Homework already published!')
            if len(problems) == 0:
                raise Exception('There are no questions for this homework')
            if len(memberships) == 0:
                raise Exception('There are no members to publish this homework')

            problem_set.published = True
            problem_set.save()

            # self.create_problem_set_groups_in_git(memberships, problem_set, problems)

    def create_problem_set_groups_in_git(
            self,
            memberships: [Membership],
            problem_set: ProblemSet,
            problems: [Problem]
    ):
        pass

    # git = GitLabWrapper()
    # user_problem_set_group = git.get_group(problem_set.git_reference_id)
    # user_problem_set_group.id = None
    # for membership in memberships:
    #     user_problem_set_group.parent_id = membership.git_reference_id
    #     user_problem_set_git = git.create_group(user_problem_set_group)
    #     self.create_problem_set_user_variables_in_git(git, problem_set.id, user_problem_set_git.id)
    #     for problem in problems:
    #         forked_project_id = git.fork_project(problem.git_reference_id, user_problem_set_git.id)
    #         forked_project = git.get_project(forked_project_id)
    #
    #         git.create_webhook(
    #             WebhookDTO(
    #                 project_id=forked_project.id,
    #                 url='http://localhost:8000/gitlab/webhook/pipeline',
    #                 pipeline_events=1
    #             )
    #         )
    #
    #         self.add_ci_cd_path(git, forked_project_id)
    #
    #         Repository(
    #             problem=problem,
    #             membership=membership,
    #             git_reference_id=forked_project.id,
    #             git_path=forked_project.path,
    #             git_http_url=forked_project.http_url
    #         ).save()

    def create_repositories(self, forked_projects: [ProjectDTO]):
        for fork_project in forked_projects:
            Repository(
                git_reference_id=fork_project.id,
                git_path=fork_project.path,
                git_http_url=fork_project.http_url
            ).save()

    def get_course_memberships(self, course_id):
        return Membership.objects.filter(course_id=course_id, role='student')

    def get_problems(self, problem_set_id):
        return Problem.objects.filter(problem_set_id=problem_set_id)

    def create_problem_set_user_variables_in_git(self, git: GitLabWrapper, problem_set_id, problem_set_user_git_id):
        course_reference_variable = VariableDTO(
            key='GAM_PROBLEM_SET_ID',
            value=str(problem_set_id),
            protected=False,
            masked=False
        )
        git.create_group_variable(problem_set_user_git_id, course_reference_variable)

    def add_ci_cd_path(self, git: GitLabWrapper, forked_project_id):
        update_project_dto = ProjectDTO()
        update_project_dto.ci_config_path = gitlab_ci_renderer.get_ci_config_path()
        git.update_project(forked_project_id, update_project_dto)


class ProblemCreateView(generics.CreateAPIView):
    queryset = Problem.objects.all()
    serializer_class = ProblemSerializer
    permission_classes = [IsTeacherOrTaOfCourseOrAdminForProblem]

    def create(self, request, *args, **kwargs):
        try:
            return super().create(request, *args, **kwargs)
        except GitlabCreateError as e:
            return Response({'error': f'Problem failed to create in gitlab {e}'},
                            status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': f'{e}'}, status=status.HTTP_400_BAD_REQUEST)

    def perform_create(self, serializer):
        with transaction.atomic():
            problem = serializer.save()
            if problem.problem_set.published:
                raise Exception('Cannot create problem in published problem set')
            # gitlab = GitLabWrapper()

            # create_project_dto = ProjectDTO(
            #     name=problem.title,
            #     namespace_id=problem.problem_set.git_reference_id,
            #     path=problem.git_path,
            #     ci_config_path=gitlab_ci_renderer.get_ci_config_path()
            # )
            # project_gitlab = gitlab.create_project(problem.content, create_project_dto)
            problem.git_reference_id = 12
            problem.git_http_url = 'sssss'
            serializer.save()


class ProblemListView(generics.ListAPIView):
    serializer_class = ProblemSerializer
    permission_classes = [IsPartOfCourseOrAdminForProblem]

    def get_queryset(self):
        problem_set_id = self.kwargs['problem_set_id']
        return Problem.objects.filter(problem_set=problem_set_id)


class ProblemDeleteView(generics.DestroyAPIView):
    queryset = Problem.objects.all()
    serializer_class = ProblemSerializer
    permission_classes = [IsTeacherOrTaOfCourseOrAdminForProblem]

    def destroy(self, request, *args, **kwargs):
        try:
            return super().destroy(request, *args, **kwargs)
        except GitlabDeleteError as e:
            return Response({'error': f'Problem failed to delete in gitlab {e}'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': f'{e}'}, status=status.HTTP_400_BAD_REQUEST)

    def perform_destroy(self, instance):
        with transaction.atomic():
            if instance.problem_set.published:
                raise Exception('Cannot delete problem in published problem set')
            problem_git_id = instance.git_reference_id
            instance.delete()
            # gitlab = GitLabWrapper()
            # gitlab.delete_project(problem_git_id)


class ProblemRetrieveView(generics.RetrieveAPIView):
    queryset = Problem.objects.all()
    serializer_class = ProblemSerializer
    permission_classes = [IsPartOfCourseOrAdminForProblem]


class ProblemUpdateView(generics.UpdateAPIView):
    queryset = Problem.objects.all()
    serializer_class = ProblemUpdateSerializer
    permission_classes = [IsTeacherOrTaOfCourseOrAdminForProblem]

    def update(self, request, *args, **kwargs):
        try:
            return super().update(request, *args, **kwargs)
        except GitlabUpdateError as e:
            return Response({'error': f'Problem failed to update in gitlab {e}'},
                            status=status.HTTP_400_BAD_REQUEST)
        except GitlabCreateError as e:
            return Response({'error': f'Failed to update README in gitlab {e}'},
                            status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': f'{e}'}, status=status.HTTP_400_BAD_REQUEST)

    def perform_update(self, serializer):
        with transaction.atomic():
            if serializer.instance.problem_set.published:
                raise Exception('Cannot update problem in published problem set')
            content = serializer.instance.content
            updated_content = serializer.validated_data.get('content')
            problem = serializer.save()

            # gitlab = GitLabWrapper()
            # create_project_dto = ProjectDTO(
            #     name=problem.title,
            #     namespace_id=problem.problem_set.git_reference_id,
            #     path=problem.git_path
            # )

            # gitlab.update_project(problem.git_reference_id, create_project_dto)
            # Compare the existing data with the updated data
            # if updated_content != content:
            # gitlab.update_readme_project(problem.git_reference_id, updated_content)


class RepositoryRetrieveView(generics.RetrieveAPIView):
    serializer_class = RepositorySerializer
    permission_classes = [GetRepositoryPermission]
    lookup_field = 'problem_id'

    def get_queryset(self):
        user = self.request.user
        problem_id = self.kwargs['problem_id']
        return Repository.objects.filter(membership__user_id=user.id, problem_id=problem_id).order_by('-id')


class SubmissionListView(generics.ListAPIView):
    serializer_class = SubmissionListViewSerializer
    permission_classes = [AllAuthenticatedPermission]

    def get_queryset(self):
        problem_set_id = self.kwargs.get('problem_set_id')
        user = ProblemSet.objects.get(id=problem_set_id).course.members.filter(id=self.request.user.id).first()
        if user and user.role == 'student':
            return Submission.objects.filter(repository__problem__problem_set_id=problem_set_id,
                                             repository__membership__user=self.request.user)
        else:
            return Submission.objects.filter(repository__problem__problem_set_id=problem_set_id)


class FinalSubmissionListView(generics.ListAPIView):
    serializer_class = SubmissionListViewSerializer
    permission_classes = [AllAuthenticatedPermission]

    def get_queryset(self):
        problem_set_id = self.kwargs.get('problem_set_id')
        user = ProblemSet.objects.get(id=problem_set_id).course.members.filter(id=self.request.user.id).first()
        if user and user.role == 'student':
            return Submission.objects.filter(repository__problem__problem_set_id=problem_set_id,
                                             repository__membership__user=self.request.user,
                                             is_final=True)
        else:
            return Submission.objects.filter(repository__problem__problem_set_id=problem_set_id,
                                             is_final=True)


class SubmissionUpdateView(generics.UpdateAPIView):
    queryset = Submission.objects.all()
    serializer_class = SubmissionSerializer
    permission_classes = [CanModifySubmission]

    def update(self, request, *args, **kwargs):
        try:
            return super().update(request, *args, **kwargs)
        except Exception as e:
            return Response({'error': f'{e}'}, status=status.HTTP_400_BAD_REQUEST)

    def perform_update(self, serializer):
        with transaction.atomic():
            return serializer.save()


class SubmissionDeleteView(generics.DestroyAPIView):
    queryset = Submission.objects.all()
    serializer_class = SubmissionSerializer
    permission_classes = [CanModifySubmission]

    def destroy(self, request, *args, **kwargs):
        try:
            return super().destroy(request, *args, **kwargs)
        except Exception as e:
            return Response({'error': f'{e}'}, status=status.HTTP_400_BAD_REQUEST)

    def perform_destroy(self, instance):
        with transaction.atomic():
            instance.delete()
