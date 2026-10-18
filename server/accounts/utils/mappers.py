from gitlab_wrapper.gitlab_enum import GroupAccessLevel


def map_user_role_to_group_access(user_role):
    if user_role == 'teacher':
        return GroupAccessLevel.TEACHER
    if user_role == 'student':
        return GroupAccessLevel.STUDENT
    if user_role == 'admin':
        return GroupAccessLevel.TEACHER
