from rest_framework import permissions

from .models import UserRoles


class AdminPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and UserRoles.objects.filter(user=request.user,
                                                                          roles__role='admin').exists()


class SelfOrAdminPermission(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return request.user.is_authenticated and (
                    obj == request.user or UserRoles.objects.filter(user=request.user, roles__role='admin').exists())


class TeacherOrAdminPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and (UserRoles.objects.filter(user=request.user,
                                                                           roles__role='teacher').exists() or UserRoles.objects.filter(
            user=request.user, roles__role='admin').exists())


class StudentOrAdminPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and (UserRoles.objects.filter(user=request.user,
                                                                           roles__role='student').exists() or UserRoles.objects.filter(
            user=request.user, roles__role='admin').exists())


class AllAuthenticatedPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated


class UnauthenticatedPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        return True


from rest_framework import permissions
from app_api.models import Membership


# class IsPartOfCourse(permissions.BasePermission):
#     def has_object_permission(self, request, view, obj):
#         user = request.user
#         return Membership.objects.filter(user=user, course=obj).exists()

class IsPartOfCourseOrAdmin(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        user = request.user
        return Membership.objects.filter(user=user, course=obj).exists() or UserRoles.objects.filter(user=user,
                                                                                                     roles__role='admin').exists()
