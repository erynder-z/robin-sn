import React from 'react';
import PropTypes from 'prop-types';
import { BiLike } from 'react-icons/bi';

function PostOptionLike({ clickEffect, alreadyLiked, like, setClickEffect, postID, numOfLikes }) {
  return (
    <div
      title="Like / Unlike"
      className={`optionItem ${clickEffect.like ? 'clicked' : ''} ${
        alreadyLiked ? 'alreadyInteracted' : ''
      }`}
      role="button"
      tabIndex={0}
      onClick={(e) => {
        like(postID);
        setClickEffect({ like: true });
        e.stopPropagation();
      }}
      onKeyDown={(e) => {
        like(postID);
        setClickEffect({ like: true });
        e.stopPropagation();
      }}>
      <BiLike size="1.5rem" />
      {numOfLikes}
    </div>
  );
}

export default PostOptionLike;

PostOptionLike.propTypes = {
  clickEffect: PropTypes.objectOf(PropTypes.bool.isRequired).isRequired,
  alreadyLiked: PropTypes.bool.isRequired,
  like: PropTypes.func.isRequired,
  setClickEffect: PropTypes.func.isRequired,
  postID: PropTypes.string.isRequired,
  numOfLikes: PropTypes.number.isRequired
};
