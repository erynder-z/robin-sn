import React from 'react';
import PropTypes from 'prop-types';
import { BiMessageRounded } from 'react-icons/bi';

function PostOptionReply({
  clickEffect,
  alreadyReplied,
  toggleReplyModal,
  setClickEffect,
  numOfReplies
}) {
  return (
    <div
      title="Reply"
      className={`optionItem ${clickEffect.reply ? 'clicked' : ''} ${
        alreadyReplied ? 'alreadyInteracted' : ''
      }`}
      role="button"
      tabIndex={0}
      onClick={(e) => {
        toggleReplyModal();
        setClickEffect({ reply: true });
        e.stopPropagation();
      }}
      onKeyDown={(e) => {
        toggleReplyModal();
        setClickEffect({ reply: true });
        e.stopPropagation();
      }}>
      <BiMessageRounded size="1.5rem" />
      {numOfReplies}
    </div>
  );
}

export default PostOptionReply;

PostOptionReply.propTypes = {
  clickEffect: PropTypes.objectOf(PropTypes.bool.isRequired).isRequired,
  alreadyReplied: PropTypes.bool.isRequired,
  toggleReplyModal: PropTypes.func.isRequired,
  setClickEffect: PropTypes.func.isRequired,
  numOfReplies: PropTypes.number.isRequired
};
