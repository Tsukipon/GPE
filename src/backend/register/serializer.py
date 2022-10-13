from register.models import BlockedUsers, CustomUser, FollowUser, FollowingRequests
from rest_framework import serializers
from django.contrib.auth import get_user_model


class BlockerUsersSerializer(serializers.ModelSerializer):
    """
    The serializer analyses the content of the json received by the api
    for the block requests and allows an easy parsing and data integrity.
    """
    blocker_user_id = serializers.IntegerField()
    blocked_user_id = serializers.IntegerField()

    class Meta:
        model = BlockedUsers
        fields = '__all__'

    def create(self, validated_data):
        return BlockedUsers.objects.create(**validated_data)

    def update(self, BlockedUsers, validated_data):
        BlockedUsers.blocker_user_id = validated_data.get(
            "blocker_user_id", BlockedUsers.blocker_user_id)
        BlockedUsers.blocked_user_id = validated_data.get(
            "blocked_user_id", BlockedUsers.blocked_user_id)

        BlockedUsers.save()
        return BlockedUsers


class FollowingRequestSerialiser(serializers.ModelSerializer):
    """
The serializer analyses the content of the json received by the api
for the following requests and allows an easy parsing and data integrity.        
"""
    sender_id = serializers.IntegerField()
    receiver_id = serializers.IntegerField()

    class Meta:
        model = FollowingRequests
        fields = '__all__'

    def create(self, validated_data):
        return FollowingRequests.objects.create(**validated_data)

    def update(self, FollowingRequests, validated_data):
        FollowingRequests.sender_id = validated_data.get(
            "sender_id", FollowingRequests.sender_id)
        FollowingRequests.receiver_id = validated_data.get(
            "receiver_id", FollowingRequests.receiver_id)

        FollowingRequests.save()
        return FollowingRequests


class FollowUserSerializer(serializers.ModelSerializer):
    """
    The serializer analyses the content of the json received by the api
    concerning the followed/followers users and allows an easy parsing and data integrity.        
    """
    class Meta:
        model = FollowUser
        fields = '__all__'

    def create(self, validated_data):
        return FollowUser.objects.create(**validated_data)

    def update(self, FollowUser, validated_data):
        FollowUser.follower_id = validated_data.get(
            "follower_id", FollowUser.follower_id)
        FollowUser.followed_id = validated_data.get(
            "followed_id", FollowUser.followed_id)
        FollowUser.save()
        return FollowUser


class ShortUserSerializer(serializers.ModelSerializer):
    """
    The serializer analyses the content of the json received by the api
    for the users and allows an easy parsing and data integrity.
    This serializer only concerns the optional fields of user model.        

    """

    class Meta:
        model = CustomUser
        fields = ["email", "skill", "visibility", "secret",
                  "pseudo", "description", "picture"]


class UserSerializer(serializers.ModelSerializer):
    """
    The serializer analyses the content of the json received by the api
    for the users and allows an easy parsing and data integrity.        
    """
    id = serializers.IntegerField(read_only=True)
    email = serializers.EmailField(required=True)
    password = serializers.CharField(
        required=True, max_length=128)
    skill = serializers.ChoiceField(
        choices=CustomUser.SKILL_LEVEL, required=False
    )
    privacy = serializers.ChoiceField(
        choices=CustomUser.RESTRICTION_LEVEL, required=False
    )
    pseudo = serializers.CharField(
        required=False, max_length=50
    )
    description = serializers.CharField(
        required=False, max_length=255
    )
    picture = serializers.ImageField(
        required=False
    )

    class Meta:
        model = CustomUser
        fields = "__all__"


def create(self, validated_data):
    """
    Create and return a new User instance, given the validated data.
    """
    user = get_user_model().objects.create(email=validated_data['email'])
    user.set_password(validated_data['password'])
    user.save()
    user = CustomUser.objects.create(user=user)
    return user


def update(self, instance, validated_data):
    """
    Update and return an existing User instance, given the validated data.
    """
    instance.Email = validated_data.get(
        "email", instance.Email)
    instance.password = validated_data.get(
        "password", instance.Password)
    instance.save()
    return instance
