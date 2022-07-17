import React from 'react';
import { BiSmile } from 'react-icons/bi';
import './GoodbyeOverlay.css';

function GoodbyeOverlay() {
  return (
    <div className="goodbye-overlay">
      <BiSmile className="goodbye-icon" size="5rem" />
      <h3> Bye!</h3>
    </div>
  );
}

export default GoodbyeOverlay;
