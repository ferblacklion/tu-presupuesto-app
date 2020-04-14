import { IUser } from './IUser';

export interface IUserState {
  loggedIn: boolean;
  userData: IUser | null;
  fetching: boolean;
  error: string;
}
