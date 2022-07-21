import React from 'react';
import PropTypes from 'prop-types';
import { BiLogOutCircle } from 'react-icons/bi';

function LogoutOption({ logout }) {
  return (
    <div
      className="logoutContextbar"
      role="button"
      tabIndex={0}
      onClick={() => {
        logout();
      }}
      onKeyDown={() => {
        logout();
      }}>
      <BiLogOutCircle className="logoutContextbar-icon" size="2rem" />
      Logout
    </div>
  );
}

export default LogoutOption;

LogoutOption.propTypes = {
  logout: PropTypes.func.isRequired
};
