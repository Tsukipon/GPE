from django.contrib.auth.base_user import BaseUserManager

from django.conf import settings
from django.db.models.signals import post_save, pre_delete
from django.dispatch import receiver
from rest_framework.authtoken.models import Token


class CustomUserManager(BaseUserManager):
    """
    Custom user model manager where email is the unique identifiers
    for authentication instead of usernames.
    """

    def create_user(self, email, password, **extra_fields):
        """
        Create and save a User with the given email and password.
        """
        if not email:
            raise ValueError(_('The Email must be set'))
        if not password:
            raise ValueError(_('The Password must be set'))
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password) # change password to hash
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password, **extra_fields):
        """Create and save a SuperUser with the given email and password."""
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError(('Superuser must have is_staff=True.'))
        if extra_fields.get('is_superuser') is not True:
            raise ValueError(('Superuser must have is_superuser=True.'))
        return self.create_user(email, password, **extra_fields)


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    """Function which creates a token when receives a signal through api."""
    if created:
        Token.objects.create(user=instance)

# @receiver(pre_delete, sender=settings.AUTH_USER_MODEL)
# def mymodel_delete(sender, instance, **kwargs):
#     instance.file.delete(False)