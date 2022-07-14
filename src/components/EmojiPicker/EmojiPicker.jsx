import React from 'react';
import PropTypes from 'prop-types';
import Picker from 'emoji-picker-react';
import './EmojiPicker.css';

function EmojiPicker({ setShowEmojiPicker, onEmojiClick }) {
  return (
    <div className="emoji-picker-overlay">
      <div
        className="emoji-picker-close"
        role="button"
        tabIndex={0}
        onClick={() => {
          setShowEmojiPicker(false);
        }}
        onKeyDown={() => {
          setShowEmojiPicker(false);
        }}>
        {' '}
        &times;
      </div>
      <Picker onEmojiClick={onEmojiClick} disableSearchBar />
    </div>
  );
}

export default EmojiPicker;

EmojiPicker.propTypes = {
  setShowEmojiPicker: PropTypes.func.isRequired,
  onEmojiClick: PropTypes.func.isRequired
};
