import axios from "axios";
import { AppToaster } from "../../components/Toaster";

const CREATE_ACTION = "CREATE_ACTION"
const GET_ALL_ACTION = "GET_ALL_ACTION"
const GET_FOLLOWED_ALERTS_ACTION = "GET_FOLLOWED_ACTION"
const MODIFY_ACTION = "MODIFY_ACTION"
const DELETE_ACTION = "DELETE_ACTION"


const initialState = {
  alerts : [],
}


export const createAlerte = (name, alerting_device, expire, expiration_date,
  currency_pair, is_active, description ,condition,conditionType,conditionValue,privacy_level) => {
  const token = localStorage.getItem("token");
  if(expire){
    const request = axios({
      method: "post",
      url: `http://localhost:8000/alert/`,
      headers: {
        Authorization: `Token ${token}`,
      },
      data: {
        alert_name: name, currency_pair: currency_pair, alerting_device: alerting_device,
        expire: expire, expiration_date: expiration_date, is_active: is_active, description: description,
        privacy_level: privacy_level,
        triggers : [
          {
            trigger_type: condition,
            trigger_condition: conditionType,
            value: conditionValue,
            is_active: true
          }
        ]
      }
    });
    return {
      type: CREATE_ACTION,
      payload: request,
    };
  }
  else{
    const request = axios({
      method: "post",
      url: `http://localhost:8000/alert/`,
      headers: {
        Authorization: `Token ${token}`,
      },
      data: {
        alert_name: name, currency_pair: currency_pair,
        alerting_device: alerting_device,
        expire: expire, is_active: is_active, description: description,protection_level: privacy_level,
        triggers : [
          {
            trigger_type: condition,
            trigger_condition: conditionType,
            value: conditionValue,
            is_active: true
          }
        ]

        
      }
    });
    return {
      type: CREATE_ACTION,
      payload: request,
    };
  }
  

  
};


export const GetListAlert = () => {
  const token = localStorage.getItem("token");
  const request = axios({
    method: "get",
    url: `http://localhost:8000/alerts/`,
    headers: {
      Authorization: `Token ${token}`,
    }
  });

  return {
    type: GET_ALL_ACTION,
    payload: request,
  };
}

export const GetListFollowedAlert = () => {
  const token = localStorage.getItem("token");
  const request = axios({
    method: "get",
    url: `http://localhost:8000//alerts_followed`,
    headers: {
      Authorization: `Token ${token}`,
    }
  });

  return {
    type: GET_FOLLOWED_ALERTS_ACTION,
    payload: request,
  };
}


export const ModifyAlert = (alert) => {
  console.log("//",alert)
  // S'accorder avec alex pour améliorer la modification
  //const expiration = alert.expiration_date.split(" ")[0];
  const token = localStorage.getItem("token");
  const request = axios({
    method: "put",
    url: `http://localhost:8000/alert/`,
    headers: {
      Authorization: `Token ${token}`,
    },
    data: {
      alert_name: alert.alert_name,
      protection_level: alert.protection_level,
      currency_pair: alert.currency_pair_id,
      alerting_device: alert.alerting_device,
      expire: alert.expire,
      is_active: alert.is_active, 
      description: alert.description,
      triggers : alert.triggers
    }
  });

  return {
    type: MODIFY_ACTION,
    payload: request,
  };
};






export const DeleteAlert = (alertName) => {
  const token = localStorage.getItem("token");
  const request = axios({
    method: "delete",
    url: `http://localhost:8000/alert/`,
    headers: {
      Authorization: `Token ${token}`,
    },
    data: {
      alert_name: alertName
    }
  });

  return {
    type: MODIFY_ACTION,
    payload: request,
  };

};


const updateState = (state,alert) => {
  for(const a of state.alerts){
    if(a.alert_name === alert.alert_name){
      a.is_active = alert.is_active
    }
  }
};



export default function alertReducer(state = initialState, action) {
  switch(action.type){
    case `${CREATE_ACTION}_FULFILLED`: 
        return state
    
    case `${CREATE_ACTION}_PENDING`:
      return state;

    case `${CREATE_ACTION}_REJECTED`:
      {
        let message = `${action.payload}`;
        AppToaster.show({ message: message, intent: "danger" });
      }
      return state;
    
    case `${GET_ALL_ACTION}_FULFILLED`: 
      state.alerts = action.payload.data
      return state;
    
    case `${GET_ALL_ACTION}_PENDING`:
      return state;
    case `${GET_ALL_ACTION}_REJECTED`:
      {
        let message = `${action.payload}`;
        AppToaster.show({ message: message, intent: "danger" });
      }
      return state;


    case `${MODIFY_ACTION}_FULFILLED`: 
        updateState(state,action.payload.data)
        return state;
    
    case `${MODIFY_ACTION}_PENDING`:
        return state;
    case `${MODIFY_ACTION}_REJECTED`:
        {
          let message = `${action.payload}`;
          AppToaster.show({ message: message, intent: "danger" });
        }
        return state;


    case `${DELETE_ACTION}_FULFILLED`: 
        return state;

    case `${DELETE_ACTION}_PENDING`:
        return state;
    case `${DELETE_ACTION}_REJECTED`:
        {
          let message = `${action.payload}`;
          AppToaster.show({ message: message, intent: "danger" });
        }
        return state;

    case `${GET_FOLLOWED_ALERTS_ACTION}_FULFILLED`: 
      state.followed_alerts = action.payload.data
      return state;
    
    case `${GET_FOLLOWED_ALERTS_ACTION}_PENDING`:
      return state;
    case `${GET_FOLLOWED_ALERTS_ACTION}_REJECTED`:
      {
        let message = `${action.payload}`;
        AppToaster.show({ message: message, intent: "danger" });
      }
        return state;

    default: 
        return state;
    }
  }

  export const getAlerts = state => state.alerts;



    