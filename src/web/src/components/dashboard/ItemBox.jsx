import { useState } from "react";
import SelectionComponent from "./Selection";
import CurrencyComponent from "./Currency";
import {LineChart}  from "./LineChart";
import FollowerComponent from "./Follower";
import EarningsComponent from "./Earnings";
import CurrencyStatisticsComponent from "./CurrencyStatistics";
import PieChartComponent from "./PieChart";
import { CandlestickChart } from "./CandlestickChart";
import '../styles/Dashboard.css';

const ItemBox = ({width,height}) =>{
    
    const [contentType, setContentType] = useState (0);


    const selectedContent = (typeId) => {
        console.log(typeId);
        setContentType(typeId);
    }

    return(
        <div className="item-content" >
            { contentType === 0 && <SelectionComponent selectedContent={selectedContent}/>}
            { contentType === 1 && <CurrencyStatisticsComponent selectedContent={selectedContent}/>}
            { contentType === 2 && <CurrencyComponent selectedContent={selectedContent}/>}
            { contentType === 3 && <CandlestickChart selectedContent={selectedContent} width={width} height={height} />}
            { contentType === 4 && <div>Bar Chart</div>}
            { contentType === 5 &&  <LineChart selectedContent={selectedContent} width={width} height={height} />}
            { contentType === 6 && <PieChartComponent selectedContent={selectedContent}/>}
            { contentType === 7 && <div>Waterfall Chart</div>}
            { contentType === 8 && <div>Twitter Component</div>}
            { contentType === 9 && <FollowerComponent />}
            { contentType === 10 && <EarningsComponent />}
            


        </div>
    )
}
export default ItemBox;