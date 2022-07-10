import React from 'react';
import PropTypes from 'prop-types';
import { TbLogout } from 'react-icons/tb';
import { GetUserContext } from '../../contexts/UserContext';
import './UserInfo.css';

function UserInfo({ logout }) {
  const { userData } = GetUserContext();
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
            <TbLogout size="2rem" />
          </button>{' '}
          <span> @{userData.username}</span>
        </div>
      </div>
    </div>
  );
}

export default UserInfo;

UserInfo.propTypes = {
  logout: PropTypes.func.isRequired
};
