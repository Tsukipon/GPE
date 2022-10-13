### Streamer Documentation

##### Oanda authentication
- Open a live-demo account ->  https://developer.oanda.com/rest-live-v20/introduction/  
- Ask a Token on your live-demo account profile page.
- Authentication on the STREAMing API or REST API with a Bearer Token -> https://developer.oanda.com/rest-live-v20/authentication/  

*Curl or postman can be used.*  
```
curl -H "Authorization: Bearer {Token_value}"  	https://api-fxpractice.oanda.com/v3/accounts
```

The request should return a json object based on this format:
```
{
    "accounts": [
        {
            "id": "xxx-xxx-xxxxxxxx-xxx",
            "tags": []
        }
    ]
}
```

Once you have the ACCOUNT_ID and the OANDA_TOKEN you can store them in the .env file at the top of the project with the next format:
```
API_ACCOUNT_ID=API_ACCOUNT_ID
API_TOKEN=API_TOKEN
```

### Rate Limiting
#### REST API
- 120 requests per second.  
#### STREAMING API
- 20 active streams. 

##### Streamer communication
The pricing streamer service communicate on port 5563 with websocket protocole.
Websocket connection example with ZMQ in Python:
```
    context = zmq.Context()
    socket = context.socket(zmq.SUB)
    socket.connect("tcp://pricing_streamer:5563")
    socket.setsockopt_string(zmq.SUBSCRIBE, "")
    while True:
        s = socket.recv()
        values = socket.recv()
        values = values.decode("utf-8")
        values = json.loads(values)
```
The data send by the pricing streamer is a array json object:
```
[
    {
pricing             |   "type": "PRICE",
pricing             |   "time": "2022-05-11T14:21:38.164603344Z",
pricing             |   "bids": [
pricing             |     {
pricing             |       "price": "1.75888",
pricing             |       "liquidity": 10000000
pricing             |     }
pricing             |   ],
pricing             |   "asks": [
pricing             |     {
pricing             |       "price": "1.75932",
pricing             |       "liquidity": 10000000
pricing             |     }
pricing             |   ],
pricing             |   "closeoutBid": "1.75888",
pricing             |   "closeoutAsk": "1.75932",
pricing             |   "status": "tradeable",
pricing             |   "tradeable": true,
pricing             |   "instrument": "GBP_AUD"
pricing             | 
    }
]
```
You can find others ways to use sockets with ZMQ on different langages thanks to their documentation  -> https://zeromq.org/ .