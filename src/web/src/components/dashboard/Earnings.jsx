import '../styles/Dashboard.css';
import { useState} from "react";
import { GetFollowers } from "../../store/reducers/user.reducer";
import { useDispatch } from "react-redux";

const EarningsComponent = () => {
    const dispatch = useDispatch();
    const [data, setData] = useState(null);
    dispatch(GetFollowers()).then(request => {
        if (!data) {
            setData(request.value.data.length);
        }
    });
    return (
        <div>
            <div className="currency-content">
            <span className="currency-name"> Gains : </span>
                <div className="currency-data">
                    <span className="main-value" style={{color: "green"}}> {data*2} </span>
                    <span> € / mois</span>
                </div>
            </div> 
        </div>
    )
}

export default EarningsComponent;


