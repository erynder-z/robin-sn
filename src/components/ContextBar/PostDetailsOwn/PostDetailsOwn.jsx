import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { BiTrash } from 'react-icons/bi';
import { FaBookmark, FaRegBookmark } from 'react-icons/fa';
import './PostDetailsOwn.css';

function PostDetailsOwn({ deletePost, bookmarkPost, isPostBookmarked }) {
  const [bookmarkCheck, setBookmarkCheck] = useState(null);

  useEffect(() => {
    setBookmarkCheck(isPostBookmarked);
  }, [isPostBookmarked]);

  return (
    <div className="postDetails-own">
      <div className="myPost">My post</div>
      <div className="deletePost">
        {' '}
        <BiTrash
          className="post-delete"
          size="2rem"
          role="button"
          tabIndex={0}
          onClick={() => {
            deletePost();
          }}
          onKeyDown={() => {
            deletePost();
          }}
        />
      </div>

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

export default PostDetailsOwn;

PostDetailsOwn.propTypes = {
  deletePost: PropTypes.func.isRequired,
  bookmarkPost: PropTypes.func.isRequired,
  isPostBookmarked: PropTypes.bool.isRequired
};
