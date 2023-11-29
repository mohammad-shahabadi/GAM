from datetime import datetime, timedelta

import jwt
from django.conf import settings
# from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.hashers import make_password, check_password
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework import viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from .models import UserRoles, Role
from .permissions import AdminPermission, SelfOrAdminPermission, UnauthenticatedPermission
from .serializers import UserSerializer

from ..gitlab.gitlab_wrapper import GitLabWrapper
from ..gitlab.gitlab_dto import UserDTO


@api_view(['POST'])
@permission_classes([AdminPermission])
def signup(request):
    email = request.data.get('email')
    password = request.data.get('password')
    role_names = request.data.get('roles', [])  # List of role names

    try:
        user = User.objects.get(email=email)
        if user:
            return Response({'error': 'User already exists'}, status=status.HTTP_400_BAD_REQUEST)
    except User.DoesNotExist:
        pass

    if email and password:
        hashed_password = make_password(password)
        user = User(email=email, password=hashed_password, username=email)
        user.save()

        # Create UserRoles instance and assign roles
        user_roles = UserRoles(user=user)
        user_roles.save()

        for role_name in role_names:
            try:
                role = Role.objects.get(role=role_name)
                user_roles.roles.add(role)
            except Role.DoesNotExist:
                # Handle the case where the specified role does not exist
                return Response({'error': f'Role "{role_name}" does not exist'}, status=status.HTTP_400_BAD_REQUEST)
        user_roles.save()  # do we really need this here as well?

        payload = {
            'user_id': user.id,
            'exp': datetime.utcnow() + timedelta(days=1)  # Token expiration time
        }
        token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')

        # TODO: add exception handling and transaction
        try:
            gitlab = GitLabWrapper()
            user_gitlab_dto = UserDTO(name=email.split('@')[0], username=email.split('@')[0], email=email, password=password)
            gitlab.create_user(user_dto=user_gitlab_dto)
        except Exception as e:
            print(f'User failed to create in gitlab {e}')

        return Response({'token': token}, status=status.HTTP_201_CREATED)
    else:
        return Response({'error': 'Missing email or password'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([UnauthenticatedPermission])
def login(request):
    email = request.data.get('email')
    password = request.data.get('password')

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

    if check_password(password, user.password):
        payload = {
            'user_id': user.id,
            'exp': datetime.utcnow() + timedelta(days=1)  # Token expiration time
        }
        token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')

        try:
            user_roles = UserRoles.objects.get(user=user)
            roles = [role.role for role in user_roles.roles.all()]
        except UserRoles.DoesNotExist:
            roles = []

        return Response({'token': token, 'roles': roles}, status=status.HTTP_200_OK)
    else:
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AdminPermission]

    def get_permissions(self):
        if self.action == 'retrieve':
            return [SelfOrAdminPermission()]
        return super().get_permissions()
