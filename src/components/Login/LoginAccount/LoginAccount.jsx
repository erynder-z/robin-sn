import React from 'react';
import PropTypes from 'prop-types';

function LoginAccount({
  emailFormValue,
  passwordFormValue,
  loginError,
  setNewAccount,
  setLoginError,
  setEmailFormValue,
  setPasswordFormValue,
  login
}) {
  return (
    <>
      <h2 className="login-header">Login to existing account</h2>
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

          <h2 className="createNewAccount-header">Or create a new account</h2>
          <div className="button-container">
            <button
              className="createNewAccountBtn"
              type="button"
              onClick={() => {
                setNewAccount(true);
                setLoginError(null);
              }}>
              Create new account
            </button>
          </div>
        </form>
      </div>
      <div className="loginError">{loginError}</div>
    </>
  );
}

export default LoginAccount;

LoginAccount.propTypes = {
  emailFormValue: PropTypes.string.isRequired,
  passwordFormValue: PropTypes.string.isRequired,
  loginError: PropTypes.string,
  setNewAccount: PropTypes.func.isRequired,
  setLoginError: PropTypes.func.isRequired,
  setEmailFormValue: PropTypes.func.isRequired,
  setPasswordFormValue: PropTypes.func.isRequired,
  login: PropTypes.func.isRequired
};

LoginAccount.defaultProps = {
  loginError: null
};
