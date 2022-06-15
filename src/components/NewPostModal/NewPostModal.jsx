import React, { useState } from 'react';
import PropTypes from 'prop-types';
import uniqid from 'uniqid';
import { arrayUnion, doc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { database } from '../Firebase/Firebase';
import './NewPostModal.css';

function NewPostModal({ userCredentials, toggleNewPostModal }) {
  const { uid } = userCredentials;
  const [text, setText] = useState('');

  // adds the postID to the user-object
  const addPostToUserObject = async (postID) => {
    const docRef = doc(database, 'users', uid);

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
      ownerID: uid,
      content: text,
      hasHashtag: false,
      hashtags: [],
      reposts: [
        /* {repostedUserID: ""} */
      ],

      likes: [
        /* {likedUserID: ""} */
      ],

      replies: [
        /* { replyContent: '', repliedUserID: '', replyDate: '' } */
      ]
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
      <div role="textbox" tabIndex={0} className="newPostModal-body">
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
        <textarea
          name="newPost"
          id="newPost"
          cols="30"
          rows="10"
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
  userCredentials: PropTypes.shape({
    uid: PropTypes.string.isRequired
  }).isRequired
};
