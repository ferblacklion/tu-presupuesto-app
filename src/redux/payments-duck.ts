import { Dispatch } from 'redux';
import {
  savePaymentsService,
  getUserPaymentService,
  deletePaymentService,
  getUserPaymentDefaultService
} from '../services/firebase';
import { firestore } from 'firebase';
import { sortFunByIsDefault } from '../utils/sort-by-is-default';

export const initialState: IPayments = {
  payments: []
};
/**
 * CONSTANTS
 */
export const SAVE_PAYMENT = 'SAVE_PAYMENT';
export const GET_PAYMENT = 'GET_PAYMENT';
export const DELETE_PAYMENT = 'DELETE_PAYMENT';
export declare interface IPayment {
  id?: string;
  name: string;
  cost: number;
  isDefault: boolean;
  datetime: firestore.Timestamp;
}
export declare interface IPayments {
  payments: IPayment[];
}

export interface ISavePaymentAction {
  type: typeof SAVE_PAYMENT;
  payload: IPayment;
}

export interface IGetPaymentAction {
  type: typeof GET_PAYMENT;
  payload: IPayments;
}

export interface IDeletePaymentAction {
  type: typeof DELETE_PAYMENT;
  payload: { id: string };
}

type paymentsActionsTypes =
  | ISavePaymentAction
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
      return { ...state, payments: [...state.payments, action.payload] };
    case GET_PAYMENT:
      return { ...action.payload };
    case DELETE_PAYMENT:
      const paymentsFiltered = state.payments.filter(
        (payment: IPayment) => payment.id !== action.payload.id
      );
      //console.log('delete', action.payload.id);
      return { payments: [...paymentsFiltered] };
    default:
      return { ...state };
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

export const getPaymentsAction = (
  userId: string,
  cutOffDate: number,
  onlyDefault = false
) => (dispatch: Dispatch) => {
  if (!onlyDefault) {
    return getUserPaymentDefaultService(userId)
      .then(dataResponse => {
        const payments: IPayments =
          dataResponse !== undefined && Object.keys(dataResponse).length > 0
            ? dataResponse
            : { payments: [] };
        return payments;
      })
      .then(defaultPayments => {
        getUserPaymentService(userId, cutOffDate).then(res => {
          const payments: IPayments =
            res !== undefined && Object.keys(res).length > 0
              ? { payments: [...defaultPayments.payments, ...res.payments] }
              : { payments: [...defaultPayments.payments] };
          console.log('get payments actions  --- ', payments);
          dispatch({ type: GET_PAYMENT, payload: payments });
        });
      })
      .catch(e => {
        console.log(e.message);
      });
  }

  return getUserPaymentDefaultService(userId)
    .then(dataResponse => {
      const payments: IPayments =
        dataResponse !== undefined && Object.keys(dataResponse).length > 0
          ? dataResponse
          : { payments: [] };
      payments.payments.sort(sortFunByIsDefault);
      console.log('get payments actions --- ', payments);
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
