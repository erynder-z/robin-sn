import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { MdOutlineDangerous } from 'react-icons/md';
import { BiImageAdd, BiBarChart } from 'react-icons/bi';
import './ProfileOptions.css';
import { doc, updateDoc } from 'firebase/firestore';
import resizeFile from '../../../helpers/ImageResizer/ImageResizer';
import { database } from '../../Firebase/Firebase';
import { GetUserContext } from '../../../contexts/UserContext';

function ProfileOptions({ deleteAccount }) {
  const { userData } = GetUserContext();
  const [fadeModal, setFadeModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);

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

  const StatsModal = (
    <div className="statsModal-overlay">
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
            setFadeModal(true);
            setTimeout(() => setShowStatsModal(false), 100);
          }}
          onKeyDown={() => {
            setFadeModal(true);
            setTimeout(() => setShowStatsModal(false), 100);
          }}>
          Close stats
        </div>
      </div>
    </div>
  );

  const DeleteModal = (
    <div className={`deleteModal-overlay ${fadeModal ? 'fadeout' : 'fadein'}`}>
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
            setFadeModal(true);
            setTimeout(() => setShowDeleteModal(false), 100);
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

      {showDeleteModal && DeleteModal}
      {showStatsModal && StatsModal}
    </div>
  );
}

export default ProfileOptions;

ProfileOptions.propTypes = {
  deleteAccount: PropTypes.func.isRequired
};
