import React from 'react';
import PropTypes from 'prop-types';
import { BiArrowBack } from 'react-icons/bi';

function CreateNewAccount({
  confirmPasswordFormValue,
  emailFormValue,
  passwordFormValue,
  loginError,
  setNewAccount,
  setLoginError,
  setEmailFormValue,
  setPasswordFormValue,
  setConfirmPasswordFormValue,
  register
}) {
  return (
    <>
      <div className="backPost">
        <BiArrowBack
          className="login-back"
          size="3rem"
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
        <header>
          <div className="app-header-container">
            <h2 className="app-header">Create your account</h2>
          </div>
        </header>
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
              Create account
            </button>
          </div>
        </form>
        <div className="loginError-createAcct">{loginError}</div>
      </div>
    </>
  );
}

export default CreateNewAccount;

CreateNewAccount.propTypes = {
  emailFormValue: PropTypes.string.isRequired,
  passwordFormValue: PropTypes.string.isRequired,
  confirmPasswordFormValue: PropTypes.string.isRequired,
  loginError: PropTypes.string,
  setNewAccount: PropTypes.func.isRequired,
  setLoginError: PropTypes.func.isRequired,
  setEmailFormValue: PropTypes.func.isRequired,
  setPasswordFormValue: PropTypes.func.isRequired,
  setConfirmPasswordFormValue: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired
};

CreateNewAccount.defaultProps = {
  loginError: null
};
