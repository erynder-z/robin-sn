import React from 'react';
import PropTypes from 'prop-types';
import './Sidebar.css';
import {
  BiHomeAlt,
  BiHash,
  BiBell,
  BiEnvelope,
  BiBookmark,
  BiListUl,
  BiUserCircle
} from 'react-icons/bi';
import { signOut } from 'firebase/auth';
import { auth } from '../Firebase/Firebase';
import UserInfo from '../UserInfo/UserInfo';

function Sidebar({ userData }) {
  const logout = async () => {
    await signOut(auth);
  };

  return (
    <div className="sidebar">
      <ul>
        <li className="sidebar-item">
          <BiHomeAlt size="2rem" />
          <span>Home</span>
        </li>
        <li className="sidebar-item">
          <BiHash size="2rem" />
          <span>Explore</span>
        </li>
        <li className="sidebar-item">
          <BiBell size="2rem" />
          <span>Notifications</span>
        </li>
        <li className="sidebar-item">
          <BiEnvelope size="2rem" />
          <span>Messages</span>
        </li>
        <li className="sidebar-item">
          <BiBookmark size="2rem" />
          <span>Bookomarks</span>
        </li>
        <li className="sidebar-item">
          <BiListUl size="2rem" />
          <span>Lists</span>
        </li>
        <li className="sidebar-item">
          <BiUserCircle size="2rem" />
          <span>Profile</span>
        </li>
        <UserInfo logout={logout} userData={userData} />
      </ul>
    </div>
  );
}

export default Sidebar;

Sidebar.propTypes = {
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
  }).isRequired
};
