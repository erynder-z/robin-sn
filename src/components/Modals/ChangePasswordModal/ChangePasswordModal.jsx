import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import '../Modals.css';
import { updatePassword } from 'firebase/auth';
import { auth } from '../../../data/firebase';

function ChangePasswordModal({ setShowChangePasswordModal, showWarning, showOverlayEffect }) {
  const [passwordFormValue, setPasswordFormValue] = useState('');
  const [confirmPasswordFormValue, setConfirmPasswordFormValue] = useState('');
  const [pwError, setPwError] = useState(null);

  const handleChangePassword = () => {
    if (passwordFormValue !== '' && confirmPasswordFormValue === passwordFormValue) {
      const user = auth.currentUser;
      const newPassword = passwordFormValue;

      updatePassword(user, newPassword)
        .then(() => {
          showOverlayEffect('Password updated!');
        })
        .catch((err) => {
          setPwError(`Error: ${err.message}`);
          showWarning(`Error: ${err.message}`);
        });
      setShowChangePasswordModal(false);
    }
  };

  useEffect(() => {
    if (confirmPasswordFormValue !== passwordFormValue) {
      setPwError('passwords do not match');
    } else {
      setPwError(null);
    }
  }, [confirmPasswordFormValue]);

  return (
    <div className="changePasswordModal-overlay fadein">
      <div className="changePasswordModal">
        <form>
          <div className="input-container">
            <label htmlFor="newpass">
              New password
              <input
                type="password"
                placeholder="enter new password"
                value={passwordFormValue}
                onChange={(e) => {
                  setPasswordFormValue(e.target.value);
                }}
                required
              />
            </label>
          </div>
          <div className="input-container">
            <label htmlFor="confirm-newpass">
              Confirm new password
              <input
                type="password"
                placeholder="confirm new password"
                value={confirmPasswordFormValue}
                onChange={(e) => {
                  setConfirmPasswordFormValue(e.target.value);
                }}
                required
              />
            </label>
          </div>
          <div className="button-container">
            <button className="changePasswordBtn" type="button" onClick={handleChangePassword}>
              Change Password
            </button>
          </div>
          <div className="button-container">
            <button
              className="noChangePasswordBtn"
              type="button"
              onClick={() => {
                setShowChangePasswordModal(false);
              }}>
              Return without updating
            </button>
          </div>
        </form>
        <div className="loginError">{pwError}</div>
      </div>
    </div>
  );
}

export default ChangePasswordModal;

ChangePasswordModal.propTypes = {
  setShowChangePasswordModal: PropTypes.func.isRequired,
  showWarning: PropTypes.func.isRequired,
  showOverlayEffect: PropTypes.func.isRequired
};
