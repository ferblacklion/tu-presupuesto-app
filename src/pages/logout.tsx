import React from 'react';
import logout from '../utils/logout';

export default function Logout() {
  return (
    <div>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
