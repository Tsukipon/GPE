import React, { useState, useEffect } from "react";
import { InfluxDB } from "@influxdata/influxdb-client";
import ReactApexChart from 'react-apexcharts';
import CurrencySelectionModal from "./CurrencySelectionModal";

const token = "ai-IvnQlIBcemj05UH-50Z-wLYvUhk3bHVwSLBlUpTyvqtENM0jTS_0zxYUyJKeiZqMg-u_EaVgMQgmWKDssmg==";
const org = "GPE";
const url = "http://localhost:8086/";



export const CandlestickChart = ({selectedContent,width,height}) => {
  const [dataOpen, setDataOpen] = useState([]);
  const [dataClose, setDataClose] = useState([]);
  const [dataHigh, setDataHigh] = useState([]);
  const [dataLow, setDataLow] = useState([]);
  const [series, setSeries] = useState([{data:[]}]);
  
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

  const [options,setOptions] = useState({
    chart: {
      type: 'candlestick',
      height: 350
    },
    title: {
      text: 'CandleStick Chart',
      align: 'left'
    },
    xaxis: {
      type: 'datetime'
    },
    yaxis: {
      tooltip: {
        enabled: true
      },
    }
  });

  function fetchData(){
    if(selectedCurrency){
      let queryOpen = `from(bucket: "PRICES")
    |> range(start: -30m)
    |> filter(fn: (r) => r["_measurement"] == "${selectedCurrency+"_BID"}")
    |> filter(fn: (r) => r["_field"] == "bid")
    |> aggregateWindow(every: 30s, fn: first)
    |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
    |> yield(name: "results")
      `;

      let queryClose = `from(bucket: "PRICES")
      |> range(start: -30m)
      |> filter(fn: (r) => r["_measurement"] == "${selectedCurrency+"_BID"}")
      |> filter(fn: (r) => r["_field"] == "bid")
      |> aggregateWindow(every: 30s, fn: last)
      |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
      |> yield(name: "results")
      `;

      let queryHigh =  `from(bucket: "PRICES")
      |> range(start: -30m)
      |> filter(fn: (r) => r["_measurement"] == "${selectedCurrency+"_BID"}")
      |> filter(fn: (r) => r["_field"] == "bid")
      |> aggregateWindow(every: 30s, fn: max)
      |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
      |> yield(name: "results")
      `;

      let queryLow =  `from(bucket: "PRICES")
      |> range(start: -30m)
      |> filter(fn: (r) => r["_measurement"] == "${selectedCurrency+"_BID"}")
      |> filter(fn: (r) => r["_field"] == "bid")
      |> aggregateWindow(every: 30s, fn: min)
      |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
      |> yield(name: "results")
      `;
        let res = [];
        const influxQuery = async () => {
          //create InfluxDB client
          const queryApi = await new InfluxDB({ url, token }).getQueryApi(org);
          //make query
          queryApi.queryRows(queryOpen, {
            next(row, tableMeta) {
              const o = tableMeta.toObject(row);
              //push rows from query into an array object
              res.push(o);
            },
            complete() {
              let finalData = []
              for (let i = 0; i < res.length; i++) {
                let point = {};
                point["bid"] = res[i]["bid"];
                point["date"] = new Date(res[i]["_time"]);
                finalData.push(point);
              }
              console.log("open :",finalData);
              setDataOpen(finalData);
              res=[];
            },
            error(error) {
              console.log("query failed- ", error);
            }
          });
          queryApi.queryRows(queryClose, {
            next(row, tableMeta) {
              const o = tableMeta.toObject(row);
              //push rows from query into an array object
              res.push(o);
            },
            complete() {
              let finalData = []
              for (let i = 0; i < res.length; i++) {
                let point = {};
                point["bid"] = res[i]["bid"];
                point["date"] = new Date(res[i]["_time"]);
                finalData.push(point);
              }
              console.log("close :",finalData);
              setDataClose(finalData);
              res=[];
            },
            error(error) {
              console.log("query failed- ", error);
            }
          });
          queryApi.queryRows(queryHigh, {
            next(row, tableMeta) {
              const o = tableMeta.toObject(row);
              //push rows from query into an array object
              res.push(o);
            },
            complete() {
              let finalData = []
              for (let i = 0; i < res.length; i++) {
                let point = {};
                point["bid"] = res[i]["bid"];
                point["date"] = new Date(res[i]["_time"]);
                finalData.push(point);
              }
              console.log("High :",finalData);
              setDataHigh(finalData);
              res=[];
            },
            error(error) {
              console.log("query failed- ", error);
            }
          });
          queryApi.queryRows(queryLow, {
            next(row, tableMeta) {
              const o = tableMeta.toObject(row);
              //push rows from query into an array object
              res.push(o);
            },
            complete() {
              let finalData = []
              for (let i = 0; i < res.length; i++) {
                let point = {};
                point["bid"] = res[i]["bid"];
                point["date"] = new Date(res[i]["_time"]);
                finalData.push(point);
              }
              console.log("Low :",finalData);
              setDataLow(finalData);
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

  const buildSeries = () => {
    //console.log("current dataOpen: ", dataOpen);
    const data = [];
    for(let i = 0; i < dataOpen.length-1; i++) {
      if(dataHigh[i].bid < dataLow[i].bid){
        console.log("error in dataHigh and dataLow");
      }
      data.push({x:dataOpen[i].date,y:[dataOpen[i].bid,dataHigh[i].bid,dataLow[i].bid,dataClose[i].bid]});
    }
    setSeries([{data:data}]); 
    const min = Math.min(...data.map((item) => {if (item.y[2]) {return item.y[2]} else return Infinity }));
    const max = Math.max(...data.map((item) => {if (item.y[1]) {return item.y[1]} else return -Infinity }));
    setOptions({...options,yaxis:{min:min,max:max}});
  } 

  useEffect(() => {
    fetchData();
  }, [selectedCurrency]);

  useEffect(() => {
    const interval = setTimeout(() => {
      buildSeries();
  }, 500);
  
  return () => {
      clearTimeout(interval);
  };
  }, [series]);



  return (
    <div>
      <CurrencySelectionModal showCurrencyDialog={showCurrencyDialog}
             handleClose={handleClose} setSelectedCurrency={setSelectedCurrency} confirmSelection={confirmSelection}/>


      {selectedCurrency && <div>
      <h1>Candlestick Chart : {selectedCurrency}</h1>
      <ReactApexChart options={options} series={series} type="candlestick" height={height} width={width}/>

        </div>}
    </div>
  );
};