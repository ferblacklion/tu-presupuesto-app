import React from 'react';
import loginWithGoogle from '../services/firebase';

function App() {
  const login = () => {
    loginWithGoogle().then(user => {
      console.log(user);
    });
  };

  return (
    <div>
      <h1>hello</h1>
      <button onClick={login}>LOGIN</button>
    </div>
  );
}

export default App;
