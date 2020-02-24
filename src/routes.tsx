import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from './pages/home';

export default function Routes() {
  return (
    <Router forceRefresh={true}>
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route component={() => <h1>404.. This page is not found!</h1>} />
      </Switch>
    </Router>
  );
}
