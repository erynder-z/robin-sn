import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { BiSpaceBar } from 'react-icons/bi';
import './DirectMessages.css';
import { doc, updateDoc } from 'firebase/firestore';
import { GetUserContext } from '../../contexts/UserContext';
import DirectMessageItem from '../DirectMessageItem/DirectMessageItem';
import { database } from '../../data/firebase';

function DirectMessages({ changeActiveTab, showWarning, showOverlayEffect }) {
  const { userData } = GetUserContext();
  const [userMessages, setUserMessages] = useState([...userData.messages]);

  const handleMarkMessageAsRead = async (message) => {
    const getMessageList = async () => {
      const list = [...userMessages];
      const newList = [];
      list.forEach((msg) => {
        if (msg.messageID === message.messageID) {
          newList.push({ ...msg, isRead: true });
        } else {
          newList.push(msg);
        }
      });
      return newList.reverse();
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

  useEffect(() => {
    setUserMessages([...userData.messages].reverse());
  }, [userData.messages]);

  useEffect(() => {
    changeActiveTab('directmessages');
  }, []);

  return (
    <div className="directMessages-container fadein">
      <div className="directMessages-header">Direct messages</div>
      <div className="directMessages-content">
        {userMessages?.length <= 0 && (
          <div className="empty">
            <BiSpaceBar size="3rem" />
            <h4> empty...</h4>
            <h5> received direct messages will show up here</h5>
          </div>
        )}

        {userMessages?.map((message) => (
          <DirectMessageItem
            key={message.messageID}
            message={message}
            handleMarkMessageAsRead={handleMarkMessageAsRead}
            showWarning={showWarning}
            showOverlayEffect={showOverlayEffect}
          />
        ))}
      </div>
    </div>
  );
}

export default DirectMessages;

DirectMessages.propTypes = {
  changeActiveTab: PropTypes.func.isRequired,
  showWarning: PropTypes.func.isRequired,
  showOverlayEffect: PropTypes.func.isRequired
};
