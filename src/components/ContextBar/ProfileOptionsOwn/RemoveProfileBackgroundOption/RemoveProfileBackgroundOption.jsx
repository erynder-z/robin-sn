import React from 'react';
import PropTypes from 'prop-types';
import { BiWindowClose } from 'react-icons/bi';

function RemoveProfileBackgroundOption({ removeProfileBackground }) {
  return (
    <div
      className="removeBackground"
      role="button"
      tabIndex={0}
      onClick={() => {
        removeProfileBackground();
      }}
      onKeyDown={() => {
        removeProfileBackground();
      }}>
      <BiWindowClose className="removeBackground-icon" size="2rem" />
      remove profile background
    </div>
  );
}

export default RemoveProfileBackgroundOption;

RemoveProfileBackgroundOption.propTypes = {
  removeProfileBackground: PropTypes.func.isRequired
};
