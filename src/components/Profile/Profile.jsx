import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { format, fromUnixTime } from 'date-fns';
import './Profile.css';
import PostItem from '../PostItem/PostItem';

function Profile({ userData }) {
  const { userPic, username, joined, following, followers, posts, description } = userData;
  const [activeView, setActiveView] = useState('posts');
  const joinedDateFormatted = format(fromUnixTime(joined.seconds), 'dd LLLL yyy');

  // lists all the posts made by the user
  const Posts = (
    <div className="posts">
      {posts.map((post) => (
        <PostItem key={post.postID} postID={post.postID} userID={userData.userID} />
      ))}
    </div>
  );
  const PostsAndReplies = <div className="postsAndReplies">posts and replies</div>;
  const Media = <div className="media">users media</div>;
  const Likes = <div className="likes">users likes</div>;

  return (
    <div className="profile-container">
      <div className="profile-header">Profile</div>
      <div className="profile-card">
        <div className="card-wrapper">
          <img className="profile-usrpic" src={userPic} alt="user avatar" />

          <div className="profile-userinfo-container">
            <h3 className="profile-username">@{username}</h3>
            <div className="profile-joined">joined {joinedDateFormatted}</div>
            <div className="profile-follow-container">
              <div className="profile-following">following: {following.length}</div>
              <div className="profile-followers">followers: {followers.length}</div>
            </div>{' '}
          </div>
          <div className="profile-description">{description}</div>
        </div>
      </div>
      <div className="profile-content">
        <div className="profile-content-header">
          <div
            className={`posts ${activeView === 'posts' ? 'active' : ''}`}
            role="button"
            tabIndex={0}
            onClick={() => {
              setActiveView('posts');
            }}
            onKeyDown={() => {
              setActiveView('posts');
            }}>
            Posts
          </div>
          <div
            className={`postsAndReplies ${activeView === 'postsAndReplies' ? 'active' : ''}`}
            role="button"
            tabIndex={0}
            onClick={() => {
              setActiveView('postsAndReplies');
            }}
            onKeyDown={() => {
              setActiveView('postsAndReplies');
            }}>
            Posts & Replies
          </div>
          <div
            className={`media ${activeView === 'media' ? 'active' : ''}`}
            role="button"
            tabIndex={0}
            onClick={() => {
              setActiveView('media');
            }}
            onKeyDown={() => {
              setActiveView('media');
            }}>
            Media
          </div>
          <div
            className={`likes ${activeView === 'likes' ? 'active' : ''}`}
            role="button"
            tabIndex={0}
            onClick={() => {
              setActiveView('likes');
            }}
            onKeyDown={() => {
              setActiveView('likes');
            }}>
            Likes
          </div>
        </div>
        {activeView === 'posts' && Posts}
        {activeView === 'postsAndReplies' && PostsAndReplies}
        {activeView === 'media' && Media}
        {activeView === 'likes' && Likes}
      </div>
    </div>
  );
}

export default Profile;

Profile.propTypes = {
  userData: PropTypes.shape({
    userID: PropTypes.string.isRequired,
    isSetup: PropTypes.bool.isRequired,
    username: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    userPic: PropTypes.string.isRequired,
    useremail: PropTypes.string.isRequired,
    joined: PropTypes.objectOf(PropTypes.number).isRequired,
    followers: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)).isRequired,
    following: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)).isRequired,
    posts: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)).isRequired,
    replies: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)).isRequired,
    reposts: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)).isRequired,
    likes: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)).isRequired,
    bookmarks: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)).isRequired
  }).isRequired
};
