from django.urls import path
from .views import (
    CourseCreateView,
    CourseDetailView,
    CourseListView,
    CourseUpdateView,
    CourseDeleteView,
    MembershipCreateView,
    MembershipUpdateView,
    MembershipListForUser,

)

urlpatterns = [
    path('courses/create', CourseCreateView.as_view(), name='course-create'),
    path('courses/list', CourseListView.as_view(), name='course-list'),
    path('courses/<int:pk>', CourseDetailView.as_view(), name='course-detail'),
    path('courses/update/<int:pk>', CourseUpdateView.as_view(), name='course-update'),
    path('courses/delete/<int:pk>', CourseDeleteView.as_view(), name='course-delete'),
    path('memberships/create', MembershipCreateView.as_view(), name='membership-create'),
    path('memberships/update/<int:pk>', MembershipUpdateView.as_view(), name='membership-update'),
    path('memberships/list', MembershipListForUser.as_view(), name='membership-list'),
]