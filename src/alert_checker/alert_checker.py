import json
import random
import zmq
import os
import time
import datetime
import requests
import mysql.connector
import oandapyV20.endpoints.accounts as accounts
import oandapyV20


def mock() -> list:
    """
    Function used for inserting fake data when the market is closed.
    """
    return [
        {
            "status": "tradeable",
            "instrument": "EUR_JPY",
            "asks": [
                {
                    "price": "114.312",
                    "liquidity": 1000000
                },
                {
                    "price": "114.313",
                    "liquidity": 2000000
                },
                {
                    "price": "114.314",
                    "liquidity": 5000000
                },
                {
                    "price": "114.316",
                    "liquidity": 10000000
                }
            ],
            "time": "2016-10-27T08:38:43.094548890Z",
            "closeoutAsk": random.uniform(100.0, 130.0),
            "type": "PRICE",
            "closeoutAsk": random.uniform(100.0, 130.0),
            "bids": [
                {
                    "price": "114.295",
                    "liquidity": 1000000
                },
                {
                    "price": "114.294",
                    "liquidity": 2000000
                },
                {
                    "price": "114.293",
                    "liquidity": 5000000
                },
                {
                    "price": "114.291",
                    "liquidity": 10000000
                }
            ]
        },
        {
            "type": "HEARTBEAT",
            "time": "2016-10-27T08:38:44.327443673Z"
        },
        {
            "status": "tradeable",
            "instrument": "EUR_USD",
            "asks": [
                {
                    "price": "1.09188",
                    "liquidity": 10000000
                },
                {
                    "price": "1.09190",
                    "liquidity": 10000000
                }
            ],
            "time": "2016-10-27T08:38:45.664613867Z",
            "closeoutAsk": random.uniform(1.0, 1.3),
            "type": "PRICE",
            "closeoutAsk": random.uniform(1.0, 1.3),
            "bids": [
                {
                    "price": "1.09177",
                    "liquidity": 10000000
                },
                {
                    "price": "1.09175",
                    "liquidity": 10000000
                }
            ]
        },
        {
            "status": "tradeable",
            "instrument": "EUR_JPY",
            "asks": [
                {
                    "price": "114.315",
                    "liquidity": 1000000
                },
                {
                    "price": "114.316",
                    "liquidity": 2000000
                },
                {
                    "price": "114.317",
                    "liquidity": 5000000
                },
                {
                    "price": "114.319",
                    "liquidity": 10000000
                }
            ],
            "time": "2016-10-27T08:38:45.681572782Z",
            "closeoutBid": random.uniform(100.0, 130.0),
            "type": "PRICE",
            "closeoutBid": random.uniform(100.0, 130.0),
            "bids": [
                {
                    "price": "114.298",
                    "liquidity": 1000000
                },
                {
                    "price": "114.297",
                    "liquidity": 2000000
                },
                {
                    "price": "114.296",
                    "liquidity": 5000000
                },
                {
                    "price": "114.294",
                    "liquidity": 10000000
                }
            ]
        }
    ]


def get_instruments_from_db() -> list:
    """
    Get instruments list from DB
    """
    db_cursor = DB.cursor()
    db_cursor.execute(f"USE {os.environ['MYSQL_DATABASE']}")
    db_cursor.execute(
        GET_CURRENCIES
    )
    return db_cursor.fetchall()


def prepare_structs(instruments: list) -> "list[dict[str, list]]":
    """
    Prepare structs in order to trigger more complex alerts during data analysis.
    """
    crossing_alerts_ask_dict = {}
    crossing_alerts_bid_dict = {}
    for currency in instruments:
        crossing_alerts_ask_dict[currency[0]] = []
        crossing_alerts_bid_dict[currency[0]] = []
    return [crossing_alerts_ask_dict, crossing_alerts_bid_dict]


def websocket_client() -> zmq.Socket:
    """
    Setup websocket client for connection with pricing streamer.
    """
    context = zmq.Context()
    socket = context.socket(zmq.SUB)
    socket.connect(
        f"tcp://pricing_streamer:{os.environ['INFLUX_CONNECTOR_PORT']}")
    socket.setsockopt_string(zmq.SUBSCRIBE, "")
    return socket


