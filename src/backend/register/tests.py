import json
import uuid
import string
import random
from faker import Faker
from django.test import TestCase
from register.models import FollowUser
from register.models import FollowingRequests
from register.models import CustomUser


class RegisterTests(TestCase):
    """Tests for register service."""
    fake = Faker()
    skills = ["beginner", "intermediate", "advanced"]

    def generate_random_password(self, length: int) -> string:
        characters = list(string.ascii_letters + string.digits + "!@#$%^&*()")
        random.shuffle(characters)
        password = ""
        for i in range(length):
            password += random.choice(characters)
        return password

    def test_no_data(self):
        response = self.client.post(
            'http://127.0.0.1:$BACKEND_PORT/register/', content_type='application/json')
        self.assertEqual(response.status_code, 400)

    def test_wrong_request(self):
        response = self.client.get(
            'http://127.0.0.1:$BACKEND_PORT/register/', content_type='application/json')
        self.assertEqual(response.status_code, 405)
        response = self.client.put(
            'http://127.0.0.1:$BACKEND_PORT/register/', content_type='application/json')
        self.assertEqual(response.status_code, 405)
        response = self.client.delete(
            'http://127.0.0.1:$BACKEND_PORT/register/', content_type='application/json')
        self.assertEqual(response.status_code, 405)

    def test_invalid_data_type(self):
        email = self.fake.unique.name()
        email = email.split(' ')[0].replace('.', '') + \
            email.split(' ')[1].replace('.', '')+'@etna-alternance.net'
        password = random.randint(10000, 100000)
        skill = random.choice(self.skills)
        json_data = {"email": email, "password": password, "skill": skill}
        response = self.client.post(
            'http://127.0.0.1:$BACKEND_PORT/register/', data=json_data, content_type='application/json')
        self.assertEqual(response.status_code, 400)

    def test_invalid_skill_choice(self):
        email = self.fake.unique.name()
        email = email.split(' ')[0].replace('.', '') + \
            email.split(' ')[1].replace('.', '')+'@etna-alternance.net'
        password = self.generate_random_password(20)
        skill = "master"
        json_data = {"email": email, "password": password, "skill": skill}
        response = self.client.post(
            'http://127.0.0.1:$BACKEND_PORT/register/', data=json_data, content_type='application/json')
        self.assertEqual(response.status_code, 400)

    def test_invalid_email(self):
        email = self.fake.unique.name()
        email = email.split(' ')[0] + email.split(' ')[1]
        password = self.generate_random_password(20)
        skill = random.choice(self.skills)
        json_data = {"email": email, "password": password, "skill": skill}
        response = self.client.post(
            'http://127.0.0.1:$BACKEND_PORT/register/', data=json_data, content_type='application/json')
        self.assertEqual(response.status_code, 400)

    def test_correct_user(self):
        email = self.fake.unique.name()
        email = email.split(' ')[0].replace('.', '') + \
            email.split(' ')[1].replace('.', '')+'@etna-alternance.net'
        password = self.generate_random_password(20)
        skill = random.choice(self.skills)
        json_data = {"email": email, "password": password, "skill": skill}
        response = self.client.post(
            'http://127.0.0.1:$BACKEND_PORT/register/', data=json.dumps(json_data), content_type='application/json')
        self.assertEqual(response.status_code, 201)
        user = CustomUser.objects.get(email=email)
        self.assertIsNotNone(user.random_uuid_register)

    def test_database_integrity(self):
        email = self.fake.unique.name()
        email = email.split(' ')[0].replace('.', '') + \
            email.split(' ')[1].replace('.', '')+'@etna-alternance.net'
        password = self.generate_random_password(20)
        skill = random.choice(self.skills)
        json_data = {"email": email, "password": password, "skill": skill}
        response = self.client.post(
            'http://127.0.0.1:$BACKEND_PORT/register/', data=json.dumps(json_data), content_type='application/json')
        self.assertEqual(response.status_code, 201)

        password = self.generate_random_password(20)
        skill = random.choice(self.skills)
        json_data = {"email": email, "password": password, "skill": skill}
        response = self.client.post(
            'http://127.0.0.1:$BACKEND_PORT/register/', data=json.dumps(json_data), content_type='application/json')
        self.assertEqual(response.status_code, 409)


