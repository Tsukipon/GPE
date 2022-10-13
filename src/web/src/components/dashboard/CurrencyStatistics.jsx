import '../styles/Dashboard.css';
import { useState} from "react";
import { GetListAlert } from "../../store/reducers/alert.reducer";
import { useDispatch } from "react-redux";
import ReactApexChart from 'react-apexcharts';

const CurrencyStatisticsComponent = () => {
    const dispatch = useDispatch();
    const [data, setData] = useState(null);
    const [options,setOptions] = useState({
      labels: []
    });

    dispatch(GetListAlert()).then(request =>{
        if(!data) {
          let currencies = {};
          for(let item of request.value.data){
            if(!currencies[item.currency_pair_id]){
              currencies[item.currency_pair_id] = 1;
            }else{
              currencies[item.currency_pair_id]++;
            }
          };
          setData(currencies);
          setOptions({
            labels: Object.keys(currencies),
          });
          console.log(currencies)
        }
      });

    return (
        <div>
            <ReactApexChart options={options} series={data && Object.values(data)} type="donut" width={400} />
        </div>
    )
}

export default CurrencyStatisticsComponent;
