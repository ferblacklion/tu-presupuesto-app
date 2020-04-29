import React from 'react';
import { IUser } from '../definition/IUser';
import { Link } from 'react-router-dom';
import { ROUTES } from '../routes';

export declare interface IUserInfoProps {
  user: IUser;
}
function UserInfo({ user }: IUserInfoProps) {
  return (
    <div className="header">
      <div className="container">
        <div className="header-content">
          <div className="header-left">
            <div className="profile-picture">
              <img src={`${user.photoURL}`} alt={`${user.displayName}`} />
            </div>
          </div>
          <div className="header-title">{user.displayName}</div>
          <div className="header-right">
            <Link to={ROUTES.SETTINGS}>
              <svg>
                <use xlinkHref="#settings" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default React.memo(UserInfo);
