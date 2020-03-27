import React, { useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import { IUser } from '../definition/IUser';
import { RootState } from '../redux/store';
import { loginUserAction, loginFromStoreAction } from '../redux/user-duck';
import { IPayments, getPaymentsAction } from '../redux/payments-duck';

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
  getPaymentsAction: (userId: string) => Promise<void>;
}

function HomePage({
  user,
  loginUserAction,
  loginFromStoreAction,
  payments,
  settings,
  getSettingsAction,
  getPaymentsAction
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
          <PaymentsContainer
            title={'Agregar gastos'}
            user={user}
            payments={payments}
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
  getPaymentsAction
};

export default connect(mapStateToProps, dispatchToProps)(HomePage);
