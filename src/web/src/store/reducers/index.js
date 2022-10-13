import { combineReducers } from "redux";
import userReducer from "./user.reducer";
import streamReducer from "./stream.reducer";
import { connectRouter } from "connected-react-router";
import alertReducer from "./alert.reducer";

const createRootReducer = (history) =>
  combineReducers({
    router: connectRouter(history),
    user: userReducer,
    alert: alertReducer,
    stream: streamReducer,
  });

export default createRootReducer;
