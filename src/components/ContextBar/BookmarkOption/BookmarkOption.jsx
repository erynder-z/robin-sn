import React from 'react';
import PropTypes from 'prop-types';
import { BsFillBookmarkDashFill } from 'react-icons/bs';

function BookmarkOption({ handleBookmark }) {
  return (
    <div
      className="post-bookmark"
      role="button"
      tabIndex={0}
      onClick={() => {
        handleBookmark();
      }}
      onKeyDown={() => {
        handleBookmark();
      }}>
      <BsFillBookmarkDashFill size="2rem" className="post-bookmark-icon" /> Remove bookmark
    </div>
  );
}

export default BookmarkOption;

BookmarkOption.propTypes = {
  handleBookmark: PropTypes.func.isRequired
};
