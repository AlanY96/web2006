/*
 * @Description: App组件 - 系统目录自带组件
 * @Author: 谢涛
 * @LastEditors: Please set LastEditors
 * @Date: 2019-04-22 19:13:58
 * @LastEditTime: 2020-02-20 18:32:27
 */

import React, { Component } from 'react';
import { message } from 'antd'
import './App.css';
import { Switch, Route, withRouter, Redirect } from 'react-router-dom'
import Login from './pages/Login'
import Index from './pages/Index'

message.config({
  top: 100,
  duration: 2,
  maxCount: 1,
});

function PrivateRoute({ component: RouteComponent, ...rest }) {
  return (
    <Route
      {...rest}
      render={props =>
        sessionStorage.getItem("isAuthenticated") || localStorage.getItem("isAuthenticated") ? (
          <RouteComponent {...props} />
        ) : (
            <Redirect
              to={{
                pathname: "/login",
                state: { from: props.location }
              }}
            />
          )
      }
    />
  );
}

class App extends Component {

  render() {

    return (
      <Switch>
        <Route path='/login' exact component={Login} />
        <PrivateRoute path='/' component={Index} />
      </Switch>
    );
  }
}

export default withRouter(App);