// constants
const initialState = {
  loggedIn: false
};
const LOGGED_IN = 'LOGGED_IN';
const LOGGED_OUT = 'LOGGED_OUT';
interface LoggedInAction {
  type: typeof LOGGED_IN;
  payload: {};
}
interface LoggedOutAction {
  type: typeof LOGGED_OUT;
  payload: {
    timestamp: number;
  };
}
type LoginActionTypes = LoggedInAction | LoggedOutAction;

// Reducer
export default function reducer(
  state = initialState,
  action: LoginActionTypes
) {
  switch (action.type) {
    case LOGGED_IN:
      return state;

    default:
      return state;
  }
}

// actions (Action Creators)
export function loginUser() {
  return { type: LOGGED_IN };
}

// side effects, only as applicable
// e.g. thunks, epics, etc
export function getUser() {
  return;
}
