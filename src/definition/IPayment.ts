import { firestore } from 'firebase';
export declare interface IPayment {
  id?: string;
  name: string;
  cost: number;
  isDefault: boolean;
  datetime: firestore.Timestamp;
}
export declare interface IPayments {
  payments: IPayment[];
}
