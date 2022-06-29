import React from 'react';
import PropTypes from 'prop-types';
import './Sidebar.css';
import { BiHomeAlt, BiHash, BiBell, BiBookmark, BiUserCircle } from 'react-icons/bi';
import { signOut } from 'firebase/auth';
import { Link } from 'react-router-dom';
import { auth } from '../Firebase/Firebase';
import UserInfo from '../UserInfo/UserInfo';

function Sidebar({ userData, activeTab }) {
  const logout = async () => {
    await signOut(auth);
  };

  return (
    <div className="sidebar">
      <ul>
        <Link to="/main/home">
          <li className={`sidebar-item ${activeTab === 'home' ? 'active' : 'inactive'}`}>
            <BiHomeAlt size="2rem" />
            <span>Home</span>
          </li>
        </Link>
        <Link to="/main/explore">
          <li className={`sidebar-item ${activeTab === 'explore' ? 'active' : 'inactive'}`}>
            <BiHash size="2rem" />
            <span>Explore</span>
          </li>
        </Link>
        <li className={`sidebar-item ${activeTab === 'notifications' ? 'active' : 'inactive'}`}>
          <BiBell size="2rem" />
          <span>Notifications</span>
        </li>
        <Link to="/main/bookmarks">
          <li className={`sidebar-item ${activeTab === 'bookmarks' ? 'active' : 'inactive'}`}>
            <BiBookmark size="2rem" />
            <span>Bookmarks</span>
          </li>
        </Link>
        <Link to="/main/myprofile">
          <li className={`sidebar-item ${activeTab === 'myprofile' ? 'active' : 'inactive'}`}>
            <BiUserCircle size="2rem" />
            <span>Profile</span>
          </li>
        </Link>
        <UserInfo logout={logout} userData={userData} />
      </ul>
    </div>
  );
}

export default Sidebar;

Sidebar.propTypes = {
  userData: PropTypes.shape({
    userID: PropTypes.string.isRequired,
    isSetup: PropTypes.bool.isRequired,
    username: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    userPic: PropTypes.string.isRequired,
    useremail: PropTypes.string.isRequired,
    joined: PropTypes.objectOf(PropTypes.number),
    followers: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)).isRequired,
    following: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)).isRequired,
    posts: PropTypes.arrayOf(
      PropTypes.shape({
        created: PropTypes.objectOf(PropTypes.number),
        postID: PropTypes.string
      })
    ).isRequired,
    replies: PropTypes.arrayOf(
      PropTypes.shape({
        created: PropTypes.objectOf(PropTypes.number),
        postID: PropTypes.string
      })
    ).isRequired,
    reposts: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)).isRequired,
    likes: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)).isRequired,
    bookmarks: PropTypes.arrayOf(
      PropTypes.shape({
        created: PropTypes.objectOf(PropTypes.number),
        postID: PropTypes.string
      })
    ).isRequired
  }).isRequired,
  activeTab: PropTypes.string.isRequired
};
