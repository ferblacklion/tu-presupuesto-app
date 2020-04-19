import React from 'react';
import { IPayment } from '../definition/IPayment';
import formatCurrency from '../utils/format-currency';
import { IPaymentsStatus } from '../definition';

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
      <div>
        Presupuesto total:{' '}
        <span id={'total-amount'}>
          {' '}
          {formatCurrency(settings.totalAmount)}{' '}
        </span>
      </div>
      <div>
        Saldo restante:{' '}
        <span id={'total-rest'}>
          {formatCurrency(settings.totalAmount - total)}
        </span>
      </div>
      <div>---------------------------------------</div>
      <div>
        Gastos: <span id={'total-payments'}>{formatCurrency(total)}</span>
      </div>
    </div>
  );
}

const PaymentsStatusMemo = React.memo(PaymentsStatus);
export default PaymentsStatusMemo;
