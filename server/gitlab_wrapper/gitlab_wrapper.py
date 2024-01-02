from decouple import config
from gitlab import Gitlab
from .gitlab_dto import GroupDTO, UserDTO, ProjectDTO
from .webhook_dto import TestReportDTO
from .gitlab_enum import GroupAccessLevel
import os

class GitLabWrapper:
    def __init__(self):
        gitlab_url = config('GITLAB_URL')
        access_token = config('ACCESS_TOKEN')
        self._gl = Gitlab(gitlab_url, private_token=access_token)

    '''
        # User Section 
    '''

    def create_user(self, user_dto: UserDTO) -> UserDTO:
        user = self._gl.users.create(
            {
                **user_dto.serialize_without_none(),
                'reset_password': False,
                # Ensure user can't creat top level group
                'can_create_group': False,
            }
        )
        user_dto.id = user.get_id()
        return user_dto

    # Username, Name and Email is required to update user (IDK WHY ?)
    def update_user(self, user_dto: UserDTO) -> UserDTO:
        assert user_dto.name is not None, 'Name is required for updating user'
        assert user_dto.username is not None, 'Username is required for updating user'
        assert user_dto.email is not None, 'Email is required for updating user'

        self._gl.users.update(
            id=user_dto.id,
            new_data=user_dto.serialize_without_none()
        )
        return user_dto

    def delete_user(self, user_dto: UserDTO):
        self._gl.users.delete(id=user_dto.id)

    def activate_user(self, user_dto: UserDTO):
        self._gl.http_post(f'/users/{user_dto.id}/activate')

    def deactivate_user(self, user_dto: UserDTO):
        self._gl.http_post(f'/users/{user_dto.id}/deactivate')

    '''
        # Group Section 
        * Use same methods for creating subgroups
    '''

    def create_group(self, create_group_dto: GroupDTO) -> GroupDTO:
        group = self._gl.groups.create(
            {
                **create_group_dto.serialize_without_none(),
                'subgroup_creation_level': 'owner',
                'create_group_dic': 'maintainer'
            }
        )
        create_group_dto.id = group.get_id()
        return create_group_dto

    def update_group(self, group_id, update_group_dto: GroupDTO):
        self._gl.groups.update(
            id=group_id,
            new_data=update_group_dto.serialize_without_none()
        )
        return update_group_dto

    def get_group(self, group_id):
        group_git = self._gl.groups.get(
            id=group_id
        )
        return GroupDTO(
            id=group_git.id,
            name=group_git.name,
            path=group_git.path,
            parent_id=group_git.parent_id,
            description=group_git.description
        )

    def delete_group(self, group_id):
        self._gl.groups.delete(id=group_id)

    def add_user_to_group(self, user_id, group_id, access_level: GroupAccessLevel):
        group = self._gl.groups.get(group_id)
        user = self._gl.users.get(user_id)
        if group and user:
            group.members.create(
                {
                    'user_id': user.id,
                    'access_level': access_level.value
                }
            )
        else:
            raise Exception('Invalid user or group.')

    def delete_user_from_group(self, user_id, group_id):
        group = self._gl.groups.get(group_id)
        user = self._gl.users.get(user_id)
        if group and user:
            group.members.delete(
                id=user.id,
            )
        else:
            raise Exception('Invalid user or group.')

    def update_user_access_group(self, user_id, group_id, access_level: GroupAccessLevel):
        group = self._gl.groups.get(group_id)
        user = self._gl.users.get(user_id)
        if group and user:
            group.members.update(
                id=user.id,
                new_data={
                    'access_level': access_level.value
                }
            )
        else:
            raise Exception('Invalid user or group.')

    def create_project(self, readme_content, create_project_dto: ProjectDTO) -> ProjectDTO:
        project = self._gl.projects.create(
            {
                **create_project_dto.serialize_without_none(),
                'default_branch': 'master',
                'initialize_with_readme': True
            }
        )
        create_project_dto.id = project.get_id()
        create_project_dto.http_url = project.http_url_to_repo

        self.update_readme_project(create_project_dto.id, readme_content)
        self.initiate_java_project(create_project_dto.id)
        # Create Branch for Students
        project.branches.create({
            'branch': 'dev',
            'ref': 'master'
        })



        return create_project_dto

    def update_project(self, project_id, update_project_dto: ProjectDTO) -> ProjectDTO:
        project = self._gl.projects.update(
            id=project_id,
            new_data=update_project_dto.serialize_without_none()
        )
        return update_project_dto

    def update_readme_project(self, project_id, readme_content):
        project = self._gl.projects.get(project_id)
        project.commits.create(
            {
                'branch': 'master',
                'commit_message': "Update README.md",
                'actions': [
                    {
                        'action': 'update',
                        'file_path': 'README.md',
                        'content': readme_content
                    }
                ]
            }
        )

    def delete_project(self, project_id):
        self._gl.projects.delete(id=project_id)

    def fork_projects_to_groups(self, super_group_to_create: GroupDTO, projects: [ProjectDTO], groups: [GroupDTO]):
        for group in groups:
            super_group_to_create.parent_id = group.id
            super_group = self.create_group(super_group_to_create)
            for project in projects:
                project_git = self._gl.projects.get(project.id)
                project_git.forks.create({'namespace_id': super_group.id})

    def initiate_java_project(self, project_id):
        project = self._gl.projects.get(project_id)

        java_base_files_path = '../resources/gitlab/java_repo_base'
        directory_path = os.path.join(os.path.dirname(__file__), java_base_files_path)
        print(directory_path)
        project.commits.create({
            'branch': 'master',
            'actions': [{
                'action': 'create',
                'file_path': file[len(directory_path) + 1:],
                'content': open(file, 'r').read(),
                'encoding': 'text'
            } for file in [os.path.join(root, file) for root, _, files in os.walk(directory_path) for file in files]],
            'commit_message': 'initiate java project'
        })

        project.hooks.create({'url': 'https://webhook.site/b7fd9e79-d774-44b2-a87d-e254f4dd72d7', 'push_events': 1})

    def get_test_report(self, project_id, pipeline_id) -> TestReportDTO:
        project = self._gl.projects.get(project_id)
        pipeline = project.pipelines.get(pipeline_id)
        return pipeline.test_report.get()

