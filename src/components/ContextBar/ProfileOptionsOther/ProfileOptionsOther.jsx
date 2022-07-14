import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { BiMessageRoundedEdit, BiUserPlus, BiUserMinus } from 'react-icons/bi';
import './ProfileOptionsOther.css';
import MessageModal from '../../MessageModal/MessageModal';
import { GetUserContext } from '../../../contexts/UserContext';

function ProfileOptionsOther({ showWarning, showOverlayEffect, userInView, follow, unFollow }) {
  const { userData } = GetUserContext();
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [isFollowing, setIsFollowing] = useState(null);

  const checkIfFollowing = () => {
    const followingList = [...userData.following];

    if (followingList.some((user) => user.userID === userInView.userID)) {
      setIsFollowing(true);
    } else {
      setIsFollowing(false);
    }
  };

  useEffect(() => {
    if (userInView) {
      checkIfFollowing();
    }
  }, [userInView, userData.following]);

  return (
    <div className="profileOptionsOther-container">
      <div className="profileOptionsOther-header">Profile options</div>
      {!isFollowing && (
        <div
          className="follow"
          role="button"
          tabIndex={0}
          onClick={() => {
            follow(userInView.userID);
          }}
          onKeyDown={() => {
            follow(userInView.userID);
          }}>
          <BiUserPlus className="follow-icon" size="2rem" />
          follow
        </div>
      )}
      {isFollowing && (
        <div
          className="follow"
          role="button"
          tabIndex={0}
          onClick={() => {
            unFollow(userInView.userID);
          }}
          onKeyDown={() => {
            unFollow(userInView.userID);
          }}>
          <BiUserMinus className="follow-icon" size="2rem" />
          unfollow
        </div>
      )}
      <div
        className="sendDm"
        role="button"
        tabIndex={0}
        onClick={() => {
          setShowMessageModal(true);
        }}
        onKeyDown={() => {
          setShowMessageModal(true);
        }}>
        <BiMessageRoundedEdit className="sendDm-icon" size="2rem" />
        send DM
      </div>
      {showMessageModal && (
        <MessageModal
          userInView={userInView}
          showWarning={showWarning}
          setShowMessageModal={setShowMessageModal}
          showOverlayEffect={showOverlayEffect}
        />
      )}
    </div>
  );
}

export default ProfileOptionsOther;

ProfileOptionsOther.propTypes = {
  showWarning: PropTypes.func.isRequired,
  showOverlayEffect: PropTypes.func.isRequired,
  userInView: PropTypes.shape({
    userPic: PropTypes.string,
    username: PropTypes.string,
    userBackground: PropTypes.string,
    joined: PropTypes.objectOf(PropTypes.number),
    following: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)),
    followers: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)),
    likes: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)),
    posts: PropTypes.arrayOf(
      PropTypes.shape({
        created: PropTypes.objectOf(PropTypes.number),
        postID: PropTypes.string
      })
    ),
    replies: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)),
    description: PropTypes.string,
    userID: PropTypes.string,
    messages: PropTypes.arrayOf(
      PropTypes.shape({
        messageID: PropTypes.string,
        messageContent: PropTypes.string,
        sender: PropTypes.string,
        isRead: PropTypes.bool,
        sendDate: PropTypes.objectOf(PropTypes.number)
      })
    )
  }),
  follow: PropTypes.func.isRequired,
  unFollow: PropTypes.func.isRequired
};

ProfileOptionsOther.defaultProps = {
  userInView: PropTypes.shape({
    userPic: '',
    username: '',
    userBackground: '',
    joined: [],
    following: [],
    followers: [],
    likes: [],
    posts: [],
    replies: [],
    description: '',
    userID: '',
    messages: []
  })
};
