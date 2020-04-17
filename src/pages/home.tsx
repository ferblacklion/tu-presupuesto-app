import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../redux/store';
import {
  getPaymentsAction,
  getPaymentsDefaultAction,
  deletePaymentsAction,
  savePaymentAction
} from '../redux/payments-duck';
import PaymentsStatus from '../components/payments-status';
import { getSettingsAction } from '../redux/settings-duck';
import PaymentsContainer from '../components/payments-container';
import { Link, Redirect } from 'react-router-dom';
import { IHomePageProps } from '../definition';
import { ROUTES } from '../routes';
import UserInfo from '../components/user-info';

function HomePage({
  user,
  payments,
  settings,
  getSettingsAction,
  getPaymentsAction,
  getPaymentsDefaultAction,
  deletePaymentsAction,
  savePaymentAction
}: IHomePageProps) {
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

  if (!user) return <Redirect to={'/'} />;

  return (
    <div>
      <UserInfo user={user} />
      <h2>Menu:</h2>
      <p>
        <Link to={ROUTES.SETTINGS}>Settings</Link>
      </p>
      <PaymentsContainer
        title={'Agregar gastos'}
        user={user}
        payments={payments}
        settings={settings}
        deletePaymentsAction={deletePaymentsAction}
        savePaymentAction={savePaymentAction}
        getPaymentsAction={getPaymentsAction}
        getPaymentsDefaultAction={getPaymentsDefaultAction}
      />
      <PaymentsStatus settings={settings} payments={payments} />
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
  getSettingsAction,
  getPaymentsAction,
  getPaymentsDefaultAction,
  deletePaymentsAction,
  savePaymentAction
};

export default connect(mapStateToProps, dispatchToProps)(HomePage);
