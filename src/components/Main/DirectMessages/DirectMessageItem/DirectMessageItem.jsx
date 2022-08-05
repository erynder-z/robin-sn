import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { format, fromUnixTime } from 'date-fns';
import { BiEnvelope, BiEnvelopeOpen, BiUserCircle, BiReply, BiTrash } from 'react-icons/bi';
import { arrayRemove, doc, getDoc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { database } from '../../../../data/firebase';
import { GetUserContext } from '../../../../contexts/UserContext';
import limitNumberOfPosts from '../../../../helpers/LimitNumberOfPosts/limitNumberOfPosts';
import './DirectMessageItem.css';

function DirectMessageItem({
  message,
  handleMarkMessageAsRead,
  toggleMessageModal,
  handleSetModalActive,
  showWarning,
  setUserInView
}) {
  const { userData } = GetUserContext();
  const [expandMessage, setExpandMessage] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const getUserData = async () => {
    try {
      const userRef = doc(database, 'users', message.senderID);
      const docSnap = await getDoc(userRef);

      setUser({
        userPic: docSnap.data().userPic,
        username: docSnap.data().username,
        userBackground: docSnap.data().userBackground,
        joined: docSnap.data().joined,
        following: docSnap.data().following,
        followers: docSnap.data().followers,
        likes: limitNumberOfPosts(docSnap.data().likes),
        posts: limitNumberOfPosts(docSnap.data().posts),
        replies: limitNumberOfPosts(docSnap.data().replies),
        description: docSnap.data().description,
        userID: docSnap.data().userID,
        active: docSnap.data().active
      });
    } catch (err) {
      showWarning(err.message);
    }
  };

  const showMessageDetails = () => {
    setExpandMessage(!expandMessage);
    if (!message.isRead) {
      handleMarkMessageAsRead(message);
    }
  };

  const deleteMessage = async () => {
    const inboxRef = doc(database, 'messages', userData.userID);
    await updateDoc(inboxRef, {
      inbox: arrayRemove(message)
    });
  };

  const gotoProfile = () => {
    navigate(`/main/userprofile/${user.userID}`, {
      state: { usr: user.userID }
    });
  };

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <div
      title={expandMessage ? 'Collapse' : 'Expand'}
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
          <BiUserCircle
            title="Visit profile"
            size="2rem"
            className="messageListItem-gotoProfile"
            onClick={(e) => {
              gotoProfile();
              e.stopPropagation();
            }}
          />

          <BiTrash
            title="Delete this message"
            size="2rem"
            className="messageListItem-delete"
            onClick={(e) => {
              deleteMessage();
              e.stopPropagation();
            }}
          />
          {user?.active && (
            <BiReply
              title="Reply to this user"
              size="2rem"
              className="messageListItem-reply"
              onClick={(e) => {
                setUserInView(user);
                toggleMessageModal();
                handleSetModalActive(true);
                e.stopPropagation();
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default DirectMessageItem;

DirectMessageItem.propTypes = {
  handleMarkMessageAsRead: PropTypes.func.isRequired,
  toggleMessageModal: PropTypes.func.isRequired,
  handleSetModalActive: PropTypes.func.isRequired,
  showWarning: PropTypes.func.isRequired,
  setUserInView: PropTypes.func.isRequired,
  message: PropTypes.shape({
    messageID: PropTypes.string.isRequired,
    messageContent: PropTypes.string.isRequired,
    senderID: PropTypes.string.isRequired,
    isRead: PropTypes.bool.isRequired,
    sendDate: PropTypes.objectOf(PropTypes.number).isRequired,
    senderUsername: PropTypes.string.isRequired
  }).isRequired
};
