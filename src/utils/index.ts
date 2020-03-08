import { IPlainObject } from '../definition/IPlainObject';

export function saveStore(data: any, key: string) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function getStorage(key: string): IPlainObject {
  const value = localStorage.getItem(key);
  if (value) {
    return JSON.parse(value);
  }
  return {};
}
