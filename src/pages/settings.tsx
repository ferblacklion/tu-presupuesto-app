import React, { useEffect, useCallback, useState } from 'react';
import { connect } from 'react-redux';
import { saveSettingsAction, getSettingsAction } from '../redux/settings-duck';
import { RootState } from '../redux/store';
import PaymentsContainer from '../components/payments-container';
import {
  getPaymentsDefaultAction,
  savePaymentAction,
  getPaymentsAction,
  deletePaymentsAction
} from '../redux/payments-duck';
import { Link, Redirect } from 'react-router-dom';
import logout from '../utils/logout';
import { ISettingsPageProps } from '../definition';
import { ROUTES } from '../routes';
import SettingsForm from '../components/settings-form';

export const SettingsPage = ({
  user,
  saveSettingsAction,
  getSettingsAction,
  settings,
  getPaymentsDefaultAction,
  payments,
  deletePaymentsAction,
  savePaymentAction,
  getPaymentsAction
}: ISettingsPageProps) => {
  const initFetch = useCallback(() => {
    getSettingsAction(user?.uid);

    if (user && user.uid) getPaymentsDefaultAction(user.uid);
  }, [user, getSettingsAction, getPaymentsDefaultAction]);

  useEffect(() => {
    initFetch();
  }, [user, initFetch]);

  const [savindSettigs, setSavindSettigs] = useState(false);

  const saveUserSettings = (totalAmount: number, cutOffDate: number) => {
    setSavindSettigs(true);
    if (user && user?.uid) {
      saveSettingsAction(user.uid, {
        cutOffDate: !isNaN(cutOffDate) ? cutOffDate : 0,
        totalAmount: !isNaN(totalAmount) ? totalAmount : 0
      }).then(() => {
        setTimeout(() => {
          setSavindSettigs(false);
        }, 800);
      });
    }
  };

  if (!user) return <Redirect to={ROUTES.LOGIN} />;

  return (
    <div>
      <h2>Menu</h2>

      <Link to={ROUTES.HOME}>Inicio</Link>
      <p>
        <a onClick={logout} href={ROUTES.LOGOUT}>
          Logout
        </a>
      </p>

      <h1>Configuraciones</h1>

      {settings.success && (
        <SettingsForm
          settings={settings}
          onSubmit={saveUserSettings}
          saving={savindSettigs}
        />
      )}
      <PaymentsContainer
        title={'Agregar gastos predeterminados:'}
        user={user}
        payments={payments}
        isDefaultData={true}
        settings={settings}
        deletePaymentsAction={deletePaymentsAction}
        savePaymentAction={savePaymentAction}
        getPaymentsAction={getPaymentsAction}
        getPaymentsDefaultAction={getPaymentsDefaultAction}
      />
    </div>
  );
};

function mapStateToProps(state: RootState) {
  return {
    user: state.user.userData,
    settings: state.settings,
    payments: state.payments
  };
}
const dispatchToProps = {
  saveSettingsAction,
  getSettingsAction,
  getPaymentsDefaultAction,
  savePaymentAction,
  getPaymentsAction,
  deletePaymentsAction
};

export default connect(mapStateToProps, dispatchToProps)(SettingsPage);
