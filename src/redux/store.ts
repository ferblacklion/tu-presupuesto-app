import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import userReducer from './user-duck';
import settingsReducer from './settings-duck';

import paymentsReducer from './payments-duck';
import reduxImmutableStateInvariant from 'redux-immutable-state-invariant';

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}

const rootReducer = combineReducers({
  user: userReducer,
  payments: paymentsReducer,
  settings: settingsReducer
});
export type RootState = ReturnType<typeof rootReducer>;

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default function generateStore(initialState: RootState) {
  return createStore(
    rootReducer,
    initialState,
    composeEnhancers(applyMiddleware(reduxImmutableStateInvariant(), thunk))
  );
}
export function generateStoreProd() {
  return createStore(rootReducer, applyMiddleware(thunk));
}
