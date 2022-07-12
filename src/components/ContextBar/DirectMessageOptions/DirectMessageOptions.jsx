import React from 'react';
import PropTypes from 'prop-types';
import { BiCheckDouble } from 'react-icons/bi';
import './DirectMessageOptions.css';
import { doc, updateDoc } from 'firebase/firestore';
import { GetUserContext } from '../../../contexts/UserContext';
import { database } from '../../Firebase/Firebase';

function DirectMessageOptions({ showWarning }) {
  const { userData } = GetUserContext();

  const markMessagesAsRead = async () => {
    const getMessageList = async () => {
      const list = [...userData.messages];
      const newList = [];
      list.forEach((msg) => {
        newList.push({ ...msg, isRead: true });
      });
      return newList;
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
    </div>
  );
}

export default DirectMessageOptions;

DirectMessageOptions.propTypes = {
  showWarning: PropTypes.func.isRequired
};
