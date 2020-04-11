import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import HomePage from './pages/home';
import SettingsPage from './pages/settings';
import Login from './pages/login';
import Logout from './pages/logout';

export default function Routes() {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <HomePage />
        </Route>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/logout">
          <Logout />
        </Route>
        <Route path="/settings">
          <SettingsPage />
        </Route>
        <Route component={() => <h1>404.. This page is not found!</h1>} />
      </Switch>
    </Router>
  );
}
