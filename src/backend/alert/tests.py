import json
import string
import random
from django.test import TestCase
from alert.models import Alert, AlertTrigger
from alert.models import AlertTrigger
from alert.models import CurrencyPair
from faker import Faker


class AlertsListTests(TestCase):
    """Tests for alerts listing service."""
    fake = Faker()
    skills = ["beginner", "intermediate", "advanced"]

    def generate_random_password(self, length: int) -> string:
        characters = list(string.ascii_letters + string.digits + "!@#$%^&*()")
        random.shuffle(characters)
        password = ""
        for i in range(length):
            password += random.choice(characters)
        return password

    def create_test_user(self):
        email = self.fake.unique.name()
        email = email.split(' ')[0].replace('.', '') + \
            email.split(' ')[1].replace('.', '')+'@etna-alternance.net'
        password = self.generate_random_password(20)
        skill = random.choice(self.skills)
        json_data = {"email": email, "password": password, "skill": skill}
        response = self.client.post(
            'http://127.0.0.1:$BACKEND_PORT/register/', data=json.dumps(json_data), content_type='application/json')
        return json.loads(response.content.decode("utf-8"))["token"]

    def test_list_alert_wrong_request(self):
        token = self.create_test_user()
        response = self.client.post(
            'http://127.0.0.1:$BACKEND_PORT/alerts/', content_type='application/json',
            HTTP_AUTHORIZATION='Token {}'.format(token))
        self.assertEqual(response.status_code, 405)
        response = self.client.put(
            'http://127.0.0.1:$BACKEND_PORT/alerts/', content_type='application/json',
            HTTP_AUTHORIZATION='Token {}'.format(token))
        self.assertEqual(response.status_code, 405)
        response = self.client.delete(
            'http://127.0.0.1:$BACKEND_PORT/alerts/', content_type='application/json',
            HTTP_AUTHORIZATION='Token {}'.format(token))
        self.assertEqual(response.status_code, 405)

    def test_list_alert_no_credentials(self):
        response = self.client.get(
            'http://127.0.0.1:$BACKEND_PORT/alerts/', content_type='application/json')
        self.assertEqual(response.status_code, 401)

    def test_list_alert_wrong_token(self):
        response = self.client.get(
            'http://127.0.0.1:$BACKEND_PORT/alerts/', content_type='application/json', HTTP_AUTHORIZATION='Token token')
        self.assertEqual(response.status_code, 401)

    def test_list_alert_correct_token(self):
        token = self.create_test_user()
        response = self.client.get(
            'http://127.0.0.1:$BACKEND_PORT/alerts/', content_type='application/json',
            HTTP_AUTHORIZATION='Token {}'.format(token))
        self.assertEqual(response.status_code, 200)


