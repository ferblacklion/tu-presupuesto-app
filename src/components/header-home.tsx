import React from 'react';
import { IUser } from '../definition/IUser';
import { Link } from 'react-router-dom';
import { ROUTES } from '../routes';
import ProfilePicture from './profile-picture';

export declare interface IUserInfoProps {
  user: IUser;
}
function HeaderHome({ user }: IUserInfoProps) {
  return (
    <>
      <div className="header-left">
        <ProfilePicture
          photoURL={`${user.photoURL}`}
          displayName={`${user.displayName}`}
        />
      </div>
      <div className="header-title">{user.displayName}</div>
      <div className="header-right">
        <Link to={ROUTES.SETTINGS}>
          <svg>
            <use xlinkHref="#settings" />
          </svg>
        </Link>
      </div>
    </>
  );
}

export default React.memo(HeaderHome);
