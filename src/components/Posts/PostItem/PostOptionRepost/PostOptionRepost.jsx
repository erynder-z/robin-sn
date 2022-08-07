import React from 'react';
import PropTypes from 'prop-types';
import { BiRepost } from 'react-icons/bi';

function PostOptionRepost({
  clickEffect,
  alreadyReposted,
  repost,
  setClickEffect,
  postOwnerUsername,
  numOfReposts
}) {
  return (
    <div
      title="Repost"
      className={`optionItem ${clickEffect.repost ? 'clicked' : ''} ${
        alreadyReposted ? 'alreadyInteracted' : ''
      }`}
      role="button"
      tabIndex={0}
      onClick={(e) => {
        repost(postOwnerUsername);
        setClickEffect({ repost: true });

        e.stopPropagation();
      }}
      onKeyDown={(e) => {
        repost(postOwnerUsername);
        setClickEffect({ repost: true });
        e.stopPropagation();
      }}>
      <BiRepost size="1.5rem" />
      {numOfReposts}
    </div>
  );
}

export default PostOptionRepost;

PostOptionRepost.propTypes = {
  clickEffect: PropTypes.objectOf(PropTypes.bool.isRequired).isRequired,
  alreadyReposted: PropTypes.bool.isRequired,
  repost: PropTypes.func.isRequired,
  setClickEffect: PropTypes.func.isRequired,
  postOwnerUsername: PropTypes.string,
  numOfReposts: PropTypes.number.isRequired
};

PostOptionRepost.defaultProps = {
  postOwnerUsername: ''
};
