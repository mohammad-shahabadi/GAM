from enum import Enum


class UserAccessLevel(Enum):
    TEACHER = 'owner'
    TA = 'maintainer'
    STUDENT = 'developer'


class GroupAccessLevel(Enum):
    TEACHER = 50
    TA = 40
    STUDENT = 30
