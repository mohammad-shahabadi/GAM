from rest_framework import permissions
from .models import UserRoles


class AdminPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and UserRoles.objects.filter(user=request.user, roles__role='admin').exists()

class SelfOrAdminPermission(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return request.user.is_authenticated and (obj == request.user or UserRoles.objects.filter(user=request.user, roles__role='admin').exists())

class TeacherOrAdminPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and (UserRoles.objects.filter(user=request.user, roles__role='teacher').exists() or UserRoles.objects.filter(user=request.user, roles__role='admin').exists())

class StudentOrAdminPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and (UserRoles.objects.filter(user=request.user, roles__role='student').exists() or UserRoles.objects.filter(user=request.user, roles__role='admin').exists())

class UnauthenticatedPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        return True