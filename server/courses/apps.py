from django.apps import AppConfig


class CoursesConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'courses'
    # Keep the original label so existing tables and migrations stay valid
    label = 'app_api'
