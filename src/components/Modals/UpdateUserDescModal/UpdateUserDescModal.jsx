import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { doc, updateDoc } from 'firebase/firestore';
import { database } from '../../../data/firebase';
import { GetUserContext } from '../../../contexts/UserContext';
import '../Modals.css';

function UpdateUserDescModal({ setShowUpdateUserDescModal, showWarning }) {
  const { userData } = GetUserContext();
  const [descriptionText, setDescriptionText] = useState('');

  const updateUserDescription = async () => {
    const userRef = doc(database, 'users', userData.userID);

    try {
      updateDoc(userRef, {
        description: descriptionText
      });
    } catch (err) {
      showWarning(err.message);
    }
    setDescriptionText('');
  };

  return (
    <div className="updateDescModal-overlay fadein">
      <div className="updateDescModal">
        <label htmlFor="udescUpdate" className="descUpdateInput-label">
          <h3>About you</h3>
          <textarea
            className="descriptionUpdate-input"
            type="text"
            maxLength="100"
            placeholder="max. 100 characters"
            value={descriptionText}
            onChange={(e) => {
              setDescriptionText(e.target.value);
            }}
            required
          />
        </label>
        <div
          className="updateDesc-updateBtn"
          role="button"
          tabIndex={0}
          onClick={() => {
            updateUserDescription();
            setShowUpdateUserDescModal(false);
          }}
          onKeyDown={() => {
            updateUserDescription();
            setShowUpdateUserDescModal(false);
          }}>
          Update
        </div>
        <div
          className="updateDesc-closeBtn"
          role="button"
          tabIndex={0}
          onClick={() => {
            setShowUpdateUserDescModal(false);
          }}
          onKeyDown={() => {
            setShowUpdateUserDescModal(false);
          }}>
          Close without updating
        </div>
      </div>
    </div>
  );
}

export default UpdateUserDescModal;

UpdateUserDescModal.propTypes = {
  setShowUpdateUserDescModal: PropTypes.func.isRequired,
  showWarning: PropTypes.func.isRequired
};
