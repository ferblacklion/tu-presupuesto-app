import React from 'react';
import { IUser } from '../definition/IUser';

export declare interface IUserInfoProps {
  user: IUser;
}
export default function UserInfo({ user }: IUserInfoProps) {
  return (
    <div>
      <h1>Hello {user.displayName}</h1>
      <img
        width="60"
        height="65"
        src={user.photoURL || ''}
        alt={user.displayName || ''}
      />
    </div>
  );
}
