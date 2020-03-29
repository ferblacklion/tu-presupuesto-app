import { IPayment } from '../redux/payments-duck';

export function sortFunction(a: IPayment, b: IPayment) {
  var dateA = a.datetime.seconds;
  var dateB = b.datetime.seconds;
  return dateA > dateB ? 1 : -1;
}
