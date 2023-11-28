from gitlab import Gitlab
from decouple import config
from gitlab_dto import GroupDTO, UserDTO

from gitlab_enum import GroupAccessLevel

from gitlab import Gitlab


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
        user_dto = user.get_id()
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
        return self._gl.groups.get(
            id=group_id
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
