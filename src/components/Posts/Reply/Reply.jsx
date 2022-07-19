import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import uniqid from 'uniqid';
import { MdOutlineEmojiEmotions } from 'react-icons/md';
import { arrayUnion, doc, Timestamp, updateDoc } from 'firebase/firestore';
import { LinearProgress } from '@mui/material';
import { database } from '../../../data/firebase';
import { GetUserContext } from '../../../contexts/UserContext';
import WarningModal from '../../Modals/WarningModal/WarningModal';
import EmojiPicker from '../../Modals/EmojiPicker/EmojiPicker';
import './Reply.css';

function Reply({ postID, replyMode, toggleReplyModal, postOwner, setReplyEffect }) {
  const { userData } = GetUserContext();
  const [mode, setMode] = useState('');
  const [text, setText] = useState('');
  const [replyUserName, setReplyUserName] = useState('');
  const [showReplyUI, setShowReplyUserName] = useState(false);
  const [fadeModal, setFadeModal] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // add replied post's ID to user object
  const addPostToUserObject = async () => {
    try {
      const docRef = doc(database, 'users', userData.userID);

      await updateDoc(docRef, {
        replies: arrayUnion({ postID, created: Timestamp.now() })
      });
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  // adds reply to the post object
  const reply = async (pID) => {
    if (text !== '') {
      try {
        const replyID = uniqid();
        const docRef = doc(database, 'posts', pID);
        await updateDoc(docRef, {
          replies: arrayUnion({
            replyID,
            replyUserID: userData.userID,
            replyContent: text,
            replyDate: Timestamp.now()
          })
        });

        addPostToUserObject(pID);
        toggleReplyModal();
        setText('');
        setReplyEffect('Replying');
      } catch (err) {
        setErrorMessage(err.message);
      }
    } else {
      setErrorMessage('enter a message!');
    }
  };

  // add emoji from picker to text
  const onEmojiClick = (event, emojiObject) => {
    setShowEmojiPicker(false);
    setText(text + emojiObject.emoji);
  };

  useEffect(() => {
    if (errorMessage) {
      setTimeout(() => setErrorMessage(null), 2000);
    }
  }, [errorMessage]);

  // determine if component should display a reply modal or append a reply-item to the parent component
  useEffect(() => {
    setMode(replyMode);
    setReplyUserName({ username: postOwner.username, userpic: postOwner.userpic });
  }, []);

  // show a modal in order to reply
  const ReplyModal = (
    <div className={`replyModal-overlay ${fadeModal ? 'fadeout' : 'fadein'}`}>
      <div
        role="textbox"
        tabIndex={0}
        className="replyModal-body"
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
        <div className="replyModal-container">
          <div className="replyModal-left">
            {' '}
            <img className="reply-userpic" src={replyUserName.userpic} alt="user avatar" />
            <div className="reply-userpic-divider" />
            <img className="reply-userpic" src={userData.userPic} alt="user avatar" />
          </div>
          <div className="replyModal-right">
            <div className="replyModal-upper">
              <div className="replyTo"> Replying to @{replyUserName.username}</div>{' '}
              <div
                className="reply-closeBtn"
                role="button"
                tabIndex={0}
                onClick={(e) => {
                  setFadeModal(true);
                  setTimeout(() => toggleReplyModal(), 100);
                  e.stopPropagation();
                }}
                onKeyDown={(e) => {
                  setFadeModal(true);
                  setTimeout(() => toggleReplyModal(), 100);
                  e.stopPropagation();
                }}>
                &times;
              </div>
            </div>
            <textarea
              className="reply-modal-textarea"
              maxLength="100"
              cols="30"
              rows="5"
              placeholder="write your reply"
            />{' '}
            <div className="progress">
              <span className="charLeft"> {100 - text.length} characters left</span>
              <LinearProgress
                className="charProgress"
                variant="determinate"
                value={text.length}
                color="inherit"
              />
            </div>
            <div className="replyModal-post">
              <MdOutlineEmojiEmotions
                title="Add emoji"
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
                className="replyBtn-modal"
                type="submit"
                onMouseDown={() => {
                  reply(postID);
                }}>
                Reply
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // append a textbox in order to reply
  const ReplyAppend = (
    <div className="replyAppend-body">
      <div className={`replyTo-append ${!showReplyUI ? 'hidden' : ''}`}>
        replying to: @{replyUserName.username}
      </div>
      <div className="replyAppend-wrapper">
        <img className="reply-userpic-append" src={userData.userPic} alt="user avatar" />
        <textarea
          maxLength="100"
          className="reply-append-textarea"
          placeholder="write your reply"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
          }}
          onFocus={() => {
            setShowReplyUserName(true);
          }}
          onBlur={() => {
            setShowReplyUserName(false);
          }}
        />
      </div>{' '}
      <div className={`progress ${!showReplyUI ? 'hidden' : ''}`}>
        <span className="charLeft"> {100 - text.length} characters left</span>
        <LinearProgress
          className="charProgress"
          variant="determinate"
          value={text.length}
          color="inherit"
        />
      </div>
      <div className="replyAppend-post">
        <MdOutlineEmojiEmotions
          title="Add emoji"
          size="2rem"
          className="show-emoji-picker"
          onMouseDown={() => {
            setShowEmojiPicker(true);
          }}
        />
        {showEmojiPicker && (
          <EmojiPicker setShowEmojiPicker={setShowEmojiPicker} onEmojiClick={onEmojiClick} />
        )}

        <button
          className="replyBtn-append"
          type="submit"
          onMouseDown={() => {
            reply(postID);
          }}>
          Reply
        </button>
      </div>
    </div>
  );

  return (
    <div className="reply-container">
      {mode === 'modal' && ReplyModal}
      {mode === 'append' && ReplyAppend}
      {errorMessage && <WarningModal errorMessage={errorMessage} />}
    </div>
  );
}

export default Reply;

Reply.propTypes = {
  postID: PropTypes.string.isRequired,
  replyMode: PropTypes.string.isRequired,
  toggleReplyModal: PropTypes.func.isRequired,
  postOwner: PropTypes.shape({
    username: PropTypes.string.isRequired,
    userpic: PropTypes.string.isRequired
  }).isRequired,
  setReplyEffect: PropTypes.func.isRequired
};
