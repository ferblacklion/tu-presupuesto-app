import React from 'react';
import { loginWithGoogle, getUserSettings } from '../services/firebase';

function Home() {
  const login = () => {
    loginWithGoogle().then(user => {
      console.log(user);
    });
  };

  const getSettings = () => {
    getUserSettings().then(r => {
      console.log(r);
    });
  };

  return (
    <div>
      <h1>hello</h1>
      <button onClick={login}>LOGIN</button>
      <button onClick={getSettings}>GET SETTINGS</button>
    </div>
  );
}

export default Home;
