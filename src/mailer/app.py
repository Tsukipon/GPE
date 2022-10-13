"""
Service that handle the sending of the mails to the owners of the alerts
which have been triggered by the alert_checker service.
"""
import os
import logging
from typing import Literal
from flask import Flask, request, Response
from flask.templating import render_template
from mailjet_rest import Client


EMAIL_HOST = os.environ["EMAIL_HOST"]
MJ_APIKEY_PUBLIC = os.environ["MJ_APIKEY_PUBLIC"]
MJ_APIKEY_PRIVATE = os.environ["MJ_APIKEY_PRIVATE"]
MAILJET = Client(
    auth=(MJ_APIKEY_PUBLIC, MJ_APIKEY_PRIVATE), version='v3.1')


def setup_logger(logger_name: str, log_file_name: str, log_level: Literal[0, 10, 20, 30, 40, 50]) -> logging.Logger:
    """Logger setup"""
    handler = logging.FileHandler(log_file_name)
    logger = logging.getLogger(logger_name)
    logger.setLevel(log_level)
    logger.addHandler(handler)
    return logger


# APP INIT
app = Flask(__name__, template_folder="templates")

logger_info = setup_logger('logger_info', 'logs/mailer_info.log', logging.INFO)
logger_error = setup_logger(
    'logger_error', 'logs/mailer_error.log', logging.ERROR)


