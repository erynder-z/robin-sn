import PropTypes from 'prop-types';
import React from 'react';
import FollowUserList from './FollowUserList/FollowUserList';
import ProfileOptions from './ProfileOptions/ProfileOptions';
import PostDetailsOwn from './PostDetailsOwn/PostDetailsOwn';
import PostDetailsOther from './PostDetailsOther/PostDetailsOther';
import './ContextBar.css';

function ContextBar({ userData, mode, deletePost, bookmarkPost, isPostBookmarked }) {
  return (
    <div className="contextbar">
      {mode === 'home' && <FollowUserList userData={userData} />}
      {mode === 'explore' && <FollowUserList userData={userData} />}
      {mode === 'bookmarks' && <FollowUserList userData={userData} />}
      {mode === 'myprofile' && <ProfileOptions userData={userData} />}
      {mode === 'postdetailsown' && (
        <PostDetailsOwn
          deletePost={deletePost}
          bookmarkPost={bookmarkPost}
          isPostBookmarked={isPostBookmarked}
        />
      )}
      {mode === 'postdetailsother' && (
        <PostDetailsOther bookmarkPost={bookmarkPost} isPostBookmarked={isPostBookmarked} />
      )}
    </div>
  );
}

export default ContextBar;

ContextBar.propTypes = {
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
    bookmarks: PropTypes.arrayOf(
      PropTypes.shape({
        created: PropTypes.objectOf(PropTypes.number),
        postID: PropTypes.string
      })
    ).isRequired
  }).isRequired,
  mode: PropTypes.string.isRequired,
  deletePost: PropTypes.func.isRequired,
  bookmarkPost: PropTypes.func.isRequired,
  isPostBookmarked: PropTypes.bool.isRequired
};
