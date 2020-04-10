import { RootState } from './store';
import { getStorage } from '../utils';
import { IUserState } from './user-duck';

const savedUser = getStorage('userData');

const user: IUserState = {
  loggedIn: savedUser ? true : false,
  userData: savedUser ? savedUser.user?.userData : null,
  fetching: false,
  error: ''
};

const initialState: RootState = {
  user: user,
  settings: {
    totalAmount: 0,
    cutOffDate: 0,
    success: false
  },
  payments: {
    payments: []
  }
};

export default initialState;
