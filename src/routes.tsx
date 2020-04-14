import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import HomePage from './pages/home';
import SettingsPage from './pages/settings';
import Login from './pages/login';
import Logout from './pages/logout';

export enum ROUTES {
  LOGIN = '/',
  HOME = '/home/',
  LOGOUT = '/logout/',
  SETTINGS = '/settings/'
}
// TODO add auth routes

export default function Routes() {
  return (
    <Router>
      <Switch>
        <Route exact path={ROUTES.LOGIN}>
          <Login />
        </Route>
        <Route path={ROUTES.HOME}>
          <HomePage />
        </Route>
        <Route path={ROUTES.SETTINGS}>
          <SettingsPage />
        </Route>
        <Route path={ROUTES.LOGOUT}>
          <Logout />
        </Route>
        <Route component={() => <h1>404... This page is not found!</h1>} />
      </Switch>
    </Router>
  );
}
