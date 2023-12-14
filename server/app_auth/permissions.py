from app_auth.models import User
from rest_framework import permissions
from app_api.models import Membership


class AdminPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and User.objects.filter(id=request.user.id,
                                                                     role='admin').exists()


class SelfOrAdminPermission(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return request.user.is_authenticated and (
                obj == request.user or User.objects.filter(id=request.user.id,
                                                           role='admin').exists())


class TeacherOrAdminPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and (User.objects.filter(id=request.user.id,
                                                                      role='teacher').exists()
                                                  or
                                                  User.objects.filter(id=request.user.id,
                                                                      role='admin').exists())


class StudentOrAdminPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and (User.objects.filter(id=request.user.id,
                                                                      role='student').exists()
                                                  or
                                                  User.objects.filter(id=request.user.id,
                                                                      role='admin').exists())


class AllAuthenticatedPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated


class UnauthenticatedPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        return True


# class IsPartOfCourse(permissions.BasePermission):
#     def has_object_permission(self, request, view, obj):
#         user = request.user
#         return Membership.objects.filter(user=user, course=obj).exists()

class IsPartOfCourseOrAdmin(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        user = request.user
        return (Membership.objects.filter(user=user, course=obj).exists()
                or
                User.objects.filter(id=user.id, role='admin').exists())
