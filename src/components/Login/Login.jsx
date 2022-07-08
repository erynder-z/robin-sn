import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  createUserWithEmailAndPassword,
  AuthErrorCodes,
  signInWithEmailAndPassword
} from 'firebase/auth';
import { BiArrowBack } from 'react-icons/bi';
import { auth } from '../Firebase/Firebase';
import './Login.css';

function Login() {
  const [newAccount, setNewAccount] = useState(false);
  const [emailFormValue, setEmailFormValue] = useState('');
  const [passwordFormValue, setPasswordFormValue] = useState('');
  const [confirmPasswordFormValue, setConfirmPasswordFormValue] = useState('');
  const [loginError, setLoginError] = useState(null);
  const navigate = useNavigate();
  const user = auth.currentUser;

  const showLoginError = (error) => {
    if (error.code === AuthErrorCodes.INVALID_PASSWORD) {
      setLoginError('Wrong password. Try again.');
    } else {
      setLoginError(`Error: ${error.message}`);
    }
  };

  // creates an account with entered email and password
  const register = async () => {
    if (emailFormValue !== '' && passwordFormValue !== '') {
      try {
        await createUserWithEmailAndPassword(auth, emailFormValue, passwordFormValue);
      } catch (error) {
        showLoginError(error);
      }
    } else {
      showLoginError('enter a valid email and password');
    }
  };

  // logs in with entered email and password
  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, emailFormValue, passwordFormValue);
    } catch (error) {
      showLoginError(error);
    }
  };

  useEffect(() => {
    if (user) {
      navigate('/main');
    }
  }, [user]);

  useEffect(() => {
    if (confirmPasswordFormValue !== passwordFormValue) {
      setLoginError('passwords do not match');
    } else {
      setLoginError(null);
    }
  }, [confirmPasswordFormValue]);

  const CreateNewAccount = (
    <div className="newAccountContainer fadein">
      <div className="backPost">
        <BiArrowBack
          className="post-back"
          size="1.5rem"
          role="button"
          tabIndex={0}
          onClick={() => {
            setNewAccount(false);
            setLoginError(null);
          }}
          onKeyDown={() => {
            setNewAccount(false);
            setLoginError(null);
          }}
        />
      </div>
      <div className="signup-email">
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
          <div className="input-container">
            <label htmlFor="confirm-pass">
              Confirm password
              <input
                type="password"
                placeholder="confirm password"
                value={confirmPasswordFormValue}
                onChange={(e) => {
                  setConfirmPasswordFormValue(e.target.value);
                }}
                required
              />
            </label>
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
  );

  return (
    <div className="signin-container fadein">
      <div className="login-container">
        <h2>Login to existing account</h2>
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
            <div className="loginError">{loginError}</div>
            <h2 className="createNewAccount-header">Or create a new account</h2>
            <div className="button-container">
              <button
                className="createNewAccountBtn"
                type="button"
                onClick={() => {
                  setNewAccount(true);
                  setLoginError(null);
                }}>
                Create New Account
              </button>
            </div>
          </form>
        </div>
      </div>

      {newAccount && CreateNewAccount}
    </div>
  );
}

export default Login;
