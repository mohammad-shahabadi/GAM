# yourapp/management/commands/create_default_user.py

from decouple import config
from django.contrib.auth.hashers import make_password
from django.core.management.base import BaseCommand

from app_auth.models import User


class Command(BaseCommand):
    help = 'Create a default user with specified email and password'

    def handle(self, *args, **options):

        email = config('DEFAULT_ADMIN_EMAIL', default='admin@admin.com')
        password = config('DEFAULT_ADMIN_PASSWORD')

        if not User.objects.filter(email=email).exists():

            hashed_password = make_password(password)
            user = User(email=email, password=hashed_password, username=email, role='admin', is_superuser=True)
            user.save()

            self.stdout.write(self.style.SUCCESS('Default user created successfully'))
        else:
            self.stdout.write(self.style.SUCCESS('Default user already exists'))
