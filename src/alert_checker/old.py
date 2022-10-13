"""
This module is a service that interrogate the database to check if an active alert needs to be triggered
according to his trigger configuration. This also depends from the data received by the database from the
currency_manager service. Once the alert is triggered it is desactivated or not according to the type
of the alert. Once triggered the alerts, this service contacts the mailer service through an http call.
"""


import mysql.connector
import time
import requests
import datetime

# PREREQUISITES
crossing_alerts_ask_dict = {}
crossing_alerts_bid_dict = {}
CROSSING_RANGE = 10
MAILER_SERVICE_URL = "http://mailer:8003/mail"
header = {"Content-Type": "application/json"}
currency_pairs = {}
alert = {}
alerts = []
tradeable_currencies = []
actives_alerts_data = {}
iteration = 0

sql_query_get_currencies = """SELECT * FROM alert_currencypair"""
sql_query_get_active_alerts = """SELECT * FROM alert_alert WHERE is_active = %s AND alerting_device=%s AND currency_pair_id = %s"""
sql_query_get_triggers_from_active_alerts = """SELECT * from alert_alerttrigger WHERE alert_id = %s AND is_active = %s"""
sql_query_desactivate_trigger = """UPDATE alert_alerttrigger SET is_active=0 WHERE id=%s"""
sql_query_desactivate_alert_triggers = """UPDATE alert_alerttrigger SET is_active=0 WHERE alert_id=%s"""
sql_query_desactivate_alerts = """UPDATE alert_alert SET is_active=0 WHERE id=%s"""
sql_query_retrieve_alert_owner = """SELECT user_id from alert_useralert WHERE alert_id=%s"""
sql_query_get_alert_owner_email_address = """SELECT email FROM register_customuser WHERE id =%s"""

