import React from 'react';
import loginWithGoogle from '../services/firebase';

function App() {
  const login = () => {
    loginWithGoogle().then(user => {
      console.log(user);
    });
  };
  const h = 'adfasf';

  // bad
  const bad = {
    foo: 3,
    bar: 4,
    'data-blah': 5
  };
  console.log(bad, h);

  return (
    <div>
      <h1>hello</h1>
      <button onClick={login}>LOGIN</button>
    </div>
  );
}

export default App;
