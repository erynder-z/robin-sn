import React, { useState } from 'react';
import PropTypes from 'prop-types';
import uniqid from 'uniqid';
import { arrayUnion, doc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { database } from '../Firebase/Firebase';
import './NewPostModal.css';

function NewPostModal({ userData, toggleNewPostModal }) {
  const { userID, userPic, username } = userData;
  const [text, setText] = useState('');

  // adds the postID to the user-object
  const addPostToUserObject = async (postID) => {
    const docRef = doc(database, 'users', userID);

    await updateDoc(docRef, {
      posts: arrayUnion({ postID })
    });
  };

  // creates the post in the database
  const submitPost = async () => {
    const postID = uniqid();
    await setDoc(doc(database, 'posts', postID), {
      created: serverTimestamp(),
      postID,
      ownerID: userID,
      content: text,
      hasHashtag: false,
      hashtags: [],
      reposts: [],
      likes: [],
      replies: []
    });

    addPostToUserObject(postID);
    toggleNewPostModal();
  };

  return (
    <div
      className="newPostModal-overlay"
      role="button"
      tabIndex={0}
      onClick={() => {
        toggleNewPostModal();
      }}
      onKeyDown={() => {
        toggleNewPostModal();
      }}>
      <div
        role="textbox"
        tabIndex={0}
        className="newPostModal-body"
        onClick={(e) => {
          e.stopPropagation();
        }}
        onKeyDown={(e) => {
          e.stopPropagation();
        }}>
        <div className="newPostModal-upper">
          <div className="user-header">
            <img className="post-usrpic" src={userPic} alt="user avatar" />
            <div className="post-author">@{username} </div>
          </div>
          <div
            className="close"
            role="button"
            tabIndex={0}
            onClick={() => {
              toggleNewPostModal();
            }}
            onKeyDown={() => {
              toggleNewPostModal();
            }}>
            &times;
          </div>
        </div>
        <textarea
          cols="30"
          rows="5"
          placeholder="enter your message"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
          }}
          onClick={(e) => {
            e.stopPropagation();
          }}
          onKeyDown={(e) => {
            e.stopPropagation();
          }}
        />
        <button
          className="postBtn"
          type="submit"
          onClick={() => {
            submitPost();
          }}>
          Post
        </button>
      </div>
    </div>
  );
}

export default NewPostModal;

NewPostModal.propTypes = {
  toggleNewPostModal: PropTypes.func.isRequired,
  userData: PropTypes.shape({
    userID: PropTypes.string.isRequired,
    isSetup: PropTypes.bool.isRequired,
    username: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    userPic: PropTypes.string.isRequired,
    useremail: PropTypes.string.isRequired,
    joined: PropTypes.objectOf(PropTypes.number).isRequired,
    followers: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)).isRequired,
    following: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)).isRequired,
    posts: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)).isRequired,
    replies: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)).isRequired,
    bookmarks: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)).isRequired
  }).isRequired
};
