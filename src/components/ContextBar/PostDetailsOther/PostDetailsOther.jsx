import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FaBookmark, FaRegBookmark } from 'react-icons/fa';
import './PostDetailsOther.css';

function PostDetailsOther({ bookmarkPost, isPostBookmarked }) {
  const [bookmarkCheck, setBookmarkCheck] = useState(null);

  useEffect(() => {
    setBookmarkCheck(isPostBookmarked);
  }, [isPostBookmarked]);

  return (
    <div className="postDetails-other fadein">
      <div className="otherPost">Post options</div>
      <div className="bookmarkPost">
        {bookmarkCheck && (
          <FaBookmark
            className="post-bookmark"
            size="2rem"
            role="button"
            tabIndex={0}
            onClick={() => {
              bookmarkPost();
              setBookmarkCheck(!bookmarkCheck);
            }}
            onKeyDown={() => {
              bookmarkPost();
              setBookmarkCheck(!bookmarkCheck);
            }}
          />
        )}
        {!bookmarkCheck && (
          <FaRegBookmark
            className="post-bookmark"
            size="2rem"
            role="button"
            tabIndex={0}
            onClick={() => {
              bookmarkPost();
              setBookmarkCheck(!bookmarkCheck);
            }}
            onKeyDown={() => {
              bookmarkPost();
              setBookmarkCheck(!bookmarkCheck);
            }}
          />
        )}
      </div>
    </div>
  );
}

export default PostDetailsOther;

PostDetailsOther.propTypes = {
  bookmarkPost: PropTypes.func.isRequired,
  isPostBookmarked: PropTypes.bool.isRequired
};
