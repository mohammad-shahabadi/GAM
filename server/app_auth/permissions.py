from app_auth.models import User
from rest_framework import permissions
from app_api.models import Membership, Course


class AdminPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and User.objects.filter(id=request.user.id,
                                                                     role='admin').exists()


class SelfPermission(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return request.user.is_authenticated


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

class IsTeacherOfCourseOrAdmin(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        user = request.user
        return (User.objects.filter(id=user.id, role='admin').exists()
                or
                Membership.objects.filter(user=user, course=obj, role='teacher').exists())


class IsPartOfCourseOrAdmin(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        user = request.user
        return (obj.members.filter(id=user.id).exists()
                or
                User.objects.filter(id=user.id, role='admin').exists())


class IsTeacherOfCourseOrAdminForMemberShip(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        user = request.user
        return (User.objects.filter(id=user.id, role='admin').exists()
                or
                Membership.objects.filter(user=user, course=obj.course, role='teacher').exists())


class IsTeacherOrTaOfCourseOrAdminForProblemSet(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        user = request.user
        role = Membership.objects.filter(user=user, course=obj.course).first()
        return (User.objects.filter(id=user.id, role='admin').exists()
                or
                (role and (role == 'teacher' or role == 'ta')))


class IsTeacherOrTaOfCourseOrAdminForProblem(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        user = request.user
        role = Membership.objects.filter(user=user, course=obj.problem_set.course).first()
        return (User.objects.filter(id=user.id, role='admin').exists()
                or
                (role and (role == 'teacher' or role == 'ta')))


class IsPartOfCourseOrAdminForProblemSet(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        user = request.user
        return (obj.course.members.filter(id=user.id).exists()
                or
                User.objects.filter(id=user.id, role='admin').exists())


class IsPartOfCourseOrAdminForProblem(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        user = request.user
        return (obj.problem_set.course.members.filter(id=user.id).exists()
                or
                User.objects.filter(id=user.id, role='admin').exists())


class CanModifySubmission(permissions.BasePermission):  # todo make sure it works
    def has_object_permission(self, request, view, obj):
        user = request.user
        return (User.objects.filter(id=user.id, role='admin').exists()
                or
                (obj.problem_set.course.members.filter(id=user.id).exists()
                 and
                 obj.problem_set.course.members.filter(id=user.id).first().role != 'student'))


class GetRepositoryPermission(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        user = request.user
        return (user.role != 'student'
                or
                obj.membership.user.id == user.id)
