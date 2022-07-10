import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { BsBookmarkPlus, BsFillBookmarkDashFill } from 'react-icons/bs';
import './PostDetailsOther.css';

function PostDetailsOther({ bookmarkPost, isPostBookmarked }) {
  const [bookmarkCheck, setBookmarkCheck] = useState(null);

  // check if post is aleady bookmarked
  useEffect(() => {
    setBookmarkCheck(isPostBookmarked);
  }, [isPostBookmarked]);

  return (
    <div className="postDetails-other fadein">
      <div className="otherPost">Post options</div>
      <div className="bookmarkPost">
        {bookmarkCheck && (
          <div
            className="post-bookmark"
            role="button"
            tabIndex={0}
            onClick={() => {
              bookmarkPost();
              setBookmarkCheck(!bookmarkCheck);
            }}
            onKeyDown={() => {
              bookmarkPost();
              setBookmarkCheck(!bookmarkCheck);
            }}>
            <BsFillBookmarkDashFill size="2rem" className="post-bookmark-icon" /> Remove bookmark
          </div>
        )}

        {!bookmarkCheck && (
          <div
            className="post-bookmark"
            role="button"
            tabIndex={0}
            onClick={() => {
              bookmarkPost();
              setBookmarkCheck(!bookmarkCheck);
            }}
            onKeyDown={() => {
              bookmarkPost();
              setBookmarkCheck(!bookmarkCheck);
            }}>
            <BsBookmarkPlus size="2rem" className="post-bookmark-icon" />
            Bookmark post
          </div>
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
