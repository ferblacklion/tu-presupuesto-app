import React, { useState, useEffect } from 'react';
import NumberFormat, { NumberFormatValues } from 'react-number-format';
import initialState from '../redux/initialState';
import { ISettingsFormProps } from '../definition';
import { FaRegMoneyBillAlt } from 'react-icons/fa';

export default function SettingsForm({
  onSubmit,
  settings,
  saving
}: ISettingsFormProps) {
  let totalAmountElement: NumberFormat;
  let inputCutOffDate: NumberFormat;

  const [state, setState] = useState(initialState.settings);

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

  const saveSettings = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    const totalAmount = Number(totalAmountElement.state.numAsString);
    const cutOffDate = Number(inputCutOffDate.state.value);
    onSubmit(totalAmount, cutOffDate);
  };

  return (
    <form id={'save-settings-form'}>
      <div className="box box-p">
        <div className="input input-icon">
          <label htmlFor="fecha-corte">Fecha de Corte</label>
          <svg>
            <use xlinkHref="#calendar" />
          </svg>
          <NumberFormat
            ref={(inst: NumberFormat) => (inputCutOffDate = inst)}
            name="cut-off-date"
            minLength={2}
            value={state.cutOffDate}
            inputMode={'numeric'}
            decimalSeparator={'false'}
            onValueChange={cutOffDateOnValueChange}
          />
        </div>
        <div className="input input-icon">
          <label htmlFor="monto-total">Monto Total</label>
          <FaRegMoneyBillAlt color={'#0841a6'} />
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
        </div>
      </div>

      <button id={'save-settings'} onClick={saveSettings} className="btn">
        <span>{!saving ? 'Guardar' : 'Guardando...'}</span>
      </button>
    </form>
  );
}
