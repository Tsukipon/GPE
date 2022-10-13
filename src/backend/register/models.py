from django.utils import timezone
from django.contrib.auth.base_user import AbstractBaseUser
from django.contrib.auth.models import PermissionsMixin
from django.db import models

from .managers import CustomUserManager


class BlockedUsers(models.Model):
    """Save blocked users"""
    blocker_user_id = models.IntegerField(null=False)
    blocked_user_id = models.IntegerField(null=False)

    class Meta:
        unique_together = (('blocker_user_id', 'blocked_user_id'),)


class FollowingRequests(models.Model):
    """Save requests for following for user data accessibility"""
    sender_id = models.IntegerField(null=False)
    receiver_id = models.IntegerField(null=False)

    class Meta:
        unique_together = (('sender_id', 'receiver_id'),)


class FollowUser(models.Model):
    """Table that bound the follower and the followed users."""
    class Meta:
        unique_together = (('follower_id', 'followed_id'),)
    follower_id = models.IntegerField(null=False)
    followed_id = models.IntegerField(null=False)


class CustomUser(AbstractBaseUser, PermissionsMixin):
    """Custom user custom model."""
    SKILL_LEVEL = (
        ('beginner', 'beginner'),
        ('intermediate', 'intermediate'),
        ('advanced', 'advanced')
    )
    RESTRICTION_LEVEL = (
        ('private', 'private'),
        ('protected', 'protected'),
        ('public', 'public')
    )
    username = None
    email = models.EmailField('email', unique=True)
    email_verified = models.BooleanField(default=False)
    random_uuid_register = models.CharField(max_length=36, null=True)
    random_uuid_password = models.CharField(max_length=36, null=True)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    date_joined = models.DateTimeField(default=timezone.now)
    # additionnal fields allowed with AbstractBaseUser
    picture = models.ImageField(null=True, blank=True)
    pseudo = models.CharField(unique=True, max_length=50, null=True)
    description = models.CharField(max_length=255, null=True)
    skill = models.CharField(
        choices=SKILL_LEVEL, max_length=12, null=False, default=SKILL_LEVEL[0][0])
    secret = models.CharField(max_length=36, null=True)
    visibility = models.CharField(
        choices=RESTRICTION_LEVEL, null=False, default=RESTRICTION_LEVEL[0][1], max_length=11)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []
    # email becomes the unique identifier

    objects = CustomUserManager()
    # all objects for the class come from the CustomUserManager

    def __str__(self):
        """
        Handle string representation of data on admin console.
        """
        return str(self.id) + " "+self.email + " " + str(self.email_verified) + " " + str(self.is_staff) + " " + str(self.is_active) + " " + str(self.date_joined) + " " + self.skill
