import React, { useState, useEffect } from 'react';
import NumberFormat, { NumberFormatValues } from 'react-number-format';
import initialState from '../redux/initialState';
import { ISettingsFormProps } from '../definition';

export default function SettingsForm({
  onSubmit,
  settings
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

  const saveSettings = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const totalAmount = Number(totalAmountElement.state.numAsString);
    const cutOffDate = Number(inputCutOffDate.state.value);
    onSubmit(totalAmount, cutOffDate);
  };

  return (
    <form id={'save-settings-form'}>
      <p>
        <label htmlFor="">Fecha corte:</label>
        <NumberFormat
          ref={(inst: NumberFormat) => (inputCutOffDate = inst)}
          name="cut-off-date"
          minLength={2}
          value={state.cutOffDate}
          inputMode={'numeric'}
          decimalSeparator={'false'}
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
      <button id={'save-settings'} type="submit" onClick={saveSettings}>
        Guardar
      </button>
    </form>
  );
}
