import PropTypes from 'prop-types';
import React from 'react';
import FollowUserList from './FollowUserList/FollowUserList';
import ProfileOptions from './ProfileOptions/ProfileOptions';
import PostDetailsOwn from './PostDetailsOwn/PostDetailsOwn';
import PostDetailsOther from './PostDetailsOther/PostDetailsOther';
import './ContextBar.css';

function ContextBar({ userData, mode, postInfo, deletePost }) {
  return (
    <div className="contextbar">
      {mode === 'home' && <FollowUserList userData={userData} />}
      {mode === 'myprofile' && <ProfileOptions userData={userData} />}
      {mode === 'postdetailsown' && (
        <PostDetailsOwn userData={userData} postInfo={postInfo} deletePost={deletePost} />
      )}
      {mode === 'postdetailsother' && <PostDetailsOther userData={userData} />}
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
    bookmarks: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)).isRequired
  }).isRequired,
  mode: PropTypes.string.isRequired,
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
