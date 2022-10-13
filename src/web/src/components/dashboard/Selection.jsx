import CandlestickChartIcon from '@mui/icons-material/CandlestickChart';
import StackedLineChartIcon from '@mui/icons-material/StackedLineChart';
import PieChartIcon from '@mui/icons-material/PieChart';
import DonutLargeIcon from '@mui/icons-material/DonutLarge';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import LoyaltyIcon from '@mui/icons-material/Loyalty';
import FlutterDashIcon from '@mui/icons-material/FlutterDash';
import EuroIcon from '@mui/icons-material/Euro';
import { CircleMenu, CircleMenuItem} from "react-circular-menu";


import '../styles/Dashboard.css';



const Selection = ({selectedContent}) => {

    return(
        <div>
          <CircleMenu
          className="load-button"
          startAngle={-90}
          rotationAngle={360}
          itemSize={2}
          radius={5}
          rotationAngleInclusive={false}
          >
            
            <CircleMenuItem
              tooltip="Miscellaneous"
            >
              <CircleMenu
              className="load-button"
              startAngle={-150}
              rotationAngle={180}
              itemSize={2}
              radius={5}
              rotationAngleInclusive={false}
              >
                <CircleMenuItem
                onClick={() => selectedContent(10)}
                tooltip="Gains"
                >
                <EuroIcon />
                </CircleMenuItem> 
                
                <CircleMenuItem
                onClick={() => selectedContent(9)}
                tooltip="Followers"
                >
                <LoyaltyIcon />
                </CircleMenuItem>

                <CircleMenuItem
                onClick={() => selectedContent(8)}
                tooltip="Tweeter"
                >
                <FlutterDashIcon />
                </CircleMenuItem> 

                


              </CircleMenu>
              
            </CircleMenuItem> 
          

            <CircleMenuItem
              onClick={() => selectedContent(1)}
              tooltip="Statistiques sur paires de devises"
            >
              <DonutLargeIcon />
            </CircleMenuItem> 

            <CircleMenuItem
              onClick={() => selectedContent(2)}
              

              tooltip="Currency pair"
            >
              <CurrencyExchangeIcon />
            </CircleMenuItem> 

            <CircleMenuItem
              onClick={() => selectedContent(3)}
              tooltip="Candlestick Chart"
            >
              <CandlestickChartIcon />
            </CircleMenuItem>

            <CircleMenuItem 
              onClick={() => selectedContent(5)}
              tooltip="Line Chart"
            >
              <StackedLineChartIcon />
            </CircleMenuItem>

            <CircleMenuItem 
              onClick={() => selectedContent(6)}
              tooltip="Pie Chart"
            >
              <PieChartIcon />
            </CircleMenuItem>


          </CircleMenu>


          




        </div>
    );


}
export default Selection;