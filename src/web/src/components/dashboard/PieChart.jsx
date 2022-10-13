import '../styles/Dashboard.css';
import { useState} from "react";
import { GetListAlert } from "../../store/reducers/alert.reducer";
import { useDispatch } from "react-redux";
import ReactApexChart from 'react-apexcharts';


const PieChartComponent = () => {
    const dispatch = useDispatch();
    const [data, setData] = useState(null);

    dispatch(GetListAlert()).then(request =>{
        let active =0;
        let inactive =0;
        if(!data) {
          for(let item of request.value.data){
            if(item.is_active === true){
              active++;
          }else{
              inactive++;
          }
          }
          setData([active,inactive]);
        }
      });
    
    const options = {
        colors:['#074ef2', '#ed6b61'],
        chart: {
            width: 380,
            type: 'pie',
          },
          labels: ['Alertes activées', 'Alertes désactivées'],
          responsive: [{
            breakpoint: 480,
            options: {
              chart: {
                width: 200
              },
              legend: {
                position: 'left',
                fontSize: '50px',
                fontWeight: 400,
                
              }
            }
          }]
    };
    return (
        <div>  
            <ReactApexChart options={options} series={data} type="pie" width={450} />

        </div>
    )
}

export default PieChartComponent;
