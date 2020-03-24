import React, { useRef } from 'react';
import NumberFormat from 'react-number-format';
import { IPayment, IPayments } from '../redux/payments-duck';
import { IUser } from '../definition/IUser';
import {
  addPaymentAction,
  getPaymentsAction,
  deletePaymentsAction
} from '../redux/payments-duck';
import { isNumber } from 'util';
import { connect } from 'react-redux';
import formatCurrency from '../utils/format-currency';
import moment from 'moment';

export declare interface IPaymentsContainer {
  title: string;
  user: IUser | null;
  payments: IPayments;
  addPaymentAction: (p: IPayment) => Promise<void>;
  deletePaymentsAction: (payment: IPayment) => any;
  isDefaultData?: boolean;
}

function PaymentsContainer({
  title,
  user,
  payments,
  deletePaymentsAction,
  addPaymentAction,
  isDefaultData = false
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
      datetime: moment().format('LLL')
    };

    if (singlePayment.name.trim() && singlePayment.cost > 0) {
      addPaymentAction(singlePayment).then(() => {
        if (costNameInput.current) costNameInput.current.value = '';
        costValueInput = '';
      });
    }
  };

  const deleteCostItem = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const name = e.currentTarget.getAttribute('data-name') || '';
    const cost = Number(e.currentTarget.getAttribute('data-cost')) || -1;
    const payment: IPayment = { name, cost, isDefault: false, datetime: '' };
    if (payment.name && isNumber(payment.cost)) {
      deletePaymentsAction(payment);
    }
  };

  let paymentsFiltered: IPayments = { payments: [] };

  if (payments !== undefined && payments.payments !== undefined) {
    if (isDefaultData) {
      paymentsFiltered.payments = payments.payments.filter(
        (p: IPayment) => p.isDefault === true
      );
    } else {
      paymentsFiltered.payments = payments.payments;
    }
  }

  console.log(paymentsFiltered);

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
          {paymentsFiltered.payments.map((p, i) => (
            <li key={i}>
              {p.name} ===> {formatCurrency(p.cost)}{' '}
              <a
                href="/"
                data-name={p.name}
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
  addPaymentAction,
  getPaymentsAction,
  deletePaymentsAction
};

export default connect(null, dispatchToProps)(PaymentsContainer);
