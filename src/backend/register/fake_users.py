import requests
import os
import uuid
import random
import datetime
import json
import mysql.connector


def user_creator() -> list:
    """
    Fake user data creator.
    Used for the next function.
    """
    i = 0
    secrets_and_tokens = {}
    emails = ["boury_a@etna-alternance.net", "serir_r@etna-alternance.net",
              "blassi_t@etna-alternance.net", "diaby_k@etna-alternance.net"]
    tokens = []
    sql_query_get_token = """SELECT * FROM authtoken_token"""
    sql_query_get_users = """SELECT id,email,secret FROM register_customuser"""
    for email in emails:
        i += 1
        data = {}
        data["email"] = email
        data["password"] = str(uuid.uuid4())
        r = requests.post(f"http://127.0.0.1:{os.environ['BACKEND_PORT']}/register/",
                          json=data)
        print(r.status_code, r.json())
        mydb = mysql.connector.connect(
            host=os.environ['DB_HOST'],
            user=os.environ['DB_USER'],
            password=os.environ['DB_PASSWORD'],
            database=os.environ['DB_NAME']
        )
        mycursor = mydb.cursor()
        mycursor.execute(sql_query_get_token)
        token_data = mycursor.fetchall()
        for data in token_data:
            token = data[0]
            tokens.append(token)
        mydb = mysql.connector.connect(
            host=os.environ['DB_HOST'],
            user=os.environ['DB_USER'],
            password=os.environ['DB_PASSWORD'],
            database=os.environ['DB_NAME']
        )
        mycursor = mydb.cursor()
        mycursor.execute(sql_query_get_users)
        user_data = mycursor.fetchall()
        for data in user_data:
            id = data[0]
            email = data[1]
            secret = data[2]
            secrets_and_tokens[id] = [email, secret]
        mycursor.execute(sql_query_get_token)
        token_data = mycursor.fetchall()
        for data in token_data:
            user_id = data[-1]
            token = data[0]
            tokens.append(token)
            secrets_and_tokens[user_id].append(token)
    print("{} users created !".format(i))
    return tokens


def alert_builder(token: str, number_of_fake_alerts: int, number_of_trigger_per_alert: int) -> bool:
    """
    Fake alert creator for testing purpose.
    """
    i = 0
    while i < number_of_fake_alerts:
        header = {'Authorization': 'Token ' + random.choice(token)}
        i += 1
        alert_data = {}
        trigger_data = {}
        alert_data["alert_name"] = str(uuid.uuid4())
        alert_data["currency_pair"] = random.choice(
            ["EUR_USD", "USD_JPY", "USD_CAD"])
        alert_data["expire"] = random.choice([True, False])
        if alert_data["expire"]:
            alert_data["expiration_date"] = str(datetime.datetime.now(
            )+datetime.timedelta(days=random.randint(-10.0, 10.0)))
        alert_data["alerting_device"] = "e-mail"
        alert_data["is_active"] = True
        alert_data["description"] = "lorem ipsum dolorem"
        alert_data["protection_level"] = random.choice(
            ["private", "limited", "public"]
        )
        alert_data["triggers"] = []
        for trigger in range(number_of_trigger_per_alert):
            trigger_data["trigger_type"] = random.choice(["ask", "bid"])
            trigger_data["trigger_condition"] = random.choice(
                ["bigger than", "lesser than", "crossing", "upcrossing", "downcrossing"])
            trigger_data["value"] = random.uniform(0, 3)
            trigger_data["is_active"] = True
            alert_data["triggers"].append(trigger_data)
            trigger_data = {}
        r = requests.post(f"http://127.0.0.1:{os.environ['BACKEND_PORT']}/alert/",
                          json=alert_data, headers=header)
        print((r.status_code, r.json()))
        if r.status_code != 201:
            print("no alert created")
            return
    print("{} alerts created !".format(i))
    return True


def random_follow(data: dict) -> None:
    token_user_index = random.randint(1, 4)
    followed_user_index = random.randint(1, 4)
    while token_user_index == followed_user_index:
        token_user_index = random.randint(1, 4)
    r = requests.post(f"http://127.0.0.1:{os.environ['BACKEND_PORT']}/follow/",
                      data=json.dumps({"secret": data[followed_user_index][1]}), headers={
                          'Authorization': "Token "+data[token_user_index][-1], 'Content-Type': 'application/json'})

    print(r.status_code)
    print(r.json())


# CREATE USERS
alert_builder(user_creator(), 5, random.randint(2, 5))
