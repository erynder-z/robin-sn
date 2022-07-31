import React, { useState } from 'react';
import PropTypes from 'prop-types';
import uniqid from 'uniqid';
import { BiImage } from 'react-icons/bi';
import LinearProgress from '@mui/material/LinearProgress';
import { MdOutlineEmojiEmotions } from 'react-icons/md';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import {
  arrayUnion,
  doc,
  getDoc,
  increment,
  serverTimestamp,
  setDoc,
  updateDoc
} from 'firebase/firestore';
import { database, storage } from '../../../data/firebase';
import { GetUserContext } from '../../../contexts/UserContext';
import parseHashtag from '../../../helpers/HashtagCreator/HashtagCreator';
import parseMention from '../../../helpers/MentionCreator/MentionCreator';
import EmojiPicker from '../EmojiPicker/EmojiPicker';
import './NewPostModal.css';

function NewPostModal({ toggleNewPostModal, showOverlayEffect, showWarning }) {
  const { userData } = GetUserContext();
  const { userID, userPic, username } = userData;
  const [text, setText] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [imageUpload, setImageUpload] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [fadeModal, setFadeModal] = useState(false);

  const normaliseProgressbar = (value) => ((value - 0) * 100) / (120 - 0);

  // add hashtags from a post to hashtags-collection
  const addHashtag = async (hashtagArray) => {
    hashtagArray.map(async (hashtag) => {
      try {
        await setDoc(
          doc(database, 'hashtags', hashtag.toLowerCase()),
          {
            hashtag: hashtag.toLowerCase(),
            count: increment(1)
          },
          { merge: true }
        );
      } catch (err) {
        showWarning(err.message);
      }
    });
  };

  // upload image to database and adds the image URL to the post in the database
  const uploadPicture = (postID) => {
    if (imageUpload == null) return;
    try {
      const randomID = uniqid();
      const imageRef = ref(storage, `images/${imageUpload.name + randomID}`);
      const postRef = doc(database, 'posts', postID);

      uploadBytes(imageRef, imageUpload).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((url) => {
          updateDoc(postRef, { image: { imageURL: url, imageRef: imageRef.toString() } });
        });
      });
    } catch (err) {
      showWarning(err.message);
    }
  };

  // adds the postID to the user-object
  const addPostToUserObject = async (postID) => {
    try {
      const userRef = doc(database, 'users', userID);
      const docRef = doc(database, 'posts', postID);
      const docSnap = await getDoc(docRef);

      await updateDoc(userRef, {
        posts: arrayUnion({ postID, created: docSnap.data().created })
      });
    } catch (err) {
      showWarning(err.message);
    }
  };

  // creates the post in the database
  const submitPost = async () => {
    if (text !== '') {
      const hashtagArray = await parseHashtag(text);
      const mentionArray = await parseMention(text);

      try {
        const postID = uniqid();
        await setDoc(doc(database, 'posts', postID), {
          created: serverTimestamp(),
          postID,
          ownerID: userID,
          content: text,
          hashtags: hashtagArray,
          mentions: mentionArray,
          reposts: [],
          likes: [],
          replies: [],
          image: { imageURL: null, imageRef: null },
          isRepost: false
        });

        uploadPicture(postID);
        addPostToUserObject(postID);
        addHashtag(hashtagArray);
        toggleNewPostModal();
      } catch (err) {
        showWarning(err.message);
      }
      showOverlayEffect('Posting');
    } else {
      showWarning('Enter a message!');
    }
  };

  // Load image into state to preview
  const handleImageUpload = async (e) => {
    try {
      const file = e.target.files[0];
      setImageUpload(file);
      // image needs to be base64 to be rendered, so it must be converted first
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        const base64data = reader.result;
        setImagePreview(base64data);
      };
    } catch (err) {
      showWarning(err.message);
    }
  };

  // add emoji from picker to text
  const onEmojiClick = (event, emojiObject) => {
    setShowEmojiPicker(false);
    setText(text + emojiObject.emoji);
  };

  return (
    <div className={`newPostModal-overlay ${fadeModal ? 'fadeout' : 'fadein'}`}>
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
            className="newPost-closeBtn"
            role="button"
            tabIndex={0}
            onClick={() => {
              setFadeModal(true);
              setTimeout(() => toggleNewPostModal(), 100);
            }}
            onKeyDown={() => {
              setFadeModal(true);
              setTimeout(() => toggleNewPostModal(), 100);
            }}>
            &times;
          </div>
        </div>
        <textarea
          className="newPost-textarea"
          maxLength="120"
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
        />{' '}
        {imagePreview && (
          <div className="picture-upload-container">
            <div
              className="removeImage"
              role="button"
              tabIndex={0}
              onClick={() => {
                setImagePreview(null);
                setImageUpload(null);
              }}
              onKeyDown={() => {
                setImagePreview(null);
                setImageUpload(null);
              }}>
              &times;
            </div>
            <img className="picture-upload" src={imagePreview} alt="uploaded content" />{' '}
          </div>
        )}
        <div className="progress">
          <span className="charLeft"> {120 - text.length} characters left</span>
          <LinearProgress
            className="charProgress"
            variant="determinate"
            value={normaliseProgressbar(text.length)}
            color="inherit"
          />
        </div>
        <div className="post-options-container">
          <div className="upload-options">
            <label htmlFor="pictureUpload" className="picture-upload-label" title="Upload image">
              <BiImage size="2rem" />
              <input
                className="picture-upload"
                type="file"
                id="pictureUpload"
                accept="image/png, image/jpeg"
                onChange={(e) => {
                  handleImageUpload(e);
                }}
              />
            </label>
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
              className="postBtn"
              type="submit"
              onClick={() => {
                submitPost();
              }}>
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewPostModal;

NewPostModal.propTypes = {
  toggleNewPostModal: PropTypes.func.isRequired,
  showOverlayEffect: PropTypes.func.isRequired,
  showWarning: PropTypes.func.isRequired
};
