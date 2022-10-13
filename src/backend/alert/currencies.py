import os
import json
from tqdm import tqdm
import oandapyV20.endpoints.accounts as accounts
from oandapyV20.endpoints.pricing import PricingStream
import oandapyV20


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


def main_currencies_seed(currencies: "list[str]") -> None:
    """
    Pepare a json file with fake data in fixture folder which will be loaded in database
    only for main currencies. Replace currency_manager service when market is closed.
    """
    dict = {}
    final = []
    for currency in tqdm(currencies):
        dict["model"] = "alert.CurrencyPair"
        dict["fields"] = {}
        dict["fields"]["symbol"] = currency
        final.append(dict)
        dict = {}
        with open(os.path.join("/app/fixtures/", "seed.json"), "w") as file:
            file.write(json.dumps(final))




# RECOVER ALL CURRENCIES VALUES
TOKEN = os.environ["OANDA_TOKEN"]
ACCOUNT_ID = os.environ["OANDA_ACCOUNT_ID"]
API = oandapyV20.API(access_token=TOKEN)
ALL_INSTRUMENTS = get_instruments("CURRENCY", API, ACCOUNT_ID).split(',')
print(ALL_INSTRUMENTS)

# SEED FOR CURRENCIES
main_currencies_seed(ALL_INSTRUMENTS)
