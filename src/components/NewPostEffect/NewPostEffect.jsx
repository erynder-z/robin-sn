import React from 'react';
import PropTypes from 'prop-types';
import { BiCheck } from 'react-icons/bi';
import './NewPostEffect.css';

function NewPostEffect({ message }) {
  return (
    <div className="newPostEffect-overlay">
      {message}
      <BiCheck className="newPostEffect-icon" size="5rem" />
    </div>
  );
}

export default NewPostEffect;

NewPostEffect.propTypes = {
  message: PropTypes.string.isRequired
};
