import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  createUserWithEmailAndPassword,
  AuthErrorCodes,
  signInWithEmailAndPassword
} from 'firebase/auth';
import { auth } from '../Firebase/Firebase';

import './Login.css';

function Login() {
  const [emailFormValue, setEmailFormValue] = useState('');
  const [passwordFormValue, setPasswordFormValue] = useState('');
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();
  const user = auth.currentUser;

  const showLoginError = (error) => {
    if (error.code === AuthErrorCodes.INVALID_PASSWORD) {
      setLoginError('Wrong password. Try again.');
    } else {
      setLoginError(`Error: ${error.message}`);
    }
  };

  const register = async () => {
    if (emailFormValue !== '' && passwordFormValue !== '') {
      try {
        await createUserWithEmailAndPassword(auth, emailFormValue, passwordFormValue);
      } catch (error) {
        console.log(error.message);
        showLoginError(error);
      }
    } else {
      alert('enter a valid email and password');
    }
  };

  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, emailFormValue, passwordFormValue);
    } catch (error) {
      console.log(error.message);
      showLoginError(error);
    }
  };

  useEffect(() => {
    if (user) {
      navigate('/main');
    }
  }, [user]);

  return (
    <div className="signin-container">
      <div className="login-container">
        <div className="signin-email">
          <form>
            <div className="input-container">
              <label htmlFor="uname">
                Email
                <input
                  type="email"
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
              <button className="loginBtn" type="button" onClick={login}>
                Login
              </button>
            </div>
            <div className="button-container">
              <button className="signupBtn" type="button" onClick={register}>
                Create Account
              </button>
            </div>
          </form>
          <div className="loginError">{loginError}</div>
        </div>
      </div>
    </div>
  );
}

export default Login;
