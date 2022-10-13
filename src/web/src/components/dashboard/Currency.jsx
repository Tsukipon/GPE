import '../styles/Dashboard.css';
import { useState, useEffect } from "react";
import CurrencySelectionModal from "./CurrencySelectionModal";
import { InfluxDB } from "@influxdata/influxdb-client";

const token = "ai-IvnQlIBcemj05UH-50Z-wLYvUhk3bHVwSLBlUpTyvqtENM0jTS_0zxYUyJKeiZqMg-u_EaVgMQgmWKDssmg==";
const org = "GPE";
const url = "http://localhost:8086/";


// display dynamically the ask and bid price of the currency
const CurrencyComponent = ({selectedContent}) => {

    const [price, setPrice] = useState(0);
    const [newPrice,setNewPrice] = useState(0);
    const [priceBid, setPriceBid] = useState(0);
    const [priceAsk, setPriceAsk] = useState(0);
    const [color, setColor] = useState("red");
    const [selectedCurrency, setSelectedCurrency] = useState(null);
    const [showCurrencyDialog, setShowCurrencyDialog] = useState(true);
    

    

    function handleClose () {
        setShowCurrencyDialog(false);
        selectedContent(0);
    }

    function confirmSelection (selection) {
        setShowCurrencyDialog(false);
        setSelectedCurrency(selection);
        //selectedContent(1);
    }

    function fetchData() {
        if(selectedCurrency){
            let query = `from(bucket: "PRICES")
            |> range(start: -3d)
            |> filter(fn: (r) => r["_measurement"] == "${selectedCurrency+"_ASK"}" or r["_measurement"] == "${selectedCurrency+"_BID"}")
            |> filter(fn: (r) => r["_field"] == "ask" or r["_field"] == "bid")
            |> last()
            |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
            |> yield(name: "results")
            `;
            let res = [];
            const influxQuery = async () => {
              //create InfluxDB client
              const queryApi = await new InfluxDB({ url, token }).getQueryApi(org);
              //make query
              queryApi.queryRows(query, {
                next(row, tableMeta) {
                  const o = tableMeta.toObject(row);
                  //push rows from query into an array object
                  res.push(o);
                },
                complete() {
                  let data = {};
                  for (let i = 0; i < res.length; i++) {
                    if(res[i].ask){
                        data.ask = res[i].ask;
    
                    }
                    if(res[i].bid){
                        data.bid = res[i].bid;
                    }
                  }
                  setPriceAsk(data.ask);
                  setPriceBid(data.bid);
                  let newPrice = ((data.ask+data.bid)/2).toFixed(5);
                  setNewPrice(newPrice);
                  
                  data = {};           
                  res=[];
                },
                error(error) {
                  console.log("query failed- ", error);
                }
              });
            };
            influxQuery();
            }
    }
    

    useEffect(() => {
        if(newPrice < price) {
            setColor("red");
          } else {
            setColor("green");
          }
          setPrice(newPrice);
          setTimeout(() => setColor("black"), 600);
    }, [newPrice]);


    // influx request
    useEffect(() => {
        fetchData();
        const interval = setInterval(() => {
            fetchData();
        }, 4000);
        
        return () => {
            clearInterval(interval);
        };
        
      }, [selectedCurrency]);



    return (

        <div>
            <CurrencySelectionModal showCurrencyDialog={showCurrencyDialog}
             handleClose={handleClose} setSelectedCurrency={setSelectedCurrency} confirmSelection={confirmSelection}/>
            {selectedCurrency && <div className="currency-content">
                <span className="currency-name"> {selectedCurrency} </span>
                <div className="currency-data">
                    <span> {priceBid}</span>
                    <span className="main-value" style={{color: color}}> {price}</span>
                    <span> {priceAsk}</span>
                </div>
            </div> }
        </div>
    )




}

export default CurrencyComponent;


