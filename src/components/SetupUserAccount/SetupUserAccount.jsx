import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { BiImageAdd } from 'react-icons/bi';
import { doc, serverTimestamp, Timestamp, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { database } from '../../data/firebase';
import placeholder from '../../assets/placeholder.png';
import LoadingScreen from '../Overlays/LoadingScreen/LoadingScreen';
import AvatarCreator from '../../helpers/AvatarCreator/AvatarCreator';
import resizeFile from '../../helpers/ImageResizer/ImageResizer';
import WarningModal from '../Modals/WarningModal/WarningModal';
import logoOutline from '../../assets/logo_outline.png';
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
    following: [{ userID: uid }, { userID: 'rDQkZcxpSdTH8L1Oq7vIrwM1aUz2' }], // The users own ID + a default follow
    posts: [],
    replies: [],
    reposts: [],
    likes: [],
    bookmarks: [],
    messages: [
      {
        messageID: 'robin1',
        messageContent:
          "Hello, I'm Stefan, the creator of Robin. Thank you so much for trying this app! I hope you like it!",
        senderID: 'LXpgyqXRl6SVzxlXpPQCcDArkdE2',
        isRead: false,
        sendDate: Timestamp.now(),
        senderUsername: 'erynder-z'
      }
    ],
    active: false
  });

  // allow the user to upload a picture and save it in state to be accessed by the avatar-creator
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
      setErrorMessage(err.message);
    }
  };

  // update userObject to that the user-setup screen will not be shown
  const handleSubmit = (e) => {
    const onlyAlphanumeric = /^([a-zA-Z0-9 _-]+)$/;
    if (onlyAlphanumeric.test(userObject.username)) {
      e.preventDefault();
      setUserObject((prevState) => ({
        ...prevState,
        isSetup: true
      }));
      setIsFinished(true);
    } else {
      setErrorMessage('username cannot be blank and cannot contain any special characters');
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
        bookmarks: userObject.bookmarks,
        messages: userObject.messages,
        active: true
      });
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  // update the dummy "Robin" profile with the newly signed up users ID
  const updateUserRobin = async () => {
    const robinRef = doc(database, 'users', 'rDQkZcxpSdTH8L1Oq7vIrwM1aUz2');
    await updateDoc(robinRef, {
      followers: arrayUnion({ userID: uid })
    });
  };

  // navitage to main component if setup is finished
  useEffect(() => {
    if (isFinished) {
      updateUserRobin();
      uploadUser();
      navigate('/main');
    }
  }, [isFinished]);

  useEffect(() => {
    if (errorMessage) {
      setTimeout(() => setErrorMessage(null), 2000);
    }
  }, [errorMessage]);

  // display loading screen while component is mounted
  useEffect(() => {
    setTimeout(() => setShowLoading(null), 2000);
  }, []);

  return showLoading ? (
    <LoadingScreen />
  ) : (
    <div className="setup-background-overlay">
      <div className="setup-user-account fadein">
        <h3 className="setup-header">Set up your user account</h3>
        <div className="setup-user-container">
          <img className="setup-userpic" src={userObject.userPic} alt="avatar" />
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
                  pattern="[^()/><\][\\\x22,;|]+"
                />
              </label>
            </div>
            <label htmlFor="udesc" className="descinput-label">
              <h3>About you</h3>
              <textarea
                className="description-input"
                type="text"
                maxLength="120"
                placeholder="max. 120 characters"
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
            Let&apos;s go! <img className="logo-mini" src={logoOutline} alt="app logo" />
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
