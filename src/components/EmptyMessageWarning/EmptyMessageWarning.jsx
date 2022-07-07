import React from 'react';
import { BiMessageX } from 'react-icons/bi';
import './EmptyMessageWarning.css';

function EmptyMessageWarning() {
  return (
    <div className="emptyMessageWarning-overlay">
      <BiMessageX className="emptyMessageWarning-icon" size="5rem" />
      Please enter a message!
    </div>
  );
}

export default EmptyMessageWarning;
