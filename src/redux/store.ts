import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import userReducer from './user-duck';
import settingsReducer from './settings-duck';
import { IUser } from '../definition/IUser';
import { ISettings } from '../definition/ISettings';
import { IPayments } from './payments-duck';
import paymentsReducer from './payments-duck';
import reduxImmutableStateInvariant from 'redux-immutable-state-invariant';

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}
export interface IStore {
  user: IUser;
  settings: ISettings;
  payments: IPayments;
}
const rootReducer = combineReducers({
  user: userReducer,
  settings: settingsReducer,
  payments: paymentsReducer
});
export type RootState = ReturnType<typeof rootReducer>;

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default function generateStore() {
  return createStore(
    rootReducer,
    composeEnhancers(applyMiddleware(reduxImmutableStateInvariant(), thunk))
  );
}
export function generateStoreProd() {
  return createStore(rootReducer, applyMiddleware(thunk));
}
