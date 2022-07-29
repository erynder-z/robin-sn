import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import BookmarkOption from '../BookmarkOption/BookmarkOption';
import RemoveBookmarkOption from '../RemoveBookmarkOption/RemoveBookmarkOption';
import './PostDetailsOther.css';

function PostDetailsOther({ bookmarkPost, isPostBookmarked }) {
  const [bookmarkCheck, setBookmarkCheck] = useState(null);

  const handleBookmark = () => {
    bookmarkPost();
    setBookmarkCheck(!bookmarkCheck);
  };

  // check if post is aleady bookmarked
  useEffect(() => {
    setBookmarkCheck(isPostBookmarked);
  }, [isPostBookmarked]);

  return (
    <div className="postDetails-other fadein">
      <div className="otherPost-header">Post options</div>
      <div className="bookmarkPost">
        {bookmarkCheck && <BookmarkOption handleBookmark={handleBookmark} />}
        {!bookmarkCheck && <RemoveBookmarkOption handleBookmark={handleBookmark} />}
      </div>
    </div>
  );
}

export default PostDetailsOther;

PostDetailsOther.propTypes = {
  bookmarkPost: PropTypes.func.isRequired,
  isPostBookmarked: PropTypes.bool.isRequired
};
