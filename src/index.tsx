import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import Routes from './routes';
import { Provider } from 'react-redux';
import generateStore from './redux/store';
import initialState from './redux/initialState';
import './static/assets/css/style.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

toast.configure({
  autoClose: 5000,
  draggable: false
});

const store = generateStore(initialState);

const WithStore = () => (
  <Provider store={store}>
    <Routes />
  </Provider>
);

ReactDOM.render(<WithStore />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
