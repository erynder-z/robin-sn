import React from 'react';
import PropTypes from 'prop-types';
import './UserInfo.css';

function UserInfo({ userData, logout }) {
  return (
    <div className="usr-container">
      <div className="head">
        <img className="usrpic" src={userData.userPic} alt="user avatar" />
        <div className="usrname">@{userData.username}</div>
      </div>
      <button
        className="logoutBtn"
        type="button"
        onClick={() => {
          logout();
        }}
        onKeyDown={() => {
          logout();
        }}>
        Logout
      </button>
    </div>
  );
}

export default UserInfo;

UserInfo.propTypes = {
  userData: PropTypes.shape({
    isSetup: PropTypes.bool.isRequired,
    username: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    userPic: PropTypes.string.isRequired,
    useremail: PropTypes.string.isRequired,
    joined: PropTypes.objectOf(PropTypes.number).isRequired,
    numberOfTweets: PropTypes.number.isRequired,
    followers: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)).isRequired,
    following: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)).isRequired,
    tweets: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)).isRequired,
    replies: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)).isRequired,
    bookmarks: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)).isRequired
  }).isRequired,
  logout: PropTypes.func.isRequired
};
