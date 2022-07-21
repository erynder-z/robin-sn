import React from 'react';
import PropTypes from 'prop-types';
import { BiUserMinus } from 'react-icons/bi';

function UnfollowOption({ handleUnfollow }) {
  return (
    <div
      className="follow"
      role="button"
      tabIndex={0}
      onClick={() => {
        handleUnfollow();
      }}
      onKeyDown={() => {
        handleUnfollow();
      }}>
      <BiUserMinus className="follow-icon" size="2rem" />
      unfollow
    </div>
  );
}

export default UnfollowOption;

UnfollowOption.propTypes = {
  handleUnfollow: PropTypes.func.isRequired
};
