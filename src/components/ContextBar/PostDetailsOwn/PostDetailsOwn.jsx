import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { BiTrash } from 'react-icons/bi';
import { FaBookmark, FaRegBookmark } from 'react-icons/fa';
import './PostDetailsOwn.css';

function PostDetailsOwn({ deletePost, postInfo, bookmarkPost, isPostBookmarked }) {
  const [bookmarkCheck, setBookmarkCheck] = useState(null);

  useEffect(() => {
    setBookmarkCheck(isPostBookmarked);
  }, [isPostBookmarked]);

  return (
    <div className="postDetails-own fadein">
      <div className="myPost">My post</div>
      <div className="deletePost">
        {' '}
        <BiTrash
          className="post-delete"
          size="2rem"
          role="button"
          tabIndex={0}
          onClick={() => {
            deletePost(postInfo.post);
          }}
          onKeyDown={() => {
            deletePost(postInfo.post);
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
  postInfo: PropTypes.shape({
    post: PropTypes.shape({
      content: PropTypes.string,
      created: PropTypes.objectOf(PropTypes.number),
      hashtags: PropTypes.arrayOf(PropTypes.string),
      image: PropTypes.objectOf(PropTypes.string),
      likes: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)),
      ownerID: PropTypes.string,
      postID: PropTypes.string,
      replies: PropTypes.arrayOf(
        PropTypes.shape({
          replyContent: PropTypes.string,
          replyDate: PropTypes.objectOf(PropTypes.number),
          replyID: PropTypes.string,
          replyUserID: PropTypes.string
        })
      ),
      reposts: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string))
    })
  }),
  deletePost: PropTypes.func.isRequired,
  bookmarkPost: PropTypes.func.isRequired,
  isPostBookmarked: PropTypes.bool.isRequired
};

PostDetailsOwn.defaultProps = {
  postInfo: PropTypes.shape({
    content: '',
    created: {},
    hashtags: [],
    image: {},
    likes: [],
    ownerID: '',
    postID: '',
    replies: {},
    reposts: []
  })
};