def get_active_alerts(now: datetime.datetime) -> list:
    """
    SQL request to fetch all active alerts that the service must check
    when listening to the market stocks.
    """
    db_cursor.execute(
        GET_ACTIVATED_ALERTS, ("e-mail", now, "e-mail"))
    active_alerts = db_cursor.fetchall()
    return active_alerts


def timer_reset(last_tick: float, previous_tick: float) -> bool:
    """
    Check if the timer needs to be reset. The time is implemented to limit the DB requests
    """
    print(last_tick - previous_tick)
    if last_tick - previous_tick >= DB_REQUEST_LIMITER:
        return True
    else:
        return False


def deactivate_perished_alert(alert_data: tuple, now: str) -> None:
    """
    Function that deactivates the alerts having an expiration date smaller than actual datetime
    Sends a mail to the alert owner when it happens.
    """
    alert_id = alert_data[0]
    alert_name = alert_data[1]
    expiration_date = alert_data[3]

    if expiration_date:
        if now > str(expiration_date):
            # ALERT DEACTIVATION
            db_cursor.execute(
                DEACTIVATE_ALERT, (alert_id,))
            # RETRIEVE ALERT OWNER FOR MAILING
            db_cursor.execute(GET_ALERT_OWNER, (alert_id,))
            alert_owner_id = db_cursor.fetchone()
            db_cursor.execute(
                GET_ALERT_OWNER_EMAIL, (alert_owner_id))
            alert_owner_email = db_cursor.fetchone()
            json_data = {}
            json_data["alert_name"] = alert_name
            json_data["user_address"] = alert_owner_email
            json_data["expiration_date"] = now
            # MAIL SENDING
            r = requests.post(MAILER_SERVICE_URL,
                              json=json_data, headers={"Content-Type": "application/json"}, timeout=REQUEST_TIMEOUT)
            if r.status_code == 200:
                DB.commit()


def deactivate_triggered_alert(nb_triggers_per_alert: dict, trigger_counter: int, trigger_ids: list, alert_id: int, payload: list) -> int:
    """
    Function that triggers the deactivation of alerts whose all triggers are triggered.
    Sends a mail to the alert owner when it happens.

    """
    if trigger_counter == nb_triggers_per_alert[alert_id]:
        # TRIGGERS DEACTIVATION BY BUILDING ADAPTATIVE SQL REQUEST ACCORDING TO TRIGGER LIST LENGTH
        deactivate_alerts_triggers = f"""UPDATE alert_alerttrigger SET is_active=0 WHERE id IN ({('%s,'*len(trigger_ids))[:-1]})"""
        db_cursor.execute(deactivate_alerts_triggers, (trigger_ids))
        # ALERT DEACTIVATION
        db_cursor.execute(DEACTIVATE_ALERT, (alert_id,))
        # RETRIEVE ALERT OWNER FOR MAILING
        db_cursor.execute(GET_ALERT_OWNER, (alert_id,))
        alert_owner_id = db_cursor.fetchone()
        db_cursor.execute(
            GET_ALERT_OWNER_EMAIL, (alert_owner_id))
        alert_owner_email = db_cursor.fetchone()
        # PREPARE PAYLOAD FOR MAILER
        payload.append({"email": alert_owner_email})
        DB.commit()
        # CONTACT MAILER WITH ALL TRIGGERS PAYLOAD
        r = requests.post(MAILER_SERVICE_URL,
                          json=payload, headers={"Content-Type": "application/json"}, timeout=REQUEST_TIMEOUT)
        return r.status_code


def get_triggers_per_alert(alert_id: int) -> list:
    """
    Function that fetch all trigger data for one alert.
    """
    db_cursor.execute(GET_TRIGGERS_PER_ALERT, (alert_id,))
    alert_triggers = db_cursor.fetchall()
    return alert_triggers


def get_active_triggers(active_alerts: list) -> dict:
    """
    SQL request to fetch all active triggers that the service
    must check when listening to the market stocks.
    """
    alerts_ids = []
    for alert_data in active_alerts:
        alert_id = alert_data[0]
        alerts_ids.append(str(alert_id))
        alert_data = {}
    if alerts_ids:
        # BUILDING ADAPTATIVE SQL REQUEST ACCORDING TO ALERTS LIST LENGTH
        get_activated_alerts_triggers = f"""SELECT * from alert_alerttrigger WHERE alert_id IN ({('%s,'*len(alerts_ids))[:-1]}) AND is_active=1"""
        db_cursor.execute(
            get_activated_alerts_triggers, (alerts_ids)
        )
        active_triggers = db_cursor.fetchall()
    return active_triggers


