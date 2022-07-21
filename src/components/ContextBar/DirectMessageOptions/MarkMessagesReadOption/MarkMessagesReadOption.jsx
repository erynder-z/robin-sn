import React from 'react';
import PropTypes from 'prop-types';
import { BiCheckDouble } from 'react-icons/bi';

function MarkMessagesReadOption({ markMessagesAsRead }) {
  return (
    <div className="markMessagesRead">
      <div
        className="message-markRead"
        role="button"
        tabIndex={0}
        onClick={() => {
          markMessagesAsRead();
        }}
        onKeyDown={() => {
          markMessagesAsRead();
        }}>
        <BiCheckDouble size="2rem" className="message-markRead-icon" />
        Mark all as read
      </div>
    </div>
  );
}

export default MarkMessagesReadOption;

MarkMessagesReadOption.propTypes = {
  markMessagesAsRead: PropTypes.func.isRequired
};
