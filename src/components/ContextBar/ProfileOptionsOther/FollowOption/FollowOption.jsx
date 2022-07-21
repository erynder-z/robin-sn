import React from 'react';
import PropTypes from 'prop-types';
import { BiUserPlus } from 'react-icons/bi';

function FollowOption({ handleFollow }) {
  return (
    <div
      className="follow"
      role="button"
      tabIndex={0}
      onClick={() => {
        handleFollow();
      }}
      onKeyDown={() => {
        handleFollow();
      }}>
      <BiUserPlus className="follow-icon" size="2rem" />
      follow
    </div>
  );
}

export default FollowOption;

FollowOption.propTypes = {
  handleFollow: PropTypes.func.isRequired
};
