import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { doc, updateDoc } from 'firebase/firestore';
import { MdOutlineDangerous } from 'react-icons/md';
import {
  BiImageAdd,
  BiBarChart,
  BiLandscape,
  BiWindowClose,
  BiLogOutCircle,
  BiUserCircle
} from 'react-icons/bi';
import resizeFile from '../../../helpers/ImageResizer/ImageResizer';
import { database } from '../../../data/firebase';
import { GetUserContext } from '../../../contexts/UserContext';
import AvatarCreator from '../../../helpers/AvatarCreator/AvatarCreator';
import './ProfileOptionsOwn.css';

function ProfileOptionsOwn({
  logout,
  showWarning,
  setShowStatsModal,
  setShowDeleteUserModal,
  setShowUpdateUserDescModal
}) {
  const { userData } = GetUserContext();
  const [showCropper, setShowCropper] = useState(false);
  const [picture, setPicture] = useState();

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
      showWarning(err.message);
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
      showWarning(err.message);
    }
  };

  const uploadUserpic = async (pic) => {
    try {
      const userRef = doc(database, 'users', userData.userID);
      await updateDoc(userRef, {
        userPic: pic
      });
    } catch (err) {
      showWarning(err.message);
    }
  };

  const removeProfileBackground = async () => {
    const userRef = doc(database, 'users', userData.userID);

    try {
      await updateDoc(userRef, {
        userBackground: null
      });
    } catch (err) {
      showWarning(err.message);
    }
  };

  useEffect(() => {
    if (picture) {
      setShowCropper(true);
    }
  }, [picture]);

  return (
    <div className="profileOptions-container">
      <div className="profileOptions-header">Profile options</div>
      <div
        className="deleteAccount"
        role="button"
        tabIndex={0}
        onClick={() => {
          setShowDeleteUserModal(true);
        }}
        onKeyDown={() => {
          setShowDeleteUserModal(true);
        }}>
        <MdOutlineDangerous className="deleteAccount-icon" size="2rem" />
        delete account
      </div>

      <div
        className="updateDescription"
        role="button"
        tabIndex={0}
        onClick={() => {
          setShowUpdateUserDescModal(true);
        }}
        onKeyDown={() => {
          setShowUpdateUserDescModal(true);
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
        <BiLogOutCircle className="logoutContextbar-icon" size="2rem" />
        Logout
      </div>

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
  logout: PropTypes.func.isRequired,
  showWarning: PropTypes.func.isRequired,
  setShowStatsModal: PropTypes.func.isRequired,
  setShowDeleteUserModal: PropTypes.func.isRequired,
  setShowUpdateUserDescModal: PropTypes.func.isRequired
};
