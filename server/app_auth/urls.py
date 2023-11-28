from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import login, signup, UserViewSet

router = DefaultRouter()
router.register(r'user', UserViewSet)

urlpatterns = [
    path('signup', signup, name='signup'),
    path('login', login, name='login'),
    path('', include(router.urls)),
]
