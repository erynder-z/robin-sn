import React from 'react';
import PropTypes from 'prop-types';
import './Sidebar.css';
import { BiHomeAlt, BiHash, BiAt, BiBookmark, BiUserCircle } from 'react-icons/bi';
import { signOut } from 'firebase/auth';
import { Link } from 'react-router-dom';
import { auth } from '../Firebase/Firebase';
import UserInfo from '../UserInfo/UserInfo';
import { GetUserContext } from '../../contexts/UserContext';

function Sidebar({ activeTab }) {
  const { userData } = GetUserContext();
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
        <Link to="/main/mentions">
          <li className={`sidebar-item ${activeTab === 'mentions' ? 'active' : 'inactive'}`}>
            <BiAt size="2rem" />
            <span>Mentions</span>
          </li>
        </Link>
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
  activeTab: PropTypes.string.isRequired
};
