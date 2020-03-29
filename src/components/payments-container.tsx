import React, { useRef } from 'react';
import NumberFormat from 'react-number-format';
import { IPayment, IPayments } from '../redux/payments-duck';
import { IUser } from '../definition/IUser';
import {
  getPaymentsAction,
  deletePaymentsAction,
  savePaymentAction
} from '../redux/payments-duck';
import { connect } from 'react-redux';
import formatCurrency from '../utils/format-currency';

import 'firebase/firestore';
import firebase from 'firebase/app';
import { ISettings } from '../definition/ISettings';

export declare interface IPaymentsContainer {
  title: string;
  user: IUser | null;
  payments: IPayments;
  settings: ISettings;
  deletePaymentsAction: (paymentId: string, userId: string) => Promise<void>;
  isDefaultData?: boolean;
  savePaymentAction: (userId: string, payment: IPayment) => Promise<void>;
  getPaymentsAction: (
    userId: string,
    cutOffDate: number,
    isDefault: boolean
  ) => Promise<void>;
}

function PaymentsContainer({
  title,
  user,
  payments,
  deletePaymentsAction,
  isDefaultData = false,
  savePaymentAction,
  getPaymentsAction,
  settings
}: IPaymentsContainer) {
  let costValueInput = '';
  const costNameInput = useRef<HTMLInputElement>(null);
  let costInput: any = null;

  const savePayments = () => {
    if (!user) return;
    const singlePayment: IPayment = {
      name: costNameInput?.current?.value || '',
      cost: !isNaN(Number(costInput.state.numAsString))
        ? Number(costInput.state.numAsString)
        : 0,
      isDefault: isDefaultData,
      datetime: firebase.firestore.Timestamp.fromDate(new Date())
    };

    if (singlePayment.name.trim() && singlePayment.cost > 0) {
      savePaymentAction(user.uid || '', singlePayment).then(() => {
        if (costNameInput.current) costNameInput.current.value = '';
        costValueInput = '';
        if (user?.uid) {
          console.log(settings);
          getPaymentsAction(user?.uid, settings.cutOffDate, isDefaultData);
        }
      });
    }
  };

  const deleteCostItem = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const id = e.currentTarget.getAttribute('data-id') || '';

    if (id) {
      deletePaymentsAction(id, user?.uid || '');
    }
  };

  let paymentsFiltered: IPayments = { payments: [] };

  if (payments !== undefined && payments.payments !== undefined) {
    paymentsFiltered.payments = payments.payments;
  }

  return (
    <div>
      <h2>{title}</h2>
      <p>
        <label htmlFor="cost-name">Nombre del gasto </label>
        <input
          minLength={3}
          ref={costNameInput}
          id="cost-name"
          type="text"
        />{' '}
        <br />
      </p>
      <p>
        <label htmlFor="cost">Precio </label>
        <NumberFormat
          ref={(el: any) => (costInput = el)}
          decimalScale={2}
          thousandSeparator={true}
          id="cost"
          prefix={'Q'}
          value={costValueInput}
          inputMode={'decimal'}
          allowNegative={false}
        />
      </p>
      <br />
      <p>
        <button onClick={savePayments}>+</button>
      </p>
      <br />
      <div>
        LISTA DE GASTOS
        <ul>
          {paymentsFiltered.payments.map((p, i: number) => (
            <li key={p.id || i}>
              {p.name} ===> {formatCurrency(p.cost)}{' '}
              <a
                href="/"
                data-name={p.name}
                data-id={p.id}
                data-cost={p.cost}
                onClick={deleteCostItem}
              >
                Eliminar
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

const dispatchToProps = {
  getPaymentsAction,
  deletePaymentsAction,
  savePaymentAction
};

export default connect(null, dispatchToProps)(PaymentsContainer);
