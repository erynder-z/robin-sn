import React from 'react';
import PropTypes from 'prop-types';
import { BsBookmarkPlus } from 'react-icons/bs';

function RemoveBookmarkOption({ handleBookmark }) {
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
      <BsBookmarkPlus size="2rem" className="post-bookmark-icon" />
      Bookmark post
    </div>
  );
}

export default RemoveBookmarkOption;

RemoveBookmarkOption.propTypes = {
  handleBookmark: PropTypes.func.isRequired
};
