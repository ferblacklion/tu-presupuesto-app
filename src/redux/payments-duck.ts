import { Dispatch } from 'redux';
import {
  savePaymentsService,
  getUserPaymentService,
  deletePaymentService,
  getUserPaymentDefaultService
} from '../services/firebase';
import { initialPaymentState } from './initialState';
import { IPayment, IPayments } from '../definition/IPayment';

/**
 * CONSTANTS
 */
export const SAVE_PAYMENT = 'SAVE_PAYMENT';
export const GET_PAYMENT = 'GET_PAYMENT';
export const GET_PAYMENT_DEFAULT = 'GET_PAYMENT_DEFAULT';
export const DELETE_PAYMENT = 'DELETE_PAYMENT';

export interface ISavePaymentAction {
  type: typeof SAVE_PAYMENT;
  payload: IPayment;
}

export interface IGetPaymentAction {
  type: typeof GET_PAYMENT;
  payload: IPayments;
}

export interface IGetPaymentDefaultAction {
  type: typeof GET_PAYMENT_DEFAULT;
  payload: IPayments;
}

export interface IDeletePaymentAction {
  type: typeof DELETE_PAYMENT;
  payload: { id: string };
}

type paymentsActionsTypes =
  | ISavePaymentAction
  | IGetPaymentAction
  | IGetPaymentDefaultAction
  | IDeletePaymentAction;

/**
 * REDUCERS
 * @param state
 * @param action
 */
export default function reducer(
  state = initialPaymentState,
  action: paymentsActionsTypes
) {
  switch (action.type) {
    case SAVE_PAYMENT:
      return { ...state };
    case GET_PAYMENT:
      return { payments: [...state.payments, ...action.payload.payments] };
    case GET_PAYMENT_DEFAULT:
      return { ...action.payload };
    case DELETE_PAYMENT:
      const paymentsFiltered = state.payments.filter(
        (payment: IPayment) => payment.id !== action.payload.id
      );
      return { payments: [...paymentsFiltered] };
    default:
      return state;
  }
}

/**
 * ACTIONS
 */

export const savePaymentAction = (userId: string, payment: IPayment) => (
  dispatch: Dispatch
) => {
  return savePaymentsService(userId, payment)
    .then(function() {
      dispatch({ type: SAVE_PAYMENT, payload: payment });
    })
    .catch(function(error) {
      console.error('Error writing document: ', error);
    });
};

export const getPaymentsDefaultAction = (userId: string) => (
  dispatch: Dispatch
) => {
  return getUserPaymentDefaultService(userId)
    .then(dataResponse => {
      const payments: IPayments =
        dataResponse !== undefined && Object.keys(dataResponse).length > 0
          ? dataResponse
          : { payments: [] };

      //console.log('get payments default actions --- ', payments);
      dispatch({ type: GET_PAYMENT_DEFAULT, payload: payments });
    })
    .catch(e => {
      console.log(e.message);
    });
};

export const getPaymentsAction = (userId: string, cutOffDate: number) => (
  dispatch: Dispatch
) => {
  return getUserPaymentService(userId, cutOffDate)
    .then(res => {
      const payments: IPayments =
        res !== undefined && Object.keys(res).length > 0
          ? res
          : { payments: [] };

      //console.log('get payments actions  --- ', payments);
      dispatch({ type: GET_PAYMENT, payload: payments });
    })
    .catch(e => {
      console.log(e.message);
    });
};

export const deletePaymentsAction = (paymentId: string, userId = '') => (
  dispatch: Dispatch
) => {
  return deletePaymentService(paymentId, userId).then(() => {
    dispatch({ type: DELETE_PAYMENT, payload: { id: paymentId } });
  });
};
