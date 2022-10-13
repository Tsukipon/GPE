"""
This module is a service that takes data from the pricing_streamer service and keep the
stock market information about each Forex currency. It stays open when the Forex
Market is himself open in Europe from sunday at 23PM to friday at 22PM.
Once the data is in the database, it allows the alert_checker service to take over
concerning triggering the alerts.
"""
import zmq
import json
import datetime
import mysql.connector
import argparse
from enum import Enum

# PREREQUISITES
ACTUAL_MINUTE = None
ACTUAL_HOUR = None
ACTUAL_DAY = None
ACTUAL_WEEK = None
ACTUAL_MONTH = None
ACTUAL_YEAR = None
FRIDAY = 4
SATURDAY = 5
SUNDAY = 6
CLOSED_MARKET = False
ask_market_closure = 0.0
bid_market_closure = 0.0
time_ref_data = {}
LOT_SIZE = 100000


class TimeRef(Enum):
    MINUTELY = 'minute'
    HOURLY = 'hour'
    DAILY = 'day'
    WEEKLY = 'week'
    MONTHLY = 'month'
    YEARLY = 'year'

    def __str__(self):
        return self.value


def calculate_average(data: str) -> tuple:
    total_liquidity = 0
    ask_average = 0
    bid_average = 0
    for order in data["asks"]:
        total_liquidity += order["liquidity"]
        ask_average += order["liquidity"] * float(order["price"])
    ask_average = round(ask_average/total_liquidity, 5)
    total_liquidity = 0
    for order in data["bids"]:
        total_liquidity += order["liquidity"]
        bid_average += order["liquidity"] * float(order["price"])
    bid_average = round(bid_average/total_liquidity, 5)
    return (ask_average, bid_average)


def pip_to_currencies(lot_size: int, nb_pips: float) -> int:
    return lot_size * nb_pips


update_refresh_timestamp_query = """UPDATE alert_currencypair set last_refresh=%s"""
select_existing_pk_query = """SELECT COUNT(*) from alert_currencypair WHERE symbol=%s"""
insert_query = """INSERT INTO alert_currencypair (symbol,ask_average,bid_average,spread,ask_market_closure,bid_market_closure,ask_pip_variation,bid_pip_variation,ask_pip_variation_value,bid_pip_variation_value,ask_percentage_variation,bid_percentage_variation,tradeable,description,last_refresh) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)"""
update_query = """UPDATE alert_currencypair SET ask_average=%s,bid_average=%s,spread=%s,ask_market_closure=%s,bid_market_closure=%s,ask_pip_variation=%s,bid_pip_variation=%s,ask_pip_variation_value=%s,bid_pip_variation_value=%s,ask_percentage_variation=%s,bid_percentage_variation=%s,tradeable=%s,description=%s WHERE symbol=%s"""
insert_orders_query = """INSERT INTO alert_currencypairorders (order_type,liquidity,price,closeout_ask,closeout_bid,symbol_id,timestamp) VALUES (%s,%s,%s,%s,%s,%s,%s)"""
retrieve_existant_order_query = """SELECT id from alert_currencypairorders WHERE symbol_id =%s AND liquidity =%s AND price=%s AND order_type=%s  """
update_order_query = """UPDATE alert_currencypairorders SET order_type=%s,liquidity=%s,price=%s,closeout_ask=%s,closeout_bid=%s,timestamp=%s WHERE id=%s"""

main_currency_dict = {
    "EUR_USD": "Euro/Dollar",
    "USD_EUR": "American Dollar/Euro",
    "GBP_USD": "Pound_Sterling/Dollar",
    "USD_GPB": "American Dollar/Pound_Sterling",
    "USD_JPY": "American Dollar/Yen",
    "JPY_USD": "Yen/Dollar",
    "USD_CHF": "American Dollar/Swiss Franc",
    "CHF_USD": "Swiss Franc/American Dollar",
    "AUD_USD": "Australien Dollar/American Dollar",
    "USD_AUD": "American Dollar/Australien Dollar",
    "NZD_USD": "New Zealand dollar/American Dollar",
    "USD_NZD": "American Dollar/New Zealand dollar",
    "USD_CAD": "American Dollar/Canadian Dollar",
    "CAD_USD": "Canadian Dollar/American Dollar"
}


