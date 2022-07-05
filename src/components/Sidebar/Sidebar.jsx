import React from 'react';
import PropTypes from 'prop-types';
import './Sidebar.css';
import { TbHome2, TbHash, TbSpeakerphone, TbBookmarks, TbUser } from 'react-icons/tb';
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
            <TbHome2 size="2rem" />
            <span>Home</span>
          </li>
        </Link>
        <Link to="/main/explore">
          <li className={`sidebar-item ${activeTab === 'explore' ? 'active' : 'inactive'}`}>
            <TbHash size="2rem" />
            <span>Explore</span>
          </li>
        </Link>
        <Link to="/main/mentions">
          <li className={`sidebar-item ${activeTab === 'mentions' ? 'active' : 'inactive'}`}>
            <TbSpeakerphone size="2rem" />
            <span>Mentions</span>
          </li>
        </Link>
        <Link to="/main/bookmarks">
          <li className={`sidebar-item ${activeTab === 'bookmarks' ? 'active' : 'inactive'}`}>
            <TbBookmarks size="2rem" />
            <span>Bookmarks</span>
          </li>
        </Link>
        <Link to="/main/myprofile">
          <li className={`sidebar-item ${activeTab === 'myprofile' ? 'active' : 'inactive'}`}>
            <TbUser size="2rem" />
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
