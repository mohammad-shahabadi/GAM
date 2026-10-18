import jwt
from django.conf import settings
from .models import User
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from django.core.cache import cache


def user_cache_key(user_id):
    return f'user_{user_id}'


def invalidate_user_cache(user_id):
    """Call whenever a user is changed, deactivated or deleted so stale data isn't served from Redis."""
    cache.delete(user_cache_key(user_id))


class JWTAuthentication(BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.headers.get('Authorization')

        if not auth_header:
            return None

        parts = auth_header.split()
        if len(parts) != 2 or parts[0].lower() != 'bearer':
            raise AuthenticationFailed('Authorization header must be "Bearer <token>"')
        token = parts[1]

        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            user_id = payload['user_id']

            # Check if user is cached in Redis
            user = cache.get(user_cache_key(user_id))

            if not user:
                # If not in cache, fetch from the database
                user = User.objects.get(id=user_id)

                # Cache the user in Redis for future use
                cache.set(user_cache_key(user_id), user, timeout=settings.CACHE_TIMEOUT_SECONDS)
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Token has expired')
        except (jwt.InvalidTokenError, KeyError):
            raise AuthenticationFailed('Invalid token')
        except User.DoesNotExist:
            raise AuthenticationFailed('User not found')

        if not user.is_active:
            raise AuthenticationFailed('User is deactivated')

        return user, None

    def authenticate_header(self, request):
        # Makes DRF return 401 (not 403) for unauthenticated requests
        return 'Bearer'