class AlertManagerTest(TestCase):
    """Tests for a specific alert service."""
    fake = Faker()
    skills = ["beginner", "intermediate", "advanced"]
    protection_levels = ["public", "limited", "private"]

    def generate_random_password(self, length: int) -> string:
        characters = list(string.ascii_letters + string.digits + "!@#$%^&*()")
        random.shuffle(characters)
        password = ""
        for i in range(length):
            password += random.choice(characters)
        return password

    def create_test_user(self):
        email = self.fake.unique.name()
        email = email.split(' ')[0].replace('.', '') + \
            email.split(' ')[1].replace('.', '')+'@etna-alternance.net'
        password = self.generate_random_password(20)
        skill = random.choice(self.skills)
        json_data = {"email": email, "password": password, "skill": skill}
        response = self.client.post(
            'http://127.0.0.1:$BACKEND_PORT/register/', data=json.dumps(json_data), content_type='application/json')
        return json.loads(response.content.decode("utf-8"))["token"]

    def create_currency(self, symbol):
        CurrencyPair.objects.create(symbol=symbol)
        return CurrencyPair.objects.get(symbol=symbol)

    def create_trigger(self, alert_object):
        AlertTrigger.objects.create(alert=alert_object, trigger_condition=random.choices(["crossing", "bigger than", "percentage increase"]), trigger_type=random.choices(
            ["bid", "ask"]), value=random.uniform(0, 3), is_active=random.choices([True, False]))
        return AlertTrigger.objects.get(alert=alert_object)

    def test_wrong_json_patterns_alert(self):
        """
        1:no alert name
        2:no currency
        3:wrong currency
        4:not perishable alert with date
        5:persishable alert with not date
        6:wrong trigger_type
        7:wrong trigger_condition
        8:no value
        9:no triggers
        """
        currency = self.create_currency("EUR_USD")
        self.assertIsInstance(currency, CurrencyPair)
        token = self.create_test_user()
        json_data = {1:
                     {
                         "currency_pair": currency.symbol,
                         "alerting_device": "e-mail",
                         "expire": False,
                         "is_active": False,
                         "protection_level": random.choice(self.protection_levels),
                         "triggers": []
                     }, 2:
                     {"alert_name": "alert1",
                      "alerting_device": "e-mail",
                      "expire": False,
                         "is_active": False,
                         "triggers": []
                      }, 3:
                     {"alert_name": "alert1",
                      "currency_pair": "EUR__USD",
                      "alerting_device": "e-mail",
                         "expire": False,
                         "is_active": False,
                         "triggers": []
                      }, 4:
                     {"alert_name": "alert1",
                      "currency_pair": currency.symbol,
                      "alerting_device": "e-mail",
                         "expire": False,
                         "expiration_date": "2019-09-14 10:30:00.654684",
                         "is_active": False,
                         "triggers": []
                      }, 5:
                     {"alert_name": "alert1",
                      "currency_pair": currency.symbol,
                      "alerting_device": "e-mail",
                         "expire": True,
                         "is_active": False,
                         "triggers": []
                      },
                     6:
                     {"alert_name": "alert1",
                      "currency_pair": currency.symbol,
                      "alerting_device": "e-mail",
                         "expire": False,
                         "is_active": True,
                         "triggers": [
                             # self.create_trigger(Alert.objects.get("alert1")[0])
                             {
                                 "trigger_type": "ask",
                                 "trigger_condition": "percentage_decrease",
                                 "value": 1000.0,
                                 "is_active": True
                             },
                         ]
                      },
                     7:
                     {"alert_name": "alert1",
                      "currency_pair": currency.symbol,
                      "alerting_device": "e-mail",
                         "expire": False,
                         "is_active": True,
                         "triggers": [
                             {
                                 "trigger_type": "ask",
                                 "trigger_condition": "percentage_decrease",
                                 "value": 1000.0,
                                 "is_active": True
                             },
                         ]
                      },
                     8:
                     {"alert_name": "alert1",
                      "currency_pair": currency.symbol,
                      "alerting_device": "e-mail",
                         "expire": False,
                         "is_active": True,
                         "triggers": [
                             {
                                 "trigger_type": "ask",
                                 "trigger_condition": "percentage_decrease",
                                 "is_active": True
                             },
                         ]
                      },
                     9:
                     {"alert_name": "alert1",
                      "currency_pair": currency.symbol,
                      "alerting_device": "e-mail",
                         "expire": False,
                         "is_active": True,
                      },
                     }
        for index in (json_data):
            response = self.client.post(
                'http://127.0.0.1:$BACKEND_PORT/alert/', data=json.dumps(json_data[index]), content_type='application/json', HTTP_AUTHORIZATION='Token {}'.format(token))
            self.assertEqual(response.status_code, 400)
            response = self.client.put(
                'http://127.0.0.1:$BACKEND_PORT/alert/', data=json.dumps(json_data[index]), content_type='application/json', HTTP_AUTHORIZATION='Token {}'.format(token))
            self.assertEqual(response.status_code, 400)

    def test_create_alert_no_credentials(self):
        json_data = {
            "alert_name": "alert1",
            "currency_pair": "EUR_USD",
            "alerting_device": "e-mail",
            "expire": False,
            "is_active": True,
            "triggers": []
        }
        response = self.client.get(
            'http://127.0.0.1:$BACKEND_PORT/alert/', content_type='application/json')
        self.assertEqual(response.status_code, 401)
        response = self.client.post(
            'http://127.0.0.1:$BACKEND_PORT/alert/', data=json.dumps(json_data), content_type='application/json')
        self.assertEqual(response.status_code, 401)
        response = self.client.put(
            'http://127.0.0.1:$BACKEND_PORT/alert/', data=json.dumps(json_data), content_type='application/json')
        self.assertEqual(response.status_code, 401)
        response = self.client.delete(
            'http://127.0.0.1:$BACKEND_PORT/alert/', content_type='application/json')
        self.assertEqual(response.status_code, 401)

    def test_get_or_put_inexistant_alert(self):
        token = self.create_test_user()
        currency = self.create_currency("EUR_USD")
        self.assertIsInstance(currency, CurrencyPair)

        json_data = {
            "alert_name": "alert1",
            "currency_pair": currency.symbol,
            "alerting_device": "e-mail",
            "expire": False,
            "is_active": True,
            "protection_level": random.choice(self.protection_levels),
            "triggers": []
        }

        response = self.client.post(
            'http://127.0.0.1:$BACKEND_PORT/alert/', data=json.dumps(json_data), content_type='application/json', HTTP_AUTHORIZATION='Token {}'.format(token))
        self.assertEqual(response.status_code, 201)

        response = self.client.generic('GET', 'http://127.0.0.1:$BACKEND_PORT/alert/', json.dumps({'alert_name': 'alert2'}),
                                       content_type='application/json',
                                       HTTP_AUTHORIZATION='Token {}'.format(token))
        self.assertEqual(response.status_code, 404)
        json_data = {
            "alert_name": "alert2",
            "currency_pair": currency.symbol,
            "alerting_device": "e-mail",
            "expire": False,
            "is_active": True,
            "protection_level": random.choice(self.protection_levels),
            "triggers": []
        }

        response = self.client.put(
            'http://127.0.0.1:$BACKEND_PORT/alert/', data=json.dumps(json_data), content_type='application/json', HTTP_AUTHORIZATION='Token {}'.format(token))
        self.assertEqual(response.status_code, 404)

    def test_create_expired_alert(self):
        token = self.create_test_user()
        currency = self.create_currency("EUR_USD")
        self.assertIsInstance(currency, CurrencyPair)
        json_data = {
            "alert_name": "alert1",
            "currency_pair": currency.symbol,
            "alerting_device": "e-mail",
            "expire": True,
            "expiration_date": "1019-09-14 10:30:00.654684",
            "is_active": True,
            "protection_level": random.choice(self.protection_levels),
            "triggers": []
        }
        response = self.client.post(
            'http://127.0.0.1:$BACKEND_PORT/alert/', data=json.dumps(json_data), content_type='application/json', HTTP_AUTHORIZATION='Token {}'.format(token))
        self.assertEqual(response.status_code, 201)
        alert = Alert.objects.get(alert_name="alert1")
        self.assertIsInstance(alert, Alert)
        self.assertIs(alert.is_active, False)

    def test_crud_alert_manager(self):
        token = self.create_test_user()
        currency = self.create_currency("EUR_USD")
        self.assertIsInstance(currency, CurrencyPair)
        json_data = {
            "alert_name": "alert1",
            "currency_pair": currency.symbol,
            "alerting_device": "e-mail",
            "expire": True,
            "expiration_date": "3019-09-14 10:30:00.654684",
            "is_active": True,
            "protection_level": random.choice(self.protection_levels),
            "triggers": []
        }

        response = self.client.post(
            'http://127.0.0.1:$BACKEND_PORT/alert/', data=json.dumps(json_data), content_type='application/json',
            HTTP_AUTHORIZATION='Token {}'.format(token))
        self.assertEqual(response.status_code, 201)
        response = self.client.generic('GET',
                                       'http://127.0.0.1:$BACKEND_PORT/alert/', data=json.dumps({"alert_name": "alert1"}),
                                       content_type='application/json', HTTP_AUTHORIZATION='Token {}'.format(token))
        self.assertEqual(response.status_code, 200)
        response = self.client.put(
            'http://127.0.0.1:$BACKEND_PORT/alert/', data=json.dumps(json_data), content_type='application/json',
            HTTP_AUTHORIZATION='Token {}'.format(token))
        self.assertEqual(response.status_code, 200)
        response = self.client.delete(
            'http://127.0.0.1:$BACKEND_PORT/alert/', data=json.dumps({"alert_name": "alert1"}), content_type='application/json',
            HTTP_AUTHORIZATION='Token {}'.format(token))
        alerts = Alert.objects.all()
        triggers = AlertTrigger.objects.all()
        self.assertEqual(len(alerts), 0)
        self.assertEqual(len(triggers), 0)
        self.assertEqual(response.status_code, 204)

    def test_unactive_alert_with_active_triggers(self):
        token = self.create_test_user()
        currency = self.create_currency("EUR_USD")
        self.assertIsInstance(currency, CurrencyPair)
        json_data = {
            "alert_name": "alert1",
            "currency_pair": "EUR_USD",
            "alerting_device": "e-mail",
            "expire": True,
            "expiration_date": "3019-09-14 10:30:00.654684",
            "is_active": False,
            "protection_level": random.choice(self.protection_levels),
            "triggers": [
                {
                    "trigger_type": "bid",
                    "trigger_condition": "pip increase",
                    "is_active": True,
                    "value": 1.2
                },
                {
                    "trigger_type": "ask",
                    "trigger_condition": "percentage increase",
                    "is_active": False,
                    "value": 1.2
                }
            ]
        }
        response = self.client.post(
            'http://127.0.0.1:$BACKEND_PORT/alert/', data=json.dumps(json_data), content_type='application/json',
            HTTP_AUTHORIZATION='Token {}'.format(token))
        self.assertEqual(response.status_code, 201)
        triggers = AlertTrigger.objects.all()
        for trigger in triggers:
            self.assertEqual(trigger.is_active, False)

    def test_active_alert_with_unactive_triggers(self):
        token = self.create_test_user()
        currency = self.create_currency("EUR_USD")
        self.assertIsInstance(currency, CurrencyPair)
        json_data = {
            "alert_name": "alert1",
            "currency_pair": "EUR_USD",
            "alerting_device": "e-mail",
            "expire": True,
            "expiration_date": "3019-09-14 10:30:00.654684",
            "is_active": True,
            "protection_level": random.choice(self.protection_levels),
            "triggers": [
                {
                    "trigger_type": "bid",
                    "trigger_condition": "pip increase",
                    "is_active": False,
                    "value": 1.2
                },
                {
                    "trigger_type": "ask",
                    "trigger_condition": "percentage increase",
                    "is_active": False,
                    "value": 1.2
                }
            ]
        }
        response = self.client.post(
            'http://127.0.0.1:$BACKEND_PORT/alert/', data=json.dumps(json_data), content_type='application/json',
            HTTP_AUTHORIZATION='Token {}'.format(token))
        self.assertEqual(response.status_code, 201)
        alert = Alert.objects.get(alert_name="alert1")
        self.assertEqual(alert.is_active, False)

    def test_update_triggers(self):
        token = self.create_test_user()
        currency = self.create_currency("EUR_USD")
        self.assertIsInstance(currency, CurrencyPair)
        json_data = {
            "alert_name": "alert1",
            "currency_pair": "EUR_USD",
            "alerting_device": "e-mail",
            "expire": True,
            "expiration_date": "3019-09-14 10:30:00.654684",
            "is_active": True,
            "protection_level": random.choice(self.protection_levels),
            "triggers": [
                {
                    "trigger_type": "bid",
                    "trigger_condition": "pip increase",
                    "is_active": True,
                    "value": 1.2
                },
                {
                    "trigger_type": "ask",
                    "trigger_condition": "percentage increase",
                    "is_active": False,
                    "value": 1.2
                }
            ]
        }
        nb_triggers_in_json = len(json_data["triggers"])
        response = self.client.post(
            'http://127.0.0.1:$BACKEND_PORT/alert/', data=json.dumps(json_data), content_type='application/json',
            HTTP_AUTHORIZATION='Token {}'.format(token))
        self.assertEqual(response.status_code, 201)
        triggers = AlertTrigger.objects.all()
        nb_triggers = len(triggers)
        self.assertEqual(nb_triggers_in_json, nb_triggers)

        json_data = {
            "alert_name": "alert1",
            "currency_pair": "EUR_USD",
            "alerting_device": "e-mail",
            "expire": True,
            "expiration_date": "3019-09-14 10:30:00.654684",
            "is_active": True,
            "protection_level": random.choice(self.protection_levels),
            "triggers": [
                {
                    "trigger_type": "bid",
                    "trigger_condition": "pip increase",
                    "is_active": True,
                    "value": 1.2
                },
                {
                    "trigger_type": "ask",
                    "trigger_condition": "percentage increase",
                    "is_active": False,
                    "value": 1.2
                },
                {
                    "trigger_type": "ask",
                    "trigger_condition": "pip increase",
                    "is_active": True,
                    "value": 1.2
                },
                {
                    "trigger_type": "bid",
                    "trigger_condition": "upcrossing",
                    "is_active": True,
                    "value": 1.2
                }
            ]
        }
        nb_triggers_in_json = len(json_data["triggers"])

        response = self.client.put(
            'http://127.0.0.1:$BACKEND_PORT/alert/', data=json.dumps(json_data), content_type='application/json',
            HTTP_AUTHORIZATION='Token {}'.format(token))
        self.assertEqual(response.status_code, 200)
        nb_triggers_after_put = AlertTrigger.objects.all()
        self.assertNotEqual(nb_triggers, nb_triggers_after_put)
        self.assertEqual(nb_triggers_in_json, len(nb_triggers_after_put))
