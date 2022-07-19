import React from 'react';
import PropTypes from 'prop-types';
import '../Modals.css';

function DeleteUserModal({ setShowDeleteUserModal, deleteAccount }) {
  return (
    <div className="deleteModal-overlay">
      <div className="deleteModal">
        <h3 className="delete-warning">Are you sure?</h3>
        <h4>This action cannot be undone!</h4>
        <button
          type="button"
          className="accountDeleteBtn"
          onClick={() => {
            deleteAccount();
          }}>
          Yes, delete my account!
        </button>
        <button
          type="button"
          className="accountNoDeleteBtn"
          onClick={() => {
            setShowDeleteUserModal(false);
          }}>
          No, return to previous page!
        </button>
      </div>
    </div>
  );
}

export default DeleteUserModal;

DeleteUserModal.propTypes = {
  setShowDeleteUserModal: PropTypes.func.isRequired,
  deleteAccount: PropTypes.func.isRequired
};
