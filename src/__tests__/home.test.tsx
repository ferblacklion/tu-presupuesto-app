import React from 'react';
import firebase from 'firebase';
import { IUser } from '../definition/IUser';
import { ISettings } from '../definition/ISettings';
import { IPayments, IPayment } from '../definition/IPayment';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import { ISettingsPageProps } from '../definition';
import { ISettingsState } from '../definition/ISettingsState';
import thunk from 'redux-thunk';
import fetchMock from 'fetch-mock';
import configureMockStore from 'redux-mock-store';
import { HomePage } from '../pages/home';

// test an async action
const middleware = [thunk];
const mockStore = configureMockStore(middleware);
const user: IUser = {
  uid: 'vrw44t5KzvUjRO0yhoGwXum93Px1',
  displayName: 'Moisés Cermeño',
  photoURL:
    'https://lh3.googleusercontent.com/a-/AAuE7mD1yc_T93RSzAw4qfRl5Bvz9W2pjMJNSowQrZZEdA',
  email: 'mo.frc08@gmail.com'
};

function render(args?: any) {
  const settings: ISettingsState = {
    totalAmount: 9000,
    cutOffDate: 25,
    success: true
  };
  const payments: IPayments = {
    payments: [
      {
        id: '1',
        cost: 250,
        name: 'test 1',
        isDefault: false,
        datetime: firebase.firestore.Timestamp.fromDate(new Date())
      },
      {
        id: '2',
        cost: 250,
        name: 'test 2',
        isDefault: false,
        datetime: firebase.firestore.Timestamp.fromDate(new Date())
      },
      {
        id: '3',
        cost: 250,
        name: 'test 2',
        isDefault: false,
        datetime: firebase.firestore.Timestamp.fromDate(new Date())
      }
    ]
  };

  const defaultProps: ISettingsPageProps = {
    user,
    settings,
    payments,
    saveSettingsAction: (ID: string | undefined | null, s: ISettings) =>
      Promise.resolve(true),
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
    <MemoryRouter>
      <HomePage {...props} />
    </MemoryRouter>
  );
}

describe('<HomePage />', () => {
  it('should be render properly', () => {
    const wrap = render();
    expect(wrap.length).toBe(1);
  });
  it('should be render list of payments properly', () => {
    const wrap = render();
    expect(wrap.find('#payments-list').children()).toHaveLength(3);
  });
});
