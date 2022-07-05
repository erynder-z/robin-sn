import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { format, fromUnixTime } from 'date-fns';
import { BiMeh } from 'react-icons/bi';
import './UserProfile.css';
import { useLocation } from 'react-router-dom';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import PostItem from '../PostItem/PostItem';
import { database } from '../Firebase/Firebase';
import { GetUserContext } from '../../contexts/UserContext';

function UserProfile({ handleSetIsReplyModalActive }) {
  const { userData } = GetUserContext();
  const location = useLocation();
  // from PostItem component
  const { usr } = location.state;
  const [user, setUser] = useState(null);
  const [activeView, setActiveView] = useState('posts');
  const [postsAndReplies, setPostsAndReplies] = useState([]);
  const [media, setMedia] = useState([]);

  const getUserData = async () => {
    try {
      const userRef = doc(database, 'users', usr);
      const docSnap = await getDoc(userRef);

      setUser({
        userPic: docSnap.data().userPic,
        username: docSnap.data().username,
        userBackground: docSnap.data().userBackground,
        joined: docSnap.data().joined,
        following: docSnap.data().following,
        followers: docSnap.data().followers,
        likes: docSnap.data().likes,
        posts: docSnap.data().posts,
        replies: docSnap.data().replies,
        description: docSnap.data().description,
        userID: docSnap.data().userID
      });
    } catch (err) {
      console.log(err);
    }
  };

  const sortPosts = (lst) => {
    const unsorted = [];
    lst.map((o) => unsorted.push({ postID: o.postID, created: o.created, userID: user.userID }));
    const sorted = unsorted.sort((a, b) => (a.created.seconds < b.created.seconds ? 1 : -1));
    return sorted;
  };

  // get all of the users posts and posts the user has replied to
  const getPostsAndReplies = async () => {
    const list = [...user.posts];
    const userReplies = [...user.replies];

    userReplies.forEach(async (reply) => {
      const q = query(collection(database, 'posts'), where('postID', '==', reply.postID));
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((d) => {
        list.push({ postID: d.data().postID, created: d.data().created });
      });
      setPostsAndReplies(sortPosts(list));
    });
  };

  // get all of the users posts with an image
  const getMediaPosts = async () => {
    const list = [];
    const q = query(
      collection(database, 'posts'),
      where('ownerID', '==', user.userID),
      where('image.imageRef', '!=', 'null')
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((d) => {
      list.push({ postID: d.data().postID, created: d.data().created });
    });

    setMedia(sortPosts(list));
  };

  useEffect(() => {
    getUserData();
  }, []);

  useEffect(() => {
    if (user) {
      getPostsAndReplies();
    }
  }, [activeView === 'postsAndReplies']);

  useEffect(() => {
    if (user) {
      getMediaPosts();
    }
  }, [activeView === 'media']);

  // lists all the posts made by the user
  const Posts = (
    <div className="posts fadein">
      {user && user.posts.length <= 0 && (
        <div className="empty">
          <BiMeh size="3rem" />
          <h4> empty...</h4>
          <h5> all of {user.username}&apos;s posts will show up here</h5>
        </div>
      )}
      {user &&
        user.posts.map((post) => (
          <PostItem
            key={post.postID}
            postID={post.postID}
            userID={userData.userID}
            userPic={userData.userPic}
            handleSetIsReplyModalActive={handleSetIsReplyModalActive}
          />
        ))}
    </div>
  );
  const PostsAndReplies = (
    <div className="postsAndReplies fadein">
      {user && postsAndReplies.length <= 0 && (
        <div className="empty">
          <BiMeh size="3rem" />
          <h4> empty...</h4>
          <h5> all of {user.username}&apos;s replies will show up here</h5>
        </div>
      )}
      {postsAndReplies.map((post) => (
        <PostItem
          key={post.postID}
          postID={post.postID}
          userID={userData.userID}
          userPic={userData.userPic}
          handleSetIsReplyModalActive={handleSetIsReplyModalActive}
        />
      ))}
    </div>
  );

  const Media = (
    <div className="media fadein">
      {user && media.length <= 0 && (
        <div className="empty">
          <BiMeh size="3rem" />
          <h4> empty...</h4>
          <h5> all of {user.username}&apos;s posts with images will show up here</h5>
        </div>
      )}
      {media.map((post) => (
        <PostItem
          key={post.postID}
          postID={post.postID}
          userID={userData.userID}
          userPic={userData.userPic}
          handleSetIsReplyModalActive={handleSetIsReplyModalActive}
        />
      ))}
    </div>
  );
  const Likes = (
    <div className="likes fadein">
      {user && user.likes.length <= 0 && (
        <div className="empty">
          <BiMeh size="3rem" />
          <h4> empty...</h4>
          <h5> all posts {user.username} liked will show up here</h5>
        </div>
      )}
      {user &&
        user.likes.map((post) => (
          <PostItem
            key={post.postID}
            postID={post.postID}
            userID={userData.userID}
            userPic={userData.userPic}
            handleSetIsReplyModalActive={handleSetIsReplyModalActive}
          />
        ))}
    </div>
  );

  return (
    <div className="profile-container fadein">
      {user && (
        <>
          <div
            className="background-wrapper"
            style={{
              backgroundImage: `url(${user.userBackground})`,
              backgroundPosition: 'center',
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat'
            }}>
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
                    <div className="profile-following">following: {user.following.length - 1}</div>
                    <div className="profile-followers">followers: {user.followers.length}</div>
                  </div>{' '}
                </div>
                <div className="profile-description">{user.description}</div>
              </div>
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
                Replies
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

UserProfile.propTypes = {
  handleSetIsReplyModalActive: PropTypes.func.isRequired
};
