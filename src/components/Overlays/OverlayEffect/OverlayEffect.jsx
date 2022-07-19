import React from 'react';
import PropTypes from 'prop-types';
import { BiCheck } from 'react-icons/bi';
import './OverlayEffect.css';

function OverlayEffect({ message }) {
  return (
    <div className="overlayEffect-overlay">
      {message}
      <BiCheck className="overlayEffect-icon" size="5rem" />
    </div>
  );
}

export default OverlayEffect;

OverlayEffect.propTypes = {
  message: PropTypes.string.isRequired
};
