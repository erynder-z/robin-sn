import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import PropTypes from 'prop-types';
import { format, fromUnixTime } from 'date-fns';
import './MyProfile.css';
import PostItem from '../PostItem/PostItem';
import { database } from '../Firebase/Firebase';

function MyProfile({ userData, changeContextBarMode }) {
  const {
    userPic,
    username,
    joined,
    following,
    followers,
    posts,
    description,
    replies,
    userID,
    likes
  } = userData;
  const [activeView, setActiveView] = useState('posts');
  const joinedDateFormatted = format(fromUnixTime(joined.seconds), 'dd LLLL yyy');
  const [postsAndReplies, setPostsAndReplies] = useState([]);
  const [media, setMedia] = useState([]);

  const sortPosts = (lst) => {
    const unsorted = [];
    lst.map((o) => unsorted.push({ postID: o.postID, created: o.created, userID }));
    const sorted = unsorted.sort((a, b) => (a.created.seconds < b.created.seconds ? 1 : -1));
    return sorted;
  };

  // get all of the users posts and posts the user has replied to
  const getPostsAndReplies = async () => {
    const list = [...posts];
    const userReplies = [...replies];

    userReplies.forEach(async (reply) => {
      const q = query(collection(database, 'posts'), where('postID', '==', reply.postID));
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {
        list.push({ postID: doc.data().postID, created: doc.data().created });
      });
      setPostsAndReplies(sortPosts(list));
    });
  };

  // get all of the users posts with an image
  const getMediaPosts = async () => {
    const list = [];
    const q = query(
      collection(database, 'posts'),
      where('ownerID', '==', userID),
      where('image.imageRef', '!=', 'null')
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      list.push({ postID: doc.data().postID, created: doc.data().created });
    });

    setMedia(sortPosts(list));
  };

  useEffect(() => {
    getPostsAndReplies();
  }, [activeView === 'postsAndReplies']);

  useEffect(() => {
    getMediaPosts();
  }, [activeView === 'media']);

  useEffect(() => {
    changeContextBarMode('myprofile');
  }, []);

  // lists all the posts made by the user
  const Posts = (
    <div className="posts">
      {sortPosts(posts).map((post) => (
        <PostItem key={post.postID} postID={post.postID} userID={userData.userID} />
      ))}
    </div>
  );

  const PostsAndReplies = (
    <div className="postsAndReplies">
      {postsAndReplies.map((post) => (
        <PostItem key={post.postID} postID={post.postID} userID={userData.userID} />
      ))}
    </div>
  );

  const Media = (
    <div className="media">
      {media.map((post) => (
        <PostItem key={post.postID} postID={post.postID} userID={userData.userID} />
      ))}
    </div>
  );

  const Likes = (
    <div className="likes">
      {likes.map((post) => (
        <PostItem key={post.postID} postID={post.postID} userID={userData.userID} />
      ))}
    </div>
  );

  return (
    <div className="profile-container">
      <div className="profile-header"> My Profile</div>
      <div className="profile-card">
        <div className="card-wrapper">
          <img className="profile-usrpic" src={userPic} alt="user avatar" />

          <div className="profile-userinfo-container">
            <h3 className="profile-username">@{username}</h3>
            <div className="profile-joined">joined {joinedDateFormatted}</div>
            <div className="profile-follow-container">
              <div className="profile-following">following: {following.length - 1}</div>
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

export default MyProfile;

MyProfile.propTypes = {
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
  changeContextBarMode: PropTypes.func.isRequired
};
