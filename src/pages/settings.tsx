import React, { useEffect, useState, useRef } from 'react';
import { connect } from 'react-redux';
import {
  saveSettingsAction,
  getSettingsAction,
  ISettingsState
} from '../redux/settings-duck';
import { RootState } from '../redux/store';
import { IUser } from '../definition/IUser';
import { loginFromStoreAction } from '../redux/user-duck';
import { ISettings } from '../definition/ISettings';
import PaymentsContainer from '../components/payments-container';
import {
  getPaymentsAction,
  IPayments,
  savePaymentAction
} from '../redux/payments-duck';

export declare interface ISettingsProps {
  loginFromStoreAction: () => Promise<void>;
  user: IUser | null;
  saveSettingsAction: (uID: string, s: ISettings) => Promise<void>;
  getSettingsAction: (uID: string) => Promise<void>;
  getPaymentsAction: (uID: string) => Promise<void>;
  savePaymentAction: (uID: string, payments: IPayments) => Promise<void>;
  settings: ISettingsState;
  payments: IPayments;
}

const SettingsPage = ({
  user,
  loginFromStoreAction,
  saveSettingsAction,
  getSettingsAction,
  settings,
  getPaymentsAction,
  payments,
  savePaymentAction
}: ISettingsProps) => {
  const cutOffDateElement = useRef<HTMLInputElement>(null);
  const totalAmountElement = useRef<HTMLInputElement>(null);
  const [cutOffDate, setCutOffDate] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    const initFetch = () => {
      loginFromStoreAction();
    };
    initFetch();
  }, [loginFromStoreAction]);

  useEffect(() => {
    if (user) {
      getSettingsAction(user.uid || '');
      getPaymentsAction(user.uid || '');
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    setCutOffDate(settings.cutOffDate);
    setTotalAmount(settings.totalAmount);
  }, [settings]);

  useEffect(() => {
    if (payments.payments.length > -1 && user) {
      savePaymentAction(user?.uid || '0', payments);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payments.payments]);

  const saveUserData = () => {
    const currentUserSettings: ISettings = {
      cutOffDate: cutOffDateElement.current?.value
        ? Number(cutOffDateElement.current?.value)
        : 31,
      totalAmount: totalAmountElement.current?.value
        ? Number(totalAmountElement.current.value)
        : 5000
    };

    if (user) saveSettingsAction(user?.uid || '0', currentUserSettings);
  };

  return (
    <div>
      <h1>Settings</h1>
      {settings.success && (
        <>
          <p>
            <label htmlFor="">Fecha corte:</label>
            <input
              ref={cutOffDateElement}
              type="text"
              name="cut-off-date"
              defaultValue={cutOffDate}
            />
          </p>
          <p>
            <label htmlFor="">Monto total:</label>
            <input
              ref={totalAmountElement}
              type="text"
              name="total-amount"
              defaultValue={totalAmount}
            />
          </p>
          <button onClick={saveUserData}>Guardar</button>
        </>
      )}
      <PaymentsContainer
        title={'Agregar gastos predeterminados:'}
        user={user}
        payments={payments}
        isDefaultData={true}
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
  loginFromStoreAction,
  saveSettingsAction,
  getSettingsAction,
  getPaymentsAction,
  savePaymentAction
};

export default connect(mapStateToProps, dispatchToProps)(SettingsPage);
