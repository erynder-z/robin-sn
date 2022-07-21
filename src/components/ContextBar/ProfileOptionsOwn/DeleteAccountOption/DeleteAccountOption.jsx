import React from 'react';
import PropTypes from 'prop-types';
import { MdOutlineDangerous } from 'react-icons/md';

function DeleteAccountOption({ setShowDeleteUserModal }) {
  return (
    <div
      className="deleteAccount"
      role="button"
      tabIndex={0}
      onClick={() => {
        setShowDeleteUserModal(true);
      }}
      onKeyDown={() => {
        setShowDeleteUserModal(true);
      }}>
      <MdOutlineDangerous className="deleteAccount-icon" size="2rem" />
      delete account
    </div>
  );
}

export default DeleteAccountOption;

DeleteAccountOption.propTypes = {
  setShowDeleteUserModal: PropTypes.func.isRequired
};
