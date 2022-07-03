import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { MdOutlineDangerous } from 'react-icons/md';
import { BiImageAdd } from 'react-icons/bi';
import './ProfileOptions.css';
import { doc, updateDoc } from 'firebase/firestore';
import resizeFile from '../../../helpers/ImageResizer/ImageResizer';
import { database } from '../../Firebase/Firebase';
import { GetUserContext } from '../../../contexts/UserContext';

function ProfileOptions({ deleteAccount }) {
  const { userData } = GetUserContext();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const changeUserpic = async (e) => {
    const userRef = doc(database, 'users', userData.userID);

    try {
      const file = e.target.files[0];
      const image = await resizeFile(file);
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onloadend = async () => {
        const base64data = reader.result;
        await updateDoc(userRef, {
          userPic: base64data
        });
      };
    } catch (err) {
      console.log(err);
    }
  };

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
    <div className="profileOptions-container fadein">
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
        change profile picure
      </label>

      {showDeleteModal && DeleteModal}
    </div>
  );
}

export default ProfileOptions;

ProfileOptions.propTypes = {
  deleteAccount: PropTypes.func.isRequired
};
