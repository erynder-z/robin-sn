import React from 'react';
import PropTypes from 'prop-types';
import { BiLogOutCircle } from 'react-icons/bi';
import { GetUserContext } from '../../contexts/UserContext';
import './UserInfo.css';

function UserInfo({ logout }) {
  const { userData } = GetUserContext();
  return (
    <div className="usr-container">
      <div className="head">
        <img className="usrpic" src={userData.userPic} alt="user avatar" />
        <div className="usrname">
          {' '}
          <span> @{userData.username}</span>
          <button
            title="logout"
            className="logoutBtn"
            type="button"
            onClick={() => {
              logout();
            }}
            onKeyDown={() => {
              logout();
            }}>
            <BiLogOutCircle size="2rem" />
          </button>{' '}
        </div>
      </div>
    </div>
  );
}

export default UserInfo;

UserInfo.propTypes = {
  logout: PropTypes.func.isRequired
};
