import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './CreateUserAccount.css';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import resizeFile from '../../helpers/ImageResizer/ImageResizer';
import { database } from '../Firebase/Firebase';
import placeholder from '../../assets/placeholder.png';

function CreateUserAccount({ user }) {
  const navigate = useNavigate();
  const { uid, email } = user;
  const [isFinished, setIsFinished] = useState(false);
  const [userObject, setUserObject] = useState({
    isSetup: false,
    username: '',
    description: '',
    userPic: placeholder,
    useremail: email,
    joined: new Date(),
    numberOfTweets: 0,
    followers: [],
    following: [],
    tweets: [],
    replies: [],
    bookmarks: []
  });

  const uploadUserpic = async (e) => {
    try {
      const file = e.target.files[0];
      const image = await resizeFile(file);
      setUserObject((prevState) => ({
        ...prevState,
        userPic: image
      }));
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setUserObject((prevState) => ({
      ...prevState,
      isSetup: true
    }));
    setIsFinished(true);
  };

  const uploadUser = async () => {
    await setDoc(doc(database, 'users', uid), {
      userObject
    });
  };

  useEffect(() => {
    if (isFinished) {
      uploadUser();
      navigate('/main');
    }
  }, [isFinished]);

  return (
    <div className="create-user-account">
      <div className="create-user-container">
        <img src={userObject.userPic} alt="avatar" />
        <label htmlFor="picture" className="custom-file-upload-label">
          Upload picture
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
          <div className="input-container">
            <label htmlFor="uname">
              Username
              <input
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
        </form>
      </div>

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
        Lets go!
      </button>
    </div>
  );
}

export default CreateUserAccount;

CreateUserAccount.propTypes = {
  user: PropTypes.shape({
    uid: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired
  }).isRequired
};
