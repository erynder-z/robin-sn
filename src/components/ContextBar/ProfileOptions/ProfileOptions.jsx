import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { MdOutlineDangerous } from 'react-icons/md';

import './ProfileOptions.css';

function ProfileOptions({ deleteAccount }) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const DeleteModal = (
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
            setShowDeleteModal(false);
          }}>
          No, return to previous page!
        </button>
      </div>
    </div>
  );

  return (
    <div className="profileOptions-container fadein">
      <div className="profileOptions-header">Profile options</div>
      <div
        className="deleteAccount"
        role="button"
        tabIndex={0}
        onClick={() => {
          setShowDeleteModal(true);
        }}
        onKeyDown={() => {
          setShowDeleteModal(true);
        }}>
        <MdOutlineDangerous className="account-delete" size="2rem" />
        delete account
      </div>
      {showDeleteModal && DeleteModal}
    </div>
  );
}

export default ProfileOptions;

ProfileOptions.propTypes = {
  deleteAccount: PropTypes.func.isRequired
};
