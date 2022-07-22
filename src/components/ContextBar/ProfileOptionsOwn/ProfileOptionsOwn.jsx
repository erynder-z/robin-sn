import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { doc, updateDoc } from 'firebase/firestore';
import resizeFile from '../../../helpers/ImageResizer/ImageResizer';
import { database } from '../../../data/firebase';
import { GetUserContext } from '../../../contexts/UserContext';
import AvatarCreator from '../../../helpers/AvatarCreator/AvatarCreator';
import DeleteAccountOption from './DeleteAccountOption/DeleteAccountOption';
import UpdateUserDescriptionOption from './UpdateUserDescriptionOption/UpdateUserDescriptionOption';
import ChangeUserpicOption from './ChangeUserpicOption/ChageUserpicOption';
import ChangeUserBackgroundOption from './ChangeProfileBackgroundOption/ChangeProfileBackgroundOption';
import RemoveProfileBackgroundOption from './RemoveProfileBackgroundOption/RemoveProfileBackgroundOption';
import ShowAccountStatsOption from './ShowAccountStatsOption/ShowAccountStatsOption';
import LogoutOption from './LogoutOption/LogoutOption';
import './ProfileOptionsOwn.css';
import ChangePasswordOption from './ChangePasswordOption/ChangePasswordOption';

function ProfileOptionsOwn({
  logout,
  showWarning,
  setShowStatsModal,
  setShowDeleteUserModal,
  setShowUpdateUserDescModal,
  setShowChangePasswordModal
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
      <DeleteAccountOption setShowDeleteUserModal={setShowDeleteUserModal} />
      <ChangePasswordOption setShowChangePasswordModal={setShowChangePasswordModal} />
      <UpdateUserDescriptionOption setShowUpdateUserDescModal={setShowUpdateUserDescModal} />
      <ChangeUserpicOption changeUserpic={changeUserpic} />
      <ChangeUserBackgroundOption changeProfileBackground={changeProfileBackground} />
      <RemoveProfileBackgroundOption removeProfileBackground={removeProfileBackground} />
      <ShowAccountStatsOption setShowStatsModal={setShowStatsModal} />
      <LogoutOption logout={logout} />
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
  setShowUpdateUserDescModal: PropTypes.func.isRequired,
  setShowChangePasswordModal: PropTypes.func.isRequired
};
