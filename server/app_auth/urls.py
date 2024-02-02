from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import login, signup, GetAllUsersView, GetUserByIDView, ModifyUserView, DeactivateUserView, \
    UserDeleteView, GetUserSelfInfoView, UserSearchListView, import_users_from_csv

urlpatterns = [
    path('signup', signup, name='signup'),
    path('login', login, name='login'),
    path('users', GetAllUsersView.as_view(), name='get_all_users'),
    path('users/<int:pk>/update', ModifyUserView.as_view(), name='modify_user'),
    path('users/<int:pk>', GetUserByIDView.as_view(), name='get_user_by_id'),
    path('users/me', GetUserSelfInfoView.as_view(), name='get_user_self_info'),
    path('users/<int:pk>/deactivate', DeactivateUserView.as_view(), name='deactivate_user'),
    path('users/<int:pk>/delete', UserDeleteView.as_view(), name='delete_user'),
    path('users/search', UserSearchListView.as_view(), name='user-search'),
    path('users/import', import_users_from_csv, name='import_users_from_csv'),
]
