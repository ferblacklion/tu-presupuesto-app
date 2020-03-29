import { IPayment } from '../redux/payments-duck';

export function sortFunByIsDefault(a: IPayment, b: IPayment) {
  const x = a.isDefault;
  const y = b.isDefault;
  return x === y ? 0 : x ? -1 : 1;
}
