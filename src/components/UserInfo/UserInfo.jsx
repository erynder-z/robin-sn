import React from 'react';
import PropTypes from 'prop-types';
import './UserInfo.css';
import { BiLogOut } from 'react-icons/bi';

function UserInfo({ userData, logout }) {
  return (
    <div className="usr-container">
      <div className="head">
        <img className="usrpic" src={userData.userPic} alt="user avatar" />
        <div className="usrname">
          <button
            className="logoutBtn"
            type="button"
            onClick={() => {
              logout();
            }}
            onKeyDown={() => {
              logout();
            }}>
            <BiLogOut size="2rem" />
          </button>{' '}
          @{userData.username}{' '}
        </div>
      </div>
    </div>
  );
}

export default UserInfo;

UserInfo.propTypes = {
  userData: PropTypes.shape({
    userID: PropTypes.string.isRequired,
    isSetup: PropTypes.bool.isRequired,
    username: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    userPic: PropTypes.string.isRequired,
    useremail: PropTypes.string.isRequired,
    joined: PropTypes.objectOf(PropTypes.number).isRequired,
    followers: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)).isRequired,
    following: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)).isRequired,
    posts: PropTypes.arrayOf(
      PropTypes.shape({
        created: PropTypes.objectOf(PropTypes.number),
        postID: PropTypes.string
      })
    ).isRequired,
    replies: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)).isRequired,
    reposts: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)).isRequired,
    likes: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)).isRequired,
    bookmarks: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)).isRequired
  }).isRequired,
  logout: PropTypes.func.isRequired
};
