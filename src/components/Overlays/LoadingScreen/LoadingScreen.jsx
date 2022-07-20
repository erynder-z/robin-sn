import React from 'react';
import PropTypes from 'prop-types';
import { BiLoaderAlt } from 'react-icons/bi';
import './LoadingScreen.css';

function LoadingScreen({ message }) {
  return (
    <div className="loading">
      <BiLoaderAlt className="loading-icon" size="5rem" />
      <span>{message}</span>
    </div>
  );
}

export default LoadingScreen;

LoadingScreen.propTypes = {
  message: PropTypes.string
};

LoadingScreen.defaultProps = {
  message: 'loading...'
};
