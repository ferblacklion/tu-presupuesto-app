import React, { useEffect, useCallback, useRef } from 'react';
import { connect } from 'react-redux';
import { IUser } from '../definition/IUser';
import { RootState } from '../redux/store';
import { loginUserAction, loginFromStoreAction } from '../redux/user-duck';
import {
  IPayments,
  savePaymentAction,
  IPayment,
  addPaymentAction,
  getPaymentsAction,
  deletePaymentsAction
} from '../redux/payments-duck';
import { isNumber } from 'util';
import NumberFormat from 'react-number-format';
import PaymentsStatus from '../components/payments-status';
import { ISettings } from '../definition/ISettings';
import { getSettingsAction } from '../redux/settings-duck';
import formatCurrency from '../utils/format-currency';

export interface IHomeProps {
  user: IUser | null;
  loginUserAction: () => Promise<void>;
  loginFromStoreAction: () => Promise<void>;
  savePaymentAction: (userId: string, p: IPayments) => Promise<void>;
  addPaymentAction: (p: IPayment) => Promise<void>;
  getPaymentsAction: (userId: string) => Promise<void>;
  deletePaymentsAction: (index: number) => any;
  payments: IPayments;
  settings: ISettings;
  getSettingsAction: (userId: string) => Promise<void>;
}
function HomePage({
  user,
  loginUserAction,
  loginFromStoreAction,
  savePaymentAction,
  addPaymentAction,
  payments,
  getPaymentsAction,
  deletePaymentsAction,
  settings,
  getSettingsAction
}: IHomeProps) {
  const costNameInput = useRef<HTMLInputElement>(null);
  let costInput: any = null;
  let costValueInput = '';

  const initFetch = useCallback(() => {
    loginFromStoreAction();
  }, [loginFromStoreAction]);

  useEffect(() => {
    initFetch();
  }, [initFetch]);

  const login = () => {
    loginUserAction();
  };

  const savePayments = () => {
    if (!user) return;
    const singlePayment: IPayment = {
      name: costNameInput?.current?.value || '',
      cost: !isNaN(Number(costInput.state.numAsString))
        ? Number(costInput.state.numAsString)
        : 0
    };

    if (singlePayment.name.trim() && singlePayment.cost > 0) {
      addPaymentAction(singlePayment).then(() => {
        if (costNameInput.current) costNameInput.current.value = '';
        costValueInput = '';
      });
    }
  };

  useEffect(() => {
    if (payments.payments.length && user) {
      savePaymentAction(user?.uid || '0', payments);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payments.payments]);

  const deleteCostItem = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const index = Number(e.currentTarget.getAttribute('data-index'));
    if (isNumber(index)) {
      deletePaymentsAction(index);
    }
  };

  useEffect(() => {
    if (user && user.uid) {
      getPaymentsAction(user.uid);
      getSettingsAction(user.uid);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <div>
      {user?.uid && (
        <div>
          <h1>Hello {user?.displayName}</h1>
          <img
            width="60"
            height="65"
            src={user?.photoURL || ''}
            alt={user?.displayName || ''}
          />
          <p>pages:</p>
          <p>
            <a href="/settings" title="settings">
              Settings
            </a>
          </p>
          <div>
            <h2>Agregar:</h2>
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
                {payments.payments.map((p, i) => (
                  <li key={i}>
                    {p.name} ===> {formatCurrency(p.cost)}{' '}
                    <a href="/" data-index={i} onClick={deleteCostItem}>
                      Eliminar
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <PaymentsStatus settings={settings} payments={payments} />
        </div>
      )}
      {!user?.uid && <button onClick={login}>LOGIN</button>}
    </div>
  );
}

function mapStateToProps(state: RootState) {
  return {
    user: state.user.userData,
    payments: state.payments,
    settings: state.settings
  };
}

const dispatchToProps = {
  loginUserAction,
  loginFromStoreAction,
  savePaymentAction,
  addPaymentAction,
  getPaymentsAction,
  deletePaymentsAction,
  getSettingsAction
};

export default connect(mapStateToProps, dispatchToProps)(HomePage);
