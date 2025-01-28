from datetime import datetime, timedelta

import jwt
from django.conf import settings
# from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.hashers import make_password, check_password
from django.db import transaction
from django.db.models import Q
from gitlab.exceptions import GitlabCreateError, GitlabUpdateError, GitlabDeleteError
# from django.contrib.auth.models import User
from rest_framework import status, generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from gitlab_wrapper.gitlab_dto import UserDTO
from gitlab_wrapper.gitlab_wrapper import GitLabWrapper
from .models import User
from .permissions import AdminPermission, UnauthenticatedPermission, SelfPermission, TeacherOrAdminPermission
from .serializers import UserSerializer, UserSoftDeleteSerializer, UserUpdateSerializer
import pandas as pd


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
                user = create_user_in_db_and_gitlab(email, first_name, last_name, password, role_name, student_number)
                token = create_jwt_token(user)
            else:
                raise Exception('Missing email or password')

            return Response({'token': token}, status=status.HTTP_201_CREATED)

    except GitlabCreateError as e:
        return Response({'error': f'User failed to create in gitlab {e}'}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'error': f'{e}'}, status=status.HTTP_400_BAD_REQUEST)


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
        token = create_jwt_token(user)
        return Response({'token': token, 'role': user.role}, status=status.HTTP_200_OK)
    else:
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)


# @csrf_exempt
@api_view(['POST'])
@permission_classes([AdminPermission])
def import_users_from_csv(request):
    try:
        csv_file = request.FILES['csv_file']
        # Assuming the CSV file has columns: username, password, student_number, git_reference_id, role
        df = pd.read_csv(csv_file)

        for index, row in df.iterrows():
            email = row['email']
            password = row['password']
            role_name = row['role']
            student_number = row['student_number']
            first_name = row['first_name']
            last_name = row['last_name']

            try:
                user = User.objects.get(email=email)
                if user:
                    raise Exception('User already exists')
            except User.DoesNotExist:
                pass

            # Create user
            if email and password:
                create_user_in_db_and_gitlab(email, first_name, last_name, password, role_name, student_number)

        return Response({'message': 'Users imported successfully'}, status=200)

    except Exception as e:
        return Response({'error': f'{e}'}, status=status.HTTP_400_BAD_REQUEST)


def create_user_in_db_and_gitlab(email, first_name, last_name, password, role_name, student_number):

    hashed_password = make_password(password)
    user = User(first_name=first_name or '', last_name=last_name or '', email=email,
                password=hashed_password, username=email, student_number=student_number,
                role=role_name)
    user.save()
    # gitlab = GitLabWrapper()
    # user_gitlab_dto = UserDTO(name=f'{first_name} {last_name}', username=email.split('@')[0], email=email,
    #                           password=password)
    # gitlab_user = gitlab.create_user(user_dto=user_gitlab_dto)
    user.git_reference_id = 12
    user.save()

    return user


def create_jwt_token(user):
    payload = {
        'user_id': user.id,
        'exp': datetime.utcnow() + timedelta(days=7)  # Token expiration time
    }
    return jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')


class GetUserByIDView(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AdminPermission]


class GetUserSelfInfoView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [SelfPermission]

    def get_object(self):
        return self.request.user


class GetAllUsersView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [TeacherOrAdminPermission]

    def get_queryset(self):
        return User.objects.filter()


class UserSearchListView(generics.ListAPIView):
    serializer_class = UserSerializer
    permission_classes = [TeacherOrAdminPermission]

    def get_queryset(self):
        search_param = self.request.query_params.get('q', None)

        if search_param:
            # Perform case-insensitive search on multiple fields
            queryset = User.objects.filter(
                Q(student_number__icontains=search_param) |
                Q(email__icontains=search_param) |
                Q(first_name__icontains=search_param) |
                Q(last_name__icontains=search_param)
            )
        else:
            # If no search parameter is provided, return all users
            queryset = User.objects.all()

        queryset = queryset.exclude(email='admin@admin.com')

        return queryset


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
        with transaction.atomic():
            if serializer.instance.email == "admin@admin.com":
                raise Exception('Cannot delete admin')

            serializer.instance.is_active = not serializer.instance.is_active
            serializer.save()

            # gitlab = GitLabWrapper()
            # deactivate_user_gitlab_dto = UserDTO(id=serializer.instance.git_reference_id)

            # if serializer.instance.is_active:
            #     gitlab.activate_user(deactivate_user_gitlab_dto)
            # else:
            #     gitlab.deactivate_user(deactivate_user_gitlab_dto)


class UserDeleteView(generics.DestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSoftDeleteSerializer
    permission_classes = [AdminPermission]

    def destroy(self, request, *args, **kwargs):
        try:
            return super().destroy(request, *args, **kwargs)
        except GitlabDeleteError as e:
            return Response({'error': f'User failed to delete in gitlab {e}'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': f'{e}'}, status=status.HTTP_400_BAD_REQUEST)

    def perform_destroy(self, instance):
        with transaction.atomic():
            if instance.is_superuser:
                raise Exception('Cannot delete admin')
            instance.delete()

            # gitlab = GitLabWrapper()
            # delete_user_gitlab_dto = UserDTO(id=instance.git_reference_id)
            # gitlab.delete_user(delete_user_gitlab_dto)


class ModifyUserView(generics.UpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserUpdateSerializer
    permission_classes = [AdminPermission]

    def update(self, request, *args, **kwargs):
        try:
            return super().update(request, *args, **kwargs)
        except GitlabUpdateError as e:
            return Response({'error': f'User failed to update in gitlab {e}'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': f'{e}'}, status=status.HTTP_400_BAD_REQUEST)

    def perform_update(self, serializer):
        if serializer.instance.is_superuser and serializer.validated_data['role'] != 'admin':
            raise Exception('Can not change admin role')
        with transaction.atomic():
            serializer.save()
            if serializer.instance.is_superuser is False:
                # gitlab = GitLabWrapper()
                full_name = f'{serializer.instance.first_name} {serializer.instance.last_name}'
                # update_user_gitlab_dto = UserDTO(id=serializer.instance.git_reference_id, name=full_name,
                #                                  email=serializer.instance.email,
                #                                  username=serializer.instance.email.split('@')[0])
                # gitlab.update_user(update_user_gitlab_dto)

