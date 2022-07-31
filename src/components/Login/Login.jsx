import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  createUserWithEmailAndPassword,
  AuthErrorCodes,
  signInWithEmailAndPassword
} from 'firebase/auth';
import { BsGithub } from 'react-icons/bs';
import { auth } from '../../data/firebase';
import logo from '../../assets/logo.png';
import CreateNewAccount from './CreateNewAccount/CreateNewAccount';
import LoginAccount from './LoginAccount/LoginAccount';
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
      } catch (err) {
        showLoginError(err.message);
      }
    } else {
      showLoginError('enter a valid email and password');
    }
  };

  // logs in with entered email and password
  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, emailFormValue, passwordFormValue);
    } catch (err) {
      showLoginError(err.message);
    }
  };

  useEffect(() => {
    if (confirmPasswordFormValue !== passwordFormValue) {
      setLoginError('passwords do not match');
    } else {
      setLoginError(null);
    }
  }, [confirmPasswordFormValue]);

  // navitage to main-component is user is already logged in
  useEffect(() => {
    if (user) {
      navigate('/main');
    }
  }, [user]);

  return (
    <div className="signin-container fadein">
      <header>
        <div className="app-header-container">
          <h1 className="app-header">Welcome to Robin - A social network</h1>
        </div>
      </header>
      <div className="logo-container">
        <img className="logo-big" src={logo} alt="app logo" />
      </div>
      <div className="login-container">
        {newAccount ? (
          <CreateNewAccount
            confirmPasswordFormValue={confirmPasswordFormValue}
            emailFormValue={emailFormValue}
            passwordFormValue={passwordFormValue}
            loginError={loginError}
            setNewAccount={setNewAccount}
            setLoginError={setLoginError}
            setEmailFormValue={setEmailFormValue}
            setPasswordFormValue={setPasswordFormValue}
            setConfirmPasswordFormValue={setConfirmPasswordFormValue}
            register={register}
          />
        ) : (
          <LoginAccount
            emailFormValue={emailFormValue}
            passwordFormValue={passwordFormValue}
            loginError={loginError}
            setNewAccount={setNewAccount}
            setLoginError={setLoginError}
            setEmailFormValue={setEmailFormValue}
            setPasswordFormValue={setPasswordFormValue}
            login={login}
          />
        )}
      </div>
      <div className="about">
        <h3> © 2022 erynder-z</h3>
        <a href="https://github.com/erynder-z">
          <BsGithub className="about-icon" size="2rem" />
        </a>
      </div>{' '}
    </div>
  );
}

export default Login;
