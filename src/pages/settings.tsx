import React, { useEffect, useState, useCallback } from 'react';
import { connect } from 'react-redux';
import { saveSettingsAction, getSettingsAction } from '../redux/settings-duck';
import { RootState } from '../redux/store';
import PaymentsContainer from '../components/payments-container';
import { getPaymentsDefaultAction } from '../redux/payments-duck';
import NumberFormat, { NumberFormatValues } from 'react-number-format';
import { Link, Redirect } from 'react-router-dom';
import initialState from '../redux/initialState';
import logout from '../utils/logout';
import { ISettingsPageProps } from '../definition';
import { ROUTES } from '../routes';

const SettingsPage = ({
  user,
  saveSettingsAction,
  getSettingsAction,
  settings,
  getPaymentsDefaultAction,
  payments
}: ISettingsPageProps) => {
  let totalAmountElement: NumberFormat;
  let inputCutOffDate: NumberFormat;

  const [state, setState] = useState(initialState.settings);

  const initFetch = useCallback(() => {
    getSettingsAction(user?.uid);

    if (user && user.uid) getPaymentsDefaultAction(user.uid);
  }, [user, getSettingsAction, getPaymentsDefaultAction]);

  useEffect(() => {
    initFetch();
  }, [user, initFetch]);

  useEffect(() => {
    if (inputCutOffDate) {
      inputCutOffDate.setState({
        value: settings.cutOffDate
      });
    }
    if (totalAmountElement) {
      totalAmountElement.setState({
        value: `Q${settings.totalAmount}`
      });
    }
    setState({
      cutOffDate: settings.cutOffDate,
      totalAmount: settings.totalAmount,
      success: true
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings]);

  const saveUserData = () => {
    const totalAmount = Number(totalAmountElement.state.numAsString);
    const cutOffDate = Number(inputCutOffDate.state.value);

    if (user && user?.uid) {
      saveSettingsAction(user.uid, {
        cutOffDate: !isNaN(cutOffDate) ? cutOffDate : 0,
        totalAmount: !isNaN(totalAmount) ? totalAmount : 0
      });
    }
  };

  const cutOffDateOnValueChange = (values: NumberFormatValues) => {
    const { value, floatValue = 0 } = values;

    if (inputCutOffDate !== undefined && floatValue < 31) {
      inputCutOffDate.setState({ value });
    } else if (inputCutOffDate !== undefined && floatValue > 31) {
      inputCutOffDate.setState({
        value: inputCutOffDate.state.value
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
        <>
          <p>
            <label htmlFor="">Fecha corte:</label>
            <NumberFormat
              ref={(inst: NumberFormat) => (inputCutOffDate = inst)}
              name="cut-off-date"
              minLength={2}
              value={state.cutOffDate}
              inputMode={'numeric'}
              decimalSeparator={false}
              onValueChange={cutOffDateOnValueChange}
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
              value={state.totalAmount}
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
  saveSettingsAction,
  getSettingsAction,
  getPaymentsDefaultAction
};

export default connect(mapStateToProps, dispatchToProps)(SettingsPage);
