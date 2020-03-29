import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import Routes from './routes';
import { Provider } from 'react-redux';
import generateStore from './redux/store';

const WithStore = () => (
  <Provider store={generateStore()}>
    <Routes />
  </Provider>
);

ReactDOM.render(<WithStore />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
