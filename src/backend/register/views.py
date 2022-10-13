import uuid
import os
import requests
import datetime
import logging
from uuid import uuid4
from .serializer import BlockerUsersSerializer, FollowUserSerializer, FollowingRequestSerialiser, ShortUserSerializer, UserSerializer
from .models import BlockedUsers, CustomUser, FollowUser, FollowingRequests
from alert.models import UserAlert
from alert.models import Alert
from django.http.response import HttpResponseRedirect
from django.contrib.auth.hashers import check_password, make_password
from django.conf import settings
from django.db import IntegrityError
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny

MAILER_SERVICE_URL = f"http://mailer:{os.environ['MAILER_PORT']}/mail"
FRONT_LOGIN_PAGE = f"http://localhost:{os.environ['FRONTEND_PORT']}/login"
FRONT_RESET_PASSWORD_PAGE = f"http://localhost:{os.environ['FRONTEND_PORT']}/reset_password"

logger_info = logging.getLogger('django_register_info')
logger_error = logging.getLogger('django_register_error')


@api_view(['GET'])
@authentication_classes([])
@permission_classes([])
def check_account(request, uuid):
    """Verify an account once it has been created thanks to an unique identifier saved in database"""
    if request.method == "GET":
        all_users = CustomUser.objects.all()
        for user in all_users:
            if user.random_uuid_register == uuid:
                json_data = {}
                user.email_verified = True
                user.random_uuid_register = None
                user.save()
                json_data["accept"] = True
                json_data["user_address"] = user.email
                if not settings.TESTING:
                    requests.post(MAILER_SERVICE_URL, json=json_data, headers={"Content-Type": "application/json"}
                                  )
                    logger_info.info(
                        f'The user {json_data["user_address"]} was able to check his account!', extra={"level": "INFO", "method": "GET", "endpoint": "/CHECK_ACCOUNT"})
                return HttpResponseRedirect(FRONT_LOGIN_PAGE)
        return Response({"response": "The request failed"}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    """Allow a user to create his account on the app.
    example_json:
        {
            "password":string
            "email":string
            "pseudo":string (optional)
            "description":string (optional)
            "skill":enum_string (optional)
            "visibility":enum_string (optional)
        }
    """
    if request.method == "POST":
        try:
            json_data = {}
            data = request.data
            data["password"] = make_password(data["password"])
            data["random_uuid_register"] = str(uuid.uuid4())
            data["secret"] = str(uuid.uuid4())
            if not "pseudo" in data:
                data["pseudo"] = data["email"].split("@")[0]
            serializer = UserSerializer(data=data)

            if serializer.is_valid(raise_exception=True):
                user = serializer.save()
                user_token = Token.objects.get(user=user)
                json_data["user_address"] = data["email"]
                json_data["registration"] = True
                json_data["random_uuid_register"] = data["random_uuid_register"]
                if not settings.TESTING:
                    requests.post(MAILER_SERVICE_URL, json=json_data, headers={"Content-Type": "application/json"}
                                  )
                logger_info.info(
                    f'The user {json_data["user_address"]} created his account!', extra={"level": "INFO", "method": "POST", "endpoint": "/REGISTER"})
                return Response(data={
                    'token': user_token.key,
                }, status=status.HTTP_201_CREATED)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except IntegrityError:
            logger_error.error(
                f'The user {data["email"]} failed to create his account - email already exists!', extra={"level": "ERROR", "method": "POST", "endpoint": "/REGISTER"})
            return Response({"response": "User already exists"}, status=status.HTTP_409_CONFLICT)
        except KeyError as e:
            logger_error.error(
                'A user failed to create his account - lack of data integrity!', extra={"level": "ERROR", "method": "POST", "endpoint": "/REGISTER"})
            return Response({"response": "Invalid json data"}, status=status.HTTP_400_BAD_REQUEST)
        except TypeError as e:
            logger_error.error(
                'A user failed to create his account - lack of data integrity!', extra={"level": "ERROR", "method": "POST", "endpoint": "/REGISTER"})
            return Response({"response": "Invalid json data"}, status=status.HTTP_400_BAD_REQUEST)


class CustomAuthToken(ObtainAuthToken):
    """
    Class called each time a user creates his own account and associate a token to him
    inside the database.
    """

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data,
                                           context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        try:
            Token.objects.get(user=user).delete()
            token, created = Token.objects.get_or_create(user=user)
            token_creation_date = datetime.datetime.now()
            token_expiration_date = token_creation_date + \
                settings.TOKEN_EXPIRE_TIME
            return Response({
                'token': token.key,
                'token_expiration_date': token_expiration_date,
            })

        except Token.DoesNotExist:
            token, created = Token.objects.get_or_create(user=user)
            token_creation_date = datetime.datetime.now()
            token_expiration_date = token_creation_date + \
                settings.TOKEN_EXPIRE_TIME
            return Response({
                'token': token.key,
                'token_expiration_date': token_expiration_date,
            })


class RefreshAuthToken(ObtainAuthToken):
    """
    Class that handles the refresh of the token each time it is asked through the api.
    """

    def post(self, request, *args, **kwargs):
        try:
            request_user_token = str(request.META.get(
                'HTTP_AUTHORIZATION')).split(" ")[-1]
            token_user_id = Token.objects.get(key=request_user_token).user_id
            token_user = CustomUser.objects.get(id=token_user_id)
            token_creation_date = Token.objects.get(
                key=request_user_token).created

            token_creation_date = datetime.datetime.strptime(
                str(token_creation_date)[:-7], "%Y-%m-%d %H:%M:%S")
            now = datetime.datetime.now()
            token_expiration_date = token_creation_date + settings.TOKEN_EXPIRE_TIME
            if now < token_expiration_date:
                Token.objects.filter(
                    user=token_user).delete()
                token, created = Token.objects.get_or_create(user=token_user)
                logger_info.info(
                    f'The user {token_user.pseudo} refreshed his token - expiration_date:{token_expiration_date} !', extra={"level": "INFO", "method": "POST", "endpoint": "/REFRESH_TOKEN"})
                return Response({
                    "response": "The token has been refreshed",
                    'token': token.key,
                    'token_expiration_date': token_expiration_date,
                }, status=status.HTTP_200_OK)
            else:
                logger_error.error(
                    f'The user {token_user.pseudo} failed to refresh his token - token expired!', extra={"level": "ERROR", "method": "POST", "endpoint": "/REFRESH_TOKEN"})
                return Response({
                    "response": "The token has not been refreshed because it has exprired"}, status=status.HTTP_401_UNAUTHORIZED)
        except Token.DoesNotExist:
            logger_error.error(
                f'A user failed to refresh his token - token inexistant!', extra={"level": "ERROR", "method": "POST", "endpoint": "/REFRESH_TOKEN"})
            return Response({"response": "invalid token"}, status=status.HTTP_401_UNAUTHORIZED)


@permission_classes((AllowAny,))
@api_view(['POST'])
def logout(request):
    """Allow a user to logout the application."""
    try:
        request_user_token = str(request.META.get(
            'HTTP_AUTHORIZATION')).split(" ")[-1]
        user_token = Token.objects.get(key=request_user_token)
        token_user = CustomUser.objects.get(id=user_token.user_id)
        if request.method == "POST":
            user_token.delete()
            logger_info.info(
                f'The user {token_user.pseudo} logged out!', extra={"level": "INFO", "method": "POST", "endpoint": "/LOGOUT"})
            return Response(data={"response": "User logged out!"},
                            status=status.HTTP_200_OK)
    except (CustomUser.DoesNotExist, Token.DoesNotExist):
        return Response(
            data={["response"]: "User not logged in!"},
            status=status.HTTP_404_NOT_FOUND)


@api_view(['PUT'])
def modify_user_experience(request):
    """Road supposed to be used by FMetrics to update the user skill
        example_json:
            {
            "skill":enum_string (optional)
            }
    """
    try:
        if request.method == 'PUT':
            skills = ["beginner", "intermediate", "advanced"]
            request_user_token = str(request.META.get(
                'HTTP_AUTHORIZATION')).split(" ")[-1]
            token_user_id = Token.objects.get(key=request_user_token).user_id
            token_user = CustomUser.objects.get(
                id=token_user_id)
            if request.data["skill"] == token_user.skill or request.data["skill"] not in skills:
                return Response(data={"response": "request aborted"}, status=status.HTTP_400_BAD_REQUEST)
            previous_skill = token_user.skill
            token_user.skill = request.data["skill"]
            token_user.save()
            logger_info.info(
                f'The skill of the user {token_user.pseudo} was changed from {previous_skill} to {request.data["skill"]}!', extra={"level": "INFO", "method": "PUT", "endpoint": "/USER_EXPERIENCE"})
            return Response(data={"response": "skill modified"}, status=status.HTTP_204_NO_CONTENT)
    except KeyError:
        logger_error.error(
            f'The user {token_user.pseudo} could not update his skill!')
        return Response(data={"response": "request aborted"}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
def update_user(request):
    """
    Road that complete the inscription if the user didn't finished it.
    The request HEADER must be set on multipart/form-data.
    example_json:
    {
        "pseudo":string (optional)
        "description":string (optional)
        "visibility":enum_string (optional)
        "picture":file (optional)
    }
    """
    try:
        if request.method == 'PUT':
            request_user_token = str(request.META.get(
                'HTTP_AUTHORIZATION')).split(" ")[-1]
            token_user_id = Token.objects.get(key=request_user_token).user_id
            token_user = CustomUser.objects.get(
                id=token_user_id)
            if "pseudo" in request.data:
                token_user.pseudo = request.data["pseudo"]
            if "visibility" in request.data:
                token_user.visibility = request.data["visibility"]
            if "description" in request.data:
                token_user.description = request.data["description"]
            if "picture" in request.data:
                token_user.picture = request.data["picture"]
            if not request.data:
                logger_error.error(
                    'A user failed to update his account - lack of data integrity!', extra={"level": "ERROR", "method": "PUT", "endpoint": "/UPDATE_USER"})
                return Response(data={"response": "request aborted"}, status=status.HTTP_400_BAD_REQUEST)
            token_user.save()
            logger_info.info(
                f'The user {token_user.pseudo} updated his account!', extra={"level": "INFO", "method": "PUT", "endpoint": "/UPDATE_USER"})
            return Response(data={"response": "user modified"}, status=status.HTTP_204_NO_CONTENT)
    except CustomUser.DoesNotExist:
        logger_error.error(
            'A user failed to update his account - account not found!', extra={"level": "ERROR", "method": "PUT", "endpoint": "/UPDATE_USER"})
        return Response(data={"response": "request aborted"}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET', 'DELETE'])
def user_detail(request):
    """
    Allow user account manipulation by accessing to the data, modifying them or delete them.
    Only a logged user with his token can manage his own account.
    """
    try:
        if request.method == 'GET':
            request_user_token = str(request.META.get(
                'HTTP_AUTHORIZATION')).split(" ")[-1]
            token_user_id = Token.objects.get(key=request_user_token).user_id
            token_user = CustomUser.objects.get(id=token_user_id)
            user_serializer = ShortUserSerializer(token_user)
            logger_info.info(
                f'The user {token_user.pseudo} asked to check his personnal data!', extra={"level": "INFO", "method": "GET", "endpoint": "/USER_DETAIL"})
            return Response(user_serializer.data, status=status.HTTP_200_OK)

        elif request.method == 'DELETE':
            request_user_token = str(request.META.get(
                'HTTP_AUTHORIZATION')).split(" ")[-1]
            token_user_id = Token.objects.get(key=request_user_token).user_id
            token_user = CustomUser.objects.get(id=token_user_id)
            useralerts = UserAlert.objects.filter(
                user_id=token_user_id)
            useralerts_data = useralerts.values("alert_id")
            for data in useralerts_data:
                Alert.objects.get(
                    id=data["alert_id"]
                ).delete()
            logger_info.info(
                f'The user {token_user.pseudo} deleted his account!', extra={"level": "INFO", "method": "DELETE", "endpoint": "/USER_DETAIL"})
            useralerts.delete()
            token_user.delete()
            return Response(data={"response": "User deleted"}, status=status.HTTP_204_NO_CONTENT)
    except CustomUser.DoesNotExist:
        logger_error.error(
            'A user failed to consult or delete his account - account not found!', extra={"level": "ERROR", "method": "DELETE", "endpoint": "/USER_DETAIL"})
        return Response(data={"response": "request aborted"}, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
@authentication_classes([])
@permission_classes([])
def ask_reset_password(request):
    """Send a mail front side with a link to the user in order to change his password
    in case the user forgots his password (not logged).
    """
    if request.method == "POST":
        try:
            user_email = request.data["email"]
            random_uuid = str(uuid4())
            json_data = {"user_address": user_email, "uuid": random_uuid}
            user = CustomUser.objects.get(email=user_email)
            if not settings.TESTING:
                requests.post(MAILER_SERVICE_URL, json=json_data, headers={"Content-Type": "application/json"}
                              )
                user.random_uuid_password = random_uuid
                user.save()
                logger_info.info(
                    f'Mail sent to {user.email} to reset his password!', extra={"level": "INFO", "method": "POST", "endpoint": "/ASK_RESET_PASSWORD"})
                return Response({"response": "reset_mail has beed sent"}, status=status.HTTP_200_OK)
            else:
                user.random_uuid_password = random_uuid
                user.save()
                return Response({"response": "test success"}, status=status.HTTP_100_CONTINUE)
        except CustomUser.DoesNotExist:
            logger_error.error(
                'A user failed to ask a password reset - account not found!', extra={"level": "ERROR", "method": "POST", "endpoint": "/ASK_RESET_PASSWORD"})
            return Response({"response": "object does not exist"}, status=status.HTTP_404_NOT_FOUND)
        except KeyError:
            logger_error.error(
                'A user failed to create his account - lack of data integrity!', extra={"level": "ERROR", "method": "POST", "endpoint": "/ASK_RESET_PASSWORD"})
            return Response("Invalid json data", status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'POST'])
@authentication_classes([])
@permission_classes([])
def reset_password(request, uuid):
    """
    Redirect a user on the front-end after uuid-token verification if GET request
    Change the password of the user once the form is filled front side and the uuid is still existing in database.
    The user is not logged in this situation.
    """
    if request.method == "GET":
        all_users = CustomUser.objects.all()
        for user in all_users:
            if user.random_uuid_password == uuid:
                logger_info.info(
                    f'The user {user.email} successfully asked to reset his password!', extra={"level": "INFO", "method": "GET", "endpoint": "/RESET_PASSWORD"})
                return HttpResponseRedirect(FRONT_RESET_PASSWORD_PAGE+"/uuid={}".format(uuid))
        logger_error.error(
            'A user failed to ask the reset of his password! - user not found', extra={"level": "ERROR", "method": "GET", "endpoint": "/RESET_PASSWORD"})
        return Response({"response": "The request failed"}, status=status.HTTP_404_NOT_FOUND)
    if request.method == "POST":
        try:
            new_password = request.data["newPassword"]
            all_users = CustomUser.objects.all()
            for user in all_users:
                if user.random_uuid_password == uuid:
                    user.random_uuid_password = None
                    user.password = make_password(new_password)
                    user.save()
                    logger_info.info(
                        f'The user {user.email} successfully reset his password!', extra={"level": "INFO", "method": "POST", "endpoint": "/RESET_PASSWORD"})
                    return Response({"response": "the password has been modified"}, status=status.HTTP_200_OK)
            logger_error.error(
                'A user failed to reset his password! - user not found', extra={"level": "ERROR", "method": "POST", "endpoint": "/RESET_PASSWORD"})
            return Response({"response": "The request failed"}, status=status.HTTP_404_NOT_FOUND)
        except KeyError:
            logger_error.error(
                f'A user failed to reset his password - lack of data integrity!', extra={"level": "ERROR", "method": "POST", "endpoint": "/RESET_PASSWORD"})
            return Response("Invalid json data", status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
def change_password(request):
    """
    Change the password of the user if he is logged and asks that to the front in settings/profile page.
    example_json:
    {
        "oldPassword":string
        "newPassword":string
    }
    """
    request_user_token = str(request.META.get(
        'HTTP_AUTHORIZATION')).split(" ")[-1]
    token_user_id = Token.objects.get(key=request_user_token).user_id
    try:
        old_password = request.data["oldPassword"]
        new_password = request.data["newPassword"]
        user = CustomUser.objects.get(id=token_user_id)
        verification = check_password(old_password, user.password)
        if verification:
            user.password = make_password(new_password)
            user.save()
            logger_info.info(
                f'The user {user.email} successfully updated his password!', extra={"level": "INFO", "method": "POST", "endpoint": "/CHANGE_PASSWORD"})
            return Response({"response": "the password has been modified"}, status=status.HTTP_200_OK)
        else:
            logger_error.error(
                f'A user failed to update his password - lack of credentials integrity!', extra={"level": "ERROR", "method": "POST", "endpoint": "/CHANGE_PASSWORD"})
            return Response({"response": "The request failed"}, status=status.HTTP_403_FORBIDDEN)
    except KeyError:
        logger_error.error(
            'A user failed to update his password - lack of data integrity!', extra={"level": "ERROR", "method": "POST", "endpoint": "/CHANGE_PASSWORD"})
        return Response("Invalid json data", status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
def user_list(request):
    """Give the data from the app users
    except those from the user who made the request and those from the blocked users.
    Additionnal data are given according to privacy setting in user models.
    If privacy is public the secret code and skill values are given."""
    if request.method == "GET":
        final = []
        json_data = {}
        request_user_token = str(request.META.get(
            'HTTP_AUTHORIZATION')).split(" ")[-1]
        token_user_id = Token.objects.get(key=request_user_token).user_id
        users = CustomUser.objects.all()
        users_blocked_id = BlockedUsers.objects.filter(
            blocker_user_id=token_user_id
        ).values("blocked_user_id")
        users_blocked_id = list([data["blocked_user_id"]
                                for data in users_blocked_id])
        for user in users:
            if token_user_id != user.id and user.id not in users_blocked_id:
                json_data["pseudo"] = user.pseudo
                json_data["description"] = user.description
                json_data["visibility"] = user.visibility
                if user.visibility == "public":
                    json_data["number_of_followed"] = FollowUser.objects.filter(
                        follower_id=user.id
                    ).count()
                    json_data["number_of_followers"] = FollowUser.objects.filter(
                        followed_id=user.id
                    ).count()
                    json_data["date_joined"] = CustomUser.objects.get(
                        id=user.id).date_joined
                    json_data["skill"] = user.skill
                final.append(json_data)
                json_data = {}
        return Response(data=final, status=status.HTTP_200_OK)


@api_view(["POST"])
def ask_secret(request):
    """Allow a user to ask the secret of another one by using his pseudo.
    The target must be different from the user who made the request and
    not be blocked by him.
        example_json:
        {
            "pseudo":string
        }
    """
    if request.method == "POST":
        request_user_token = str(request.META.get(
            'HTTP_AUTHORIZATION')).split(" ")[-1]
        token_user_id = Token.objects.get(key=request_user_token).user_id
    try:
        asked_user_pseudo = request.data["pseudo"]
    except KeyError:
        return Response(data={"response:": "invalid json format"}, status=status.HTTP_400_BAD_REQUEST)
    try:
        asked_user = CustomUser.objects.get(
            pseudo=asked_user_pseudo
        )
        asker_user = CustomUser.objects.get(
            id=token_user_id
        )
    except CustomUser.DoesNotExist:
        return Response(data={"response": "user doesn't exist"}, status=status.HTTP_404_NOT_FOUND)
    request.data["sender_id"] = token_user_id
    request.data["receiver_id"] = asked_user.id
    users_blocked_id = BlockedUsers.objects.filter(
        blocker_user_id=token_user_id
    ).values("blocked_user_id")
    users_blocked_id = list([data["blocked_user_id"]
                             for data in users_blocked_id])
    if asked_user.id != token_user_id and asked_user.id not in users_blocked_id:
        existant_follow_relation = FollowUser.objects.filter(
            follower_id=token_user_id, followed_id=asked_user.id
        )
        if not existant_follow_relation:
            follow_request_serializer = FollowingRequestSerialiser(
                data=request.data)
            if follow_request_serializer.is_valid():
                follow_request_serializer.save()
                logger_info.info(
                    f'The user {asker_user.email} successfully asked to follow the user {asked_user.email}!', extra={"level": "INFO", "method": "POST", "endpoint": "/RESET_PASSWORD"})
                return Response(data={"reponse": "following request has been succesfully sent"}, status=status.HTTP_200_OK)
            else:
                logger_error.error(
                    'A user failed to ask to follow someone - lack of data integrity!', extra={"level": "ERROR", "method": "POST", "endpoint": "/RESET_PASSWORD"})
                return Response(data=follow_request_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            logger_error.error(
                'A user failed to ask to follow someone - logical error user already followed!', extra={"level": "ERROR", "method": "POST", "endpoint": "/RESET_PASSWORD"})
            return Response(data={"response": "request aborted"}, status=status.HTTP_409_CONFLICT)
    else:
        logger_error.error(
            'A user failed to ask to follow someone - action forbidden!', extra={"level": "ERROR", "method": "POST", "endpoint": "/RESET_PASSWORD"})
        return Response(data={"response": "request aborted"}, status=status.HTTP_403_FORBIDDEN)


@api_view(["GET"])
def get_follower_requests(request):
    """
    Show the users that requested your secret in order to follow you
    """
    try:
        if request.method == "GET":
            final = []
            json_data = {}
            request_user_token = str(request.META.get(
                'HTTP_AUTHORIZATION')).split(" ")[-1]
            token_user_id = Token.objects.get(key=request_user_token).user_id
            request_followers = FollowingRequests.objects.filter(
                receiver_id=token_user_id
            ).values("sender_id")
            for user_id in request_followers:
                user_data = CustomUser.objects.get(
                    id=user_id["sender_id"]
                )
                json_data["pseudo"] = user_data.__dict__["pseudo"]
                final.append(json_data)
                json_data = {}
            logger_info.info(
                'A user asked to see the users who asked to follow him!', extra={"level": "INFO", "method": "GET", "endpoint": "/GET_FOLLOWERS_REQUESTS"})
            return Response(data=final, status=status.HTTP_200_OK)
    except Exception:
        logger_error.error(
            f'A user failed to see the users who asked to follow him - lack of data integrity!', extra={"level": "ERROR", "method": "GET", "endpoint": "/GET_FOLLOWERS_REQUESTS"})
        return Response(data={"response": "request aborted"}, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
def get_followed(request):
    """
    Show the users followed by the current user
    """
    try:
        if request.method == "GET":
            final = []
            json_data = {}
            request_user_token = str(request.META.get(
                'HTTP_AUTHORIZATION')).split(" ")[-1]
            token_user_id = Token.objects.get(key=request_user_token).user_id
            users_followed_id = FollowUser.objects.filter(
                follower_id=token_user_id
            ).values("followed_id")
            # for data in users_followed_id:
            #     followed_data = CustomUser.objects.get(
            #         id=data["followed_id"]
            #     )
            followed_users = CustomUser.objects.filter(
                pk__in=users_followed_id
            ).values()

            for data in followed_users:

                json_data["pseudo"] = data["pseudo"]
                json_data["description"] = data["description"]
                final.append(json_data)
                json_data = {}
            logger_info.info(
                'A user asked to see the users followed by him!', extra={"level": "INFO", "method": "GET", "endpoint": "/GET_FOLLOWED"})
            return Response(final, status.HTTP_200_OK)
    except Exception as e:
        logger_error.error(
            f'A user failed to see the users followed by him - {e}', extra={"level": "ERROR", "method": "GET", "endpoint": "/GET_FOLLOWED"})
        return Response(data={"response": "request aborted"}, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
def get_followers(request):
    """
    Show the followers of the current user
    """
    try:
        if request.method == "GET":
            final = []
            json_data = {}
            request_user_token = str(request.META.get(
                'HTTP_AUTHORIZATION')).split(" ")[-1]
            token_user_id = Token.objects.get(key=request_user_token).user_id
            users_followers_id = FollowUser.objects.filter(
                followed_id=token_user_id
            ).values("follower_id")
            # for data in user_followers_id:
            #     followers_data = CustomUser.objects.get(
            #         id=data["follower_id"]
            #     )
            followers_data = CustomUser.objects.filter(
                pk__in=users_followers_id
            ).values()
            for data in followers_data:
                json_data["pseudo"] = data["pseudo"]
                json_data["description"] = data["description"]
                final.append(json_data)
                json_data = {}
            logger_info.info(
                'A user asked to see the users who follow him!', extra={"level": "INFO", "method": "GET", "endpoint": "/GET_FOLLOWERS"})
            return Response(final, status.HTTP_200_OK)
    except Exception as e:
        logger_error.error(
            f'A user failed to see the users who follow him - {e}!', extra={"level": "ERROR", "method": "GET", "endpoint": "/GET_FOLLOWERS"})
        return Response(data={"response": "request aborted"}, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
def block_user(request):
    """Road that blocks a user.The last one won't be able to see data from the user who asked to do so
    or even follow him
    example_json:
        {
            "pseudo":string
        }
    """
    try:
        if request.method == "POST":
            json_data = {}
            request_user_token = str(request.META.get(
                'HTTP_AUTHORIZATION')).split(" ")[-1]
            token_user_id = Token.objects.get(key=request_user_token).user_id
            if "pseudo" in request.data:
                target_pseudo = request.data["pseudo"]
                print("TARGET", request.data)
            else:
                logger_error.error(
                    'A user failed to block a user - lack of data integrity!', extra={"level": "ERROR", "method": "POST", "endpoint": "/BLOCK_USER"})
                return Response(data={"response": "request aborted"}, status=status.HTTP_400_BAD_REQUEST)

            current_user = CustomUser.objects.get(
                id=token_user_id
            )
            target_user = CustomUser.objects.get(
                pseudo=target_pseudo
            )

            if target_user.id != token_user_id:
                relation = FollowUser.objects.get(
                    followed_id=token_user_id, follower_id=target_user.id
                )
                json_data["blocker_user_id"] = token_user_id
                json_data["blocked_user_id"] = target_user.id
                block_serializer = BlockerUsersSerializer(data=json_data)
                if block_serializer.is_valid():
                    block_serializer.save()
                    friend_requests = FollowingRequests.objects.filter(
                        receiver_id=token_user_id, sender_id=target_user.id
                    )
                    if len(friend_requests) > 0:
                        friend_requests[0].delete()
                    relation.delete()
                    logger_info.info(
                        f'The user {current_user.pseudo} successfully blocked the user {target_user.pseudo}!', extra={"level": "INFO", "method": "POST", "endpoint": "/BLOCK_USER"})
                    return Response(data={"response": "user has been successfully blocked"}, status=status.HTTP_200_OK)
                logger_error.error(
                    'A user failed to block a user - lack of data integrity!', extra={"level": "ERROR", "method": "POST", "endpoint": "/BLOCK_USER"})
                return Response(data=block_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            else:
                logger_error.error(
                    'A user block a user - logical error the user tried cant block himself!', extra={"level": "ERROR", "method": "POST", "endpoint": "/BLOCK_USER"})
                return Response(data={"response": "request aborted"}, status=status.HTTP_400_BAD_REQUEST)

    except FollowUser.DoesNotExist:
        logger_error.error(
            'A user failed to block another user - logical error the relation does not exist!', extra={"level": "ERROR", "method": "POST", "endpoint": "/BLOCK_USER"})
        return Response(data={"response": "request aborted"}, status=status.HTTP_404_NOT_FOUND)

    # except CustomUser.DoesNotExist:
    #     logger_error.error(
    #         'A user failed to block another user - logical error the target does not exist!', extra={"level": "ERROR", "method": "POST", "endpoint": "/BLOCK_USER"})
    #     return Response(data={"response": "request aborted"}, status=status.HTTP_404_NOT_FOUND)

    except Exception as e:
        logger_error.error(
            f'Something went wrong - {e}', extra={"level": "ERROR", "method": "POST", "endpoint": "/BLOCK_USER"})
        return Response(data={"response": "request aborted"}, status=status.HTTP_400_BAD_REQUEST)


@api_view(["DELETE"])
def unblock_user(request):
    """Allow to unblock a blocked user.
                example_json:
        {
            "pseudo":string
        }
    """
    if request.method == "DELETE":
        request_user_token = str(request.META.get(
            'HTTP_AUTHORIZATION')).split(" ")[-1]
        token_user_id = Token.objects.get(key=request_user_token).user_id
        pseudo_user_to_unblock = request.data["pseudo"]
        try:
            current_user = CustomUser.objects.get(
                id=token_user_id
            )
            user_to_unblock_id = CustomUser.objects.get(
                pseudo=pseudo_user_to_unblock
            ).id
        except CustomUser.DoesNotExist:
            logger_error.error(
                'A user could not unblock another user - user not found!', extra={"level": "ERROR", "method": "DELETE", "endpoint": "/UNBLOCK_USER"})
            return Response(data={"response": "user not found"}, status=status.HTTP_404_NOT_FOUND)
        if token_user_id != user_to_unblock_id:
            try:
                BlockedUsers.objects.get(
                    blocked_user_id=user_to_unblock_id
                ).delete()
                logger_info.info(
                    f'The user {current_user.pseudo} successfully unblocked the user {user_to_unblock_id}!', extra={"level": "INFO", "method": "DELETE", "endpoint": "/UNBLOCK_USER"})
                return Response(data={"response": "user has been unblocked"}, status=status.HTTP_200_OK)
            except BlockedUsers.DoesNotExist:
                logger_error.error(
                    'A user could not unblock another user - logical error the user was not blocked!', extra={"level": "ERROR", "method": "DELETE", "endpoint": "/UNBLOCK_USER"})
                return Response(data={"response": "request aborted"}, status=status.HTTP_404_NOT_FOUND)
        return Response(data={"response": "request aborted"}, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
def share_secret(request):
    """Allow the target to accept the following request from those who asked to do so.
        Show the secret and the pseudo of the current user who is the target of the following request.
            example_json:
        {
            "pseudo":string
        }
    """
    try:
        if request.method == "POST":
            request_user_token = str(request.META.get(
                'HTTP_AUTHORIZATION')).split(" ")[-1]
            token_user_id = Token.objects.get(key=request_user_token).user_id
            current_user = CustomUser.objects.get(
                id=token_user_id
            )
            pseudo = request.data["pseudo"]
            pseudo_user = CustomUser.objects.get(
                pseudo=pseudo
            )
            potential_follower = FollowingRequests.objects.get(
                sender_id=pseudo_user.id, receiver_id=token_user_id
            )
            potential_follower.delete()
            if not settings.TESTING:
                json_data = {}
                json_data["sender"] = current_user.pseudo
                json_data["secret"] = current_user.secret
                json_data["user_address"] = pseudo_user.email
                print(json_data)
                requests.post(MAILER_SERVICE_URL, json=json_data, headers={"Content-Type": "application/json"}
                              )
            logger_info.info(
                f'The user {current_user.pseudo} successfully shared his secret with the user {pseudo_user.pseudo}!', extra={"level": "INFO", "method": "POST", "endpoint": "/FOLLOW"})
            return Response(data={"secret": current_user.secret, "pseudo": pseudo_user.pseudo}, status=status.HTTP_200_OK)
    except CustomUser.DoesNotExist:
        logger_error.error(
            'A user was not allowed to share his secret - logical error the target does not exist!', extra={"level": "ERROR", "method": "POST", "endpoint": "/FOLLOW"})
        return Response(data={"response": "request aborted"}, status=status.HTTP_404_NOT_FOUND)
    except KeyError:
        logger_error.error(
            'A user failed to share his secret - lack of data integrity!', extra={"level": "ERROR", "method": "POST", "endpoint": "/FOLLOW"})
        return Response({"response": "Invalid json data"}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def follow(request):
    """
    Allow a user to follow another protected user after the last one shared his secret code thanks to
    share_secret road.
    example_json:
        {
            "secret":string
        }
    Allow a user to follow another public user by passing his pseudo as a parameter
    example_json:
        {
            "pseudo":string
        }
    """
    try:
        if request.method == 'POST':
            request_user_token = str(request.META.get(
                'HTTP_AUTHORIZATION')).split(" ")[-1]
            token_user_id = Token.objects.get(key=request_user_token).user_id

            if not "pseudo" in request.data and not "secret" in request.data:
                logger_error.error(
                    'A user failed to follow - lack of data integrity!', extra={"level": "ERROR", "method": "POST", "endpoint": "/FOLLOW"})
                return Response(data={"response": "request aborted"}, status=status.HTTP_400_BAD_REQUEST)
            if "pseudo" in request.data and "secret" in request.data:
                logger_error.error(
                    'A user failed to follow - lack of data integrity!', extra={"level": "ERROR", "method": "POST", "endpoint": "/FOLLOW"})
                return Response(data={"response": "request aborted"}, status=status.HTTP_400_BAD_REQUEST)

            if "pseudo" in request.data:
                target_pseudo = request.data["pseudo"]
                followed_user = CustomUser.objects.get(
                    pseudo=target_pseudo
                )
                if followed_user.visibility != "public":
                    logger_error.error(
                        'A user was not allowed to follow the target!', extra={"level": "ERROR", "method": "POST", "endpoint": "/FOLLOW"})
                    return Response(data={"response": "request aborted"}, status=status.HTTP_403_FORBIDDEN)
            if "secret" in request.data:
                target_secret = request.data["secret"]
                followed_user = CustomUser.objects.get(
                    secret=target_secret
                )
                if followed_user.visibility != "protected":
                    logger_error.error(
                        'A user was not allowed to follow the target!', extra={"level": "ERROR", "method": "POST", "endpoint": "/FOLLOW"})
                    return Response(data={"response": "request aborted"}, status=status.HTTP_403_FORBIDDEN)
            follower_user = CustomUser.objects.get(
                id=token_user_id
            )
            print("REQUEST:", followed_user.id, token_user_id)
            if followed_user.id != token_user_id:
                follow_serializer = FollowUserSerializer(data={"follower_id": token_user_id,
                                                               "followed_id": followed_user.id}
                                                         )
                if follow_serializer.is_valid():
                    follow_serializer.save()
                    logger_info.info(
                        f'The user {follower_user.pseudo} successfully followed the user {followed_user.pseudo}!', extra={"level": "INFO", "method": "POST", "endpoint": "/FOLLOW"})
                    return Response({"response": "User has been successfully added as friend"}, status=status.HTTP_200_OK)
                else:
                    logger_error.error(
                        'A user failed to follow - lack of data integrity!', extra={"level": "ERROR", "method": "POST", "endpoint": "/FOLLOW"})
                    return Response(follow_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            else:
                logger_error.error(
                    'A user was not allowed to follow the target - logical error!', extra={"level": "ERROR", "method": "POST", "endpoint": "/FOLLOW"})
                return Response(data={"response": "request aborted"}, status=status.HTTP_403_FORBIDDEN)
    except CustomUser.DoesNotExist:
        logger_error.error(
            'A user failed to follow - logical error the target does not exist!', extra={"level": "ERROR", "method": "POST", "endpoint": "/FOLLOW"})
        return Response(data={"response": "request aborted"}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
def get_blocked_users(request):
    """Allow a user to get the list of all the users he blocked thanks to his personal token
    """
    try:
        if request.method == 'GET':
            final = []
            request_user_token = str(request.META.get(
                'HTTP_AUTHORIZATION')).split(" ")[-1]
            token_user_id = Token.objects.get(key=request_user_token).user_id
            current_user = CustomUser.objects.get(
                id=token_user_id
            )
            blocked_users_ids = BlockedUsers.objects.filter(
                blocker_user_id=token_user_id
            ).values("blocked_user_id")
            blocked_users = CustomUser.objects.filter(
                pk__in=blocked_users_ids
            )
            for data in blocked_users:
                json_data = {}
                json_data["pseudo"] = data.pseudo
                json_data["description"] = data.description
                final.append(json_data)
            logger_info.info(
                f'The user {current_user.pseudo} asked access to his blocked users!', extra={"level": "INFO", "method": "GET", "endpoint": "/USERS_BLOCKED"})
            return Response(data=final, status=status.HTTP_200_OK)
    except Exception as e:
        logger_error.error(
            f'Something went wrong when {current_user.pseudo} asked access to his blocked users - {e}!', extra={"level": "ERROR", "method": "POST", "endpoint": "/USERS_BLOCKED"})
        return Response(data={"response": "request aborted"}, status=status.HTTP_400_BAD_REQUEST)
