import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import { Provider } from "react-redux";

import "./index.css";
import store from "./Redux/Store/index";

/* import {LoadingAlert} from './Common'; */
import { Routers } from "./Router/Routers";
import { ToastContainer } from 'react-toastify';
import { ForgotPassword, ResetPassword } from "./Component/Users";
ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <ToastContainer />
      <Switch>
        <Route path="/reset" component={ResetPassword} />
        <Route path="/forgot" component={ForgotPassword} />
        <Route path="/" component={Routers} />
      </Switch>
    </BrowserRouter>
    {/* <LoadingAlert /> */}
  </Provider>,
  document.getElementById('root')
);
