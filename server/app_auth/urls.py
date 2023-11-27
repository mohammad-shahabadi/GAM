from rest_framework.routers import DefaultRouter
from .views import login, signup, UserViewSet
from django.urls import path, include

router = DefaultRouter()
# router.register(r'user-roles', UserRolesViewSet)
router.register(r'user', UserViewSet)
# router.register(r'signup/', signup, basename='signup')
# router.register(r'login/', login, basename='login')
# router.register(r'get-users/', get_users, basename='get-users')

# urlpatterns = router.urls

urlpatterns = [
    path('signup', signup, name='signup'),
    path('login', login, name='login'),
    path('', include(router.urls)),
]

