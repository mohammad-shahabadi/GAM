import jwt
from django.conf import settings
from .models import User
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from django.core.cache import cache



class JWTAuthentication(BaseAuthentication):
    def authenticate(self, request):
        bearer_token = request.headers.get('Authorization')

        if not bearer_token:
            return None

        token = bearer_token.split(' ')[1]

        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            user_id = payload['user_id']

            # Check if user is cached in Redis
            user = cache.get(f'user_{user_id}')

            if not user:
                # If not in cache, fetch from the database
                user = User.objects.get(id=user_id)

                # Cache the user in Redis for future use
                cache.set(f'user_{user_id}', user, timeout=settings.CACHE_TIMEOUT_SECONDS)

            return user, None
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Token has expired')
        except jwt.InvalidTokenError:
            raise AuthenticationFailed('Invalid token')
        except User.DoesNotExist:
            raise AuthenticationFailed('User not found')
