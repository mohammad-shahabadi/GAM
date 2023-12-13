from datetime import datetime, timedelta

import jwt
from django.conf import settings
# from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.hashers import make_password, check_password
from django.db import transaction
from gitlab.exceptions import GitlabCreateError, GitlabUpdateError, GitlabDeleteError
# from django.contrib.auth.models import User
from rest_framework import status, generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from gitlab_wrapper.gitlab_dto import UserDTO
from gitlab_wrapper.gitlab_wrapper import GitLabWrapper
from .models import User
from .permissions import AdminPermission, SelfOrAdminPermission, UnauthenticatedPermission
from .serializers import UserSerializer


@api_view(['POST'])
@permission_classes([AdminPermission])
def signup(request):
    try:
        with transaction.atomic():
            email = request.data.get('email')
            password = request.data.get('password')
            role_name = request.data.get('role')
            student_number = request.data.get('student_number')
            first_name = request.data.get('first_name')
            last_name = request.data.get('last_name')

            try:
                user = User.objects.get(email=email)
                if user:
                    raise Exception('User already exists')
            except User.DoesNotExist:
                pass

            if email and password:
                hashed_password = make_password(password)
                user = User(first_name=first_name or '', last_name=last_name or '', email=email,
                            password=hashed_password, username=email, student_number=student_number,
                            role=role_name)
                user.save()

                payload = {
                    'user_id': user.id,
                    'exp': datetime.utcnow() + timedelta(days=7)  # Token expiration time
                }
                token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')
                gitlab = GitLabWrapper()
                user_gitlab_dto = UserDTO(name=f'{first_name} {last_name}', username=email.split('@')[0], email=email,
                                          password=password)
                gitlab_user = gitlab.create_user(user_dto=user_gitlab_dto)
                user.git_reference_id = gitlab_user.id
                user.save()
            else:
                raise Exception('Missing email or password')

            return Response({'token': token}, status=status.HTTP_201_CREATED)

    except GitlabCreateError as e:
        return Response({'error': f'User failed to create in gitlab {e}'}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'error': e}, status=status.HTTP_400_BAD_REQUEST)


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

        return Response({'token': token, 'role': user.role}, status=status.HTTP_200_OK)
    else:
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

class GetUserByIDView(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [SelfOrAdminPermission]


class GetAllUsersView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AdminPermission]

    def get_queryset(self):
        return User.objects.filter(is_deleted=False)


class DeactivateUserView(generics.UpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AdminPermission]

    def update(self, request, *args, **kwargs):
        try:
            return super().update(request, *args, **kwargs)
        except Exception as e:
            return Response({'error': f'{e}'}, status=status.HTTP_400_BAD_REQUEST)

    def perform_update(self, serializer):
        if serializer.instance.is_deleted:
            raise Exception('User not found')
        with transaction.atomic():
            if serializer.instance.email == "admin@admin.com":
                raise Exception('Cannot delete admin')

            serializer.instance.is_active = not serializer.instance.is_active
            serializer.save()

            gitlab = GitLabWrapper()
            deactivate_user_gitlab_dto = UserDTO(id=serializer.instance.git_reference_id)

            if serializer.instance.is_active:
                gitlab.activate_user(deactivate_user_gitlab_dto)
            else:
                gitlab.deactivate_user(deactivate_user_gitlab_dto)


class SoftDeleteUserView(generics.UpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AdminPermission]

    def update(self, request, *args, **kwargs):
        try:
            return super().update(request, *args, **kwargs)
        except GitlabDeleteError as e:
            return Response({'error': f'User failed to delete in gitlab {e}'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': f'{e}'}, status=status.HTTP_400_BAD_REQUEST)

    def perform_update(self, serializer):
        if serializer.instance.is_deleted:
            raise Exception('User not found')
        with transaction.atomic():
            if serializer.instance.email == "admin@admin.com":
                raise Exception('Cannot delete admin')
            serializer.instance.is_deleted = True
            serializer.save()

            gitlab = GitLabWrapper()
            delete_user_gitlab_dto = UserDTO(id=serializer.instance.git_reference_id)
            gitlab.delete_user(delete_user_gitlab_dto)


class ModifyUserView(generics.UpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AdminPermission]

    def update(self, request, *args, **kwargs):
        try:
            return super().update(request, *args, **kwargs)
        except GitlabUpdateError as e:
            return Response({'error': f'User failed to update in gitlab {e}'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': f'{e}'}, status=status.HTTP_400_BAD_REQUEST)

    def perform_update(self, serializer):
        if serializer.instance.is_deleted:
            raise Exception('User not found')
        with transaction.atomic():
            serializer.save()
            gitlab = GitLabWrapper()
            full_name = f'{serializer.instance.first_name} {serializer.instance.last_name}'
            update_user_gitlab_dto = UserDTO(id=serializer.instance.git_reference_id, name=full_name,
                                             email=serializer.instance.email,
                                             username=serializer.instance.email.split('@')[0])
            gitlab.update_user(update_user_gitlab_dto)
