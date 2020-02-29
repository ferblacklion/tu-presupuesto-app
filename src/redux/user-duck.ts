import { IUser } from '../definition/IUser';
import { loginWithGoogle } from '../services/firebase';
import { Dispatch, Store } from 'redux';

/**
 * CONSTANTS
 */
export interface IUserState {
  loggedIn: boolean;
  userData: IUser | null;
  fetching: boolean;
}
const initialState: IUserState = {
  loggedIn: false,
  userData: null,
  fetching: false
};
const LOGGED_IN = 'LOGGED_IN';
const LOGGED_OUT = 'LOGGED_OUT';
const LOGGED_IN_SUCCESS = 'LOGGED_IN_SUCCESS';
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
  };
}

interface LoggedInSuccessAction {
  type: typeof LOGGED_IN_SUCCESS;
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
      return { ...state, fetching: true };
    case LOGGED_IN_SUCCESS:
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
        error: action.payload.error
      };
    default:
      return { ...state };
  }
}

function saveStore(data: any) {
  console.log(data);

  localStorage.setItem('user', JSON.stringify(data));
}
/**
 * ACTIONS (ACTION CREATORS)
 */

export const loginUserAction = () => (
  dispatch: Dispatch,
  getState: () => Store
) => {
  dispatch({ type: LOGGED_IN });
  return loginWithGoogle()
    .then(user => {
      const userData: IUser = {
        uid: user?.uid,
        displayName: user?.displayName,
        photoURL: user?.photoURL,
        email: user?.email
      };

      dispatch({ type: LOGGED_IN_SUCCESS, payload: { userData } });
      saveStore(getState());
    })
    .catch(e => {
      console.log(e.message);
      dispatch({ type: LOGGED_IN_ERROR, payload: { error: e.message } });
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
