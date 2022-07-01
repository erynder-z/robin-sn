import React from 'react';
import PropTypes from 'prop-types';
import './UserInfo.css';
import { BiLogOut } from 'react-icons/bi';
import { GetUserContext } from '../../contexts/UserContext';

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
  logout: PropTypes.func.isRequired
};
