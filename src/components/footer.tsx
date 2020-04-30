import React from 'react';
import { FaFacebookSquare } from 'react-icons/fa';

export default function Footer() {
  const openFacebook = () => {
    window.open(
      'https://www.facebook.com/Tu-Presupuesto-Fácil-103990271263531/',
      '_blank'
    );
  };
  return (
    <div className="copy">
      <p>
        ©{new Date().getFullYear()} Presupuesto Fácil APP, Inc. All Rights
        Reserved.
      </p>
      <div style={{ textAlign: 'center' }}>
        <p>
          <FaFacebookSquare
            color={'black'}
            size={'1.5em'}
            onClick={openFacebook}
          />
        </p>
      </div>
    </div>
  );
}
