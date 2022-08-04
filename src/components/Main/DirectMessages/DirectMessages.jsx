import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { BiSpaceBar } from 'react-icons/bi';
import { doc, updateDoc } from 'firebase/firestore';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { GetUserContext } from '../../../contexts/UserContext';
import DirectMessageItem from './DirectMessageItem/DirectMessageItem';
import { database } from '../../../data/firebase';
import FetchingIcon from '../FetchingIcon/FetchingIcon';
import './DirectMessages.css';

function DirectMessages({
  changeActiveTab,
  showWarning,
  toggleMessageModal,
  handleSetModalActive,
  setUserInView
}) {
  const { userData } = GetUserContext();
  const [inbox] = useDocumentData(doc(database, 'messages', userData.userID));
  const [userMessages, setUserMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const sortMessages = (lst) => {
    const unsorted = [];
    lst.map((o) =>
      unsorted.push({
        isRead: o.isRead,
        messageContent: o.messageContent,
        messageID: o.messageID,
        sendDate: o.sendDate,
        senderID: o.senderID,
        senderUsername: o.senderUsername
      })
    );
    const sorted = unsorted.sort((a, b) => (a.sendDate.seconds < b.sendDate.seconds ? 1 : -1));
    return sorted;
  };

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

  useEffect(() => {
    setUserMessages(inbox?.inbox);
    setLoading(false);
  }, [inbox]);

  useEffect(() => {
    changeActiveTab('directmessages');
  }, []);

  return (
    <div className="directMessages-container fadein">
      <div className="directMessages-header">Direct messages</div>
      {loading ? (
        <FetchingIcon />
      ) : (
        <div className="directMessages-content">
          <div className="messages">
            {userMessages?.length <= 0 && (
              <div className="empty">
                <BiSpaceBar size="3rem" />
                <h4> empty...</h4>
                <h5> received direct messages will show up here</h5>
              </div>
            )}

            {userMessages &&
              sortMessages(userMessages)?.map((message) => (
                <DirectMessageItem
                  key={message.messageID}
                  message={message}
                  handleMarkMessageAsRead={handleMarkMessageAsRead}
                  toggleMessageModal={toggleMessageModal}
                  handleSetModalActive={handleSetModalActive}
                  showWarning={showWarning}
                  setUserInView={setUserInView}
                />
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default DirectMessages;

DirectMessages.propTypes = {
  changeActiveTab: PropTypes.func.isRequired,
  showWarning: PropTypes.func.isRequired,
  toggleMessageModal: PropTypes.func.isRequired,
  handleSetModalActive: PropTypes.func.isRequired,
  setUserInView: PropTypes.func.isRequired
};
