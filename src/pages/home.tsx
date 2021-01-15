import React, { useEffect, useState } from 'react';
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
import { Redirect } from 'react-router-dom';
import { IHomePageProps } from '../definition';
import HeaderHome from '../components/header-home';
import Svgs from '../components/svgs';
import Footer from '../components/footer';
import { notify } from '../components/notify';
import Header from '../components/header';
import { isTypeReferenceNode } from 'typescript';

export function HomePage({
  user,
  payments,
  settings,
  getSettingsAction,
  getPaymentsAction,
  getPaymentsDefaultAction,
  deletePaymentsAction,
  savePaymentAction
}: IHomePageProps) {
  const [HasError, setHasError] = useState(false);
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
      try {
        getPaymentsAction(user.uid, settings.cutOffDate).catch(e => {
          console.log('error action ' + e);

          setHasError(true);
        });
      } catch (error) {
        console.log(error);

        setHasError(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.uid, settings.cutOffDate]);

  useEffect(() => {
    if (
      settings.success === true &&
      (settings.cutOffDate === 0 || settings.totalAmount === 0)
    ) {
      notify();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.success]);

  if (!user) return <Redirect to={'/'} />;

  return (
    <>
      <Header>
        <HeaderHome user={user} />
      </Header>
      {HasError ? (
        <h2>Something is wrong!</h2>
      ) : (
        <div className="content">
          <div className="container">
            <PaymentsStatus settings={settings} payments={payments} />
            <PaymentsContainer
              title={'Gastos Recientes'}
              user={user}
              payments={payments}
              settings={settings}
              deletePaymentsAction={deletePaymentsAction}
              savePaymentAction={savePaymentAction}
              getPaymentsAction={getPaymentsAction}
              getPaymentsDefaultAction={getPaymentsDefaultAction}
            />
            <Footer />
          </div>
        </div>
      )}
      <Svgs />
    </>
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
