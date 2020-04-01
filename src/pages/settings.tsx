import React, { useEffect } from 'react';
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
import { getPaymentsDefaultAction, IPayments } from '../redux/payments-duck';
import NumberFormat, { NumberFormatValues } from 'react-number-format';

export declare interface ISettingsProps {
  loginFromStoreAction: () => Promise<void>;
  user: IUser | null;
  saveSettingsAction: (uID: string, s: ISettings) => Promise<void>;
  getSettingsAction: (uID: string) => Promise<void>;
  getPaymentsDefaultAction: (uID: string) => Promise<void>;
  settings: ISettingsState;
  payments: IPayments;
}

const SettingsPage = ({
  user,
  loginFromStoreAction,
  saveSettingsAction,
  getSettingsAction,
  settings,
  getPaymentsDefaultAction,
  payments
}: ISettingsProps) => {
  let totalAmountElement: NumberFormat;
  let inputCutOffDate: NumberFormat;

  useEffect(() => {
    const initFetch = () => {
      loginFromStoreAction();
    };
    initFetch();
  }, [loginFromStoreAction]);

  useEffect(() => {
    if (user) {
      getSettingsAction(user.uid || '');
      getPaymentsDefaultAction(user.uid || '');
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    if (inputCutOffDate)
      inputCutOffDate.setState({ value: settings.cutOffDate });
    if (totalAmountElement)
      totalAmountElement.setState({ value: `Q ${settings.totalAmount}` });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings]);

  const saveUserData = () => {
    const totalAmount = Number(totalAmountElement.state.numAsString);
    const cutOffDate = Number(inputCutOffDate.state.value);

    if (user && user?.uid)
      saveSettingsAction(user.uid, {
        cutOffDate: !isNaN(cutOffDate) ? cutOffDate : 0,
        totalAmount: !isNaN(totalAmount) ? totalAmount : 0
      });
  };

  const onValueChange = (values: NumberFormatValues) => {
    const { value, floatValue } = values;

    if (floatValue !== undefined && floatValue <= 31) {
      inputCutOffDate.setState({ floatValue, value });
      return;
    }

    if (floatValue !== undefined && floatValue > 31) {
      inputCutOffDate.setState({
        floatValue: inputCutOffDate.state.floatValue,
        value: inputCutOffDate.state.value
      });
      return;
    }
  };

  return (
    <div>
      <h2>Menu</h2>

      <a href="/">Inicio</a>

      <h1>Configuraciones</h1>

      {settings.success && (
        <>
          <p>
            <label htmlFor="">Fecha corte:</label>
            <NumberFormat
              ref={(inst: NumberFormat) => (inputCutOffDate = inst)}
              name="cut-off-date"
              minLength={2}
              value={''}
              inputMode={'numeric'}
              decimalSeparator={false}
              onValueChange={onValueChange}
            />
          </p>
          <p>
            <label htmlFor="">Monto total:</label>

            <NumberFormat
              ref={(el: NumberFormat) => (totalAmountElement = el)}
              decimalScale={2}
              thousandSeparator={true}
              id="total-amount"
              prefix={'Q'}
              value={''}
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
        settings={settings}
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
  getPaymentsDefaultAction
};

export default connect(mapStateToProps, dispatchToProps)(SettingsPage);
