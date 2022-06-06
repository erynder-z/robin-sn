import {
  createUserWithEmailAndPassword,
  AuthErrorCodes,
  signInWithEmailAndPassword
} from 'firebase/auth';
import React, { useState } from 'react';
import { auth } from '../Firebase/Firebase';
import './EmailLogin.css';

function EmailLogin() {
  const [loginError, setLoginError] = useState('');
  const [emailFormValue, setEmailFormValue] = useState('');
  const [passwordFormValue, setPasswordFormValue] = useState('');

  const showLoginError = (error) => {
    if (error.code === AuthErrorCodes.INVALID_PASSWORD) {
      setLoginError('Wrong password. Try again.');
    } else {
      setLoginError(`Error: ${error.message}`);
    }
  };

  const loginEmailPassword = async (email, password) => {
    try {
      const userCredentials = await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.log(error);
      showLoginError(error);
    }
  };

  const createAccount = async (email, password) => {
    try {
      const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.log(error);
      showLoginError(error);
    }
  };

  const handleSubmitLogin = () => {
    loginEmailPassword(emailFormValue, passwordFormValue);
  };

  const handleSubmitCreateAccount = () => {
    createAccount(emailFormValue, passwordFormValue);
  };

  return (
    <div className="signin-email">
      <form>
        <div className="input-container">
          <label htmlFor="uname">
            Username
            <input
              type="text"
              placeholder="enter email"
              value={emailFormValue}
              onChange={(e) => {
                setEmailFormValue(e.target.value);
              }}
              required
            />
          </label>
        </div>
        <div className="input-container">
          <label htmlFor="pass">
            Password
            <input
              type="password"
              placeholder="enter password"
              value={passwordFormValue}
              onChange={(e) => {
                setPasswordFormValue(e.target.value);
              }}
              required
            />
          </label>
        </div>
        <div className="button-container">
          <button className="loginBtn" type="button" onClick={handleSubmitLogin}>
            Login
          </button>
        </div>
        <div className="button-container">
          <button className="signupBtn" type="button" onClick={handleSubmitCreateAccount}>
            Create Account
          </button>
        </div>
      </form>
      <div className="loginError">{loginError}</div>
    </div>
  );
}

export default EmailLogin;
