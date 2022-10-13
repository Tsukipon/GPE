from rest_framework.authentication import TokenAuthentication, get_authorization_header
from rest_framework.exceptions import AuthenticationFailed
from django.conf import settings
import pytz
import datetime
from rest_framework.authtoken.models import Token
from django.utils import timezone

class ExpiringTokenAuthentication(TokenAuthentication):
    """This class manages the authentication system of the whole Backend."""

    def authenticate_credentials(self, key):
        """Check if a token exists for a user and if it has expire after a certain period of time (see settings.py)"""
        try:
            token = Token.objects.get(key=key)
        except Token.DoesNotExist:
            raise AuthenticationFailed('Invalid token')

        if not token.user.is_active:
            raise AuthenticationFailed('User inactive or deleted')

        # utc_now = datetime.datetime.utcnow()
        #utc_now = utc_now.replace(tzinfo=pytz.UTC)
        # naive = utc_now.replace(tzinfo=None)
        
        now =timezone.now()
        if token.created < now - settings.TOKEN_EXPIRE_TIME:
            raise AuthenticationFailed('Token has expired')

        return token.user, token