@app.route("/mail", methods=["POST"])
def mail_sender():
    """
    Roads for mail sending.
    The html of the mail adapts himself to the nature of the alerts.
    """
    try:
        if type(request.json) is dict:
            json_keys_list = list(request.json.keys())
            # RESET PASSWORD MAIL
            if "uuid" in json_keys_list:
                user_address = request.json["user_address"]
                uuid = request.json["uuid"]
                mail_data = {
                    'Messages': [
                        {
                            "From": {
                                "Email": EMAIL_HOST,
                                "Name": "ForexMetrics"
                            },
                            "To": [
                                {
                                    "Email": "{}".format(user_address),
                                }
                            ],
                            "Subject": "Reset your password on your ForexMetrics account!",
                            "HTMLPart": render_template("reset_password_mail.html", uuid=uuid)
                        }
                    ]
                }
                result = MAILJET.send.create(data=mail_data)
                if result.status_code == 200:
                    logger_info.info(
                        f"A mail was sent to customer {user_address} to reset his password! with uuid {uuid}", extra={"level": "INFO", "method": "POST", "endpoint": "/MAIL"})
                return Response({"response": "mail sent to {}".format(user_address)}, status=result.status_code, mimetype='application/json')

            # ACCOUNT VALIDATION
            if "registration" in json_keys_list:
                user_address = request.json["user_address"]
                random_uuid_register = request.json["random_uuid_register"]
                mail_data = {
                    'Messages': [
                        {
                            "From": {
                                "Email": EMAIL_HOST,
                                "Name": "ForexMetrics"
                            },
                            "To": [
                                {
                                    "Email": "{}".format(user_address),
                                }
                            ],
                            "Subject": "Welcome To ForexMetrics!",
                            "HTMLPart": render_template("welcome_mail.html", mail=user_address, random_uuid_register=random_uuid_register)
                        }
                    ]
                }
                result = MAILJET.send.create(data=mail_data)
                if result.status_code == 200:
                    logger_info.info(
                        f"A mail was sent to customer {user_address} to bid him welcome with uuid {random_uuid_register}!", extra={"level": "INFO", "method": "POST", "endpoint": "/MAIL"})
                return Response({"response": "mail sent to {}".format(user_address)}, status=result.status_code, mimetype='application/json')

            # ACCOUNT CHECKING
            if "accept" in json_keys_list:
                user_address = request.json["user_address"]
                mail_data = {
                    'Messages': [
                        {
                            "From": {
                                "Email": EMAIL_HOST,
                                "Name": "ForexMetrics"
                            },
                            "To": [
                                {
                                    "Email": "{}".format(user_address),
                                }
                            ],
                            "Subject": "Your email has been checked!",
                            "HTMLPart": render_template("email_checked.html", mail=user_address)
                        }
                    ]
                }
                result = MAILJET.send.create(data=mail_data)
                if result.status_code == 200:
                    logger_info.info(
                        f"A mail was sent to customer {user_address} to confirm the ckecking of his address!", extra={"level": "INFO", "method": "POST", "endpoint": "/MAIL"})
                return Response({"response": "mail sent to {}".format(user_address)}, status=result.status_code, mimetype='application/json')

            # SECRET SHARING
            if "secret" in json_keys_list:
                user_address = request.json["user_address"]
                secret = request.json["secret"]
                sender = request.json["sender"]
                mail_data = {
                    'Messages': [
                        {
                            "From": {
                                "Email": EMAIL_HOST,
                                "Name": "ForexMetrics"
                            },
                            "To": [
                                {
                                    "Email": "{}".format(user_address),
                                }
                            ],
                            "Subject": f"The user {sender} accepted to become friend with you!",
                            "HTMLPart": render_template("friend_request_accepted.html", secret=secret, sender=sender)
                        }
                    ]
                }
                result = MAILJET.send.create(data=mail_data)
                if result.status_code == 200:
                    logger_info.info(
                        f"A mail was sent to customer {user_address}. The customer {sender} accepted his friend request by sharing his secret: {secret}!", extra={"level": "INFO", "method": "POST", "endpoint": "/MAIL"})
                return Response({"response": "mail sent to {}".format(user_address)}, status=result.status_code, mimetype='application/json')

            # PERISHED ALERT MAIL
            if "expiration_date" in json_keys_list:
                user_address = request.json["user_address"]
                alert_name = request.json["alert_name"]
                expiration_date = request.json["expiration_date"]
                mail_data = {
                    'Messages': [
                        {
                            "From": {
                                "Email": EMAIL_HOST,
                                "Name": "ForexMetrics"
                            },
                            "To": [
                                {
                                    "Email": "{}".format(user_address),
                                }
                            ],
                            "Subject": "Your ForexMetrics alert has expired!",
                            "HTMLPart": render_template("expiration_mail.html", alert_name=alert_name, expiration_date=expiration_date)
                        }
                    ]
                }
                result = MAILJET.send.create(data=mail_data)
                if result.status_code == 200:
                    logger_info.info(
                    f"A mail was sent to customer {user_address} to notify that his alert {alert_name} has expired!", extra={"level": "INFO", "method": "POST", "endpoint": "/MAIL"})
                    return Response({"response": "mail sent to {}".format(user_address)}, status=result.status_code, mimetype='application/json')

        # ALERTS TRIGGERS MAIL
        trigger_condition_list = []
        trigger_value_list = []
        trigger_type_list = []
        currency_name_list = []
        counterpart_currency_list = []
        for data in request.json:
            if "email" in data:
                user_address = data["email"][0]
            if not "email" in data:
                alert_name = data["alert_name"]
                trigger_condition = data["trigger_condition"]
                trigger_value = data["trigger_value"]
                trigger_type = data["trigger_type"]
                currency_name = data["currency_name"]
                counterpart_currency = currency_name[-3:]
                trigger_condition_list.append(trigger_condition)
                trigger_value_list.append(trigger_value)
                trigger_type_list.append(trigger_type)
                currency_name_list.append(currency_name)
                counterpart_currency_list.append(counterpart_currency)
        mail_data = {
            'Messages': [
                {
                    "From": {
                        "Email": EMAIL_HOST,
                        "Name": "ForexMetrics"
                    },
                    "To": [
                        {
                            "Email": "{}".format(user_address),
                        }
                    ],
                    "Subject": "Your ForexMetrics alert has been triggered!",
                    "HTMLPart": render_template("alert_mail.html", user_address=user_address, alert_name=alert_name, trigger_data=list(zip(trigger_condition_list, trigger_value_list, trigger_type_list, currency_name_list, counterpart_currency_list)))
                }
            ]
        }
        result = MAILJET.send.create(data=mail_data)
        if result.status_code == 200:
            logger_info.info(
                f"A mail was sent to customer {user_address} to notify that his alert {alert_name} has been triggered!", extra={"level": "INFO", "method": "POST", "endpoint": "/MAIL"})
            return Response({"response": "mail sent to {}".format(user_address)}, status=result.status_code, mimetype='application/json')
    except Exception as e:
        logger_error.error(
            f"An error occured! - {e}", extra={"level": "ERROR", "method": "POST", "endpoint": "/MAIL"})


if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=os.environ["MAILER_PORT"])
