import React from 'react';
import { shallow } from 'enzyme';
import { ISettingsState } from '../definition/ISettingsState';
import SettingsForm from '../components/settings-form';
import { ISettingsFormProps } from '../definition';

function render(args?: any) {
  const settings: ISettingsState = {
    totalAmount: 9000,
    cutOffDate: 25,
    success: true
  };

  const defaultProps: ISettingsFormProps = {
    onSubmit: (totalAmount: number, cutOffDate: number) => {
      console.log('saved');
    },
    saving: false,
    settings
  };

  const props = { ...defaultProps, ...args };
  return shallow(<SettingsForm {...props} />);
}

describe('settings form component', () => {
  it('render saving False state settings form ', () => {
    const wrap = render();
    const input = wrap.find('#save-settings');
    expect(input.text()).toEqual('Guardar');
  });

  it('render saving True state settings form ', () => {
    const wrap = render({
      saving: true
    });

    const input = wrap.find('#save-settings');

    expect(input.text()).toEqual('Guardando...');
  });
});
