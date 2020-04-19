import { IPaymentsStatus } from '../definition';
import firebase from 'firebase';
import { shallow } from 'enzyme';
import React from 'react';
import PaymentsStatusMemo from '../components/payments-status';

function render(args?: any) {
  const defaultProps: IPaymentsStatus = {
    settings: { totalAmount: 1000, cutOffDate: 25 },
    payments: {
      payments: [
        {
          cost: 250,
          name: 'test 1',
          isDefault: false,
          datetime: firebase.firestore.Timestamp.fromDate(new Date())
        },
        {
          cost: 250,
          name: 'test 2',
          isDefault: false,
          datetime: firebase.firestore.Timestamp.fromDate(new Date())
        }
      ]
    }
  };

  const props = { ...defaultProps, ...args };
  return shallow(<PaymentsStatusMemo {...props} />);
}

describe('Payment status component', () => {
  it('should be render properly', () => {
    const wrap = render();
    expect(wrap.children.length).toBe(1);
  });

  it('render properly total amount result', () => {
    const wrap = render();
    const totalAmount = wrap.find('#total-amount').first();
    expect(totalAmount.text().trim()).toEqual('Q 1,000');
  });

  it('render properly total rest result', () => {
    const wrap = render();
    const totalAmount = wrap.find('#total-rest').first();
    expect(totalAmount.text().trim()).toEqual('Q 500');
  });

  it('render properly total payments result', () => {
    const wrap = render();
    const totalAmount = wrap.find('#total-payments').first();
    expect(totalAmount.text().trim()).toEqual('Q 500');
  });
});
