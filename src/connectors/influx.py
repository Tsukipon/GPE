import json
import os
import zmq
from influxdb_client import WriteApi
from influxdb_client import InfluxDBClient
from influxdb_client.client.write_api import SYNCHRONOUS


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


def main(sock: zmq.Socket, bucket: str, org: str, influx_endpoint: WriteApi) -> None:
    """
    Parse data from OANDA princing streamer and inject them into
    Influx database.
    """
    while True:
        influx_object = ""
        values = sock.recv()
        values = values.decode("utf-8")
        values = json.loads(values)
        if "instrument" in values:
            influx_object = f'{values["instrument"]}_ASK ask={round(float(values["closeoutAsk"]),5)}'
            print(f'ASK: {influx_object}')
            influx_endpoint.write(bucket, org, influx_object)
            influx_object = f'{values["instrument"]}_BID bid={round(float(values["closeoutBid"]),5)}'
            print(f'BID: {influx_object}')
            influx_endpoint.write(bucket, org, influx_object)
        print(values)


# INFLUXDB PREREQUISITES
TOKEN = os.environ["DOCKER_INFLUXDB_INIT_ADMIN_TOKEN"]
ORG = os.environ["DOCKER_INFLUXDB_INIT_ORG"]
BUCKET = os.environ["DOCKER_INFLUXDB_INIT_BUCKET"]
USERNAME = os.environ["DOCKER_INFLUXDB_INIT_USERNAME"]
PASSWORD = os.environ["DOCKER_INFLUXDB_INIT_PASSWORD"]
INFLUX_CLIENT = InfluxDBClient(url=f"http://influx:{os.environ['INFLUX_PORT']}", username=USERNAME,
                               password=PASSWORD, ssl=False, verify_ssl=False, token=TOKEN, org=ORG)
INFLUX_API = INFLUX_CLIENT.write_api(write_options=SYNCHRONOUS)

# START CONNECTION
SOCKET = websocket_client()

# MAIN LOOP
main(SOCKET, BUCKET, ORG, INFLUX_API)
