import React, { useState } from 'react';
import PropTypes from 'prop-types';
import uniqid from 'uniqid';
import { MdOutlineEmojiEmotions } from 'react-icons/md';
import './MessageModal.css';
import { arrayUnion, doc, Timestamp, updateDoc } from 'firebase/firestore';
import { GetUserContext } from '../../contexts/UserContext';
import { database } from '../../data/firebase';
import EmojiPicker from '../EmojiPicker/EmojiPicker';

function MessageModal({ showWarning, setShowMessageModal, showOverlayEffect, userInView }) {
  const { userData } = GetUserContext();
  const [text, setText] = useState('');
  const [fadeModal, setFadeModal] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // add emoji from picker to text
  const onEmojiClick = (event, emojiObject) => {
    setShowEmojiPicker(false);
    setText(text + emojiObject.emoji);
  };

  // save messages in database
  const sendMessage = async () => {
    if (text !== '') {
      try {
        const userRef = doc(database, 'users', userInView.userID);
        await updateDoc(userRef, {
          messages: arrayUnion({
            messageID: uniqid(),
            messageContent: text,
            senderID: userData.userID,
            senderUsername: userData.username,
            isRead: false,
            sendDate: Timestamp.now()
          })
        });

        setFadeModal(true);
        setTimeout(() => setShowMessageModal(false), 100);
      } catch (err) {
        showWarning(err.message);
      }
      showOverlayEffect('sending message');
    } else {
      showWarning('Enter a message!');
    }
  };

  return (
    <div className={`messageModal-overlay ${fadeModal ? 'fadeout' : 'fadein'}`}>
      <div
        role="textbox"
        tabIndex={0}
        className="messageModal-body"
        placeholder="enter text"
        value={text}
        onChange={(e) => {
          setText(e.target.value);
        }}
        onClick={(e) => {
          e.stopPropagation();
        }}
        onKeyDown={(e) => {
          e.stopPropagation();
        }}>
        <div className="messageModal-container">
          <div className="messageModal-left">
            {' '}
            <img className="message-userpic" src={userInView?.userPic} alt="user avatar" />
            <div className="message-userpic-divider" />
            <img className="message-userpic" src={userData.userPic} alt="user avatar" />
          </div>
          <div className="messageModal-right">
            <div className="messageModal-upper">
              <div className="messageTo"> Messaging @{userInView?.username}</div>{' '}
              <div
                className="message-closeBtn"
                role="button"
                tabIndex={0}
                onClick={(e) => {
                  setFadeModal(true);
                  setTimeout(() => setShowMessageModal(false), 100);
                  e.stopPropagation();
                }}
                onKeyDown={(e) => {
                  setFadeModal(true);
                  setTimeout(() => setShowMessageModal(false), 100);
                  e.stopPropagation();
                }}>
                &times;
              </div>
            </div>
            <textarea
              className="message-modal-textarea"
              cols="30"
              rows="5"
              placeholder="enter message"
            />{' '}
            <div className="messageModal-post">
              <MdOutlineEmojiEmotions
                size="2rem"
                className="show-emoji-picker"
                onClick={() => {
                  setShowEmojiPicker(true);
                }}
              />
              {showEmojiPicker && (
                <EmojiPicker setShowEmojiPicker={setShowEmojiPicker} onEmojiClick={onEmojiClick} />
              )}
              <button
                className="messageBtn"
                type="submit"
                onClick={() => {
                  sendMessage();
                }}>
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MessageModal;

MessageModal.propTypes = {
  setShowMessageModal: PropTypes.func.isRequired,
  showWarning: PropTypes.func.isRequired,
  showOverlayEffect: PropTypes.func.isRequired,
  userInView: PropTypes.shape({
    userPic: PropTypes.string,
    username: PropTypes.string,
    userBackground: PropTypes.string,
    joined: PropTypes.objectOf(PropTypes.number),
    following: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)),
    followers: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)),
    likes: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)),
    posts: PropTypes.arrayOf(
      PropTypes.shape({
        created: PropTypes.objectOf(PropTypes.number),
        postID: PropTypes.string
      })
    ),
    replies: PropTypes.arrayOf(
      PropTypes.shape({ created: PropTypes.objectOf(PropTypes.number), postID: PropTypes.string })
    ),
    description: PropTypes.string,
    userID: PropTypes.string,
    messages: PropTypes.arrayOf(
      PropTypes.shape({
        messageID: PropTypes.string,
        messageContent: PropTypes.string,
        sender: PropTypes.string,
        isRead: PropTypes.bool,
        sendDate: PropTypes.objectOf(PropTypes.number)
      })
    )
  })
};

MessageModal.defaultProps = {
  userInView: PropTypes.shape({
    userPic: '',
    username: '',
    userBackground: '',
    joined: [],
    following: [],
    followers: [],
    likes: [],
    posts: [],
    replies: [],
    description: '',
    userID: '',
    messages: []
  })
};
