import { IUser } from '../definition/IUser';
import { loginWithGoogle } from '../services/firebase';
import { Dispatch, Store } from 'redux';
import { saveStore, getUserStorage } from '../utils';

/**
 * CONSTANTS
 */
export interface IUserState {
  loggedIn: boolean;
  userData: IUser | null;
  fetching: boolean;
  error: string;
}
const initialState: IUserState = {
  loggedIn: false,
  userData: null,
  fetching: false,
  error: ''
};
const LOGGED_IN = 'LOGGED_IN';
const LOGGED_OUT = 'LOGGED_OUT';
const LOGGED_IN_SUCCESS = 'LOGGED_IN_SUCCESS';
const LOGGED_WAS_SUCCESS = 'LOGGED_WAS_SUCCESS';
const LOGGED_IN_ERROR = 'LOGGED_IN_ERROR';

interface LoggedInAction {
  type: typeof LOGGED_IN;
  payload: {
    fetching: true;
  };
}

interface LoggedInErrorAction {
  type: typeof LOGGED_IN_ERROR;
  payload: {
    fetching: boolean;
    error: string;
    loggedIn: boolean;
  };
}

interface LoggedInSuccessAction {
  type: typeof LOGGED_IN_SUCCESS | typeof LOGGED_WAS_SUCCESS;
  payload: {
    userData: IUser;
    fetching: false;
  };
}
interface LoggedOutAction {
  type: typeof LOGGED_OUT;
  payload: {
    timestamp: number;
  };
}
type LoginActionTypes =
  | LoggedInSuccessAction
  | LoggedOutAction
  | LoggedInAction
  | LoggedInErrorAction;

/**
 * REDUCERS
 * @param state
 * @param action
 */
export default function reducer(
  state = initialState,
  action: LoginActionTypes
) {
  switch (action.type) {
    case LOGGED_IN:
      return { ...state, fetching: true, loggedIn: false };
    case LOGGED_IN_SUCCESS:
    case LOGGED_WAS_SUCCESS:
      return {
        ...state,
        userData: action.payload.userData,
        fetching: false,
        loggedIn: true
      };
    case LOGGED_IN_ERROR:
      return {
        ...state,
        fetching: false,
        loggedIn: false,
        error: action.payload.error
      };
    default:
      return { ...state };
  }
}

/**
 * ACTIONS (ACTION CREATORS)
 */

/**
 * loginUserAction
 */
export const loginUserAction = () => (
  dispatch: Dispatch,
  getState: () => Store
) => {
  return loginWithGoogle()
    .then(user => {
      const userData = {
        uid: user?.uid,
        displayName: user?.displayName,
        photoURL: user?.photoURL,
        email: user?.email
      };

      dispatch({ type: LOGGED_IN_SUCCESS, payload: { userData } });
      const state: any = getState();
      saveStore(state.user, 'userData');
    })
    .catch(e => {
      console.log(e.message);
      dispatch({ type: LOGGED_IN_ERROR, payload: { error: e.message } });
    });
};

/**
 * loginFromStoreAction action
 */
export const loginFromStoreAction = () => (dispatch: Dispatch) => {
  dispatch({ type: LOGGED_IN });
  const userSaved = getUserStorage('userData');

  if (Object.keys(userSaved).length) {
    return Promise.resolve(userSaved.userData).then(user => {
      const userData: IUser = {
        uid: user?.uid,
        displayName: user?.displayName,
        photoURL: user?.photoURL,
        email: user?.email
      };

      dispatch({ type: LOGGED_IN_SUCCESS, payload: { userData } });
    });
  }
  return Promise.reject().catch(() => {
    dispatch({
      type: LOGGED_IN_ERROR,
      payload: { error: 'waiting for login' }
    });
  });
};

/**
 * THUNKS
 */
// side effects, only as applicable
// e.g. thunks, epics, etc
export function getUser() {
  return;
}
