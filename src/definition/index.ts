import { IUser } from './IUser';
import { ISettings } from './ISettings';
import { ISettingsState } from '../redux/settings-duck';
import { IPayments } from '../redux/payments-duck';

export declare interface IBasePageProps {
  user: IUser | null;
  settings: ISettingsState;
  payments: IPayments;
}

export declare interface ISettingsPageProps extends IBasePageProps {
  saveSettingsAction: (uID: string, s: ISettings) => Promise<void>;
  getSettingsAction: (uID: string | undefined | null) => Promise<void>;
  getPaymentsDefaultAction: (uID: string) => Promise<void>;
}

export declare interface IHomePageProps extends IBasePageProps {
  getPaymentsAction: (userId: string, cutOffDate: number) => Promise<void>;
  getSettingsAction: (uID: string | undefined | null) => Promise<void>;
  getPaymentsDefaultAction: (uID: string) => Promise<void>;
}

export declare interface ILogin {
  user: IUser | null;
  loginUserAction: () => Promise<void>;
}
