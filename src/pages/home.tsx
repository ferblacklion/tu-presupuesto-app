import React from 'react';
import { getUserSettings } from '../services/firebase';
import { connect } from 'react-redux';
import { IUser } from '../definition/IUser';
import { RootState } from '../redux/store';
import { loginUserAction } from '../redux/user-duck';

export interface IHomeProps {
  user: IUser | null;
  loginUserAction: any;
}
function Home({ user, loginUserAction }: IHomeProps) {
  const login = () => {
    loginUserAction();
  };

  const getSettings = () => {
    getUserSettings().then(r => {
      console.log(r);
    });
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
        </div>
      )}
      {!user?.uid && <button onClick={login}>LOGIN</button>}
      <button onClick={getSettings}>GET SETTINGS</button>
    </div>
  );
}

function mapStateToProps(state: RootState) {
  return { user: state.user.userData };
}

const dispatchToProps = {
  loginUserAction
};

export default connect(mapStateToProps, dispatchToProps)(Home);
