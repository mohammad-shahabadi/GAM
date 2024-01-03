from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

urlpatterns = [
    path('<int:course_id>/<str:key>/<int:problem_set>/gitlab-ci.yml', views.render_gitlab_ci, name='render_gitlab_ci'),
    path('pipeline', views.gitlabPipelineWebhook, name='gitlabPipelineWebhook'),
]
