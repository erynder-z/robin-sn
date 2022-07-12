import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { BiCheckDouble, BiXCircle } from 'react-icons/bi';
import './DirectMessageOptions.css';
import { doc, updateDoc } from 'firebase/firestore';
import { GetUserContext } from '../../../contexts/UserContext';
import { database } from '../../../data/firebase';

function DirectMessageOptions({ showWarning }) {
  const { userData } = GetUserContext();
  const [showDeleteMsgModal, setShowDeleteMsgModal] = useState(false);

  const markMessagesAsRead = async () => {
    const getMessageList = async () => {
      const list = [...userData.messages];
      const newList = [];
      list.forEach((msg) => {
        newList.push({ ...msg, isRead: true });
      });
      return newList();
    };

    const updatedMessageList = await getMessageList();
    const userRef = doc(database, 'users', userData.userID);
    try {
      await updateDoc(userRef, {
        messages: updatedMessageList
      });
    } catch (err) {
      showWarning(err.message);
    }
  };

  const deleteAllMessages = async () => {
    const userRef = doc(database, 'users', userData.userID);
    try {
      await updateDoc(userRef, {
        messages: []
      });
    } catch (err) {
      showWarning(err.message);
    }
  };

  const DeleteMessagesModal = (
    <div className="deleteModal-overlay">
      <div className="deleteModal">
        <h3 className="delete-warning">Are you sure?</h3>
        <button
          type="button"
          className="deleteAllMessagesBtn"
          onClick={() => {
            deleteAllMessages();
            setShowDeleteMsgModal(false);
          }}>
          Yes, delete all messages!
        </button>
        <button
          type="button"
          className="dontDeleteMessagesBtn"
          onClick={() => {
            setShowDeleteMsgModal(false);
          }}>
          No, return to previous page!
        </button>
      </div>
    </div>
  );

  return (
    <div className="directMessages fadein">
      <div className="directMessages-context-header">Options</div>
      <div className="markMessagesRead">
        <div
          className="message-markRead"
          role="button"
          tabIndex={0}
          onClick={() => {
            markMessagesAsRead();
          }}
          onKeyDown={() => {
            markMessagesAsRead();
          }}>
          <BiCheckDouble size="2rem" className="message-markRead-icon" />
          Mark all as read
        </div>
      </div>
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
      {showDeleteMsgModal && DeleteMessagesModal}
    </div>
  );
}

export default DirectMessageOptions;

DirectMessageOptions.propTypes = {
  showWarning: PropTypes.func.isRequired
};
