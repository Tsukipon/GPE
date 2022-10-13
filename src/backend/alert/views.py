import datetime
import logging
from alert.serializer import AlertSerializer, AlertTriggerSerializer, UserAlertSerializer
from alert.models import Alert, AlertTrigger
from alert.models import UserAlert
from register.models import CustomUser
from register.models import FollowUser
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.authtoken.models import Token

logger_info = logging.getLogger('django_alerts_info')
logger_error = logging.getLogger('django_alerts_error')


@api_view(['GET'])
def followed_alerts_list(request):
    """Grant access to all alerts followed with their triggers or not
    depending on the privacy settings on each alert."""
    try:
        if request.method == 'GET':
            final = []
            alert_data = {}
            trigger_data = {}
            request_user_token = str(request.META.get(
                'HTTP_AUTHORIZATION')).split(" ")[-1]
            token_user_id = Token.objects.get(key=request_user_token).user_id
            current_user = CustomUser.objects.get(id=token_user_id)
            followed_users = FollowUser.objects.filter(
                follower_id=token_user_id
            ).values("followed_id")
            if not followed_users:
                return Response(data={}, status=status.HTTP_200_OK)
            for followed_user in followed_users:
                followed_alerts_id = UserAlert.objects.filter(
                    user_id=followed_user["followed_id"]
                ).values("alert_id")
                if not followed_alerts_id:
                    continue
                for followed_alert_id in followed_alerts_id:
                    followed_alerts_data = Alert.objects.filter(
                        id=followed_alert_id["alert_id"]
                    ).values_list()
                    for followed_alert_data in followed_alerts_data:
                        if followed_alert_data[8] == "private":
                            break
                        alert_data["id"] = followed_alert_data[0]
                        alert_data["alert_name"] = followed_alert_data[1]
                        alert_data["currency_pair_id"] = followed_alert_data[2]
                        alert_data["expire"] = followed_alert_data[3]
                        alert_data["expiration_date"] = followed_alert_data[4]
                        alert_data["alerting_device"] = followed_alert_data[5]
                        alert_data["is_active"] = followed_alert_data[6]
                        alert_data["description"] = followed_alert_data[7]
                        alert_data["protection_level"] = followed_alert_data[8]
                        if followed_alert_data[8] == "limited":
                            final.append(alert_data)
                            alert_data = {}
                            break
                        else:
                            followed_triggers = AlertTrigger.objects.filter(
                                alert_id=followed_alert_data[0]
                            ) .values_list()
                            alert_data["triggers"] = []
                            for followed_triggers_data in followed_triggers:
                                trigger_data["id"] = followed_triggers_data[0]
                                trigger_data["alert_id"] = followed_triggers_data[1]
                                trigger_data["trigger_type"] = followed_triggers_data[2]
                                trigger_data["trigger_condition"] = followed_triggers_data[3]
                                trigger_data["value"] = followed_triggers_data[4]
                                trigger_data["is_active"] = followed_triggers_data[5]
                                alert_data["triggers"].append(trigger_data)
                                trigger_data = {}
                            final.append(alert_data)
                            alert_data = {}
            logger_info.info(
                f'The user {current_user.pseudo} asked access to his followed alerts!', extra={"level": "INFO", "method": "GET", "endpoint": "/ALERT_FOLLOWED"})
            return Response(data=final, status=status.HTTP_200_OK)
    except FollowUser.DoesNotExist:
        logger_error.error(
            f'The user {current_user.pseudo} does not follow another user - logical error!', extra={"level": "ERROR", "method": "GET", "endpoint": "/ALERT_FOLLOWED"})
        return Response({"response": "The request failed"}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
def alert_list(request):
    """Grant access to all alerts with his triggers for a specific user according to his token."""
    if request.method == 'GET':
        try:
            json_result = []
            query_list = []
            request_user_token = str(request.META.get(
                'HTTP_AUTHORIZATION')).split(" ")[-1]
            token_user_id = Token.objects.get(key=request_user_token).user_id
            current_user = CustomUser.objects.get(id=token_user_id)
            useralert_user_id = UserAlert.objects.filter(
                user_id=token_user_id)
            for queryset in useralert_user_id:
                query_list.append(queryset.alert_id)
            alerts = Alert.objects.filter(pk__in=query_list)
            for index, alert in enumerate(alerts.values()):
                alert_triggers = AlertTrigger.objects.filter(
                    alert_id=query_list[index]).values()
                alert["triggers"] = alert_triggers
                json_result.append(alert)
            logger_info.info(
                f'The user {current_user.pseudo} asked access to his alerts!', extra={"level": "INFO", "method": "GET", "endpoint": "/ALERT_LIST"})
            return Response(data=json_result, status=status.HTTP_200_OK)
        except UserAlert.DoesNotExist:
            logger_error.error(
                f'The user {current_user.pseudo} does not have any alert! - logical error', extra={"level": "ERROR", "method": "GET", "endpoint": "/ALERT_LIST"})
            return Response(data={"response": "Insexistant relation"}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET', 'POST', 'PUT', 'DELETE'])
def alert_manager(request):
    """Manage access to a specific alert and his triggers for a specific user according to his token.
        GET,DELETE:
        example_json:
            {
                "alert_name":string
            }
        POST,PUT:
        example_json:
            {

        "alert_name": string,
        "expire": "boolean",
        "expiration_date": datetimefield,
        "alerting_device": "enum_string",
        "is_active": "boolean",
        "description": string,
        "currency_pair": "string",
        "protection_level": "enum_string",
        "triggers": [
            {
                "trigger_type": "enum_string",
                "trigger_condition": "enum_string",
                "value": float,
                "is_active": boolean
            },
            {
                "trigger_type": "enum_string",
                "trigger_condition": "enum_string",
                "value": float,
                "is_active": boolean
            }
        ]
    }
    """
    query_list = []
    request_user_token = str(request.META.get(
        'HTTP_AUTHORIZATION')).split(" ")[-1]
    token_user_id = Token.objects.get(key=request_user_token).user_id
    current_user = CustomUser.objects.get(id=token_user_id)
    useralert_user_id = UserAlert.objects.filter(
        user_id=token_user_id)
    if request.method == 'GET':
        clean_result = {}
        for queryset in useralert_user_id:
            query_list.append(queryset.alert_id)
        alert = Alert.objects.filter(
            pk__in=query_list, alert_name=request.data["alert_name"])
        if not alert:
            logger_error.error(
                f'The user {current_user.pseudo} could not have access to an inexistant alert! - logical error', extra={"level": "ERROR", "method": "GET", "endpoint": "/ALERT_MANAGER"})
            return Response(data={"response": "Inexistant alert for this user"}, status=status.HTTP_404_NOT_FOUND)
        else:
            alert_serializer = AlertSerializer(alert[0])
            alert_triggers = AlertTrigger.objects.filter(
                alert_id=alert.values()[0]['id']).values()
            triggers = []
            for trigger in alert_triggers:
                triggers.append(trigger)
            clean_result.update(alert_serializer.data)
            clean_result["triggers"] = triggers
            logger_info.info(
                f'The user {current_user.pseudo} asked access to his alert {request.data["alert_name"]}!', extra={"level": "INFO", "method": "GET", "endpoint": "/ALERT_MANAGER"})
            return Response(data=clean_result, status=status.HTTP_200_OK)
    elif request.method == 'POST':
        validated_data_result = {}
        alert_serializer = AlertSerializer(data=request.data)
        only_unactivated_triggers = True

        for queryset in useralert_user_id:
            query_list.append(queryset.alert_id)
        try:
            alert = Alert.objects.filter(
                pk__in=query_list, alert_name=request.data["alert_name"])
        except KeyError:
            logger_error.error(
                f'The user {current_user.pseudo} failed to create an alert - lack of data integrity!', extra={"level": "ERROR", "method": "POST", "endpoint": "/ALERT_MANAGER"})
            return Response(data={"response": "Wrong json data"}, status=status.HTTP_400_BAD_REQUEST)
        if not alert:
            data = request.data
            if "expiration_date" in data:
                now = str(datetime.datetime.now())
                if not data["expire"]:
                    return Response(data={"response": "The alert is not perishable"}, status=status.HTTP_400_BAD_REQUEST)
                elif data["expiration_date"] < now:
                    data["is_active"] = False
            try:
                for trigger in request.data["triggers"]:
                    if not request.data["is_active"]:
                        trigger["is_active"] = False
                    if trigger["is_active"]:
                        only_unactivated_triggers = False
            except KeyError:
                logger_error.error(
                    f'The user {current_user.pseudo} failed to create an alert - no triggers attached!', extra={"level": "ERROR", "method": "POST", "endpoint": "/ALERT_MANAGER"})
                return Response(data={"response": "No trigger data"}, status=status.HTTP_400_BAD_REQUEST)

            if data["expire"] and not "expiration_date" in data:
                logger_error.error(
                    f'The user {current_user.pseudo} failed to create an alert - lack of data integrity!', extra={"level": "ERROR", "method": "POST", "endpoint": "/ALERT_MANAGER"})
                return Response(data={"response": "The alert must have an expiration date"}, status=status.HTTP_400_BAD_REQUEST)
            if only_unactivated_triggers:
                data["is_active"] = False
            if alert_serializer.is_valid():
                alert_serializer.save()
            elif not alert_serializer.is_valid():
                logger_error.error(
                    f'The user {current_user.pseudo} failed to create an alert - lack of data integrity!', extra={"level": "ERROR", "method": "POST", "endpoint": "/ALERT_MANAGER"})
                return Response(alert_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            last_alert_id = Alert.objects.latest('id').id
            user_alert_serializer = UserAlertSerializer(
                data={"user_id": token_user_id, "alert_id": last_alert_id})
            if user_alert_serializer.is_valid():
                user_alert_serializer.save()
                validated_data_result.update(alert_serializer.data)
                validated_data_result["triggers"] = data["triggers"]
                logger_info.info(
                    f'The user {current_user.pseudo} successfully created his alert {request.data["alert_name"]}!', extra={"level": "INFO", "method": "POST", "endpoint": "/ALERT_MANAGER"})
                return Response(validated_data_result, status=status.HTTP_201_CREATED)
            else:
                logger_error.error(
                    f'The user {current_user.pseudo} failed to create an alert - lack of data integrity!', extra={"level": "ERROR", "method": "POST", "endpoint": "/ALERT_MANAGER"})
                return Response(alert_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            logger_error.error(
                f'The user {current_user.pseudo} failed to create an alert - alert name {request.data["alert_name"]} already taken for the current user!', extra={"level": "ERROR", "method": "POST", "endpoint": "/ALERT_MANAGER"})
            return Response(data={"response": "Alert name already taken for this user, aborting request"}, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'PUT':
        json_result = {}
        only_unactivated_triggers = True

        alert_serializer = AlertSerializer(data=request.data)
        if alert_serializer.is_valid():
            for queryset in useralert_user_id:
                query_list.append(queryset.alert_id)
            data = request.data

            if "expiration_date" in data:
                now = str(datetime.datetime.now())
                if not data["expire"]:
                    logger_error.error(
                        f'The user {current_user.pseudo} failed to update an alert - logical error lack of time data integrity!', extra={"level": "ERROR", "method": "PUT", "endpoint": "/ALERT_MANAGER"})
                    return Response(data={"response": "The alert is not perishable"}, status=status.HTTP_400_BAD_REQUEST)
                elif data["expiration_date"] < now:
                    alert_serializer.validated_data["is_active"] = False
            if data["expire"] and not "expiration_date" in data:
                return Response(data={"response": "The alert must have an expiration date"}, status=status.HTTP_400_BAD_REQUEST)
            try:
                alert = Alert.objects.filter(
                    pk__in=query_list, alert_name=data["alert_name"])
                if alert:
                    alert_id = alert.values()[0]["id"]
            except KeyError:
                logger_error.error(
                    f'The user {current_user.pseudo} failed to update his alert - lack of data integrity!', extra={"level": "ERROR", "method": "PUT", "endpoint": "/ALERT_MANAGER"})
                return Response(data={"response": "Wrong json data"}, status=status.HTTP_400_BAD_REQUEST)

            if not alert:
                logger_error.error(
                    f'The user {current_user.pseudo} failed to update his alert - logical error inexistant alert!', extra={"level": "ERROR", "method": "PUT", "endpoint": "/ALERT_MANAGER"})
                return Response(data={"response": "Inexistant alert for this user"}, status=status.HTTP_404_NOT_FOUND)

            alert_triggers = AlertTrigger.objects.filter(
                alert_id=alert_id
            )
            trigger_list = []
            for i, trigger in enumerate(alert_triggers):
                try:
                    trigger.trigger_type = data["triggers"][i]["trigger_type"]
                    trigger.trigger_condition = data["triggers"][i]["trigger_condition"]
                    trigger.value = data["triggers"][i]["value"]
                    trigger.is_active = data["triggers"][i]["is_active"]
                    if not data["is_active"]:
                        data["triggers"][i]["is_active"] = False
                        trigger.is_active = False
                    if trigger.is_active:
                        only_unactivated_triggers = False
                    trigger_list.append(trigger)
                except IndexError:
                    alert_trigger_to_delete = AlertTrigger.objects.get(
                        id=trigger.id)
                    alert_trigger_to_delete.delete()
                    trigger_list.pop(i)
            for i, trigger in enumerate(data["triggers"]):
                trigger["alert"] = alert[0].id
                if i >= len(trigger_list):
                    alert_trigger_serializer = AlertTriggerSerializer(
                        data=trigger)
                    if alert_trigger_serializer.is_valid():
                        alert_trigger_serializer.save()
            if only_unactivated_triggers:
                data["is_active"] = False
            alert_serializer = AlertSerializer(data=data)
            if alert_serializer.is_valid():
                for trigger in trigger_list:
                    trigger.save()
                alert[0].__dict__.update(data)
                alert[0].save()
            else:
                return Response(alert_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            json_result.update(alert_serializer.data)
            json_result["triggers"] = data["triggers"]
            logger_info.info(
                f'The user {current_user.pseudo} successfully updated his alert {request.data["alert_name"]}!', extra={"level": "INFO", "method": "PUT", "endpoint": "/ALERT_MANAGER"})
            return Response(json_result, status=status.HTTP_200_OK)
        else:
            logger_error.error(
                f'The user {current_user.pseudo} failed to update his alert - lack of data integrity!', extra={"level": "ERROR", "method": "PUT", "endpoint": "/ALERT_MANAGER"})
            return Response(alert_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        try:
            for queryset in useralert_user_id:
                query_list.append(queryset.alert_id)
            alert = Alert.objects.get(
                pk__in=query_list, alert_name=request.data["alert_name"])
            useralert_alert_id = UserAlert.objects.get(alert_id=alert.id)
            triggers = AlertTrigger.objects.filter(
                alert_id=alert.id
            ).delete()
            alert.delete()
            useralert_alert_id.delete()
            logger_info.info(
                f'The user {current_user.pseudo} successfully deleted his alert {request.data["alert_name"]}!', extra={"level": "INFO", "method": "DELETE", "endpoint": "/ALERT_MANAGER"})
            return Response({"The alert has been deleted"}, status.HTTP_204_NO_CONTENT)
        except Alert.DoesNotExist:
            logger_error.error(
                f'The user {current_user.pseudo} failed to update his alert - logical error inexistant alert!', extra={"level": "ERROR", "method": "DELETE", "endpoint": "/ALERT_MANAGER"})
            return Response({"Request aborted inexistant alert"}, status.HTTP_404_NOT_FOUND)
