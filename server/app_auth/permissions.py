from rest_framework import permissions

from app_api.models import Membership, ProblemSet

STAFF_COURSE_ROLES = ('teacher', 'ta')


def is_admin(user):
    return user.is_authenticated and user.role == 'admin'


def course_role(user, course_id):
    """Return the user's role in the course, or None if they aren't a member."""
    membership = Membership.objects.filter(user_id=user.id, course_id=course_id).first()
    return membership.role if membership else None


class AuthenticatedPermission(permissions.BasePermission):
    """Base class: object-level checks below only run once the user is authenticated."""

    def has_permission(self, request, view):
        return request.user.is_authenticated


class AdminPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        return is_admin(request.user)


class SelfPermission(AuthenticatedPermission):
    pass


class TeacherOrAdminPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ('teacher', 'admin')


class StudentOrAdminPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ('student', 'admin')


class AllAuthenticatedPermission(AuthenticatedPermission):
    pass


class UnauthenticatedPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        return True


class IsTeacherOfCourseOrAdmin(AuthenticatedPermission):
    def has_object_permission(self, request, view, obj):
        return is_admin(request.user) or course_role(request.user, obj.id) == 'teacher'


class IsPartOfCourseOrAdmin(AuthenticatedPermission):
    def has_object_permission(self, request, view, obj):
        return is_admin(request.user) or course_role(request.user, obj.id) is not None


class IsTeacherOfCourseOrAdminForMemberShip(AuthenticatedPermission):
    def has_permission(self, request, view):
        if not super().has_permission(request, view):
            return False
        # On create there is no object yet, so check the course in the request body
        if request.method == 'POST':
            course_id = request.data.get('course')
            return is_admin(request.user) or (course_id and course_role(request.user, course_id) == 'teacher')
        return True

    def has_object_permission(self, request, view, obj):
        return is_admin(request.user) or course_role(request.user, obj.course_id) == 'teacher'


class IsTeacherOrTaOfCourseOrAdminForProblemSet(AuthenticatedPermission):
    def has_permission(self, request, view):
        if not super().has_permission(request, view):
            return False
        if request.method == 'POST':
            course_id = request.data.get('course')
            return is_admin(request.user) or (course_id and course_role(request.user, course_id) in STAFF_COURSE_ROLES)
        return True

    def has_object_permission(self, request, view, obj):
        return is_admin(request.user) or course_role(request.user, obj.course_id) in STAFF_COURSE_ROLES


class IsTeacherOrTaOfCourseOrAdminForProblem(AuthenticatedPermission):
    def has_permission(self, request, view):
        if not super().has_permission(request, view):
            return False
        if request.method == 'POST':
            problem_set = ProblemSet.objects.filter(id=request.data.get('problem_set')).first()
            return is_admin(request.user) or (problem_set is not None and
                                              course_role(request.user, problem_set.course_id) in STAFF_COURSE_ROLES)
        return True

    def has_object_permission(self, request, view, obj):
        return is_admin(request.user) or course_role(request.user, obj.problem_set.course_id) in STAFF_COURSE_ROLES


class IsPartOfCourseOrAdminForProblemSet(AuthenticatedPermission):
    def has_permission(self, request, view):
        if not super().has_permission(request, view):
            return False
        # List view: /courses/<course_id>/problem_sets
        course_id = view.kwargs.get('course_id')
        if course_id is not None:
            return is_admin(request.user) or course_role(request.user, course_id) is not None
        return True

    def has_object_permission(self, request, view, obj):
        return is_admin(request.user) or course_role(request.user, obj.course_id) is not None


class IsPartOfCourseOrAdminForProblem(AuthenticatedPermission):
    def has_permission(self, request, view):
        if not super().has_permission(request, view):
            return False
        # List view: /problem_sets/<problem_set_id>/problems
        problem_set_id = view.kwargs.get('problem_set_id')
        if problem_set_id is not None:
            problem_set = ProblemSet.objects.filter(id=problem_set_id).first()
            return is_admin(request.user) or (problem_set is not None and
                                              course_role(request.user, problem_set.course_id) is not None)
        return True

    def has_object_permission(self, request, view, obj):
        return is_admin(request.user) or course_role(request.user, obj.problem_set.course_id) is not None


class CanModifySubmission(AuthenticatedPermission):
    def has_object_permission(self, request, view, obj):
        course_id = obj.repository.problem.problem_set.course_id
        return is_admin(request.user) or course_role(request.user, course_id) in STAFF_COURSE_ROLES


class GetRepositoryPermission(AuthenticatedPermission):
    def has_object_permission(self, request, view, obj):
        return request.user.role != 'student' or obj.membership.user_id == request.user.id
