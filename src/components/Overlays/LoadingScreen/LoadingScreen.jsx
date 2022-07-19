import React from 'react';
import { BiLoaderAlt } from 'react-icons/bi';
import './LoadingScreen.css';

function LoadingScreen() {
  return (
    <div className="loading">
      <BiLoaderAlt className="loading-icon" size="5rem" />
      <span>loading...</span>
    </div>
  );
}

export default LoadingScreen;
