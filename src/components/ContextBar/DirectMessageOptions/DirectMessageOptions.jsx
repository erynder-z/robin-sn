import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { doc, updateDoc } from 'firebase/firestore';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { GetUserContext } from '../../../contexts/UserContext';
import { database } from '../../../data/firebase';
import MarkMessagesReadOption from './MarkMessagesReadOption/MarkMessagesReadOption';
import DeleteMessagesOption from './DeleteMessagesOption/DeleteMessagesOption';
import './DirectMessageOptions.css';

function DirectMessageOptions({ showWarning }) {
  const { userData } = GetUserContext();
  const [inbox] = useDocumentData(doc(database, 'messages', userData.userID));
  const [showDeleteMsgModal, setShowDeleteMsgModal] = useState(false);

  const markMessagesAsRead = async () => {
    const getMessageList = async () => {
      const list = [...inbox.inbox];
      const newList = [];
      list.forEach((msg) => {
        newList.push({ ...msg, isRead: true });
      });
      return newList;
    };

    const updatedMessageList = await getMessageList();
    const inboxRef = doc(database, 'messages', userData.userID);
    try {
      await updateDoc(inboxRef, {
        inbox: updatedMessageList
      });
    } catch (err) {
      showWarning(err.message);
    }
  };

  const deleteAllMessages = async () => {
    const inboxRef = doc(database, 'messages', userData.userID);
    try {
      await updateDoc(inboxRef, {
        inbox: []
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
      <MarkMessagesReadOption markMessagesAsRead={markMessagesAsRead} />
      <DeleteMessagesOption setShowDeleteMsgModal={setShowDeleteMsgModal} />
      {showDeleteMsgModal && DeleteMessagesModal}
    </div>
  );
}

export default DirectMessageOptions;

DirectMessageOptions.propTypes = {
  showWarning: PropTypes.func.isRequired
};
