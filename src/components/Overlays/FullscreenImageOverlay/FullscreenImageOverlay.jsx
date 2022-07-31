import React from 'react';
import PropTypes from 'prop-types';
import './FullscreenImageOverlay.css';

function FullscreenImageOverlay({ image, setShowFullscreenImage, handleSetModalActive }) {
  return (
    <div className="fullscreenImage-overlay">
      <div
        className="fullscreenImage-close"
        role="button"
        tabIndex={0}
        onClick={() => {
          handleSetModalActive(false);
          setShowFullscreenImage(false);
        }}
        onKeyDown={() => {
          handleSetModalActive(false);
          setShowFullscreenImage(false);
        }}>
        &times;
      </div>
      <img className="fullscreenImage" src={image} alt="uploaded content" />
    </div>
  );
}

export default FullscreenImageOverlay;

FullscreenImageOverlay.propTypes = {
  image: PropTypes.string.isRequired,
  setShowFullscreenImage: PropTypes.func.isRequired,
  handleSetModalActive: PropTypes.func.isRequired
};
