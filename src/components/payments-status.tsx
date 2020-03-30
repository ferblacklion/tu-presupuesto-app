import React from 'react';
import { ISettings } from '../definition/ISettings';
import { IPayments, IPayment } from '../redux/payments-duck';
import formatCurrency from '../utils/format-currency';

export declare interface IPaymentsStatus {
  settings: ISettings;
  payments: IPayments;
}

function PaymentsStatus({ settings, payments }: IPaymentsStatus) {
  const initialCost = 0;

  const reducer = (accumulator: number, item: IPayment) => {
    return accumulator + item.cost;
  };

  const total =
    payments.payments !== undefined
      ? payments.payments.reduce(reducer, initialCost)
      : 0;

  return (
    <div>
      <h2>Estados</h2>
      <div>Presupuesto: {formatCurrency(settings.totalAmount)}</div>
      <div>---------------------------------------</div>
      <div>Gasto Total: {formatCurrency(total)}</div>
      <div>Monto restante: {formatCurrency(settings.totalAmount - total)}</div>
    </div>
  );
}

const PaymentsStatusMemo = React.memo(PaymentsStatus);
export default PaymentsStatusMemo;
