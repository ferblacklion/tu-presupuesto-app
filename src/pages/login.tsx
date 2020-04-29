import React from 'react';
import { loginUserAction } from '../redux/user-duck';
import { RootState } from '../redux/store';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { ILogin } from '../definition';
import { ROUTES } from '../routes';
import Footer from '../components/footer';

function Login({ user, loginUserAction }: ILogin) {
  const login = (e: React.MouseEvent) => {
    e.preventDefault();
    loginUserAction();
  };

  if (user && user.uid) {
    return <Redirect to={ROUTES.HOME} />;
  }

  return (
    <>
      <div className="header">
        <div className="container">
          <div className="header-content">
            <div className="header-title header-title-center">
              Tu Presupuesto Fácil
            </div>
          </div>
        </div>
      </div>

      <div className="content login">
        <div className="container">
          <a onClick={login} href="/" className="btn">
            <span>
              <svg>
                <use xlinkHref="#user" />
              </svg>{' '}
              Ingresar
            </span>
          </a>
        </div>
      </div>

      <Footer />

      <svg
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'block', width: 0, height: 0, opacity: 0 }}
      >
        <symbol
          id="user"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#FFF"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </symbol>
      </svg>
    </>
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
