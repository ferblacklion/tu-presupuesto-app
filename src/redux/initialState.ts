import { RootState } from './store';
import { getStorage } from '../utils';
import { IUserState } from './user-duck';

const userSaved = getStorage('userData');

const user: IUserState = {
  loggedIn: userSaved ? true : false,
  userData: userSaved ? userSaved.userData : null,
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
