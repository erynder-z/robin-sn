import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  TbHome2,
  TbHash,
  TbSpeakerphone,
  TbMessageCircle,
  TbBookmarks,
  TbUser
} from 'react-icons/tb';
import { Link } from 'react-router-dom';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { doc } from 'firebase/firestore';
import { GetUserContext } from '../../contexts/UserContext';
import { database } from '../../data/firebase';
import UserInfo from './UserInfo/UserInfo';
import logoWhite from '../../assets/logo_white.png';
import './Sidebar.css';

function Sidebar({ activeTab, logout }) {
  const { userData } = GetUserContext();
  const [inbox] = useDocumentData(doc(database, 'messages', userData.userID));
  const [unreadMessagesExist, setUnreadMessagesExist] = useState(false);

  const checkForUnreadMessages = () => {
    const list = [...inbox.inbox];
    return list.some((msg) => msg.isRead === false);
  };

  useEffect(() => {
    if (inbox) {
      setUnreadMessagesExist(checkForUnreadMessages());
    }
  }, [inbox]);

  return (
    <div className="sidebar">
      <ul>
        <img className="logo" src={logoWhite} alt="app logo" />
        <Link to="/main/home">
          <li className={`sidebar-item ${activeTab === 'home' ? 'active' : 'inactive'}`}>
            <div className="sidebar-item-wrapper">
              <TbHome2 size="2rem" />
              <span>Home</span>
            </div>
          </li>
        </Link>
        <Link to="/main/explore">
          <li className={`sidebar-item ${activeTab === 'explore' ? 'active' : 'inactive'}`}>
            <div className="sidebar-item-wrapper">
              <TbHash size="2rem" />
              <span>Explore</span>
            </div>
          </li>
        </Link>
        <Link to="/main/mentions">
          <li className={`sidebar-item ${activeTab === 'mentions' ? 'active' : 'inactive'}`}>
            <div className="sidebar-item-wrapper">
              <TbSpeakerphone size="2rem" />
              <span>Mentions</span>
            </div>
          </li>
        </Link>
        <Link to="/main/directmessages">
          <li className={`sidebar-item ${activeTab === 'directmessages' ? 'active' : 'inactive'}`}>
            <div className="sidebar-item-wrapper">
              <TbMessageCircle size="2rem" />
              <span>DMs</span>
              {unreadMessagesExist && <div className="notificationBubble" />}
            </div>
          </li>
        </Link>
        <Link to="/main/bookmarks">
          <li className={`sidebar-item ${activeTab === 'bookmarks' ? 'active' : 'inactive'}`}>
            <div className="sidebar-item-wrapper">
              <TbBookmarks size="2rem" />
              <span>Bookmarks</span>
            </div>
          </li>
        </Link>
        <Link to="/main/myprofile">
          <li className={`sidebar-item ${activeTab === 'myprofile' ? 'active' : 'inactive'}`}>
            <div className="sidebar-item-wrapper">
              <TbUser size="2rem" />
              <span>Profile</span>
            </div>
          </li>
        </Link>
        <UserInfo logout={logout} userData={userData} />
      </ul>
    </div>
  );
}

export default Sidebar;

Sidebar.propTypes = {
  activeTab: PropTypes.string.isRequired,
  logout: PropTypes.func.isRequired
};
