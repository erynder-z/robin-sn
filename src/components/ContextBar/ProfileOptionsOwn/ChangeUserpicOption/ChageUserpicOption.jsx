import React from 'react';
import PropTypes from 'prop-types';
import { BiImageAdd } from 'react-icons/bi';

function ChangeUserpicOption({ changeUserpic }) {
  return (
    <label htmlFor="picture" className="changeUserpic">
      <BiImageAdd className="changePicture-icon" size="2rem" />
      <input
        className="custom-file-upload"
        type="file"
        id="picture"
        name="picture"
        accept="image/png, image/jpeg"
        onChange={(e) => {
          changeUserpic(e);
        }}
      />
      change user picture
    </label>
  );
}

export default ChangeUserpicOption;

ChangeUserpicOption.propTypes = {
  changeUserpic: PropTypes.func.isRequired
};
