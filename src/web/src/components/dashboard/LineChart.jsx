import React, { useState, useEffect } from "react";
import { InfluxDB } from "@influxdata/influxdb-client";
import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import {minBid,maxAsk} from "../financeChart/utils";
import CurrencySelectionModal from "./CurrencySelectionModal";

const token = "ai-IvnQlIBcemj05UH-50Z-wLYvUhk3bHVwSLBlUpTyvqtENM0jTS_0zxYUyJKeiZqMg-u_EaVgMQgmWKDssmg==";
const org = "GPE";
const url = "http://localhost:8086/";


export const LineChart = ({selectedContent,width,height}) => {
  console.log(height);
  const [data, setData] = useState([]);
  const [showCurrencyDialog, setShowCurrencyDialog] = useState(true);
  const [selectedCurrency, setSelectedCurrency] = useState(null);

  function handleClose () {
    setShowCurrencyDialog(false);
    selectedContent(0);
}

function confirmSelection (selection) {
    setShowCurrencyDialog(false);
    setSelectedCurrency(selection);
    //selectedContent(1);
}

function fetchData(){
  if(selectedCurrency){
    let query = `from(bucket: "PRICES")
      |> range(start: -15m)
      |> filter(fn: (r) => r["_measurement"] == "${selectedCurrency+"_ASK"}" or r["_measurement"] == "${selectedCurrency+"_BID"}")
      |> filter(fn: (r) => r["_field"] == "ask" or r["_field"] == "bid")
      |> aggregateWindow(every: 15s, fn: first)
      |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
      |> yield(name: "results")
    `;
    let res = [];
    const influxQuery = async () => {
      //create InfluxDB client
      const queryApi = await new InfluxDB({ url, token }).getQueryApi(org);
      //make query
      await queryApi.queryRows(query, {
        next(row, tableMeta) {
          const o = tableMeta.toObject(row);
          //push rows from query into an array object
          res.push(o);
        },
        complete() {
          let finalData = []
          for (let i = 0; i < res.length/2; i++) {
            let point = {};
            point["ask"] = res[i]["ask"];
            point["bid"] = res[i+res.length/2]["bid"];
            point["name"] = res[i]["_time"].split("T")[1].replace("Z","");
            finalData.push(point);
          }
          setData(finalData);
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
    fetchData();
    const interval = setInterval(() => {
      fetchData();
    }, 6000);
    
    return () => {
        clearInterval(interval);
    };
  }, [selectedCurrency]);


  return (
    <div>
      <CurrencySelectionModal showCurrencyDialog={showCurrencyDialog}
             handleClose={handleClose} setSelectedCurrency={setSelectedCurrency} confirmSelection={confirmSelection}/>


      {selectedCurrency && 
      <div>
        <h1>Line Chart : {selectedCurrency}</h1>
      <ComposedChart width={width} height={height} data={data}>
        <CartesianGrid />
        <Tooltip />
        <Line
          stroke="#51913c"
          strokeWidth={1}
          dataKey="ask"
          dot={false}
        />
        <Line
          stroke="#0f22f7"
          strokeWidth={1}
          dataKey="bid"
          dot={false}
        />
        < Legend />
        <XAxis dataKey="name"/>
        <YAxis type="number" domain={[minBid(data),maxAsk(data)]}/>
      </ComposedChart>
      </div>}
      
    </div>
  );
};