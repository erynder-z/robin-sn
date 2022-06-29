import React, { useState } from 'react';
import PropTypes from 'prop-types';
import uniqid from 'uniqid';
import Picker from 'emoji-picker-react';
import { BiImage } from 'react-icons/bi';
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
import { database, storage } from '../Firebase/Firebase';
import resizeFile from '../../helpers/ImageResizer/ImageResizer';
import './NewPostModal.css';
import parseHashtag from '../../helpers/HashtagCreator/HashtagCreator';

function NewPostModal({ userData, toggleNewPostModal, showNewPostEffect }) {
  const { userID, userPic, username } = userData;
  const [text, setText] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [imageUpload, setImageUpload] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [fadeModal, setFadeModal] = useState(false);

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
        console.log(err);
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
      console.log(err);
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
      console.log(err);
    }
  };

  // creates the post in the database
  const submitPost = async () => {
    const hashtagArray = await parseHashtag(text);

    try {
      const postID = uniqid();
      await setDoc(doc(database, 'posts', postID), {
        created: serverTimestamp(),
        postID,
        ownerID: userID,
        content: text,
        hashtags: hashtagArray,
        reposts: [],
        likes: [],
        replies: [],
        image: { imageURL: null, imageRef: null }
      });

      uploadPicture(postID);
      addPostToUserObject(postID);
      addHashtag(hashtagArray);
      toggleNewPostModal();
    } catch (err) {
      console.log(err);
    }
    showNewPostEffect();
  };

  // Load image into state to preview
  const handleImageUpload = async (e) => {
    try {
      const file = e.target.files[0];
      const image = await resizeFile(file);
      setImageUpload(image);

      // image needs to be base64 to be rendered, so it must be converted first
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onloadend = () => {
        const base64data = reader.result;
        setImagePreview(base64data);
      };
    } catch (err) {
      console.log(err);
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
        <div className="newPostModal-upper">
          <div className="user-header">
            <img className="post-usrpic" src={userPic} alt="user avatar" />
            <div className="post-author">@{username} </div>
          </div>
        </div>
        <textarea
          className="newPost-textarea"
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

        <div className="post-options-container">
          <div className="upload-options">
            <label htmlFor="pictureUpload" className="picture-upload-label">
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
  userData: PropTypes.shape({
    userID: PropTypes.string.isRequired,
    isSetup: PropTypes.bool.isRequired,
    username: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    userPic: PropTypes.string.isRequired,
    useremail: PropTypes.string.isRequired,
    joined: PropTypes.objectOf(PropTypes.number),
    followers: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)).isRequired,
    following: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)).isRequired,
    posts: PropTypes.arrayOf(
      PropTypes.shape({
        created: PropTypes.objectOf(PropTypes.number),
        postID: PropTypes.string
      })
    ).isRequired,
    replies: PropTypes.arrayOf(
      PropTypes.shape({
        created: PropTypes.objectOf(PropTypes.number),
        postID: PropTypes.string
      })
    ).isRequired,
    reposts: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)).isRequired,
    likes: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)).isRequired,
    bookmarks: PropTypes.arrayOf(
      PropTypes.shape({
        created: PropTypes.objectOf(PropTypes.number),
        postID: PropTypes.string
      })
    ).isRequired
  }).isRequired,
  showNewPostEffect: PropTypes.func.isRequired
};
