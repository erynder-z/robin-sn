import React from 'react';
import PropTypes from 'prop-types';
import { BiKey } from 'react-icons/bi';

function ChangePasswordOption({ setShowChangePasswordModal }) {
  return (
    <div
      className="changePassword"
      role="button"
      tabIndex={0}
      onClick={() => {
        setShowChangePasswordModal(true);
      }}
      onKeyDown={() => {
        setShowChangePasswordModal(true);
      }}>
      <BiKey className="changePassword-icon" size="2rem" />
      change password
    </div>
  );
}

export default ChangePasswordOption;

ChangePasswordOption.propTypes = {
  setShowChangePasswordModal: PropTypes.func.isRequired
};
