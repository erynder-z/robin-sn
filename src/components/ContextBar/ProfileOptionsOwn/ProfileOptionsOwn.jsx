import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { doc, updateDoc } from 'firebase/firestore';
import { MdOutlineDangerous } from 'react-icons/md';
import {
  BiImageAdd,
  BiBarChart,
  BiLandscape,
  BiWindowClose,
  BiLogOut,
  BiUserCircle
} from 'react-icons/bi';
import resizeFile from '../../../helpers/ImageResizer/ImageResizer';
import { database } from '../../../data/firebase';
import { GetUserContext } from '../../../contexts/UserContext';
import AvatarCreator from '../../../helpers/AvatarCreator/AvatarCreator';
import './ProfileOptionsOwn.css';

function ProfileOptionsOwn({ deleteAccount, logout, showWarning }) {
  const { userData } = GetUserContext();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [showUpdateDescModal, setShowUpdateDescModal] = useState(false);
  const [showCropper, setShowCropper] = useState(false);
  const [picture, setPicture] = useState();
  const [descriptionText, setDescriptionText] = useState('');

  // let user load a picture and saves it in state to be accessed by the avatar creator
  const changeUserpic = async (e) => {
    try {
      const file = e.target.files[0];
      const image = await resizeFile(file);
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onloadend = async () => {
        const base64data = reader.result;
        setPicture(base64data);
      };
    } catch (err) {
      showWarning(err);
    }
  };

  const changeProfileBackground = async (e) => {
    const userRef = doc(database, 'users', userData.userID);

    try {
      const file = e.target.files[0];
      const image = await resizeFile(file);
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onloadend = async () => {
        const base64data = reader.result;
        await updateDoc(userRef, {
          userBackground: base64data
        });
      };
    } catch (err) {
      showWarning(err);
    }
  };

  const uploadUserpic = async (pic) => {
    try {
      const userRef = doc(database, 'users', userData.userID);
      await updateDoc(userRef, {
        userPic: pic
      });
    } catch (err) {
      showWarning(err);
    }
  };

  const removeProfileBackground = async () => {
    const userRef = doc(database, 'users', userData.userID);

    try {
      await updateDoc(userRef, {
        userBackground: null
      });
    } catch (err) {
      showWarning(err);
    }
  };

  const updateUserDescription = async () => {
    const userRef = doc(database, 'users', userData.userID);

    try {
      await updateDoc(userRef, {
        description: descriptionText
      });
    } catch (err) {
      showWarning(err);
    }
    setDescriptionText('');
  };

  useEffect(() => {
    if (picture) {
      setShowCropper(true);
    }
  }, [picture]);

  const UpdateDescModal = (
    <div className="updateDescModal-overlay fadein">
      <div className="updateDescModal">
        <label htmlFor="udescUpdate" className="descUpdateInput-label">
          <h3>About you</h3>
          <textarea
            className="descriptionUpdate-input"
            type="text"
            maxLength="100"
            placeholder="write a little bit about yourself (max. 100 characters)"
            value={descriptionText}
            onChange={(e) => {
              setDescriptionText(e.target.value);
            }}
            required
          />
        </label>
        <div
          className="updateDesc-updateBtn"
          role="button"
          tabIndex={0}
          onClick={() => {
            updateUserDescription();
            setShowUpdateDescModal(false);
          }}
          onKeyDown={() => {
            updateUserDescription();
            setShowUpdateDescModal(false);
          }}>
          Update
        </div>
        <div
          className="updateDesc-closeBtn"
          role="button"
          tabIndex={0}
          onClick={() => {
            setShowUpdateDescModal(false);
          }}
          onKeyDown={() => {
            setShowUpdateDescModal(false);
          }}>
          Close without updating
        </div>
      </div>
    </div>
  );

  const StatsModal = (
    <div className="statsModal-overlay fadein">
      <div className="statsModal">
        <h4>Total posts: {userData.posts.length}</h4>
        <h4>Total replies: {userData.replies.length}</h4>
        <h4>Total reposts: {userData.reposts.length}</h4>
        <h4>Total likes: {userData.likes.length}</h4>
        <div
          className="stats-closeBtn"
          role="button"
          tabIndex={0}
          onClick={() => {
            setShowStatsModal(false);
          }}
          onKeyDown={() => {
            setShowStatsModal(false);
          }}>
          Close stats
        </div>
      </div>
    </div>
  );

  const DeleteModal = (
    <div className="deleteModal-overlay">
      <div className="deleteModal">
        <h3 className="delete-warning">Are you sure?</h3>
        <h4>This action cannot be undone!</h4>
        <h5>All of your posts, hashtags and uploaded pictures will be deleted!</h5>
        <button
          type="button"
          className="accountDeleteBtn"
          onClick={() => {
            deleteAccount();
          }}>
          Yes, delete my account!
        </button>
        <button
          type="button"
          className="accountNoDeleteBtn"
          onClick={() => {
            setShowDeleteModal(false);
          }}>
          No, return to previous page!
        </button>
      </div>
    </div>
  );

  return (
    <div className="profileOptions-container">
      <div className="profileOptions-header">Profile options</div>
      <div
        className="deleteAccount"
        role="button"
        tabIndex={0}
        onClick={() => {
          setShowDeleteModal(true);
        }}
        onKeyDown={() => {
          setShowDeleteModal(true);
        }}>
        <MdOutlineDangerous className="deleteAccount-icon" size="2rem" />
        delete account
      </div>

      <div
        className="updateDescription"
        role="button"
        tabIndex={0}
        onClick={() => {
          setShowUpdateDescModal(true);
        }}
        onKeyDown={() => {
          setShowUpdateDescModal(true);
        }}>
        <BiUserCircle className="updateDescription-icon" size="2rem" />
        update user description
      </div>

      <label htmlFor="picture" className="changeUserpic">
        <BiImageAdd className="changePicture-icon" size="2rem" />
        <input
          className="custom-file-upload"
          type="file"
          id="picture"
          name="picture"
          accept="image/png, image/jpeg"
          onChange={(e) => {
            changeUserpic(e);
          }}
        />
        change user picture
      </label>

      <label htmlFor="background" className="changeProfileBackground">
        <BiLandscape className="changeProfileBackground-icon" size="2rem" />
        <input
          className="custom-file-upload"
          type="file"
          id="background"
          name="background"
          accept="image/png, image/jpeg"
          onChange={(e) => {
            changeProfileBackground(e);
          }}
        />
        change profile background
      </label>

      <div
        className="removeBackground"
        role="button"
        tabIndex={0}
        onClick={() => {
          removeProfileBackground();
        }}
        onKeyDown={() => {
          removeProfileBackground();
        }}>
        <BiWindowClose className="removeBackground-icon" size="2rem" />
        remove profile background
      </div>

      <div
        className="accountStats"
        role="button"
        tabIndex={0}
        onClick={() => {
          setShowStatsModal(true);
        }}
        onKeyDown={() => {
          setShowStatsModal(true);
        }}>
        <BiBarChart className="accountStats-icon" size="2rem" />
        show account stats
      </div>

      <div
        className="logoutContextbar"
        role="button"
        tabIndex={0}
        onClick={() => {
          logout();
        }}
        onKeyDown={() => {
          logout();
        }}>
        <BiLogOut className="logoutContextbar-icon" size="2rem" />
        Logout
      </div>

      {showDeleteModal && DeleteModal}
      {showStatsModal && StatsModal}
      {showUpdateDescModal && UpdateDescModal}
      {showCropper && (
        <div className="avatarCreator-overlay">
          <AvatarCreator
            image={picture}
            setShowCropper={setShowCropper}
            uploadUserpic={uploadUserpic}
            functionCallOrigin="changeProfile"
          />
        </div>
      )}
    </div>
  );
}

export default ProfileOptionsOwn;

ProfileOptionsOwn.propTypes = {
  deleteAccount: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
  showWarning: PropTypes.func.isRequired
};
