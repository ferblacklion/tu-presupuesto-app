import { get, set, remove } from 'local-storage';
import { IUserState } from '../redux/user-duck';

export function saveStore(data: IUserState, key: string) {
  set<IUserState>(key, data);
}

export function getUserStorage(key: string): IUserState {
  return get(key);
}

export function deleteLS(key: string) {
  remove(key);
}
