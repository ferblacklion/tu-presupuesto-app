import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import userReducer from './user-duck';
import { IUser } from '../definition/IUser';
declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}
export interface IStore {
  user: IUser;
}
const rootReducer = combineReducers({ user: userReducer });
export type RootState = ReturnType<typeof rootReducer>;

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default function generateStore() {
  return createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)));
}
export function generateStoreProd() {
  return createStore(rootReducer, applyMiddleware(thunk));
}