class LoginTest(TestCase):
    """Tests for login service."""
    fake = Faker()
    skills = ["beginner", "intermediate", "advanced"]

    def generate_random_password(self, length: int) -> string:
        characters = list(string.ascii_letters + string.digits + "!@#$%^&*()")
        random.shuffle(characters)
        password = ""
        for i in range(length):
            password += random.choice(characters)
        return password

    def create_test_user(self, email, password, skill):
        json_data = {"email": email, "password": password, "skill": skill}
        self.client.post(
            'http://127.0.0.1:$BACKEND_PORT/register/', data=json.dumps(json_data), content_type='application/json')

    def test_wrong_request(self):
        email = self.fake.unique.name()
        email = email.split(' ')[0].replace('.', '') + \
            email.split(' ')[1].replace('.', '')+'@etna-alternance.net'
        password = self.generate_random_password(20)
        skill = random.choice(self.skills)
        self.create_test_user(email, password, skill)
        json_data = {"username": email, "password": password}
        response = self.client.get(
            'http://127.0.0.1:$BACKEND_PORT/login/', content_type='application/json')
        self.assertEqual(response.status_code, 405)
        response = self.client.put(
            'http://127.0.0.1:$BACKEND_PORT/login/', data=json.dumps(json_data), content_type='application/json')
        self.assertEqual(response.status_code, 405)
        response = self.client.delete(
            'http://127.0.0.1:$BACKEND_PORT/login/', data=json.dumps(json_data), content_type='application/json')
        self.assertEqual(response.status_code, 405)

    def test_no_data(self):
        email = self.fake.unique.name()
        email = email.split(' ')[0].replace('.', '') + \
            email.split(' ')[1].replace('.', '')+'@etna-alternance.net'
        password = self.generate_random_password(20)
        skill = random.choice(self.skills)
        self.create_test_user(email, password, skill)
        response = self.client.post(
            'http://127.0.0.1:$BACKEND_PORT/login/', content_type='application/json')
        self.assertEqual(response.status_code, 400)

    def test_wrong_json_format(self):
        email = self.fake.unique.name()
        email = email.split(' ')[0].replace('.', '') + \
            email.split(' ')[1].replace('.', '')+'@etna-alternance.net'
        password = self.generate_random_password(20)
        skill = random.choice(self.skills)
        self.create_test_user(email, password, skill)
        json_data = {"email": email, "password": password}
        response = self.client.post(
            'http://127.0.0.1:$BACKEND_PORT/login/', data=json.dumps(json_data), content_type='application/json')
        self.assertEqual(response.status_code, 400)

    def test_wrong_json_data(self):
        email = self.fake.unique.name()
        email = email.split(' ')[0].replace('.', '') + \
            email.split(' ')[1].replace('.', '')+'@etna-alternance.net'
        password = self.generate_random_password(20)
        skill = random.choice(self.skills)
        self.create_test_user(email, password, skill)
        email = ""
        password = ""
        json_data = {"username": email, "password": password}
        response = self.client.post(
            'http://127.0.0.1:$BACKEND_PORT/login/', data=json.dumps(json_data), content_type='application/json')
        self.assertEqual(response.status_code, 400)

    def test_login_user(self):
        email = self.fake.unique.name()
        email = email.split(' ')[0].replace('.', '') + \
            email.split(' ')[1].replace('.', '')+'@etna-alternance.net'
        password = self.generate_random_password(20)
        skill = random.choice(self.skills)
        self.create_test_user(email, password, skill)
        json_data = {"username": email, "password": password}
        response = self.client.post(
            'http://127.0.0.1:$BACKEND_PORT/login/', data=json.dumps(json_data), content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertIsNotNone(json.loads(
            response.content.decode("utf-8"))["token"])

    def test_login_twice(self):
        email = self.fake.unique.name()
        email = email.split(' ')[0].replace('.', '') + \
            email.split(' ')[1].replace('.', '')+'@etna-alternance.net'
        password = self.generate_random_password(20)
        skill = random.choice(self.skills)
        self.create_test_user(email, password, skill)
        json_data = {"username": email, "password": password}
        response = self.client.post(
            'http://127.0.0.1:$BACKEND_PORT/login/', data=json.dumps(json_data), content_type='application/json')
        self.assertEqual(response.status_code, 200)
        token1 = json.loads(response.content.decode("utf-8"))["token"]
        self.assertIsNotNone(token1)
        response = self.client.post(
            'http://127.0.0.1:$BACKEND_PORT/login/', data=json.dumps(json_data), content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertIsNotNone(json.loads(
            response.content.decode("utf-8"))["token"])
        token2 = json.loads(response.content.decode("utf-8"))["token"]
        self.assertNotEquals(token1, token2)


class LogoutTest(TestCase):
    """Tests for logout service."""
    fake = Faker()
    skills = ["beginner", "intermediate", "advanced"]

    def generate_random_password(self, length: int) -> string:
        characters = list(string.ascii_letters + string.digits + "!@#$%^&*()")
        random.shuffle(characters)
        password = ""
        for i in range(length):
            password += random.choice(characters)
        return password

    def create_test_user(self, email, password, skill):
        json_data = {"email": email, "password": password, "skill": skill}
        response = self.client.post(
            'http://127.0.0.1:$BACKEND_PORT/register/', data=json.dumps(json_data), content_type='application/json')
        return json.loads(response.content.decode("utf-8"))["token"]

    def test_wrong_request(self):
        email = self.fake.unique.name()
        email = email.split(' ')[0].replace('.', '') + \
            email.split(' ')[1].replace('.', '')+'@etna-alternance.net'
        password = self.generate_random_password(20)
        skill = random.choice(self.skills)
        token = self.create_test_user(email, password, skill)
        json_data = {"email": email, "password": password}
        response = self.client.get(
            'http://127.0.0.1:$BACKEND_PORT/logout/', content_type='application/json',
            HTTP_AUTHORIZATION='Token {}'.format(token))
        self.assertEqual(response.status_code, 405)
        response = self.client.put(
            'http://127.0.0.1:$BACKEND_PORT/logout/', data=json.dumps(json_data), content_type='application/json',
            HTTP_AUTHORIZATION='Token {}'.format(token))
        self.assertEqual(response.status_code, 405)
        response = self.client.delete(
            'http://127.0.0.1:$BACKEND_PORT/logout/', data=json.dumps(json_data), content_type='application/json',
            HTTP_AUTHORIZATION='Token {}'.format(token))
        self.assertEqual(response.status_code, 405)

    def test_logout_without_credentials(self):
        email = self.fake.unique.name()
        email = email.split(' ')[0].replace('.', '') + \
            email.split(' ')[1].replace('.', '')+'@etna-alternance.net'
        password = self.generate_random_password(20)
        skill = random.choice(self.skills)
        self.create_test_user(email, password, skill)
        response = self.client.post(
            'http://127.0.0.1:$BACKEND_PORT/logout/', content_type='application/json')
        self.assertEqual(response.status_code, 401)

    def test_correct_logout(self):
        email = self.fake.unique.name()
        email = email.split(' ')[0].replace('.', '') + \
            email.split(' ')[1].replace('.', '')+'@etna-alternance.net'
        password = self.generate_random_password(20)
        skill = random.choice(self.skills)
        token = self.create_test_user(email, password, skill)
        response = self.client.post(
            'http://127.0.0.1:$BACKEND_PORT/logout/', content_type='application/json',
            HTTP_AUTHORIZATION='Token {}'.format(token))
        self.assertEqual(response.status_code, 200)

    def test_logout_twice(self):
        email = self.fake.unique.name()
        email = email.split(' ')[0].replace('.', '') + \
            email.split(' ')[1].replace('.', '')+'@etna-alternance.net'
        password = self.generate_random_password(20)
        skill = random.choice(self.skills)
        token = self.create_test_user(email, password, skill)
        response = self.client.post(
            'http://127.0.0.1:$BACKEND_PORT/logout/', content_type='application/json',
            HTTP_AUTHORIZATION='Token {}'.format(token))
        self.assertEqual(response.status_code, 200)
        response = self.client.post(
            'http://127.0.0.1:$BACKEND_PORT/logout/', content_type='application/json',
            HTTP_AUTHORIZATION='Token {}'.format(token))
        self.assertEqual(response.status_code, 401)


class RefreshTest(TestCase):
    """Tests for refresh service."""
    fake = Faker()
    skills = ["beginner", "intermediate", "advanced"]

    def generate_random_password(self, length: int) -> string:
        characters = list(string.ascii_letters + string.digits + "!@#$%^&*()")
        random.shuffle(characters)
        password = ""
        for i in range(length):
            password += random.choice(characters)
        return password

    def create_test_user(self, email, password, skill):
        json_data = {"email": email, "password": password, "skill": skill}
        response = self.client.post(
            'http://127.0.0.1:$BACKEND_PORT/register/', data=json.dumps(json_data), content_type='application/json')
        return json.loads(response.content.decode("utf-8"))["token"]

    def test_refresh_token_no_credentials(self):
        email = self.fake.unique.name()
        email = email.split(' ')[0].replace('.', '') + \
            email.split(' ')[1].replace('.', '')+'@etna-alternance.net'
        password = self.generate_random_password(20)
        skill = random.choice(self.skills)
        self.create_test_user(email, password, skill)
        response = self.client.post(
            'http://127.0.0.1:$BACKEND_PORT/refresh/', content_type='application/json')
        self.assertEqual(response.status_code, 401)

    def test_refresh_wrong_token(self):
        email = self.fake.unique.name()
        email = email.split(' ')[0].replace('.', '') + \
            email.split(' ')[1].replace('.', '')+'@etna-alternance.net'
        password = self.generate_random_password(20)
        skill = random.choice(self.skills)
        self.create_test_user(email, password, skill)
        response = self.client.post(
            'http://127.0.0.1:$BACKEND_PORT/refresh/', content_type='application/json', HTTP_AUTHORIZATION='Token token')
        self.assertEqual(response.status_code, 401)

    def test_refresh_twice_same_token(self):
        email = self.fake.unique.name()
        email = email.split(' ')[0].replace('.', '') + \
            email.split(' ')[1].replace('.', '')+'@etna-alternance.net'
        password = self.generate_random_password(20)
        skill = random.choice(self.skills)
        token = self.create_test_user(email, password, skill)
        response = self.client.post(
            'http://127.0.0.1:$BACKEND_PORT/refresh/', content_type='application/json',
            HTTP_AUTHORIZATION='Token {}'.format(token))
        self.assertEqual(response.status_code, 200)
        response = self.client.post(
            'http://127.0.0.1:$BACKEND_PORT/refresh/', content_type='application/json',
            HTTP_AUTHORIZATION='Token {}'.format(token))
        self.assertEqual(response.status_code, 401)

    def test_refresh_correct_token(self):
        email = self.fake.unique.name()
        email = email.split(' ')[0].replace('.', '') + \
            email.split(' ')[1].replace('.', '')+'@etna-alternance.net'
        password = self.generate_random_password(20)
        skill = random.choice(self.skills)
        token = self.create_test_user(email, password, skill)
        response = self.client.post(
            'http://127.0.0.1:$BACKEND_PORT/refresh/', content_type='application/json',
            HTTP_AUTHORIZATION='Token {}'.format(token))
        self.assertEqual(response.status_code, 200)
        self.assertIsNotNone(json.loads(
            response.content.decode("utf-8"))["token"])

    def test_refresh_twice_correct_token(self):
        email = self.fake.unique.name()
        email = email.split(' ')[0].replace('.', '') + \
            email.split(' ')[1].replace('.', '')+'@etna-alternance.net'
        password = self.generate_random_password(20)
        skill = random.choice(self.skills)
        token = self.create_test_user(email, password, skill)
        response = self.client.post(
            'http://127.0.0.1:$BACKEND_PORT/refresh/', content_type='application/json',
            HTTP_AUTHORIZATION='Token {}'.format(token))
        self.assertEqual(response.status_code, 200)
        token1 = json.loads(response.content.decode("utf-8"))["token"]
        response = self.client.post(
            'http://127.0.0.1:$BACKEND_PORT/refresh/', content_type='application/json',
            HTTP_AUTHORIZATION='Token {}'.format(token1))
        self.assertEqual(response.status_code, 200)
        token2 = json.loads(response.content.decode("utf-8"))["token"]
        self.assertIsNotNone(json.loads(
            response.content.decode("utf-8"))["token"])
        self.assertNotEquals(token1, token2)


class UserTest(TestCase):
    """Tests for user management service."""
    fake = Faker()
    skills = ["beginner", "intermediate", "advanced"]

    def generate_random_password(self, length: int) -> string:
        characters = list(string.ascii_letters + string.digits + "!@#$%^&*()")
        random.shuffle(characters)
        password = ""
        for i in range(length):
            password += random.choice(characters)
        return password

    def create_test_user(self, email, password, skill):
        json_data = {"email": email, "password": password, "skill": skill}
        response = self.client.post(
            'http://127.0.0.1:$BACKEND_PORT/register/', data=json.dumps(json_data), content_type='application/json')
        return json.loads(response.content.decode("utf-8"))["token"]

    def test_user_detail_wrong_token(self):
        email = self.fake.unique.name()
        email = email.split(' ')[0].replace('.', '') + \
            email.split(' ')[1].replace('.', '')+'@etna-alternance.net'
        password = self.generate_random_password(20)
        skill = random.choice(self.skills)
        self.create_test_user(email, password, skill)
        response = self.client.get(
            'http://127.0.0.1:$BACKEND_PORT/user/', content_type='application/json', HTTP_AUTHORIZATION='Token {}'.format("token"))
        self.assertEqual(response.status_code, 401)

    def test_user_detail_no_credentials(self):
        response = self.client.get(
            'http://127.0.0.1:$BACKEND_PORT/user/')
        self.assertEqual(response.status_code, 401)
        response = self.client.delete(
            'http://127.0.0.1:$BACKEND_PORT/user/', content_type='application/json')
        self.assertEqual(response.status_code, 401)

    def test_user_not_logged_user(self):
        email = self.fake.unique.name()
        email = email.split(' ')[0].replace('.', '') + \
            email.split(' ')[1].replace('.', '')+'@etna-alternance.net'
        password = self.generate_random_password(20)
        skill = random.choice(self.skills)
        token = self.create_test_user(email, password, skill)
        response = self.client.post('http://127.0.0.1:$BACKEND_PORT/logout/',
                                    content_type='application/json', HTTP_AUTHORIZATION='Token {}'.format(token))
        self.assertEqual(response.status_code, 200)
        response = self.client.get(
            'http://127.0.0.1:$BACKEND_PORT/user/', content_type='application/json', HTTP_AUTHORIZATION='Token {}'.format("token"))
        self.assertEqual(response.status_code, 401)

    def test_user_detail_wrong_request(self):
        email = self.fake.unique.name()
        email = email.split(' ')[0].replace('.', '') + \
            email.split(' ')[1].replace('.', '')+'@etna-alternance.net'
        password = self.generate_random_password(20)
        skill = random.choice(self.skills)
        token = self.create_test_user(email, password, skill)
        response = self.client.post(
            'http://127.0.0.1:$BACKEND_PORT/user/', content_type='application/json', HTTP_AUTHORIZATION='Token {}'.format(token))
        self.assertEqual(response.status_code, 405)
        response = self.client.put(
            'http://127.0.0.1:$BACKEND_PORT/user/', content_type='application/json', HTTP_AUTHORIZATION='Token {}'.format(token))
        self.assertEqual(response.status_code, 405)

    def test_user_detail_correct_token(self):
        email = self.fake.unique.name()
        email = email.split(' ')[0].replace('.', '') + \
            email.split(' ')[1].replace('.', '')+'@etna-alternance.net'
        password = self.generate_random_password(20)
        skill = random.choice(self.skills)
        token = self.create_test_user(email, password, skill)
        response = self.client.get(
            'http://127.0.0.1:$BACKEND_PORT/user/', content_type='application/json', HTTP_AUTHORIZATION='Token {}'.format(token))
        self.assertEqual(response.status_code, 200)

    def test_delete_user(self):
        email = self.fake.unique.name()
        email = email.split(' ')[0].replace('.', '') + \
            email.split(' ')[1].replace('.', '')+'@etna-alternance.net'
        password = self.generate_random_password(20)
        skill = random.choice(self.skills)
        token = self.create_test_user(email, password, skill)
        response = self.client.delete(
            'http://127.0.0.1:$BACKEND_PORT/user/', content_type='application/json', HTTP_AUTHORIZATION='Token {}'.format(token))
        self.assertEqual(response.status_code, 204)


class AskResetTest(TestCase):
    """ Test for ask reset password service """
    fake = Faker()
    skills = ["beginner", "intermediate", "advanced"]

    def generate_random_password(self, length: int) -> string:
        characters = list(string.ascii_letters + string.digits + "!@#$%^&*()")
        random.shuffle(characters)
        password = ""
        for i in range(length):
            password += random.choice(characters)
        return password

    def create_test_user(self, email):
        json_data = {"email": email,
                     "password": "password", "skill": "advanced"}
        response = self.client.post(
            'http://127.0.0.1:$BACKEND_PORT/register/', data=json.dumps(json_data), content_type='application/json')
        return json.loads(response.content.decode("utf-8"))["token"]

    def test_ask_reset_password_wrong_request(self):
        email = self.fake.unique.name()
        email = email.split(' ')[0].replace('.', '') + \
            email.split(' ')[1].replace('.', '')+'@etna-alternance.net'
        self.create_test_user(email)
        json_data = {"email": email}
        response = self.client.get('http://127.0.0.1:$BACKEND_PORT/ask_reset_password/',
                                   content_type='application/json')
        self.assertEqual(response.status_code, 405)
        response = self.client.put('http://127.0.0.1:$BACKEND_PORT/ask_reset_password/',
                                   data=json.dumps(json_data), content_type='application/json')
        self.assertEqual(response.status_code, 405)
        response = self.client.delete('http://127.0.0.1:$BACKEND_PORT/ask_reset_password/',
                                      data=json.dumps(json_data), content_type='application/json')
        self.assertEqual(response.status_code, 405)

    def test_ask_reset_password_check_uuid(self):
        email1 = self.fake.name()
        email1 = email1.split(' ')[0] + \
            email1.split(' ')[1]+'@etna-alternance.net'
        email2 = self.fake.name()
        email2 = email2.split(' ')[0] + \
            email2.split(' ')[1]+'@etna-alternance.net'
        self.create_test_user(email1)
        self.create_test_user(email2)
        json_data = {"email": email1}
        response = self.client.post('http://127.0.0.1:$BACKEND_PORT/ask_reset_password/',
                                    data=json.dumps(json_data), content_type='application/json')
        user1 = CustomUser.objects.get(email=email1)
        user2 = CustomUser.objects.get(email=email2)

        self.assertIsNotNone(user1.random_uuid_password)
        self.assertIsNone(user2.random_uuid_password)
        self.assertEqual(response.status_code, 100)

    def test_ask_reset_password_unexistant_email(self):
        email = self.fake.unique.name()
        email = email.split(' ')[0].replace('.', '') + \
            email.split(' ')[1].replace('.', '')+'@etna-alternance.net'
        unexistant_email = self.fake.unique.name()
        unexistant_email = unexistant_email.split(
            ' ')[0] + unexistant_email.split(' ')[1]
        self.create_test_user(email)
        json_data = {"email": unexistant_email}
        response = self.client.post('http://127.0.0.1:$BACKEND_PORT/ask_reset_password/',
                                    data=json.dumps(json_data), content_type='application/json')
        self.assertEqual(response.status_code, 404)


class ResetPassword(TestCase):
    """ Test for reset password service """
    fake = Faker()
    skills = ["beginner", "intermediate", "advanced"]

    def generate_random_password(self, length: int) -> string:
        characters = list(string.ascii_letters + string.digits + "!@#$%^&*()")
        random.shuffle(characters)
        password = ""
        for i in range(length):
            password += random.choice(characters)
        return password

    def create_test_user(self, email, password):
        json_data = {"email": email, "password": password, "skill": "advanced"}
        response = self.client.post(
            'http://127.0.0.1:$BACKEND_PORT/register/', data=json.dumps(json_data), content_type='application/json')
        return json.loads(response.content.decode("utf-8"))["token"]

    def test_reset_password_wrong_request(self):
        response = self.client.put(
            'http://127.0.0.1:$BACKEND_PORT/reset_password/')
        self.assertEqual(response.status_code, 404)
        response = self.client.delete(
            'http://127.0.0.1:$BACKEND_PORT/reset_password/')
        self.assertEqual(response.status_code, 404)
        email = self.fake.unique.name()
        email = email.split(' ')[0].replace('.', '') + \
            email.split(' ')[1].replace('.', '')+'@etna-alternance.net'
        password = self.generate_random_password(20)
        self.create_test_user(email, password)
        json_data = {"email": email}
        response = self.client.post(
            'http://127.0.0.1:$BACKEND_PORT/ask_reset_password/', data=json.dumps(json_data), content_type='application/json')
        self.assertEqual(response.status_code, 100)
        user = CustomUser.objects.get(email=email)
        self.assertIsNotNone(user.random_uuid_password)
        uuid = user.random_uuid_password
        response = self.client.put(
            'http://127.0.0.1:$BACKEND_PORT/reset_password/uuid={}/'.format(uuid))
        self.assertEqual(response.status_code, 405)
        response = self.client.delete(
            'http://127.0.0.1:$BACKEND_PORT/reset_password/uuid={}/'.format(uuid))
        self.assertEqual(response.status_code, 405)

    def test_reset_password_invalid_uuid(self):
        random_uuid = str(uuid.uuid4())
        response = self.client.get(
            'http://127.0.0.1:$BACKEND_PORT/reset_password/')
        self.assertEqual(response.status_code, 404)
        response = self.client.get(
            'http://127.0.0.1:$BACKEND_PORT/reset_password/{}'.format(random_uuid))
        self.assertEqual(response.status_code, 404)

    def test_reset_password_wrong_json_1st_request(self):
        email = self.fake.unique.name()
        email = email.split(' ')[0].replace('.', '') + \
            email.split(' ')[1].replace('.', '')+'@etna-alternance.net'
        password = self.generate_random_password(20)
        self.create_test_user(email, password)
        json_data = {"test": email}
        response = self.client.post(
            'http://127.0.0.1:$BACKEND_PORT/ask_reset_password/', data=json.dumps(json_data), content_type='application/json')
        self.assertEqual(response.status_code, 400)

    def test_reset_password_wrong_json_2nd_request(self):
        email = self.fake.unique.name()
        email = email.split(' ')[0].replace('.', '') + \
            email.split(' ')[1].replace('.', '')+'@etna-alternance.net'
        password = self.generate_random_password(20)
        self.create_test_user(email, password)
        json_data = {"email": email}
        response = self.client.post(
            'http://127.0.0.1:$BACKEND_PORT/ask_reset_password/', data=json.dumps(json_data), content_type='application/json')
        self.assertEqual(response.status_code, 100)
        user = CustomUser.objects.get(email=email)
        uuid = user.random_uuid_password
        self.assertIsNotNone(uuid)
        response = self.client.get(
            'http://127.0.0.1:$BACKEND_PORT/reset_password/uuid={}/'.format(uuid))
        self.assertEqual(response.status_code, 302)
        json_data = {"test": "password"}
        response = self.client.post(
            'http://127.0.0.1:$BACKEND_PORT/reset_password/uuid={}/'.format(uuid), data=json.dumps(json_data), content_type='application/json')
        self.assertEqual(response.status_code, 400)
        user = CustomUser.objects.get(email=email)
        self.assertIsNotNone(user.random_uuid_password)

    def test_correct_reset_password(self):
        email = self.fake.unique.name()
        email = email.split(' ')[0].replace('.', '') + \
            email.split(' ')[1].replace('.', '')+'@etna-alternance.net'
        password = self.generate_random_password(20)
        self.create_test_user(email, password)
        json_data = {"email": email}
        response = self.client.post(
            'http://127.0.0.1:$BACKEND_PORT/ask_reset_password/', data=json.dumps(json_data), content_type='application/json')
        self.assertEqual(response.status_code, 100)
        user = CustomUser.objects.get(email=email)
        uuid = user.random_uuid_password
        self.assertIsNotNone(uuid)
        response = self.client.get(
            'http://127.0.0.1:$BACKEND_PORT/reset_password/uuid={}/'.format(uuid))
        self.assertEqual(response.status_code, 302)
        json_data = {"newPassword": "password"}
        response = self.client.post(
            'http://127.0.0.1:$BACKEND_PORT/reset_password/uuid={}/'.format(uuid), data=json.dumps(json_data), content_type='application/json')
        self.assertEqual(response.status_code, 200)
        user = CustomUser.objects.get(email=email)
        self.assertIsNone(user.random_uuid_password)


class ChangePassword(TestCase):
    """Test for change password service"""
    fake = Faker()
    skills = ["beginner", "intermediate", "advanced"]

    def generate_random_password(self, length: int) -> string:
        characters = list(string.ascii_letters + string.digits + "!@#$%^&*()")
        random.shuffle(characters)
        password = ""
        for i in range(length):
            password += random.choice(characters)
        return password

    def create_test_user(self, email, password):
        json_data = {"email": email, "password": password, "skill": "advanced"}
        response = self.client.post(
            'http://127.0.0.1:$BACKEND_PORT/register/', data=json.dumps(json_data), content_type='application/json')
        return json.loads(response.content.decode("utf-8"))["token"]

    def test_change_password_no_credentials(self):
        email = self.fake.unique.name()
        email = email.split(' ')[0].replace('.', '') + \
            email.split(' ')[1].replace('.', '')+'@etna-alternance.net'
        password = self.generate_random_password(20)
        new_password = self.generate_random_password(20)
        self.create_test_user(email, password)
        json_data = {"oldPassword": password, "newPassword": new_password}
        response = self.client.post(
            'http://127.0.0.1:$BACKEND_PORT/change_password/', data=json.dumps(json_data), content_type='application/json')
        self.assertEqual(response.status_code, 401)

    def test_change_password_wrong_json(self):
        email = self.fake.unique.name()
        email = email.split(' ')[0].replace('.', '') + \
            email.split(' ')[1].replace('.', '')+'@etna-alternance.net'
        password = self.generate_random_password(20)
        new_password = self.generate_random_password(20)
        token = self.create_test_user(email, password)
        json_data = {"password": password, "new_Password": new_password}
        response = self.client.post(
            'http://127.0.0.1:$BACKEND_PORT/change_password/', data=json.dumps(json_data), content_type='application/json', HTTP_AUTHORIZATION='Token {}'.format(token))
        self.assertEqual(response.status_code, 400)

    def test_change_password_wrong_request(self):
        email = self.fake.unique.name()
        email = email.split(' ')[0].replace('.', '') + \
            email.split(' ')[1].replace('.', '')+'@etna-alternance.net'
        password = self.generate_random_password(20)
        new_password = self.generate_random_password(20)
        token = self.create_test_user(email, password)
        json_data = {"oldPassword": password, "newPassword": new_password}
        response = self.client.get(
            'http://127.0.0.1:$BACKEND_PORT/change_password/', content_type='application/json', HTTP_AUTHORIZATION='Token {}'.format(token))
        self.assertEqual(response.status_code, 405)
        response = self.client.put(
            'http://127.0.0.1:$BACKEND_PORT/change_password/', data=json.dumps(json_data), content_type='application/json', HTTP_AUTHORIZATION='Token {}'.format(token))
        self.assertEqual(response.status_code, 405)
        response = self.client.delete(
            'http://127.0.0.1:$BACKEND_PORT/change_password/', data=json.dumps(json_data), content_type='application/json', HTTP_AUTHORIZATION='Token {}'.format(token))
        self.assertEqual(response.status_code, 405)

    def test_correct_change_password(self):
        email = self.fake.unique.name()
        email = email.split(' ')[0].replace('.', '') + \
            email.split(' ')[1].replace('.', '')+'@etna-alternance.net'
        password = self.generate_random_password(20)
        new_password = self.generate_random_password(20)
        token = self.create_test_user(email, password)
        json_data = {"oldPassword": password, "newPassword": new_password}
        response = self.client.post(
            'http://127.0.0.1:$BACKEND_PORT/change_password/', data=json.dumps(json_data), content_type='application/json', HTTP_AUTHORIZATION='Token {}'.format(token))
        self.assertEqual(response.status_code, 200)


class CheckAccount(TestCase):
    """Test for token checker service"""
    fake = Faker()
    skills = ["beginner", "intermediate", "advanced"]

    def generate_random_password(self, length: int) -> string:
        characters = list(string.ascii_letters + string.digits + "!@#$%^&*()")
        random.shuffle(characters)
        password = ""
        for i in range(length):
            password += random.choice(characters)
        return password

    def create_test_user(self, email, password):
        json_data = {"email": email, "password": password, "skill": "advanced"}
        response = self.client.post(
            'http://127.0.0.1:$BACKEND_PORT/register/', data=json.dumps(json_data), content_type='application/json')
        return json.loads(response.content.decode("utf-8"))["token"]

    def test_check_account_wrong_request(self):
        email = self.fake.unique.name()
        email = email.split(' ')[0].replace('.', '') + \
            email.split(' ')[1].replace('.', '')+'@etna-alternance.net'
        password = self.generate_random_password(20)
        self.create_test_user(email, password)
        user = CustomUser.objects.get(email=email)
        uuid = user.random_uuid_register
        response = self.client.post(
            'http://127.0.0.1:$BACKEND_PORT/check_account/uuid={}/'.format(uuid))
        self.assertEqual(response.status_code, 405)
        response = self.client.put(
            'http://127.0.0.1:$BACKEND_PORT/check_account/uuid={}/'.format(uuid))
        self.assertEqual(response.status_code, 405)
        response = self.client.delete(
            'http://127.0.0.1:$BACKEND_PORT/check_account/uuid={}/'.format(uuid))
        self.assertEqual(response.status_code, 405)

    def test_check_account_invalid_uuid(self):
        random_uuid = str(uuid.uuid4())
        response = self.client.get(
            'http://127.0.0.1:$BACKEND_PORT/check_account/')
        self.assertEqual(response.status_code, 404)
        response = self.client.get(
            'http://127.0.0.1:$BACKEND_PORT/check_account/uuid={}/'.format(random_uuid))
        self.assertEqual(response.status_code, 400)

    def test_correct_check_account(self):
        email = self.fake.unique.name()
        email = email.split(' ')[0].replace('.', '') + \
            email.split(' ')[1].replace('.', '')+'@etna-alternance.net'
        password = self.generate_random_password(20)
        self.create_test_user(email, password)
        user = CustomUser.objects.get(email=email)
        uuid = user.random_uuid_register
        self.assertIsNotNone(uuid)
        self.assertIs(user.email_verified, False)
        response = self.client.get(
            'http://127.0.0.1:$BACKEND_PORT/check_account/uuid={}/'.format(uuid))
        self.assertEqual(response.status_code, 302)
        user = CustomUser.objects.get(email=email)
        uuid = user.random_uuid_register
        self.assertIsNone(uuid)
        self.assertIs(user.email_verified, True)


class RelationalSystemTest(TestCase):
    """Test social interactions between users"""

    fake = Faker()
    skills = ["beginner", "intermediate", "advanced"]

    def generate_random_password(self, length: int) -> string:
        characters = list(string.ascii_letters + string.digits + "!@#$%^&*()")
        random.shuffle(characters)
        password = ""
        for i in range(length):
            password += random.choice(characters)
        return password

    def create_test_user(self, email, password):
        json_data = {"email": email, "password": password, "skill": "advanced"}
        response = self.client.post(
            'http://127.0.0.1:$BACKEND_PORT/register/', data=json.dumps(json_data), content_type='application/json')
        return json.loads(response.content.decode("utf-8"))["token"]

    def test_no_data(self):
        email = self.fake.unique.name()
        email = email.split(' ')[0].replace('.', '') + \
            email.split(' ')[1].replace('.', '')+'@etna-alternance.net'
        password = self.generate_random_password(20)
        token = self.create_test_user(email, password)
        response = self.client.post(
            'http://127.0.0.1:$BACKEND_PORT/ask_secret/',  content_type='application/json', HTTP_AUTHORIZATION='Token {}'.format(token))
        self.assertEqual(response.status_code, 400)

    def test_without_credentials(self):
        response = self.client.post(
            'http://127.0.0.1:$BACKEND_PORT/ask_secret/',  content_type='application/json')
        self.assertEqual(response.status_code, 401)

    def test_wrong_request(self):
        email = self.fake.unique.name()
        email = email.split(' ')[0].replace('.', '') + \
            email.split(' ')[1].replace('.', '')+'@etna-alternance.net'
        password = self.generate_random_password(20)
        token = self.create_test_user(email, password)
        user1 = CustomUser.objects.get(email=email)

        email = self.fake.unique.name()
        email = email.split(' ')[0].replace('.', '') + \
            email.split(' ')[1].replace('.', '')+'@etna-alternance.net'
        password = self.generate_random_password(20)
        self.create_test_user(email, password)
        user2 = CustomUser.objects.get(email=email)
        json_data = {"pseudo": user2.pseudo}
        response = self.client.get(
            'http://127.0.0.1:$BACKEND_PORT/ask_secret/', content_type='application/json', HTTP_AUTHORIZATION='Token {}'.format(token))
        self.assertEqual(response.status_code, 405)
        response = self.client.put(
            'http://127.0.0.1:$BACKEND_PORT/ask_secret/', data=json.dumps(json_data), content_type='application/json', HTTP_AUTHORIZATION='Token {}'.format(token))
        self.assertEqual(response.status_code, 405)
        response = self.client.delete(
            'http://127.0.0.1:$BACKEND_PORT/ask_secret/', data=json.dumps(json_data), content_type='application/json', HTTP_AUTHORIZATION='Token {}'.format(token))
        self.assertEqual(response.status_code, 405)

    def test_correct_follow(self):
        email1 = self.fake.unique.name()
        email1 = email1.split(' ')[0].replace('.', '') + \
            email1.split(' ')[1].replace('.', '')+'@etna-alternance.net'
        password = self.generate_random_password(20)
        token1 = self.create_test_user(email1, password)
        user1 = CustomUser.objects.get(email=email1)

        email2 = self.fake.unique.name()
        email2 = email2.split(' ')[0].replace('.', '') + \
            email2.split(' ')[1].replace('.', '')+'@etna-alternance.net'
        password = self.generate_random_password(20)
        token2 = self.create_test_user(email2, password)
        user2 = CustomUser.objects.get(email=email2)
        json_data = {"pseudo": user2.pseudo}
        response = self.client.post(
            'http://127.0.0.1:$BACKEND_PORT/ask_secret/', data=json.dumps(json_data), content_type='application/json', HTTP_AUTHORIZATION='Token {}'.format(token1))
        self.assertEqual(response.status_code, 200)

        self.assertTrue(FollowingRequests.objects.get(
            sender_id=user1.id))
        response = self.client.get(
            'http://127.0.0.1:$BACKEND_PORT/get_follower_requests/', content_type='application/json', HTTP_AUTHORIZATION='Token {}'.format(token2))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data[0], {"pseudo": email1.split('@')[0]})

        json_data = {"pseudo": user1.pseudo}
        response = self.client.post(
            'http://127.0.0.1:$BACKEND_PORT/share_secret/', data=json.dumps(json_data), content_type='application/json', HTTP_AUTHORIZATION='Token {}'.format(token2))
        secret_dict = response.data
        db_request_list = FollowingRequests.objects.all()
        self.assertEqual(secret_dict["secret"], user2.secret)
        self.assertEqual(response.status_code, 200)
        self.assertFalse(db_request_list)

        json_data = {"secret": secret_dict["secret"]}
        response = self.client.post(
            'http://127.0.0.1:$BACKEND_PORT/follow/', data=json.dumps(json_data), content_type='application/json', HTTP_AUTHORIZATION='Token {}'.format(token1))
        self.assertEqual(response.status_code, 200)
        self.assertTrue(FollowUser.objects.get(
            follower_id=user1.id, followed_id=user2.id))

        response = self.client.get(
            'http://127.0.0.1:$BACKEND_PORT/get_followed/', content_type='application/json', HTTP_AUTHORIZATION='Token {}'.format(token1))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data[0]['pseudo'], email2.split('@')[0])

        response = self.client.get(
            'http://127.0.0.1:$BACKEND_PORT/get_followers/', content_type='application/json', HTTP_AUTHORIZATION='Token {}'.format(token2))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data[0]['pseudo'], email1.split('@')[0])


