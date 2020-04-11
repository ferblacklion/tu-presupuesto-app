import React from 'react';
import { loginUserAction } from '../redux/user-duck';
import { RootState } from '../redux/store';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { ILogin } from '../definition';
import { ROUTES } from '../routes';

function Login({ user, loginUserAction }: ILogin) {
  const login = () => {
    loginUserAction();
  };

  if (user && user.uid) {
    return <Redirect to={ROUTES.HOME} />;
  }

  return (
    <div>
      <button onClick={login}>LOGIN</button>
    </div>
  );
}

function mapStateToProps(state: RootState) {
  return {
    user: state.user.userData
  };
}

const dispatchToProps = {
  loginUserAction
};

export default connect(mapStateToProps, dispatchToProps)(Login);
