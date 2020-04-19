import React, { useState } from 'react';
import NumberFormat from 'react-number-format';
import { IPayment, IPayments } from '../definition/IPayment';
import { IUser } from '../definition/IUser';

import formatCurrency from '../utils/format-currency';

import 'firebase/firestore';
import firebase from 'firebase/app';
import { ISettings } from '../definition/ISettings';
import moment from 'moment';

export declare interface IPaymentsContainer {
  title: string;
  user: IUser | null;
  payments: IPayments;
  settings: ISettings;
  isDefaultData?: boolean;
  deletePaymentsAction: (paymentId: string, userId: string) => Promise<void>;
  savePaymentAction: (userId: string, payment: IPayment) => Promise<void>;
  getPaymentsAction: (userId: string, cutOffDate: number) => Promise<void>;
  getPaymentsDefaultAction: (userId: string) => Promise<void>;
}

export declare interface IFormPaymentState {
  cost: string;
  name: string;
}

function PaymentsContainer({
  title,
  user,
  payments,
  isDefaultData = false,
  settings,
  savePaymentAction,
  getPaymentsAction,
  deletePaymentsAction,
  getPaymentsDefaultAction
}: IPaymentsContainer) {
  const [formData, setFormData] = useState<IFormPaymentState>({
    name: '',
    cost: ''
  });

  let costInput: any = null;

  const savePayments = () => {
    if (!user) return;
    const number = Number(costInput.state.numAsString);

    const singlePayment: IPayment = {
      name: formData.name,
      cost: !isNaN(number) ? number : 0,
      isDefault: isDefaultData,
      datetime: firebase.firestore.Timestamp.fromDate(moment().toDate())
    };

    if (singlePayment.cost > settings.totalAmount) {
      // TODO: show error to the user
      alert('La cantidad es muy elevada al presupuesto establecido');
      setFormData({ name: '', cost: '' });
      return;
    }

    if (singlePayment.name.trim() && singlePayment.cost > 0) {
      if (user.uid)
        savePaymentAction(user.uid, singlePayment).then(() => {
          setFormData({ name: '', cost: '' });

          if (user.uid) {
            getPaymentsDefaultAction(user.uid);
            if (!isDefaultData)
              getPaymentsAction(user.uid, settings.cutOffDate);
          }
        });
    }
  };

  const deleteCostItem = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const id = e.currentTarget.getAttribute('data-id') || '';

    if (id && user && user.uid) {
      deletePaymentsAction(id, user.uid);
    }
  };

  const onChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ name: e.target.value, cost: formData.cost });
  };

  const onChangeCost = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ name: formData.name, cost: e.target.value });
  };

  return (
    <div>
      <h2>{title}</h2>
      <p>
        <label htmlFor="cost-name">Nombre del gasto </label>
        <input
          onChange={onChangeName}
          minLength={3}
          id="cost-name"
          type="text"
          value={formData.name}
        />{' '}
        <br />
      </p>
      <p>
        <label htmlFor="cost">Precio </label>
        <NumberFormat
          onChange={onChangeCost}
          ref={(el: any) => (costInput = el)}
          decimalScale={2}
          thousandSeparator={true}
          id="cost"
          prefix={'Q'}
          value={formData.cost}
          inputMode={'decimal'}
          allowNegative={false}
        />
      </p>
      <br />
      <p>
        <button onClick={savePayments}>GUARDAR</button>
      </p>
      <br />
      <div>
        <div>
          <h2>LISTA DE GASTOS</h2>
          <ul id={'payments-list'}>
            {payments.payments.map((p, i: number) => (
              <li key={p.id || i}>
                {i + 1}). {p.name} ===>{'   '} {formatCurrency(p.cost)}{' '}
                <a href="/" data-id={p.id} onClick={deleteCostItem}>
                  Eliminar
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default PaymentsContainer;
