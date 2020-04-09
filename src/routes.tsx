import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import HomePage from './pages/home';
import SettingsPage from './pages/settings';

export default function Routes() {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <HomePage />
        </Route>
        <Route path="/settings/">
          <SettingsPage />
        </Route>
        <Route component={() => <h1>404.. This page is not found!</h1>} />
      </Switch>
    </Router>
  );
}