mydb = mysql.connector.connect(
    host="db",
    user="root",
    password="alpha",
)
mycursor = mydb.cursor()
mycursor.execute("USE gpe")

if __name__ == '__main__':
    # CLI SETUP
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "-t", "--timerefresh", type=TimeRef, required=True, choices=list(TimeRef)
    )
    now = datetime.datetime.now()
    args = parser.parse_args()
    if args.timerefresh.value == TimeRef.MINUTELY.value:
        ACTUAL_MINUTE = int(now.minute)
    elif args.timerefresh.value == TimeRef.HOURLY.value:
        ACTUAL_HOUR = int(now.hour)
    elif args.timerefresh.value == TimeRef.DAILY.value:
        ACTUAL_DAY = int(now.day)
    elif args.timerefresh.value == TimeRef.WEEKLY.value:
        ACTUAL_WEEK = int(now.isocalendar()[1])
    elif args.timerefresh.value == TimeRef.MONTHLY.value:
        ACTUAL_MONTH = int(now.month)
    elif args.timerefresh.value == TimeRef.YEARLY.value:
        ACTUAL_YEAR = int(now.year)

    # WEBSOCKET CONNECTION SETUP
    context = zmq.Context()
    socket = context.socket(zmq.SUB)
    socket.connect("tcp://pricing_streamer:5563")
    socket.setsockopt_string(zmq.SUBSCRIBE, "")
    iteration = 0

    # MAIN LOOP
    while True:
        print("##### ITERATION ", iteration, "  ########")
        iteration += 1
        values = socket.recv()
        values = values.decode("utf-8")
        values = json.loads(values)
        print(values)

        now = datetime.datetime.now()

        if not CLOSED_MARKET:
            # RECEIVED JSON DATA PROCESSING
            currency_name = values["instrument"]
            if values["tradeable"]:
                tradeable = 1
            else:
                tradeable = 0
            closeout_ask = values["closeoutAsk"]
            closeout_bid = values["closeoutBid"]
            calculation = calculate_average(values)
            average_ask = calculation[0]
            average_bid = calculation[1]

            # SETUP PERIODIC REF DICT REFRESH
            if ACTUAL_MINUTE:
                periodic_timestamp = now.minute
            elif ACTUAL_HOUR:
                periodic_timestamp = now.hour
            elif ACTUAL_DAY:
                periodic_timestamp = now.day
            elif ACTUAL_WEEK:
                periodic_timestamp = now.isocalendar()[1]
            elif ACTUAL_MONTH:
                periodic_timestamp = now.month
            elif ACTUAL_YEAR:
                periodic_timestamp = now.year

            # UPDATE REF DICT ACCORDING TO CLI SETUP
            if currency_name in time_ref_data:
                if periodic_timestamp != time_ref_data[currency_name]["timestamp"]:
                    # UPDATE TABLE
                    mycursor.execute(
                        update_refresh_timestamp_query, (now,))
                    mydb.commit()
                    time_ref_data[currency_name]["timestamp"] = periodic_timestamp
                    time_ref_data[currency_name]["ask_ref"] = average_ask
                    time_ref_data[currency_name]["bid_ref"] = average_bid

            # FILL REF DICT AT CURRENCY ENCOUNTER
            else:
                time_ref_data[currency_name] = {}

                if "JPY" in currency_name:
                    time_ref_data[currency_name]["ask_in_pips"] = average_ask
                    time_ref_data[currency_name]["bid_in_pips"] = average_bid
                else:
                    time_ref_data[currency_name]["ask_in_pips"] = average_ask
                    time_ref_data[currency_name]["bid_in_pips"] = average_bid

                time_ref_data[currency_name]["ask_ref"] = average_ask
                time_ref_data[currency_name]["bid_ref"] = average_bid
                time_ref_data[currency_name]["timestamp"] = periodic_timestamp

            #stock_rate = round(average_ask+average_bid, 5)/2

            # PIP CALCULATION
            if "JPY" in currency_name:
                spread = abs(round(average_ask-average_bid, 5)*100)
                ask_pip_variation = round(average_ask*100 -
                                          time_ref_data[currency_name]["ask_ref"]*100, 5)
                bid_pip_variation = round(average_bid*100 -
                                          time_ref_data[currency_name]["bid_ref"]*100, 5)
            else:
                spread = abs(round(average_ask-average_bid, 5)*10000)
                ask_pip_variation = round(average_ask*10000 -
                                          time_ref_data[currency_name]["ask_ref"]*10000, 5)
                bid_pip_variation = round(average_bid*10000 -
                                          time_ref_data[currency_name]["bid_ref"]*10000, 5)

            # CONVERT PIP TO REF CURRENCY VALUE
            ask_pip_variation_value = pip_to_currencies(
                LOT_SIZE, ask_pip_variation)
            bid_pip_variation_value = pip_to_currencies(
                LOT_SIZE, bid_pip_variation)

            # CALCULATE PERCENTAGE VARIATION VALUE
            ask_percentage_variation = 100-average_ask * \
                100/time_ref_data[currency_name]["ask_ref"]
            bid_percentage_variation = 100-average_bid * \
                100/time_ref_data[currency_name]["bid_ref"]

            # MAKE SURE THAT THE PERCENTAGE IS GREATER OR LESSER THAN 0

            if average_ask < time_ref_data[currency_name]["ask_ref"]:
                ask_percentage_variation = abs(ask_percentage_variation)
            else:
                ask_percentage_variation = -abs(ask_percentage_variation)
            if average_bid < time_ref_data[currency_name]["bid_ref"]:
                bid_percentage_variation = abs(bid_percentage_variation)
            else:
                bid_percentage_variation = -abs(bid_percentage_variation)

            currency_description = main_currency_dict[currency_name]

            # SQL INJECTIONS

            # RETRIEVE THE CURRENCY
            mycursor.execute(select_existing_pk_query, (currency_name,))
            countpk = mycursor.fetchone()
            # IF DOESN'T EXIST INSERTION
            if (countpk[0] == 0):
                mycursor.execute(insert_query, (currency_name, average_ask, average_bid, spread, ask_market_closure,
                                                bid_market_closure, ask_pip_variation, bid_pip_variation, ask_pip_variation_value, bid_pip_variation_value, ask_percentage_variation, bid_percentage_variation, tradeable, currency_description, now))
                mydb.commit()
            # IF EXISTS UPDATE
            else:
                mycursor.execute(update_query, (average_ask, average_bid, spread, ask_market_closure,
                                                bid_market_closure, ask_pip_variation, bid_pip_variation, ask_pip_variation_value, bid_pip_variation_value, ask_percentage_variation, bid_percentage_variation, tradeable, currency_description, currency_name))
                mydb.commit()

            # INSERT OR UPDATE ORDERS
            for dict in values["asks"]:
                mycursor.execute(
                    retrieve_existant_order_query, (
                        currency_name, dict["liquidity"], dict["price"], "ask")
                )
                countpk = mycursor.fetchone()
                if not countpk:
                    mycursor.execute(
                        insert_orders_query, ("ask", dict["liquidity"], dict["price"], closeout_ask, closeout_bid, currency_name, now))
                    mydb.commit()
                else:
                    mycursor.execute(
                        update_order_query, ("ask", dict["liquidity"], dict["price"], closeout_ask, closeout_bid, now, countpk[0]))
                    mydb.commit()
            for dict in values["bids"]:
                mycursor.execute(
                    retrieve_existant_order_query, (
                        currency_name, dict["liquidity"], dict["price"], "bid")
                )
                countpk = mycursor.fetchone()
                if not countpk:
                    mycursor.execute(
                        insert_orders_query, ("bid", dict["liquidity"], dict["price"], closeout_ask, closeout_bid, currency_name, now))
                    mydb.commit()
                else:
                    mycursor.execute(
                        update_order_query, ("bid", dict["liquidity"], dict["price"], closeout_ask, closeout_bid, now, countpk[0]))
                    mydb.commit()

            # MARKET CLOSURE
            if now.weekday() == FRIDAY:
                if now.hour >= 22:
                    ask_market_closure = average_ask
                    bid_market_closure = average_bid
                    mycursor.execute(update_query, (currency_name, average_ask, average_bid, ask_market_closure,
                                                    bid_market_closure, bid_pip_variation, ask_pip_variation, ask_percentage_variation, bid_percentage_variation, tradeable, currency_description))
                    mydb.commit()
                    CLOSED_MARKET = True

        else:
            print("CLOSED MARKET: ", CLOSED_MARKET)

            # MARKET OPENING
            if now.weekday() == SUNDAY:
                if now.hour >= 23:
                    CLOSED_MARKET = False