class ChangeUserXpTest(TestCase):
    """Test experience changement on user attribute"""
    fake = Faker()
    skills = ["beginner", "intermediate", "advanced"]

    def generate_random_password(self, length: int) -> string:
        characters = list(string.ascii_letters + string.digits + "!@#$%^&*()")
        random.shuffle(characters)
        password = ""
        for i in range(length):
            password += random.choice(characters)
        return password

    def create_test_user(self, email, password):
        json_data = {"email": email, "password": password, "skill": "advanced"}
        response = self.client.post(
            'http://127.0.0.1:$BACKEND_PORT/register/', data=json.dumps(json_data), content_type='application/json')
        return json.loads(response.content.decode("utf-8"))["token"]

    def test_no_credentials(self):
        response = self.client.put(
            'http://127.0.0.1:$BACKEND_PORT/change_skill_level/', content_type='application/json')
        self.assertEqual(response.status_code, 401)

    def test_wrong_request(self):
        email = self.fake.unique.name()
        email = email.split(' ')[0].replace('.', '') + \
            email.split(' ')[1].replace('.', '')+'@etna-alternance.net'
        password = self.generate_random_password(20)
        token = self.create_test_user(email, password)
        response = self.client.get(
            'http://127.0.0.1:$BACKEND_PORT/change_skill_level/', content_type='application/json', HTTP_AUTHORIZATION='Token {}'.format(token))
        self.assertEqual(response.status_code, 405)
        response = self.client.post(
            'http://127.0.0.1:$BACKEND_PORT/change_skill_level/', content_type='application/json', HTTP_AUTHORIZATION='Token {}'.format(token))
        self.assertEqual(response.status_code, 405)
        response = self.client.delete(
            'http://127.0.0.1:$BACKEND_PORT/change_skill_level/', content_type='application/json', HTTP_AUTHORIZATION='Token {}'.format(token))
        self.assertEqual(response.status_code, 405)

    def test_wrong_enum(self):
        email = self.fake.unique.name()
        email = email.split(' ')[0].replace('.', '') + \
            email.split(' ')[1].replace('.', '')+'@etna-alternance.net'
        password = self.generate_random_password(20)
        token = self.create_test_user(email, password)
        response = self.client.put(
            'http://127.0.0.1:$BACKEND_PORT/change_skill_level/', data=json.dumps({"skill": "master"}), content_type='application/json', HTTP_AUTHORIZATION='Token {}'.format(token))
        self.assertEqual(response.status_code, 400)

    def test_no_data(self):
        email = self.fake.unique.name()
        email = email.split(' ')[0].replace('.', '') + \
            email.split(' ')[1].replace('.', '')+'@etna-alternance.net'
        password = self.generate_random_password(20)
        token = self.create_test_user(email, password)
        response = self.client.put(
            'http://127.0.0.1:$BACKEND_PORT/change_skill_level/',  content_type='application/json', HTTP_AUTHORIZATION='Token {}'.format(token))
        self.assertEqual(response.status_code, 400)

    def test_same_experience_level_update(self):
        email = self.fake.unique.name()
        email = email.split(' ')[0].replace('.', '') + \
            email.split(' ')[1].replace('.', '')+'@etna-alternance.net'
        password = self.generate_random_password(20)
        token = self.create_test_user(email, password)
        response = self.client.put(
            'http://127.0.0.1:$BACKEND_PORT/change_skill_level/', data=json.dumps({"skill": "advanced"}), content_type='application/json', HTTP_AUTHORIZATION='Token {}'.format(token))
        self.assertEqual(response.status_code, 400)

    def test_correct_experience_level_update(self):
        email = self.fake.unique.name()
        email = email.split(' ')[0].replace('.', '') + \
            email.split(' ')[1].replace('.', '')+'@etna-alternance.net'
        password = self.generate_random_password(20)
        token = self.create_test_user(email, password)
        response = self.client.put(
            'http://127.0.0.1:$BACKEND_PORT/change_skill_level/', data=json.dumps({"skill": "intermediate"}), content_type='application/json', HTTP_AUTHORIZATION='Token {}'.format(token))
        self.assertEqual(response.status_code, 204)
