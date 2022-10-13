import zmq
import os
import oandapyV20.endpoints.accounts as accounts
from oandapyV20.endpoints.pricing import PricingStream
from oandapyV20.endpoints.instruments import InstrumentsCandles
import oandapyV20
import json
from oandapyV20.definitions.instruments import CandlestickGranularity


def get_instruments(request_type: str, api: oandapyV20.API, account_id: str) -> str:
    """
    Recover currencies symbols for prices throught OANDA HTTP GET request.
    Return them in the correct format for the fetching request.
    """
    endpoint = accounts.AccountInstruments(account_id)
    instruments = ""
    try:
        response = api.request(endpoint)
        json_response = json.dumps(response, indent=2)
        parsed_json = json.loads(json_response)
        for instrument in parsed_json['instruments']:
            if (instrument['type'] == request_type):
                instruments += f"{instrument['name']},"
        return instruments[:-1]
    except oandapyV20.exceptions.V20Error as err:
        print("Error:", endpoint.status_code, err)


def pricing_streaming(api: oandapyV20.API, account_id: str, instruments: str) -> None:
    """
    Fetch pricings on OANDA API throught HTTP streaming.
    """
    endpoint = PricingStream(account_id, params={
        "instruments": instruments})
    try:
        stream = api.request(endpoint)
        for ticks in stream:
            print(json.dumps(ticks, indent=2))
            socket.send(json.dumps(ticks, indent=2).encode("utf-8"))
    except oandapyV20.exceptions.V20Error as err:
        print("Error:", endpoint.status_code, err)


def candle_streaming(api: oandapyV20.API, instrument: str) -> None:
    """
    Fetch candles on OANDA API throught HTTP streaming.
    """
    endpoint = InstrumentsCandles(instrument, params={
        "granularity": "D", "count": 1,
    })
    try:
        stream = api.request(endpoint)
        for ticks in stream:
            print(json.dumps(ticks, indent=2))
            socket.send(json.dumps(ticks, indent=2).encode("utf-8"))
    except oandapyV20.exceptions.V20Error as err:
        print("Error:", endpoint.status_code, err)


# OANDA PREREQUISITES
TOKEN = os.environ["OANDA_TOKEN"]
ACCOUNT_ID = os.environ["OANDA_ACCOUNT_ID"]
API = oandapyV20.API(access_token=TOKEN)

# SERVER CONFIG
context = zmq.Context()
socket = context.socket(zmq.PUB)
socket.bind(f"tcp://*:{os.environ['INFLUX_CONNECTOR_PORT']}")

# RECOVER ALL CURRENCIES VALUES
ALL_INSTRUMENTS = get_instruments("CURRENCY", API, ACCOUNT_ID)

# STREAMING PRICES
pricing_streaming(API, ACCOUNT_ID, ALL_INSTRUMENTS)