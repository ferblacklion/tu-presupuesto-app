import React from 'react';
import { loginUserAction } from '../redux/user-duck';

export default function Login() {
  const login = () => {
    loginUserAction();
  };
  return (
    <div>
      <button onClick={login}>LOGIN</button>
    </div>
  );
}
