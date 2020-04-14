import { RootState } from './store';
import { getUserStorage } from '../utils';
import { IUserState } from '../definition/IUserState';
import { ISettingsState } from '../definition/ISettingsState';
import { IPayments } from '../definition/IPayment';

const userSaved = getUserStorage('userData');

export const initialUserState: IUserState = {
  loggedIn: userSaved ? true : false,
  userData: userSaved ? userSaved.userData : null,
  fetching: false,
  error: ''
};

export const initialSettingsState: ISettingsState = {
  totalAmount: 0,
  cutOffDate: 0,
  success: false
};

export const initialPaymentState: IPayments = {
  payments: []
};

const initialState: RootState = {
  user: initialUserState,
  payments: initialPaymentState,
  settings: initialSettingsState
};

export default initialState;
