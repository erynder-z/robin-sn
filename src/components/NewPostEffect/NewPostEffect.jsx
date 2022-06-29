import React from 'react';
import { BiCheck } from 'react-icons/bi';
import './NewPostEffect.css';

function NewPostEffect() {
  return (
    <div className="newPostEffect-overlay">
      posting <BiCheck className="newPostEffect-icon" size="5rem" />
    </div>
  );
}

export default NewPostEffect;
