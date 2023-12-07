# yourapp/management/commands/create_default_user.py

from app_auth.models import UserRoles, Role
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import User
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = 'Create a default user with specified email and password'

    def create_roles(self):
        for role_choice in Role.ROLE_CHOICES:
            role_name = role_choice[0]
            try:
                role = Role.objects.get(role=role_name)
                print(f"Role '{role_name}' already exists with id {role.id}")
            except Role.DoesNotExist:
                Role.objects.create(role=role_name)
                print(f"Role '{role_name}' created successfully")

    def handle(self, *args, **options):
        
        self.create_roles()

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