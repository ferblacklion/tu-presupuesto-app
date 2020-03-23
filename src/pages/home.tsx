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
  getPaymentsAction
} from '../redux/payments-duck';

export interface IHomeProps {
  user: IUser | null;
  loginUserAction: () => Promise<void>;
  loginFromStoreAction: () => Promise<void>;
  savePaymentAction: (userId: string, p: IPayments) => Promise<void>;
  addPaymentAction: (p: IPayment) => Promise<void>;
  getPaymentsAction: (userId: string) => Promise<void>;
  payments: IPayments;
}
function HomePage({
  user,
  loginUserAction,
  loginFromStoreAction,
  savePaymentAction,
  addPaymentAction,
  payments,
  getPaymentsAction
}: IHomeProps) {
  const costNameInput = useRef<HTMLInputElement>(null);
  const costInput = useRef<HTMLInputElement>(null);

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
      cost: !isNaN(Number(costInput?.current?.value))
        ? Number(costInput?.current?.value)
        : 0
    };

    if (singlePayment.name.trim() && singlePayment.cost > 0) {
      addPaymentAction(singlePayment).then(() => {
        if (costNameInput.current) costNameInput.current.value = '';
        if (costInput.current) costInput.current.value = '';
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
    const index = e.target;
    console.log('delete', index);
  };

  useEffect(() => {
    console.log('user', user);

    if (user && user.uid) getPaymentsAction(user.uid);
  }, [user, getPaymentsAction]);

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
              <input ref={costNameInput} id="cost-name" type="text" /> <br />
            </p>
            <p>
              <label htmlFor="cost">Precio </label>
              <input ref={costInput} id="cost" type="text" />
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
                    {p.name} --- {p.cost}{' '}
                    <a href="/" data-index={i} onClick={deleteCostItem}>
                      Eliminar
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
      {!user?.uid && <button onClick={login}>LOGIN</button>}
    </div>
  );
}

function mapStateToProps(state: RootState) {
  return { user: state.user.userData, payments: state.payments };
}

const dispatchToProps = {
  loginUserAction,
  loginFromStoreAction,
  savePaymentAction,
  addPaymentAction,
  getPaymentsAction
};

export default connect(mapStateToProps, dispatchToProps)(HomePage);