def get_nb_triggers_per_alert(active_alerts: list, active_triggers: list) -> dict:
    """
    SQL request to organise in a dictionnary the number of triggers per alert
    in order to know when to trigger the alerts.
    """
    nb_triggers_per_alert = {}
    for alert_data in active_alerts:
        counter = 0
        for trigger_data in active_triggers:
            if alert_data[0] == trigger_data[-1]:
                counter += 1
        nb_triggers_per_alert[alert_data[0]] = counter
    return nb_triggers_per_alert


def main(sock: zmq.Socket) -> None:
    """
    Parse data from OANDA princing streamer and compare the forex rates with alerts in db
    in order to trigger them according to their settings.
    """
    # DATA STRUCTURES PREPARATION PREREQUISITES
    structs = prepare_structs(ALL_INSTRUMENTS)

    # TIMER REF
    timer_ref = time.perf_counter()
    now = str(datetime.datetime.now())

    # GET ACTIVE ALERTS
    active_alerts = get_active_alerts(now)
    # GET ACTIVE TRIGGERS
    active_triggers = get_active_triggers(active_alerts)
    # GET TRIGGERS PER ALERT
    nb_triggers_per_alert = get_nb_triggers_per_alert(
        active_alerts, active_triggers)
    # MAIN LOOP
    while True:
        buffer = ""
        # PRICING STREAMER DATA RECEPTION
        values = sock.recv()
        values = values.decode("utf-8")
        values = json.loads(values)
        # values = mock()[random.randint(0, 3)]
        if "instrument" in values and values["status"] == "tradeable":
            # SHORT TIME HISTORIC DATA CURRENCY ASK
            if "closeoutAsk" in values:
                buffer = f'{values["instrument"]} ask={round(float(values["closeoutAsk"]),5)}'
                for instrument in structs[0]:
                    if buffer.split(' ')[0] in instrument:
                        structs[0][instrument].append(
                            float(buffer.split('=')[1]))
                        if len(structs[0][instrument]) >= OBSERVER_RANGE:
                            del (structs[0][instrument][0])

            # SHORT TIME HISTORIC DATA CURRENCY BID
            if "closeoutBid" in values:
                buffer = f'{values["instrument"]} bid={round(float(values["closeoutBid"]),5)}'
                for instrument in structs[1]:
                    if buffer.split(' ')[0] in instrument:
                        structs[1][instrument].append(
                            float(buffer.split('=')[1]))
                        if len(structs[1][instrument]) >= OBSERVER_RANGE:
                            del (structs[1][instrument][0])
        # print(structs)

        # CLOCK CHECKING
        timer_tic = time.perf_counter()
        if timer_reset(timer_tic, timer_ref):
            # GET ACTIVE ALERTS
            active_alerts = get_active_alerts(now)
            # GET ACTIVE TRIGGERS
            active_triggers = get_active_triggers(active_alerts)
            # GET TRIGGERS PER ALERT
            nb_triggers_per_alert = get_nb_triggers_per_alert(
                active_alerts, active_triggers)

            # DESACTIVATE PERISHED ALERTS WITH ITS TRIGGERS
            now = str(datetime.datetime.now())
            for alert_data in active_alerts:
                counter = 0
                deactivate_perished_alert(alert_data, now)

                # GET NUMBER OF TRIGGERS FOR EACH ALERT IN ORDER TO DEACTIVATE IT
                for trigger_data in active_triggers:
                    if alert_data[0] == trigger_data[-1]:
                        counter += 1
                nb_triggers_per_alert[alert_data[0]] = counter

            # REFRESH TIMER
            timer_ref = timer_tic

        # BROWSE ACTIVE ALERTS
        for alert_data in active_alerts:
            alert_id = alert_data[0]
            alert_name = alert_data[1]
            alert_instrument = alert_data[-1]

            # BROWSE ACTIVE TRIGGERS FROM ACTIVE ALERTS
            payload = []
            trigger_counter = 0
            trigger_ids = []
            for trigger_data in get_triggers_per_alert(alert_id):
                trigger_id = trigger_data[0]
                trigger_type = trigger_data[1]
                trigger_condition = trigger_data[2]
                trigger_value = trigger_data[3]
                if structs[0][alert_instrument] and structs[1][alert_instrument]:
                    if trigger_condition == "crossing" and trigger_type == "ask":
                        if trigger_value > structs[0][alert_instrument][0] and trigger_value < structs[0][alert_instrument][-1] or trigger_value < structs[0][alert_instrument][0] and trigger_value > structs[0][alert_instrument][-1]:
                            trigger_counter += 1
                            trigger_ids.append(trigger_id)
                            json_data = {}
                            json_data["alert_name"] = alert_name
                            json_data["trigger_condition"] = trigger_condition
                            json_data["trigger_type"] = trigger_type
                            json_data["trigger_value"] = trigger_value
                            json_data["currency_name"] = alert_instrument
                            payload.append(json_data)

                    if trigger_condition == "crossing" and trigger_type == "bid":
                        if trigger_value > structs[1][alert_instrument][0] and trigger_value < structs[1][alert_instrument][-1] or trigger_value < structs[1][alert_instrument][0] and trigger_value > structs[1][alert_instrument][-1]:
                            trigger_counter += 1
                            trigger_ids.append(trigger_id)
                            json_data = {}
                            json_data["alert_name"] = alert_name
                            json_data["trigger_condition"] = trigger_condition
                            json_data["trigger_type"] = trigger_type
                            json_data["trigger_value"] = trigger_value
                            json_data["currency_name"] = alert_instrument
                            payload.append(json_data)

                    if trigger_condition == "upcrossing" and trigger_type == "ask":
                        if trigger_value < structs[0][alert_instrument][0] and trigger_value > structs[0][alert_instrument][-1]:
                            trigger_counter += 1
                            trigger_ids.append(trigger_id)
                            json_data = {}
                            json_data["alert_name"] = alert_name
                            json_data["trigger_condition"] = trigger_condition
                            json_data["trigger_type"] = trigger_type
                            json_data["trigger_value"] = trigger_value
                            json_data["currency_name"] = alert_instrument
                            payload.append(json_data)

                    if trigger_condition == "upcrossing" and trigger_type == "bid":
                        if trigger_value < structs[1][alert_instrument][0] and trigger_value > structs[1][alert_instrument][-1]:
                            trigger_counter += 1
                            trigger_ids.append(trigger_id)
                            json_data = {}
                            json_data["alert_name"] = alert_name
                            json_data["trigger_condition"] = trigger_condition
                            json_data["trigger_type"] = trigger_type
                            json_data["trigger_value"] = trigger_value
                            json_data["currency_name"] = alert_instrument
                            payload.append(json_data)

                    if trigger_condition == "downcrossing" and trigger_type == "ask":
                        if trigger_value > structs[0][alert_instrument][0] and trigger_value < structs[0][alert_instrument][-1]:
                            trigger_counter += 1
                            trigger_ids.append(trigger_id)
                            json_data = {}
                            json_data["alert_name"] = alert_name
                            json_data["trigger_condition"] = trigger_condition
                            json_data["trigger_type"] = trigger_type
                            json_data["trigger_value"] = trigger_value
                            json_data["currency_name"] = alert_instrument
                            payload.append(json_data)

                    if trigger_condition == "downcrossing" and trigger_type == "bid":
                        if trigger_value > structs[1][alert_instrument][0] and trigger_value < structs[1][alert_instrument][-1]:
                            trigger_counter += 1
                            trigger_ids.append(trigger_id)
                            json_data = {}
                            json_data["alert_name"] = alert_name
                            json_data["trigger_condition"] = trigger_condition
                            json_data["trigger_type"] = trigger_type
                            json_data["trigger_value"] = trigger_value
                            json_data["currency_name"] = alert_instrument
                            payload.append(json_data)

                    if trigger_condition == "bigger than" and trigger_type == "ask":
                        if trigger_value < structs[0][alert_instrument][-1]:
                            trigger_counter += 1
                            trigger_ids.append(trigger_id)
                            json_data = {}
                            json_data["alert_name"] = alert_name
                            json_data["trigger_condition"] = trigger_condition
                            json_data["trigger_type"] = trigger_type
                            json_data["trigger_value"] = trigger_value
                            json_data["currency_name"] = alert_instrument
                            payload.append(json_data)

                    if trigger_condition == "bigger than" and trigger_type == "bid":
                        if trigger_value < structs[1][alert_instrument][-1]:
                            trigger_counter += 1
                            trigger_ids.append(trigger_id)
                            json_data = {}
                            json_data["alert_name"] = alert_name
                            json_data["trigger_condition"] = trigger_condition
                            json_data["trigger_type"] = trigger_type
                            json_data["trigger_value"] = trigger_value
                            json_data["currency_name"] = alert_instrument
                            payload.append(json_data)

                    if trigger_condition == "lesser than" and trigger_type == "ask":
                        if trigger_value > structs[0][alert_instrument][-1]:
                            trigger_counter += 1
                            trigger_ids.append(trigger_id)
                            json_data = {}
                            json_data["alert_name"] = alert_name
                            json_data["trigger_condition"] = trigger_condition
                            json_data["trigger_type"] = trigger_type
                            json_data["trigger_value"] = trigger_value
                            json_data["currency_name"] = alert_instrument
                            payload.append(json_data)

                    if trigger_condition == "lesser than" and trigger_type == "bid":
                        if trigger_value > structs[1][alert_instrument][-1]:
                            trigger_counter += 1
                            trigger_ids.append(trigger_id)
                            json_data = {}
                            json_data["alert_name"] = alert_name
                            json_data["trigger_condition"] = trigger_condition
                            json_data["trigger_type"] = trigger_type
                            json_data["trigger_value"] = trigger_value
                            json_data["currency_name"] = alert_instrument
                            payload.append(json_data)
            # IF ALL ALERT TRIGGERS ARE UNACTIVATED THE ALERT NEEDS TO BE DESACTIVATED
            deactivate_triggered_alert(
                nb_triggers_per_alert, trigger_counter, trigger_ids, alert_id, payload)

        active_alerts = []
        active_triggers = []


