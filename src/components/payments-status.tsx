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
    <div className="slide">
      <div className="slide-content">
        <div className="slide-box">
          <div className="box">
            <div className="col">
              <svg className="icon">
                <use xlinkHref="#tag" />
              </svg>
              <div>
                <p className="text text-sm text-light text-up text-bold">
                  Gastos
                </p>
                <p
                  id={'total-payments'}
                  className="text text-xl text-dark text-extrabold amount"
                >
                  {formatCurrency(total)}
                </p>
              </div>
            </div>
            <div className="col">
              <svg className="icon">
                <use xlinkHref="#wallet" />
              </svg>
              <div>
                <p className="text text-sm text-light text-up text-bold">
                  Restante
                </p>
                <p
                  id={'total-rest'}
                  className="text text-xl text-dark text-extrabold amount"
                >
                  {formatCurrency(settings.totalAmount - total)}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="slide-box">
          <div className="box">
            <div className="col">
              <svg className="icon">
                <use xlinkHref="#bookmark" />
              </svg>
              <div>
                <p className="text text-sm text-light text-up text-bold">
                  Presupuesto Total
                </p>
                <p
                  id={'total-amount'}
                  className="text text-xl text-dark text-extrabold amount"
                >
                  {formatCurrency(settings.totalAmount)}{' '}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const PaymentsStatusMemo = React.memo(PaymentsStatus);
export default PaymentsStatusMemo;
