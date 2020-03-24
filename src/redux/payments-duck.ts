import { Dispatch } from 'redux';
import {
  savePaymentsService,
  getUserPaymentService
} from '../services/firebase';

export const initialState: IPayments = {
  payments: []
};
/**
 * CONSTANTS
 */
export const SAVE_PAYMENT = 'SAVE_PAYMENT';
export const GET_PAYMENT = 'GET_PAYMENT';
export const ADD_PAYMENT = 'ADD_PAYMENT';
export const DELETE_PAYMENT = 'DELETE_PAYMENT';
export declare interface IPayment {
  name: string;
  cost: number;
  isDefault: boolean;
  datetime: string;
}
export declare interface IPayments {
  payments: IPayment[];
}

export interface ISavePaymentAction {
  type: typeof SAVE_PAYMENT;
  payload: IPayments;
}

export interface IGetPaymentAction {
  type: typeof GET_PAYMENT;
  payload: IPayments;
}

export interface IAddPaymentAction {
  type: typeof ADD_PAYMENT;
  payload: IPayment;
}

export interface IDeletePaymentAction {
  type: typeof DELETE_PAYMENT;
  payload: { payment: IPayment };
}

type paymentsActionsTypes =
  | ISavePaymentAction
  | IAddPaymentAction
  | IGetPaymentAction
  | IDeletePaymentAction;

/**
 * REDUCERS
 * @param state
 * @param action
 */
export default function reducer(
  state = initialState,
  action: paymentsActionsTypes
) {
  switch (action.type) {
    case SAVE_PAYMENT:
      return { ...action.payload };
    case ADD_PAYMENT:
      return { ...state, payments: [...state.payments, action.payload] };
    case GET_PAYMENT:
      return { ...action.payload };
    case DELETE_PAYMENT:
      const paymentsFiltered = state.payments.filter(
        (payment: IPayment) => payment.cost !== action.payload.payment.cost && payment.name !== action.payload.payment.name
      );
      console.log('delete', paymentsFiltered);

      return { ...state, payments: paymentsFiltered };
    default:
      return { ...state };
  }
}

/**
 * ACTIONS
 */

export const savePaymentAction = (userId: string, payments: IPayments) => (
  dispatch: Dispatch
) => {
  return savePaymentsService(userId, payments)
    .then(function() {
      dispatch({ type: SAVE_PAYMENT, payload: payments });
      console.log('saved');
    })
    .catch(function(error) {
      console.error('Error writing document: ', error);
    });
};

export const addPaymentAction = (p: IPayment) => (dispatch: Dispatch) => {
  return Promise.resolve().then(() => {
    dispatch({ type: ADD_PAYMENT, payload: p });
  });
};

export const getPaymentsAction = (userId: string) => (dispatch: Dispatch) => {
  return getUserPaymentService(userId)
    .then(dataResponse => {
      const payments: IPayments =
        dataResponse !== undefined
          ? (dataResponse as IPayments)
          : { payments: [] };
      console.log('get payments actions --- ', payments);
      dispatch({ type: GET_PAYMENT, payload: payments });
    })
    .catch(e => {
      console.log(e.message);
    });
};

export const deletePaymentsAction = (payment: IPayment) => (dispatch: Dispatch) => {
  dispatch({ type: DELETE_PAYMENT, payload: { payment } });
};
