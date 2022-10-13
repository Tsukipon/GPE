import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { Provider } from "react-redux";
import { applyMiddleware, createStore } from "redux";
import thunk from "redux-thunk";
import promise from "redux-promise-middleware";
import { routerMiddleware } from "connected-react-router";
import { ConnectedRouter } from "connected-react-router";
import { createBrowserHistory } from "history";
import createRootReducer from "./store/reducers";
export const history = createBrowserHistory();

const store = createStore(
  createRootReducer(history),
  {},
  applyMiddleware(routerMiddleware(history), promise, thunk)
);

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App />
    </ConnectedRouter>
  </Provider>,
  document.getElementById("root")
);
