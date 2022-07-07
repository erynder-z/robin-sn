import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import uniqid from 'uniqid';
import Picker from 'emoji-picker-react';
import './Reply.css';
import { MdOutlineEmojiEmotions } from 'react-icons/md';
import { arrayUnion, doc, Timestamp, updateDoc } from 'firebase/firestore';
import { database } from '../Firebase/Firebase';
import { GetUserContext } from '../../contexts/UserContext';
import EmptyMessageWarning from '../EmptyMessageWarning/EmptyMessageWarning';

function Reply({ postID, replyMode, toggleReplyModal, postOwner }) {
  const { userData } = GetUserContext();
  const [mode, setMode] = useState('');
  const [text, setText] = useState('');
  const [replyUserName, setReplyUserName] = useState('');
  const [showReplyUserName, setShowReplyUserName] = useState(false);
  const [fadeModal, setFadeModal] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [emptyMessageWarning, setEmptyMessageWarning] = useState(false);

  const showEmptyMessageWarning = () => {
    setEmptyMessageWarning(true);
  };

  // add replied post's ID to user object
  const addPostToUserObject = async () => {
    try {
      const docRef = doc(database, 'users', userData.userID);

      await updateDoc(docRef, {
        replies: arrayUnion({ postID, created: Timestamp.now() })
      });
    } catch (err) {
      console.log(err);
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
      } catch (err) {
        console.log(err);
      }
    } else {
      showEmptyMessageWarning();
    }
  };

  // add emoji from picker to text
  const onEmojiClick = (event, emojiObject) => {
    setShowEmojiPicker(false);
    setText(text + emojiObject.emoji);
  };

  useEffect(() => {
    if (emptyMessageWarning) {
      setTimeout(() => setEmptyMessageWarning(false), 2000);
    }
  }, [emptyMessageWarning]);

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
              cols="30"
              rows="5"
              placeholder="write your reply"
            />
            <div className="replyModal-post">
              <MdOutlineEmojiEmotions
                size="2rem"
                className="show-emoji-picker"
                onClick={() => {
                  setShowEmojiPicker(true);
                }}
              />
              {showEmojiPicker && (
                <div className="emoji-picker-overlay">
                  <div
                    className="emoji-picker-close"
                    role="button"
                    tabIndex={0}
                    onClick={() => {
                      setShowEmojiPicker(false);
                    }}
                    onKeyDown={() => {
                      setShowEmojiPicker(false);
                    }}>
                    {' '}
                    &times;
                  </div>
                  <Picker onEmojiClick={onEmojiClick} disableSearchBar />
                </div>
              )}
              <button
                className="replyBtn-modal"
                type="submit"
                onClick={() => {
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
      <div className={`replyTo-append ${!showReplyUserName ? 'hidden' : ''}`}>
        replying to: @{replyUserName.username}
      </div>
      <div className="replyAppend-wrapper">
        <img className="reply-userpic-append" src={userData.userPic} alt="user avatar" />
        <textarea
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
      </div>
      <div className="replyAppend-post">
        <MdOutlineEmojiEmotions
          size="2rem"
          className="show-emoji-picker"
          onClick={() => {
            setShowEmojiPicker(true);
          }}
        />
        {showEmojiPicker && (
          <div className="emoji-picker-overlay">
            <div
              className="emoji-picker-close"
              role="button"
              tabIndex={0}
              onClick={() => {
                setShowEmojiPicker(false);
              }}
              onKeyDown={() => {
                setShowEmojiPicker(false);
              }}>
              {' '}
              &times;
            </div>
            <Picker onEmojiClick={onEmojiClick} disableSearchBar />
          </div>
        )}

        <button
          className="replyBtn-append"
          type="submit"
          onClick={() => {
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
      {emptyMessageWarning && <EmptyMessageWarning />}
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
  }).isRequired
};
