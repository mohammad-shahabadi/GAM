# yourapp/management/commands/create_default_user.py

from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from app_auth.models import UserRoles, Role


class Command(BaseCommand):
    help = 'Create a default user with specified email and password'

    def handle(self, *args, **options):
        email = 'admin@admin.com'
        password = 'admin'

        if not User.objects.filter(email=email).exists():

            hashed_password = make_password(password)
            user = User(email=email, password=hashed_password, username=email)
            user.save()

            user_roles = UserRoles(user=user)
            user_roles.save()
            user_roles.roles.add(Role.objects.get(role='admin'))
            user_roles.save()

            self.stdout.write(self.style.SUCCESS('Default user created successfully'))
        else:
            self.stdout.write(self.style.SUCCESS('Default user already exists'))
