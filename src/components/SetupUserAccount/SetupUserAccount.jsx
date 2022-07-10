import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { BiImageAdd } from 'react-icons/bi';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { database } from '../Firebase/Firebase';
import placeholder from '../../assets/placeholder.png';
import LoadingScreen from '../LoadingScreen/LoadingScreen';
import AvatarCreator from '../../helpers/AvatarCreator/AvatarCreator';
import resizeFile from '../../helpers/ImageResizer/ImageResizer';
import WarningModal from '../WarningModal/WarningModal';
import './SetupUserAccount.css';

function CreateUserAccount({ userCredentials }) {
  const navigate = useNavigate();
  const { uid, email } = userCredentials;
  const [isFinished, setIsFinished] = useState(false);
  const [showLoading, setShowLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const [userObject, setUserObject] = useState({
    userID: uid,
    isSetup: false,
    username: '',
    description: '',
    userPic: placeholder,
    userBackground: null,
    useremail: email,
    joined: serverTimestamp(),
    followers: [],
    following: [{ userID: uid }], // so the user can see it's own posts in the home component
    posts: [],
    replies: [],
    reposts: [],
    likes: [],
    bookmarks: []
  });

  const uploadUserpic = async (e) => {
    try {
      const file = e.target.files[0];
      const image = await resizeFile(file);
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onloadend = () => {
        const base64data = reader.result;
        setUserObject((prevState) => ({
          ...prevState,
          userPic: base64data
        }));
      };
      setShowCropper(true);
    } catch (err) {
      setErrorMessage(err);
    }
  };

  // update userObject to that the user-setup screen will not be shown
  const handleSubmit = (e) => {
    if (userObject.username) {
      e.preventDefault();
      setUserObject((prevState) => ({
        ...prevState,
        isSetup: true
      }));
      setIsFinished(true);
    } else {
      setErrorMessage('enter a username!');
    }
  };

  const uploadUser = async () => {
    try {
      await setDoc(doc(database, 'users', uid), {
        userID: userObject.userID,
        isSetup: userObject.isSetup,
        username: userObject.username.replace(/ /g, '_'),
        description: userObject.description,
        userPic: userObject.userPic,
        userBackground: userObject.userBackground,
        useremail: userObject.useremail,
        joined: userObject.joined,
        followers: userObject.followers,
        following: userObject.following,
        posts: userObject.posts,
        replies: userObject.replies,
        reposts: userObject.reposts,
        likes: userObject.likes,
        bookmarks: userObject.bookmarks
      });
    } catch (err) {
      setErrorMessage(err);
    }
  };

  useEffect(() => {
    if (isFinished) {
      uploadUser();
      navigate('/main');
    }
  }, [isFinished]);

  useEffect(() => {
    if (errorMessage) {
      setTimeout(() => setErrorMessage(null), 2000);
    }
  }, [errorMessage]);

  useEffect(() => {
    setTimeout(() => setShowLoading(null), 2000);
  }, []);

  return showLoading ? (
    <LoadingScreen />
  ) : (
    <div className="setup-user-account fadein">
      <h3>Set up your user account</h3>
      <div className="setup-user-container">
        <img src={userObject.userPic} alt="avatar" />
        <label htmlFor="picture" className="custom-file-upload-label">
          <BiImageAdd size="2rem" />
          <input
            className="custom-file-upload"
            type="file"
            id="picture"
            name="picture"
            accept="image/png, image/jpeg"
            onChange={(e) => {
              uploadUserpic(e);
            }}
          />
        </label>

        <form>
          <div className="user-input-container">
            <label htmlFor="uname" className="unameinput-label">
              <h3>Username</h3>
              <input
                className="username-input"
                type="text"
                placeholder="enter user name"
                value={userObject.username}
                onChange={(e) => {
                  setUserObject((prevState) => ({
                    ...prevState,
                    username: e.target.value
                  }));
                }}
                required
              />
            </label>
          </div>
          <label htmlFor="udesc" className="descinput-label">
            <h3>About you</h3>
            <textarea
              className="description-input"
              type="text"
              placeholder="write a little bit about yourself"
              value={userObject.description}
              onChange={(e) => {
                setUserObject((prevState) => ({
                  ...prevState,
                  description: e.target.value
                }));
              }}
              required
            />
          </label>
        </form>
        <button
          type="submit"
          className="createBtn"
          onClick={(e) => {
            handleSubmit(e);
          }}
          onKeyDown={(e) => {
            handleSubmit(e);
          }}
          tabIndex={0}>
          Let&apos;s go!
        </button>
      </div>

      {showCropper && (
        <div className="avatarCreator-overlay">
          <AvatarCreator
            image={userObject.userPic}
            setUserObject={setUserObject}
            setShowCropper={setShowCropper}
            functionCallOrigin="createAccount"
          />
        </div>
      )}
      {errorMessage && <WarningModal errorMessage={errorMessage} />}
    </div>
  );
}

export default CreateUserAccount;

CreateUserAccount.propTypes = {
  userCredentials: PropTypes.shape({
    uid: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired
  }).isRequired
};
