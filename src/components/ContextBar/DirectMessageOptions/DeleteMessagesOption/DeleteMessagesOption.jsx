import React from 'react';
import PropTypes from 'prop-types';
import { BiXCircle } from 'react-icons/bi';

function DeleteMessagesOption({ setShowDeleteMsgModal }) {
  return (
    <div className="deleteMessages">
      <div
        className="message-delete"
        role="button"
        tabIndex={0}
        onClick={() => {
          setShowDeleteMsgModal(true);
        }}
        onKeyDown={() => {
          setShowDeleteMsgModal(true);
        }}>
        <BiXCircle size="2rem" className="message-delete-icon" />
        Delete all messages
      </div>
    </div>
  );
}

export default DeleteMessagesOption;

DeleteMessagesOption.propTypes = {
  setShowDeleteMsgModal: PropTypes.func.isRequired
};
