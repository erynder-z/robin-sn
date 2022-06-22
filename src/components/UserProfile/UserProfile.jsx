import React, { useState, useEffect } from 'react';
import { format, fromUnixTime } from 'date-fns';
import './UserProfile.css';
import { useLocation } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import PostItem from '../PostItem/PostItem';
import { database } from '../Firebase/Firebase';

function UserProfile() {
  const location = useLocation();
  const { usr } = location.state;
  const [user, setUser] = useState(null);
  const [activeView, setActiveView] = useState('posts');

  const getUserData = async () => {
    try {
      const userRef = doc(database, 'users', usr);
      const docSnap = await getDoc(userRef);

      setUser({
        userPic: docSnap.data().userPic,
        username: docSnap.data().username,
        joined: docSnap.data().joined,
        following: docSnap.data().following,
        followers: docSnap.data().followers,
        posts: docSnap.data().posts,
        description: docSnap.data().description
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  // lists all the posts made by the user
  const Posts = (
    <div className="posts">
      {user &&
        user.posts.map((post) => <PostItem key={post.postID} postID={post.postID} userID={usr} />)}
    </div>
  );
  const PostsAndReplies = <div className="postsAndReplies">posts and replies</div>;
  const Media = <div className="media">users media</div>;
  const Likes = <div className="likes">users likes</div>;

  return (
    <div className="profile-container">
      {user && (
        <>
          <div className="profile-header">{user.username}&apos;s Profile</div>
          <div className="profile-card">
            <div className="card-wrapper">
              <img className="profile-usrpic" src={user.userPic} alt="user avatar" />

              <div className="profile-userinfo-container">
                <h3 className="profile-username">@{user.username}</h3>
                <div className="profile-joined">
                  joined {format(fromUnixTime(user.joined.seconds), 'dd LLLL yyy')}
                </div>
                <div className="profile-follow-container">
                  <div className="profile-following">following: {user.following.length}</div>
                  <div className="profile-followers">followers: {user.followers.length}</div>
                </div>{' '}
              </div>
              <div className="profile-description">{user.description}</div>
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
        </>
      )}
    </div>
  );
}

export default UserProfile;