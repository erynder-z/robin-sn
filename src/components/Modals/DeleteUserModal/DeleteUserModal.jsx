import React from 'react';
import PropTypes from 'prop-types';
import '../Modals.css';

function DeleteUserModal({ setShowDeleteUserModal, deleteAccount }) {
  return (
    <div className="deleteModal-overlay">
      <div className="deleteModal">
        <h3 className="delete-warning">Are you sure?</h3>
        <h4>This action cannot be undone!</h4>
        <h5>All of your posts, hashtags and uploaded pictures will be deleted!</h5>
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
