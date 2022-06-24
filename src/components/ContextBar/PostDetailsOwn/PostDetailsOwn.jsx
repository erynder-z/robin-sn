import PropTypes from 'prop-types';
import React from 'react';
import { BiTrash, BiBookmark } from 'react-icons/bi';
import './PostDetailsOwn.css';

function PostDetailsOwn({ deletePost, bookmarkPost }) {
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

export default PostDetailsOwn;

PostDetailsOwn.propTypes = {
  deletePost: PropTypes.func.isRequired,
  bookmarkPost: PropTypes.func.isRequired
};
