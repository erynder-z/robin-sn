import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import uniqid from 'uniqid';
import './Reply.css';
import { arrayUnion, doc, Timestamp, updateDoc } from 'firebase/firestore';
import { database } from '../Firebase/Firebase';

function Reply({ postID, userID, replyMode, toggleReplyModal }) {
  const [mode, setMode] = useState('');
  const [text, setText] = useState('');

  // add replied post's ID to user object
  const addPostToUserObject = async () => {
    const docRef = doc(database, 'users', userID);

    await updateDoc(docRef, {
      replies: arrayUnion({ postID })
    });
  };

  // adds reply to the post object
  const reply = async () => {
    const replyID = uniqid();
    const docRef = doc(database, 'posts', postID);
    await updateDoc(docRef, {
      replies: arrayUnion({
        replyID,
        replyUserID: userID,
        replyContent: text,
        replyDate: Timestamp.now()
      })
    });

    addPostToUserObject(postID);
    toggleReplyModal();
    setText('');
  };

  useEffect(() => {
    setMode(replyMode);
  }, []);

  // show a modal in order to reply
  const ReplyModal = (
    <div
      className="replyModal-overlay"
      role="button"
      tabIndex={0}
      onClick={(e) => {
        toggleReplyModal();
        e.stopPropagation();
      }}
      onKeyDown={(e) => {
        toggleReplyModal();
        e.stopPropagation();
      }}>
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
        <div
          className="close"
          role="button"
          tabIndex={0}
          onClick={() => {
            toggleReplyModal();
          }}
          onKeyDown={() => {
            toggleReplyModal();
          }}>
          &times;
        </div>
        <textarea name="newPost" id="newPost" cols="30" rows="10" placeholder="write your reply" />
        <button
          className="postBtn"
          type="submit"
          onClick={() => {
            reply();
          }}>
          Reply
        </button>
      </div>
    </div>
  );

  // append a textbox in order to reply
  const ReplyAppend = (
    <div className="replyAppend-body">
      <textarea
        name="newPost"
        id="newPost"
        cols="30"
        rows="10"
        placeholder="write your reply"
        value={text}
        onChange={(e) => {
          setText(e.target.value);
        }}
      />
      <button
        className="postBtn"
        type="submit"
        onClick={() => {
          reply();
        }}>
        Reply
      </button>
    </div>
  );

  return (
    <div className="reply-container">
      {mode === 'modal' && ReplyModal}
      {mode === 'append' && ReplyAppend}
    </div>
  );
}

export default Reply;

Reply.propTypes = {
  postID: PropTypes.string.isRequired,
  userID: PropTypes.string.isRequired,
  replyMode: PropTypes.string.isRequired,
  toggleReplyModal: PropTypes.func.isRequired
};