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
import { getPaymentsAction, IPayments } from '../redux/payments-duck';
import NumberFormat from 'react-number-format';

export declare interface ISettingsProps {
  loginFromStoreAction: () => Promise<void>;
  user: IUser | null;
  saveSettingsAction: (uID: string, s: ISettings) => Promise<void>;
  getSettingsAction: (uID: string) => Promise<void>;
  getPaymentsAction: (
    uID: string,
    cutOffDate: number,
    isDefault: boolean
  ) => Promise<void>;
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
  payments
}: ISettingsProps) => {
  const cutOffDateElement = useRef<HTMLInputElement>(null);
  let totalAmountElement: any = null;
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
      getPaymentsAction(user.uid || '', settings.cutOffDate, true);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    setCutOffDate(settings.cutOffDate);
    setTotalAmount(settings.totalAmount);
  }, [settings]);

  const saveUserData = () => {
    const currentUserSettings: ISettings = {
      cutOffDate: cutOffDateElement.current?.value
        ? Number(cutOffDateElement.current?.value)
        : 0,
      totalAmount: totalAmountElement.state.numAsString
        ? Number(totalAmountElement.state.numAsString)
        : 0
    };

    if (user) saveSettingsAction(user?.uid || '0', currentUserSettings);
  };

  return (
    <div>
      <h1>Settings</h1>
      <p>
        <a href="/">Inicio</a>
      </p>
      {settings.success && (
        <>
          <p>
            <label htmlFor="">Fecha corte:</label>
            <input
              ref={cutOffDateElement}
              type="number"
              name="cut-off-date"
              minLength={2}
              defaultValue={cutOffDate}
            />
          </p>
          <p>
            <label htmlFor="">Monto total:</label>

            <NumberFormat
              ref={(el: any) => (totalAmountElement = el)}
              decimalScale={2}
              thousandSeparator={true}
              id="total-amount"
              prefix={'Q'}
              value={totalAmount}
              inputMode={'decimal'}
              allowNegative={false}
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
  getPaymentsAction
};

export default connect(mapStateToProps, dispatchToProps)(SettingsPage);
