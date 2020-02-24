import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import userReducer from './user-duck';
declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}
const rootReducer = combineReducers({ user: userReducer });

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default function generateStore() {
  return createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)));
}
export function generateStoreProd() {
  return createStore(rootReducer, applyMiddleware(thunk));
}