if __name__ == '__main__':
    # WEBSOCKET CONNECTION SETUP
    mydb = mysql.connector.connect(
        host="db",
        user="root",
        password="alpha",
    )
    mycursor = mydb.cursor()
    mycursor.execute("USE gpe")

    # RETRIEVE CURRENCIES DATA
    mycursor.execute(sql_query_get_currencies)
    query_result = mycursor.fetchall()
    for currency in query_result:
        crossing_alerts_ask_dict["ask_crossing_list{}".format(currency[0])] = [
        ]
        crossing_alerts_bid_dict["bid_crossing_list{}".format(currency[0])] = [
        ]

    all_ask_keys = list(crossing_alerts_ask_dict.keys())
    all_bid_keys = list(crossing_alerts_bid_dict.keys())

    # MAIN LOOP
    while True:
        print("##### ITERATION ", iteration, "  ########")
        iteration += 1
        # REFRESH CURSOR EACH ITERATION
        now = datetime.datetime.now()
        mydb = mysql.connector.connect(
            host="db",
            user="root",
            password="alpha",
        )
        mycursor = mydb.cursor()
        mycursor.execute("USE gpe")

        # SLOW DOWN PROGRAMM
        time.sleep(1)

        # RETRIEVE CURRENCIES DATA EACH ITERATION
        mycursor.execute(sql_query_get_currencies)
        currencies_query_result = mycursor.fetchall()

        # FILTER ONLY TRADEABLE CURRENCIES
        for i, currency in enumerate(currencies_query_result):
            if not currency[10]:
                currencies_query_result.pop(i)

            # SHORT TIME HISTORIC DATA CURRENCY ASK/BID
            crossing_alerts_ask_dict[all_ask_keys[i]].append(currency[1])
            crossing_alerts_bid_dict[all_bid_keys[i]].append(currency[2])
            if len(crossing_alerts_ask_dict[all_ask_keys[i]]) > CROSSING_RANGE:
                crossing_alerts_ask_dict[all_ask_keys[i]].pop(0)
            if len(crossing_alerts_bid_dict[all_bid_keys[i]]) > CROSSING_RANGE:
                crossing_alerts_bid_dict[all_bid_keys[i]].pop(0)

        # RETRIEVE ACTIVE EMAIL ALERTS CONCERNING TREADABLE CURRENCIES
        all_active_alerts = []
        for tradeable_currency in currencies_query_result:
            mycursor.execute(sql_query_get_active_alerts,
                             (1,"email", tradeable_currency[0]))
            active_alerts_query_result = mycursor.fetchall()
            ask_value = tradeable_currency[1]
            bid_value = tradeable_currency[2]
            ask_pip_variation = tradeable_currency[5]
            bid_pip_variation = tradeable_currency[6]
            ask_percentage_variation = tradeable_currency[7]
            bid_percentage_variation = tradeable_currency[8]

            # BROWSE ACTIVE ALERTS
            for alert_col in active_alerts_query_result:
                alert_id = alert_col[0]
                alert_name = alert_col[1]
                expiration_date = alert_col[3]

                # RETRIEVE ALERT OWNER FOR MAILING
                mycursor.execute(sql_query_retrieve_alert_owner, (alert_id,))
                alert_owner_id = mycursor.fetchone()
                mycursor.execute(
                    sql_query_get_alert_owner_email_address, (alert_owner_id))
                alert_owner_email = mycursor.fetchone()

                # DESACTIVATE PERISHED ALERTS WITH ITS TRIGGERS
                if expiration_date:
                    if now > expiration_date:
                        mycursor.execute(
                            sql_query_desactivate_alerts, (alert_id,))
                        mycursor.execute(
                            sql_query_desactivate_alert_triggers, (alert_id,))
                        mydb.commit()

                        json_data = {}
                        json_data["alert_name"] = alert_name
                        json_data["user_address"] = alert_owner_email
                        json_data["expiration_date"] = str(expiration_date)
                        r = requests.post(MAILER_SERVICE_URL,
                                          json=json_data, headers=header, timeout=1)
                        print(r.status_code)

                # RETRIEVE ALL ACTIVE TRIGGERS FOR ACTIVE ALERTS
                mycursor.execute(
                    sql_query_get_triggers_from_active_alerts, (alert_id, 1))
                triggers_query_result = mycursor.fetchall()

                # BROWSE EVERY ACTIVE TRIGGER DATA TO TRIGGER MAILER
                trigger_counter = 0
                payload = []
                for trigger_col in triggers_query_result:
                    trigger_id = trigger_col[0]
                    trigger_type = trigger_col[1]
                    trigger_condition = trigger_col[2]
                    trigger_value = trigger_col[3]
                    alert_id = trigger_col[4]
                    trigger_active = trigger_col[5]

                    if trigger_condition == "crossing" and trigger_type == "ask":
                        if trigger_value > crossing_alerts_ask_dict["ask_crossing_list{}".format(tradeable_currency[0])][0] and trigger_value < crossing_alerts_ask_dict["ask_crossing_list{}".format(tradeable_currency[0])][-1]:
                            trigger_counter += 1
                            json_data = {}
                            json_data["alert_name"] = alert_name
                            json_data["user_address"] = alert_owner_email
                            json_data["trigger_condition"] = trigger_condition
                            json_data["trigger_type"] = trigger_type
                            json_data["trigger_value"] = trigger_value
                            json_data["currency_name"] = tradeable_currency[0]
                            payload.append(json_data)

                    if trigger_condition == "crossing" and trigger_type == "ask":
                        if trigger_value < crossing_alerts_ask_dict["ask_crossing_list{}".format(tradeable_currency[0])][0] and trigger_value > crossing_alerts_ask_dict["ask_crossing_list{}".format(tradeable_currency[0])][-1]:
                            trigger_counter += 1
                            json_data = {}
                            json_data["alert_name"] = alert_name
                            json_data["user_address"] = alert_owner_email
                            json_data["trigger_condition"] = trigger_condition
                            json_data["trigger_type"] = trigger_type
                            json_data["trigger_value"] = trigger_value
                            json_data["currency_name"] = tradeable_currency[0]
                            payload.append(json_data)

                    if trigger_condition == "crossing" and trigger_type == "bid":
                        if trigger_value > crossing_alerts_bid_dict["bid_crossing_list{}".format(tradeable_currency[0])][0] and trigger_value < crossing_alerts_bid_dict["bid_crossing_list{}".format(tradeable_currency[0])][-1]:
                            trigger_counter += 1
                            json_data = {}
                            json_data["alert_name"] = alert_name
                            json_data["user_address"] = alert_owner_email
                            json_data["trigger_condition"] = trigger_condition
                            json_data["trigger_type"] = trigger_type
                            json_data["trigger_value"] = trigger_value
                            json_data["currency_name"] = tradeable_currency[0]
                            payload.append(json_data)

                    if trigger_condition == "crossing" and trigger_type == "bid":
                        if trigger_value < crossing_alerts_bid_dict["bid_crossing_list{}".format(tradeable_currency[0])][0] and trigger_value > crossing_alerts_bid_dict["bid_crossing_list{}".format(tradeable_currency[0])][-1]:
                            trigger_counter += 1
                            json_data = {}
                            json_data["alert_name"] = alert_name
                            json_data["user_address"] = alert_owner_email
                            json_data["trigger_condition"] = trigger_condition
                            json_data["trigger_type"] = trigger_type
                            json_data["trigger_value"] = trigger_value
                            json_data["currency_name"] = tradeable_currency[0]
                            payload.append(json_data)

                    if trigger_condition == "upcrossing" and trigger_type == "ask":
                        if trigger_value < crossing_alerts_ask_dict["ask_crossing_list{}".format(tradeable_currency[0])][0] and trigger_value > crossing_alerts_ask_dict["ask_crossing_list{}".format(tradeable_currency[0])][-1]:
                            trigger_counter += 1
                            json_data = {}
                            json_data["alert_name"] = alert_name
                            json_data["user_address"] = alert_owner_email
                            json_data["trigger_condition"] = trigger_condition
                            json_data["trigger_type"] = trigger_type
                            json_data["trigger_value"] = trigger_value
                            json_data["currency_name"] = tradeable_currency[0]
                            payload.append(json_data)

                    if trigger_condition == "upcrossing" and trigger_type == "bid":
                        if trigger_value < crossing_alerts_bid_dict["bid_crossing_list{}".format(tradeable_currency[0])][0] and trigger_value > crossing_alerts_bid_dict["bid_crossing_list{}".format(tradeable_currency[0])][-1]:
                            trigger_counter += 1
                            json_data = {}
                            json_data["alert_name"] = alert_name
                            json_data["user_address"] = alert_owner_email
                            json_data["trigger_condition"] = trigger_condition
                            json_data["trigger_type"] = trigger_type
                            json_data["trigger_value"] = trigger_value
                            json_data["currency_name"] = tradeable_currency[0]
                            payload.append(json_data)

                    if trigger_condition == "downcrossing" and trigger_type == "ask":
                        if trigger_value > crossing_alerts_ask_dict["ask_crossing_list{}".format(tradeable_currency[0])][0] and trigger_value < crossing_alerts_ask_dict["ask_crossing_list{}".format(tradeable_currency[0])][-1]:
                            trigger_counter += 1
                            json_data = {}
                            json_data["alert_name"] = alert_name
                            json_data["user_address"] = alert_owner_email
                            json_data["trigger_condition"] = trigger_condition
                            json_data["trigger_type"] = trigger_type
                            json_data["trigger_value"] = trigger_value
                            json_data["currency_name"] = tradeable_currency[0]
                            payload.append(json_data)

                    if trigger_condition == "downcrossing" and trigger_type == "bid":
                        if trigger_value > crossing_alerts_bid_dict["bid_crossing_list{}".format(tradeable_currency[0])][0] and trigger_value < crossing_alerts_bid_dict["bid_crossing_list{}".format(tradeable_currency[0])][-1]:
                            trigger_counter += 1
                            json_data = {}
                            json_data["alert_name"] = alert_name
                            json_data["user_address"] = alert_owner_email
                            json_data["trigger_condition"] = trigger_condition
                            json_data["trigger_type"] = trigger_type
                            json_data["trigger_value"] = trigger_value
                            json_data["currency_name"] = tradeable_currency[0]
                            payload.append(json_data)

                    if trigger_condition == "bigger than" and trigger_type == "ask":
                        if trigger_value > ask_value:
                            trigger_counter += 1
                            json_data = {}
                            json_data["alert_name"] = alert_name
                            json_data["user_address"] = alert_owner_email
                            json_data["trigger_condition"] = trigger_condition
                            json_data["trigger_type"] = trigger_type
                            json_data["trigger_value"] = trigger_value
                            json_data["currency_name"] = tradeable_currency[0]
                            mycursor.execute(
                                sql_query_desactivate_trigger, (trigger_id,))
                            mydb.commit()
                            payload.append(json_data)

                    if trigger_condition == "lesser than" and trigger_type == "ask":
                        if trigger_value < ask_value:
                            trigger_counter += 1
                            json_data = {}
                            json_data["alert_name"] = alert_name
                            json_data["user_address"] = alert_owner_email
                            json_data["trigger_condition"] = trigger_condition
                            json_data["trigger_type"] = trigger_type
                            json_data["trigger_value"] = trigger_value
                            json_data["currency_name"] = tradeable_currency[0]
                            mycursor.execute(
                                sql_query_desactivate_trigger, (trigger_id,))
                            mydb.commit()
                            payload.append(json_data)

                    if trigger_condition == "bigger than" and trigger_type == "bid":
                        if trigger_value > bid_value:
                            trigger_counter += 1
                            json_data = {}
                            json_data["alert_name"] = alert_name
                            json_data["user_address"] = alert_owner_email
                            json_data["trigger_condition"] = trigger_condition
                            json_data["trigger_type"] = trigger_type
                            json_data["trigger_value"] = trigger_value
                            json_data["currency_name"] = tradeable_currency[0]
                            mycursor.execute(
                                sql_query_desactivate_trigger, (trigger_id,))
                            mydb.commit()
                            payload.append(json_data)

                    if trigger_condition == "lesser than" and trigger_type == "bid":
                        if trigger_value < bid_value:
                            trigger_counter += 1
                            json_data = {}
                            json_data["alert_name"] = alert_name
                            json_data["user_address"] = alert_owner_email
                            json_data["trigger_condition"] = trigger_condition
                            json_data["trigger_type"] = trigger_type
                            json_data["trigger_value"] = trigger_value
                            json_data["currency_name"] = tradeable_currency[0]
                            mycursor.execute(
                                sql_query_desactivate_trigger, (trigger_id,))
                            mydb.commit()
                            payload.append(json_data)

                    if trigger_condition == "percentage increase" and trigger_type == "ask":
                        if trigger_value > ask_percentage_variation:
                            trigger_counter += 1
                            json_data = {}
                            json_data["alert_name"] = alert_name
                            json_data["user_address"] = alert_owner_email
                            json_data["trigger_condition"] = trigger_condition
                            json_data["trigger_type"] = trigger_type
                            json_data["trigger_value"] = trigger_value
                            json_data["currency_name"] = tradeable_currency[0]
                            mycursor.execute(
                                sql_query_desactivate_trigger, (trigger_id,))
                            mydb.commit()
                            payload.append(json_data)

                    if trigger_condition == "percentage decrease" and trigger_type == "ask":
                        if trigger_value < ask_percentage_variation:
                            trigger_counter += 1
                            json_data = {}
                            json_data["alert_name"] = alert_name
                            json_data["user_address"] = alert_owner_email
                            json_data["trigger_condition"] = trigger_condition
                            json_data["trigger_type"] = trigger_type
                            json_data["trigger_value"] = trigger_value
                            json_data["currency_name"] = tradeable_currency[0]
                            mycursor.execute(
                                sql_query_desactivate_trigger, (trigger_id,))
                            mydb.commit()
                            payload.append(json_data)

                    if trigger_condition == "percentage increase" and trigger_type == "bid":
                        if trigger_value > bid_percentage_variation:
                            trigger_counter += 1
                            json_data = {}
                            json_data["alert_name"] = alert_name
                            json_data["user_address"] = alert_owner_email
                            json_data["trigger_condition"] = trigger_condition
                            json_data["trigger_type"] = trigger_type
                            json_data["trigger_value"] = trigger_value
                            json_data["currency_name"] = tradeable_currency[0]
                            mycursor.execute(
                                sql_query_desactivate_trigger, (trigger_id,))
                            mydb.commit()
                            payload.append(json_data)

                    if trigger_condition == "percentage decrease" and trigger_type == "bid":
                        if trigger_value < bid_percentage_variation:
                            trigger_counter += 1
                            json_data = {}
                            json_data["alert_name"] = alert_name
                            json_data["user_address"] = alert_owner_email
                            json_data["trigger_condition"] = trigger_condition
                            json_data["trigger_type"] = trigger_type
                            json_data["trigger_value"] = trigger_value
                            json_data["currency_name"] = tradeable_currency[0]
                            mycursor.execute(
                                sql_query_desactivate_trigger, (trigger_id,))
                            mydb.commit()
                            payload.append(json_data)

                    if trigger_condition == "pip increase" and trigger_type == "ask":
                        if trigger_value > ask_pip_variation:
                            trigger_counter += 1
                            json_data = {}
                            json_data["alert_name"] = alert_name
                            json_data["user_address"] = alert_owner_email
                            json_data["trigger_condition"] = trigger_condition
                            json_data["trigger_type"] = trigger_type
                            json_data["trigger_value"] = trigger_value
                            json_data["currency_name"] = tradeable_currency[0]
                            mycursor.execute(
                                sql_query_desactivate_trigger, (trigger_id,))
                            mydb.commit()
                            payload.append(json_data)

                    if trigger_condition == "pip decrease" and trigger_type == "ask":
                        if trigger_value < ask_pip_variation:
                            trigger_counter += 1
                            json_data = {}
                            json_data["alert_name"] = alert_name
                            json_data["user_address"] = alert_owner_email
                            json_data["trigger_condition"] = trigger_condition
                            json_data["trigger_type"] = trigger_type
                            json_data["trigger_value"] = trigger_value
                            json_data["currency_name"] = tradeable_currency[0]
                            mycursor.execute(
                                sql_query_desactivate_trigger, (trigger_id,))
                            mydb.commit()
                            payload.append(json_data)

                    if trigger_condition == "pip increase" and trigger_type == "bid":
                        if trigger_value > bid_pip_variation:
                            trigger_counter += 1
                            json_data = {}
                            json_data["alert_name"] = alert_name
                            json_data["user_address"] = alert_owner_email
                            json_data["trigger_condition"] = trigger_condition
                            json_data["trigger_type"] = trigger_type
                            json_data["trigger_value"] = trigger_value
                            json_data["currency_name"] = tradeable_currency[0]
                            mycursor.execute(
                                sql_query_desactivate_trigger, (trigger_id,))
                            mydb.commit()
                            payload.append(json_data)

                    if trigger_condition == "pip decrease" and trigger_type == "bid":
                        if trigger_value < bid_pip_variation:
                            trigger_counter += 1
                            json_data = {}
                            json_data["alert_name"] = alert_name
                            json_data["user_address"] = alert_owner_email
                            json_data["trigger_condition"] = trigger_condition
                            json_data["trigger_type"] = trigger_type
                            json_data["trigger_value"] = trigger_value
                            json_data["currency_name"] = tradeable_currency[0]
                            mycursor.execute(
                                sql_query_desactivate_trigger, (trigger_id,))
                            mydb.commit()
                            payload.append(json_data)

                # IF ALL ALERT TRIGGERS ARE UNACTIVATED THE ALERT NEEDS TO BE DESACTIVATED
                if trigger_counter == len(triggers_query_result):
                    mycursor.execute(sql_query_desactivate_alerts, (alert_id))
                    mydb.commit()

                    # CONTACT MAILER WITH ALL TRIGGERS PAYLOAD 
                    r = requests.post(MAILER_SERVICE_URL,
                                      json=payload, headers=header, timeout=1)
                    print(r.status_code)
                    payload = []
