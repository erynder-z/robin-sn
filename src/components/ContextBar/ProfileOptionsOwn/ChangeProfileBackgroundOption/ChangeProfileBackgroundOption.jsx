import React from 'react';
import PropTypes from 'prop-types';
import { BiLandscape } from 'react-icons/bi';

function ChangeUserBackgroundOption({ changeProfileBackground }) {
  return (
    <label htmlFor="background" className="changeProfileBackground">
      <BiLandscape className="changeProfileBackground-icon" size="2rem" />
      <input
        className="custom-file-upload"
        type="file"
        id="background"
        name="background"
        accept="image/png, image/jpeg"
        onChange={(e) => {
          changeProfileBackground(e);
        }}
      />
      change profile background
    </label>
  );
}

export default ChangeUserBackgroundOption;

ChangeUserBackgroundOption.propTypes = {
  changeProfileBackground: PropTypes.func.isRequired
};
