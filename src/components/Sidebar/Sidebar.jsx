import React from 'react';
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

function Sidebar() {
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
      </ul>
    </div>
  );
}

export default Sidebar;
