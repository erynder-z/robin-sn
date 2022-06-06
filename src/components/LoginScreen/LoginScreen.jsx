import React from 'react';
import EmailLogin from '../EmailLogin/EmailLogin';
import './LoginScreen.css';

function LoginScreen() {
  return (
    <div className="signin-container">
      <div className="login-container">
        <EmailLogin />
      </div>
    </div>
  );
}

export default LoginScreen;
