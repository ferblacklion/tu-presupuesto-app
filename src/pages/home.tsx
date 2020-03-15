import React, { useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import { IUser } from '../definition/IUser';
import { RootState } from '../redux/store';
import { loginUserAction, loginFromStoreAction } from '../redux/user-duck';

export interface IHomeProps {
  user: IUser | null;
  loginUserAction: () => Promise<void>;
  loginFromStoreAction: () => Promise<void>;
}
function Home({ user, loginUserAction, loginFromStoreAction }: IHomeProps) {
  const initFetch = useCallback(() => {
    loginFromStoreAction();
  }, [loginFromStoreAction]);

  useEffect(() => {
    initFetch();
  }, [initFetch]);

  const login = () => {
    loginUserAction();
  };

  return (
    <div>
      {user?.uid && (
        <div>
          <h1>Hello {user?.displayName}</h1>
          <img
            width="60"
            height="65"
            src={user?.photoURL || ''}
            alt={user?.displayName || ''}
          />
          <p>pages:</p>
          <p>
            <a href="/settings" title="settings">
              Settings
            </a>
          </p>
        </div>
      )}
      {!user?.uid && <button onClick={login}>LOGIN</button>}
    </div>
  );
}

function mapStateToProps(state: RootState) {
  return { user: state.user.userData };
}

const dispatchToProps = {
  loginUserAction,
  loginFromStoreAction
};

export default connect(mapStateToProps, dispatchToProps)(Home);
