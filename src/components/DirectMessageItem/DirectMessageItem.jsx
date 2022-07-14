import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { format, fromUnixTime } from 'date-fns';
import { BiEnvelope, BiEnvelopeOpen, BiReply, BiTrash } from 'react-icons/bi';
import './DirectMessageItem.css';
import { arrayRemove, doc, getDoc, updateDoc } from 'firebase/firestore';
import MessageModal from '../MessageModal/MessageModal';
import { database } from '../../data/firebase';
import { GetUserContext } from '../../contexts/UserContext';

function DirectMessageItem({ message, handleMarkMessageAsRead, showWarning, showOverlayEffect }) {
  const { userData } = GetUserContext();
  const [expandMessage, setExpandMessage] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [userInView, setUserInView] = useState(null);

  const showMessageDetails = () => {
    setExpandMessage(!expandMessage);
    if (!message.isRead) {
      handleMarkMessageAsRead(message);
    }
  };

  const getUserInView = async () => {
    try {
      const userRef = doc(database, 'users', message.senderID);
      const docSnap = await getDoc(userRef);
      setUserInView(docSnap.data());
    } catch (err) {
      showWarning(err.message);
    }
  };

  const deleteMessage = async () => {
    const userRef = doc(database, 'users', userData.userID);
    await updateDoc(userRef, {
      messages: arrayRemove(message)
    });
  };

  return (
    <div
      className="messageListItem"
      role="link"
      tabIndex={0}
      onClick={() => {
        showMessageDetails();
      }}
      onKeyDown={() => {
        showMessageDetails();
      }}>
      <div className={`messageListItem-upper ${expandMessage ? 'selected' : null}`}>
        {message.isRead ? <BiEnvelopeOpen size="1.5rem" /> : <BiEnvelope size="1.5rem" />}
        <h5 className="message-username">from: {message.senderUsername}</h5>
        <h5 className="messageListItem-date">
          {format(fromUnixTime(message.sendDate.seconds), 'dd. MMM uuu, HH:mm')}
        </h5>
      </div>
      <div className={`messageListItem-lower ${expandMessage ? 'expand' : null}`}>
        <p className="messageListItem-content">{message.messageContent}</p>
        <div className="messageListItem-options">
          <BiTrash
            size="2rem"
            className="messageListItem-delete"
            onClick={(e) => {
              deleteMessage();
              e.stopPropagation();
            }}
          />
          <BiReply
            size="2rem"
            className="messageListItem-reply"
            onClick={(e) => {
              getUserInView();
              setShowMessageModal(true);
              e.stopPropagation();
            }}
          />
        </div>
      </div>
      {showMessageModal && userInView && (
        <MessageModal
          userInView={userInView}
          showWarning={showWarning}
          setShowMessageModal={setShowMessageModal}
          showOverlayEffect={showOverlayEffect}
        />
      )}
    </div>
  );
}

export default DirectMessageItem;

DirectMessageItem.propTypes = {
  message: PropTypes.shape({
    messageID: PropTypes.string.isRequired,
    messageContent: PropTypes.string.isRequired,
    senderID: PropTypes.string.isRequired,
    isRead: PropTypes.bool.isRequired,
    sendDate: PropTypes.objectOf(PropTypes.number).isRequired,
    senderUsername: PropTypes.string.isRequired
  }).isRequired,
  handleMarkMessageAsRead: PropTypes.func.isRequired,
  showWarning: PropTypes.func.isRequired,
  showOverlayEffect: PropTypes.func.isRequired
};
