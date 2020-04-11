import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { IUser } from '../definition/IUser';
import { RootState } from '../redux/store';
import { loginUserAction } from '../redux/user-duck';
import {
  IPayments,
  getPaymentsAction,
  getPaymentsDefaultAction
} from '../redux/payments-duck';

import PaymentsStatus from '../components/payments-status';
import { getSettingsAction, ISettingsState } from '../redux/settings-duck';
import PaymentsContainer from '../components/payments-container';
import { Link } from 'react-router-dom';

export interface IHomeProps {
  user: IUser | null;
  loginUserAction: () => Promise<void>;
  payments: IPayments;
  settings: ISettingsState;
  getSettingsAction: (userId: string) => Promise<void>;
  getPaymentsAction: (userId: string, cutOffDate: number) => Promise<void>;
  getPaymentsDefaultAction: (userId: string) => Promise<void>;
}

function HomePage({
  user,
  loginUserAction,
  payments,
  settings,
  getSettingsAction,
  getPaymentsAction,
  getPaymentsDefaultAction
}: IHomeProps) {
  const login = () => {
    loginUserAction();
  };

  useEffect(() => {
    if (user && user.uid) {
      if (!settings.success) {
        getSettingsAction(user.uid);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, settings.success]);

  useEffect(() => {
    if (user && user.uid) {
      getPaymentsDefaultAction(user.uid);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.uid]);

  useEffect(() => {
    if (user && user.uid && settings.cutOffDate > 0) {
      getPaymentsAction(user.uid, settings.cutOffDate);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.uid, settings.cutOffDate]);

  useEffect(() => {
    if (
      settings.success === true &&
      (settings.cutOffDate === 0 || settings.totalAmount === 0)
    ) {
      alert(
        'Debes de configurar tu fecha de corte y presupuesto antes de utilizar la app.'
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.success]);

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
            <Link to="/settings/">Settings</Link>
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
  getSettingsAction,
  getPaymentsAction,
  getPaymentsDefaultAction
};

export default connect(mapStateToProps, dispatchToProps)(HomePage);
