import React from 'react';
import PropTypes from 'prop-types';
import { BiUserCircle } from 'react-icons/bi';

function UpdateUserDescriptionOption({ setShowUpdateUserDescModal }) {
  return (
    <div
      className="updateDescription"
      role="button"
      tabIndex={0}
      onClick={() => {
        setShowUpdateUserDescModal(true);
      }}
      onKeyDown={() => {
        setShowUpdateUserDescModal(true);
      }}>
      <BiUserCircle className="updateDescription-icon" size="2rem" />
      update user description
    </div>
  );
}

export default UpdateUserDescriptionOption;

UpdateUserDescriptionOption.propTypes = {
  setShowUpdateUserDescModal: PropTypes.func.isRequired
};
