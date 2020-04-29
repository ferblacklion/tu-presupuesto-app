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
import Svgs from '../components/svgs';
import Footer from '../components/footer';
import { notify } from '../components/notify';
import Header from '../components/header';
import ProfilePicture from '../components/profile-picture';

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

  const [savingSettings, setSavingSettings] = useState(false);

  const saveUserSettings = (totalAmount: number, cutOffDate: number) => {
    setSavingSettings(true);
    if (user && user?.uid) {
      saveSettingsAction(user.uid, {
        cutOffDate: !isNaN(cutOffDate) ? cutOffDate : 0,
        totalAmount: !isNaN(totalAmount) ? totalAmount : 0
      }).then(() => {
        setTimeout(() => {
          setSavingSettings(false);
        }, 800);
      });
    }
  };

  useEffect(() => {
    if (
      settings.success === true &&
      (settings.cutOffDate === 0 || settings.totalAmount === 0)
    ) {
      notify();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.success]);

  if (!user) return <Redirect to={ROUTES.LOGIN} />;

  return (
    <>
      <Header>
        <div className="header-left">
          <Link to={ROUTES.HOME}>
            <svg>
              <use xlinkHref="#arrow-back" />
            </svg>
          </Link>
        </div>
        <div className="header-title">Configuración</div>
        <div className="header-right">
          <ProfilePicture
            photoURL={`${user.photoURL}`}
            displayName={`${user.displayName}`}
          />
        </div>
      </Header>

      <div className="content config">
        <div className="container">
          <div className="box box-p">
            <p>
              Configura el día para el reinicio de tu presupuesto mensual y el
              monto total.
            </p>
          </div>

          {settings.success && (
            <SettingsForm
              settings={settings}
              onSubmit={saveUserSettings}
              saving={savingSettings}
            />
          )}
          <PaymentsContainer
            title={'Gastos Fijos'}
            user={user}
            payments={payments}
            isDefaultData={true}
            settings={settings}
            deletePaymentsAction={deletePaymentsAction}
            savePaymentAction={savePaymentAction}
            getPaymentsAction={getPaymentsAction}
            getPaymentsDefaultAction={getPaymentsDefaultAction}
          />
          <a onClick={logout} href="/log-out/" className="btn btn-red">
            <span>Cerrar Sesión</span>
          </a>
        </div>
      </div>

      <Footer />

      <Svgs />
    </>
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
