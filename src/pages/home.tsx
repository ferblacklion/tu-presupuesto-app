import React, { useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import { IUser } from '../definition/IUser';
import { RootState } from '../redux/store';
import { loginUserAction, loginFromStoreAction } from '../redux/user-duck';
import {
  IPayments,
  getPaymentsAction,
  getPaymentsDefaultAction
} from '../redux/payments-duck';

import PaymentsStatus from '../components/payments-status';
import { ISettings } from '../definition/ISettings';
import { getSettingsAction } from '../redux/settings-duck';
import PaymentsContainer from '../components/payments-container';

export interface IHomeProps {
  user: IUser | null;
  loginUserAction: () => Promise<void>;
  loginFromStoreAction: () => Promise<void>;
  payments: IPayments;
  settings: ISettings;
  getSettingsAction: (userId: string) => Promise<void>;
  getPaymentsAction: (userId: string, cutOffDate: number) => Promise<void>;
  getPaymentsDefaultAction: (userId: string) => Promise<void>;
}

function HomePage({
  user,
  loginUserAction,
  loginFromStoreAction,
  payments,
  settings,
  getSettingsAction,
  getPaymentsAction,
  getPaymentsDefaultAction
}: IHomeProps) {
  const initFetch = useCallback(() => {
    loginFromStoreAction();
  }, [loginFromStoreAction]);

  useEffect(() => {
    initFetch();
  }, [initFetch]);

  const login = () => {
    loginUserAction();
  };

  useEffect(() => {
    if (user && user.uid) {
      getSettingsAction(user.uid);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    if (user && user.uid) {
      getPaymentsDefaultAction(user.uid);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    if (user && user.uid) {
      if (settings.cutOffDate > 0)
        getPaymentsAction(user.uid, settings.cutOffDate);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, settings.cutOffDate]);

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
          <h2>Menu:</h2>
          <p>
            <a href="/settings" title="Configuraciones">
              Configuraciones
            </a>
          </p>
          <PaymentsContainer
            title={'Agregar gastos'}
            user={user}
            payments={payments}
            settings={settings}
          />
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
  getSettingsAction,
  getPaymentsAction,
  getPaymentsDefaultAction
};

export default connect(mapStateToProps, dispatchToProps)(HomePage);
