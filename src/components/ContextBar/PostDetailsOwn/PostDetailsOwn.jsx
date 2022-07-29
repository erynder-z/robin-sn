import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import BookmarkOption from '../BookmarkOption/BookmarkOption';
import RemoveBookmarkOption from '../RemoveBookmarkOption/RemoveBookmarkOption';
import DeletePostOption from './DeletePostOption/DeletePostOption';
import './PostDetailsOwn.css';

function PostDetailsOwn({ deletePost, postInfo, bookmarkPost, isPostBookmarked }) {
  const [bookmarkCheck, setBookmarkCheck] = useState(null);

  const handleDeletePost = () => {
    deletePost(postInfo.post);
  };

  const handleBookmark = () => {
    bookmarkPost();
    setBookmarkCheck(!bookmarkCheck);
  };

  // check if post is already bookmarked
  useEffect(() => {
    setBookmarkCheck(isPostBookmarked);
  }, [isPostBookmarked]);

  return (
    <div className="postDetails-own fadein">
      <div className="myPost-header">My post</div>
      <DeletePostOption handleDeletePost={handleDeletePost} />

      <div className="bookmarkPost">
        {bookmarkCheck && <BookmarkOption handleBookmark={handleBookmark} />}
        {!bookmarkCheck && <RemoveBookmarkOption handleBookmark={handleBookmark} />}
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
