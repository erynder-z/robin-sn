import React from 'react';
import PropTypes from 'prop-types';
import { BiBookmark } from 'react-icons/bi';
import './PostDetailsOther.css';

function PostDetailsOther({ bookmarkPost }) {
  return (
    <div className="postDetails-other">
      <div className="otherPost">soemthing</div>
      <div className="bookmarkPost">
        <BiBookmark
          className="post-bookmark"
          size="2rem"
          role="button"
          tabIndex={0}
          onClick={() => {
            bookmarkPost();
          }}
          onKeyDown={() => {
            bookmarkPost();
          }}
        />
      </div>
    </div>
  );
}

export default PostDetailsOther;

PostDetailsOther.propTypes = {
  bookmarkPost: PropTypes.func.isRequired
};
