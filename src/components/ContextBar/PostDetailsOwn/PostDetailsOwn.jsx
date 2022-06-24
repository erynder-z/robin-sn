import PropTypes from 'prop-types';
import React from 'react';
import { BiTrash } from 'react-icons/bi';
import './PostDetailsOwn.css';

function PostDetailsOwn({ userData, postInfo, deletePost }) {
  return (
    <div className="postDetails-own">
      <div className="deletePost">
        {' '}
        <BiTrash
          className="post-delete"
          size="1.5rem"
          role="button"
          tabIndex={0}
          onClick={() => {
            deletePost(postInfo.postID, userData.userID);
          }}
          onKeyDown={() => {
            deletePost(postInfo.postID, userData.userID);
          }}
        />
      </div>
    </div>
  );
}

export default PostDetailsOwn;

PostDetailsOwn.propTypes = {
  userData: PropTypes.shape({
    userID: PropTypes.string.isRequired,
    isSetup: PropTypes.bool.isRequired,
    username: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    userPic: PropTypes.string.isRequired,
    useremail: PropTypes.string.isRequired,
    joined: PropTypes.objectOf(PropTypes.number),
    followers: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)).isRequired,
    following: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)).isRequired,
    posts: PropTypes.arrayOf(
      PropTypes.shape({
        created: PropTypes.objectOf(PropTypes.number),
        postID: PropTypes.string
      })
    ).isRequired,
    replies: PropTypes.arrayOf(
      PropTypes.shape({
        created: PropTypes.objectOf(PropTypes.number),
        postID: PropTypes.string
      })
    ).isRequired,
    reposts: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)).isRequired,
    likes: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)).isRequired,
    bookmarks: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)).isRequired
  }).isRequired,
  postInfo: PropTypes.shape({
    content: PropTypes.string,
    created: PropTypes.objectOf(PropTypes.number),
    hasHashtag: PropTypes.bool,
    image: PropTypes.shape({ imageRef: PropTypes.string, imageURL: PropTypes.string }),
    likes: PropTypes.shape({ userID: PropTypes.string }),
    ownerID: PropTypes.string,
    postID: PropTypes.string,
    replies: PropTypes.shape({
      replyContent: PropTypes.string,
      replyDate: PropTypes.objectOf(PropTypes.number),
      replyID: PropTypes.string.isRequired,
      replyUser: PropTypes.string
    }),
    reposts: PropTypes.shape({ userID: PropTypes.string })
  }).isRequired,
  deletePost: PropTypes.func.isRequired
};
