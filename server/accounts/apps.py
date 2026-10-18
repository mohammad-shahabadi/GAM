from django.apps import AppConfig


class AccountsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'accounts'
    # Keep the original label so existing tables, migrations and AUTH_USER_MODEL stay valid
    label = 'app_auth'
