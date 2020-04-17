import React from 'react';
import { SettingsPage } from '../pages/settings';
import { IUser } from '../definition/IUser';
import { ISettings } from '../definition/ISettings';
import { IPayments, IPayment } from '../definition/IPayment';
import { mount } from 'enzyme';
import { BrowserRouter as Router } from 'react-router-dom';
import { ISettingsPageProps } from '../definition';
import { ISettingsState } from '../definition/ISettingsState';

function render(args?: any) {
  const user: IUser = {
    uid: 'vrw44t5KzvUjRO0yhoGwXum93Px1',
    displayName: 'Moisés Cermeño',
    photoURL:
      'https://lh3.googleusercontent.com/a-/AAuE7mD1yc_T93RSzAw4qfRl5Bvz9W2pjMJNSowQrZZEdA',
    email: 'mo.frc08@gmail.com'
  };
  const settings: ISettingsState = {
    totalAmount: 9000,
    cutOffDate: 25,
    success: true
  };
  const payments: IPayments = { payments: [] };

  const defaultProps: ISettingsPageProps = {
    user,
    settings,
    payments,
    saveSettingsAction: (uID: string, s: ISettings) => Promise.resolve(),
    getSettingsAction: (uID: string | undefined | null) => Promise.resolve(),
    deletePaymentsAction: (paymentId: string, userId: string) =>
      Promise.resolve(),
    savePaymentAction: (userId: string, payment: IPayment) => Promise.resolve(),
    getPaymentsAction: (userId: string, cutOffDate: number) =>
      Promise.resolve(),
    getPaymentsDefaultAction: (userId: string) => Promise.resolve()
  };

  const props = { ...defaultProps, ...args };
  return mount(
    <Router>
      <SettingsPage {...props} />
    </Router>
  );
}

describe('SettingsPage - default props render', () => {
  it('render total-amount default value', () => {
    const wrapper = render({ history: {}, match: {} });
    const totalAmount = wrapper.find('#total-amount').first();
    expect(totalAmount.props().value).toBe(9000);
  });
});
