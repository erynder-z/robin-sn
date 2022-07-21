import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { GetUserContext } from '../../../contexts/UserContext';
import UnfollowOption from './UnfollowOption/UnfollowOption';
import FollowOption from './FollowOption/FollowOption';
import SendDmOption from './SendDmOption/SendDmOption';
import './ProfileOptionsOther.css';

function ProfileOptionsOther({
  userInView,
  follow,
  unFollow,
  toggleMessageModal,
  handleSetModalActive
}) {
  const { userData } = GetUserContext();

  const [isFollowing, setIsFollowing] = useState(null);

  const checkIfFollowing = () => {
    const followingList = [...userData.following];

    if (followingList.some((user) => user.userID === userInView.userID)) {
      setIsFollowing(true);
    } else {
      setIsFollowing(false);
    }
  };

  const handleFollow = () => {
    follow(userInView.userID);
  };

  const handleUnfollow = () => {
    unFollow(userInView.userID);
  };

  useEffect(() => {
    if (userInView) {
      checkIfFollowing();
    }
  }, [userInView, userData.following]);

  return (
    <div className="profileOptionsOther-container">
      <div className="profileOptionsOther-header">Profile options</div>
      {!isFollowing && <FollowOption handleFollow={handleFollow} />}
      {isFollowing && <UnfollowOption handleUnfollow={handleUnfollow} />}
      {userInView?.active && (
        <SendDmOption
          toggleMessageModal={toggleMessageModal}
          handleSetModalActive={handleSetModalActive}
        />
      )}
    </div>
  );
}

export default ProfileOptionsOther;

ProfileOptionsOther.propTypes = {
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
    replies: PropTypes.arrayOf(
      PropTypes.shape({ created: PropTypes.objectOf(PropTypes.number), postID: PropTypes.string })
    ),
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
    ),
    active: PropTypes.bool.isRequired
  }),
  follow: PropTypes.func.isRequired,
  unFollow: PropTypes.func.isRequired,
  toggleMessageModal: PropTypes.func.isRequired,
  handleSetModalActive: PropTypes.func.isRequired
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
