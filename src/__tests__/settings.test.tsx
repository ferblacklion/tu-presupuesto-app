import React from 'react';
import { SettingsPage } from '../pages/settings';
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
import { SAVE_SETTINGS } from '../redux/settings-duck';

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
  const payments: IPayments = { payments: [] };

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
      <SettingsPage {...props} />
    </MemoryRouter>
  );
}

describe('SettingsPage Component', () => {
  afterEach(() => {
    fetchMock.restore();
  });

  it('render total-amount default value', () => {
    const wrapper = render({ history: {}, match: {} });
    const totalAmount = wrapper.find('#total-amount').first();
    expect(totalAmount.props().value).toBe(9000);
  });

  it('render settings form', () => {
    const wrapper = render({ history: {}, match: {} });
    const forms = wrapper.find('#save-settings-form');

    expect(forms.length).toBe(1);
  });

  it('render saving True state settings form ', () => {
    const wrap = render({ history: {}, match: {} });

    wrap.setState({ savingSettings: true }, () => {
      expect(wrap.state('savingSettings')).toEqual(true);
      //const input = wrap.find('#save-settings');
      //expect(input.text()).toEqual('Guardando...');
      //console.log(wrap.debug());
    });
  });

  it('dispatch SAVE_SETTINGS action', () => {
    const settings: ISettingsState = {
      totalAmount: 9002,
      cutOffDate: 26,
      success: true
    };

    fetchMock.mock('*', {
      body: settings,
      headers: { 'content-type': 'aplication/json' }
    });

    const expectedActions = [
      {
        type: SAVE_SETTINGS,
        payload: {
          totalAmount: 9002,
          cutOffDate: 26,
          success: true
        }
      }
    ];
    const store = mockStore({ settings: [] });

    store.dispatch({ type: SAVE_SETTINGS, payload: settings });

    expect(store.getActions()).toEqual(expectedActions);
  });
});
