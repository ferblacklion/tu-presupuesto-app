import { IUser } from './IUser';
import { ISettings } from './ISettings';
import { ISettingsState } from './ISettingsState';
import { IPayments, IPayment } from './IPayment';

export declare interface IBasePageProps {
  user: IUser | null;
  settings: ISettingsState;
  payments: IPayments;
}

export declare interface ISettingsPageProps extends IBasePageProps {
  saveSettingsAction: (
    uID: string | undefined | null,
    s: ISettings
  ) => Promise<boolean>;
  getSettingsAction: (uID: string | undefined | null) => Promise<void>;
  deletePaymentsAction: (paymentId: string, userId: string) => Promise<void>;
  savePaymentAction: (userId: string, payment: IPayment) => Promise<void>;
  getPaymentsAction: (userId: string, cutOffDate: number) => Promise<void>;
  getPaymentsDefaultAction: (userId: string) => Promise<void>;
}

export declare interface IHomePageProps extends IBasePageProps {
  getPaymentsAction: (userId: string, cutOffDate: number) => Promise<void>;
  getSettingsAction: (uID: string | undefined | null) => Promise<void>;
  getPaymentsDefaultAction: (uID: string) => Promise<void>;
  deletePaymentsAction: (paymentId: string, userId: string) => Promise<void>;
  savePaymentAction: (userId: string, payment: IPayment) => Promise<void>;
}

export declare interface ILogin {
  user: IUser | null;
  loginUserAction: () => Promise<void>;
}

export declare interface ISettingsFormProps {
  onSubmit: (totalAmount: number, cutOffDate: number) => void;
  settings: ISettingsState;
  saving: boolean;
}
