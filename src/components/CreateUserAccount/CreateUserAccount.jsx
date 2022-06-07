import React, { useEffect, useState } from 'react';
import './CreateUserAccount.css';
import { doc, setDoc } from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';
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
      navigate('/home');
    }
  }, [isFinished]);

  return (
    <div className="create-user-account">
      <div className="create-user-container">
        <img src={userObject.userPic} alt="avatar" />
      </div>
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
          placeholder="description"
          value={userObject.description}
          onChange={(e) => {
            setUserObject((prevState) => ({
              ...prevState,
              description: e.target.value
            }));
          }}
          required
        />

        <label htmlFor="picture">
          Upload picture
          <input
            className="custom-file-upload"
            type="file"
            name="picture"
            accept="image/png, image/jpeg"
            onChange={(e) => {
              uploadUserpic(e);
            }}
          />
        </label>
      </form>
      <div className="button-container">
        <button
          type="submit"
          className="loginBtn"
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
    </div>
  );
}

export default CreateUserAccount;