# SERVICE PREREQUISITES
# -> AVOID OVERLOADED RAM BY LIMITING THE RANGE OF DATA KEPT IN MEMORY
OBSERVER_RANGE = 3
# -> NUMBER OF SECONDS TO LIMIT THE REFRESH OF ACTIVE ALERTS SELECTION TO AVOID DB CRASH
DB_REQUEST_LIMITER = 5
# -> TIMETOUT CONFIGURATION TO STOP WAITING FOR A RESPONSE AFTER A GIVEN NUMBER OF SECONDS
REQUEST_TIMEOUT = 1

# SQL PREREQUISITES
GET_CURRENCIES = """SELECT * FROM alert_currencypair"""
GET_ACTIVATED_ALERTS = """SELECT * FROM alert_alert WHERE is_active=1 AND alerting_device=%s AND expiration_date>%s OR is_active=1 AND alerting_device=%s AND expire=0"""
DEACTIVATE_ALERT = """UPDATE alert_alert SET is_active=0 WHERE id=%s"""
GET_ALERT_OWNER = """SELECT user_id from alert_useralert WHERE alert_id=%s"""
GET_ALERT_OWNER_EMAIL = """SELECT email FROM register_customuser WHERE id =%s"""
GET_TRIGGERS_PER_ALERT = """SELECT * FROM alert_alerttrigger WHERE alert_id=%s"""
DB_HOST = os.environ["DB_HOST"]
DB_USER = os.environ["DB_USER"]
DB_PASSWORD = os.environ["DB_PASSWORD"]

# OANDA PREREQUISITES
TOKEN = os.environ["OANDA_TOKEN"]
ACCOUNT_ID = os.environ["OANDA_ACCOUNT_ID"]
API = oandapyV20.API(access_token=TOKEN)

# MAILER PREREQUISITES
MAILER_SERVICE_URL = f"http://mailer:{os.environ['MAILER_PORT']}/mail"

# CONNECT DB
DB = mysql.connector.connect(
    host=DB_HOST,
    user=DB_USER,
    password=DB_PASSWORD,
)
db_cursor = DB.cursor()
db_cursor.execute(f"USE {os.environ['MYSQL_DATABASE']}")

ALL_INSTRUMENTS = get_instruments_from_db()

# START CONNECTION TO STREAMER
SOCKET = websocket_client()

# MAIN LOOP
main(SOCKET)
