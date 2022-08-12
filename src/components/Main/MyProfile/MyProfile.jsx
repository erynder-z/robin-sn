import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { format, fromUnixTime } from 'date-fns';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { database } from '../../../data/firebase';
import { GetUserContext } from '../../../contexts/UserContext';
import PostsTab from './PostsTab/PostsTab';
import PostsAndRepliesTab from './PostsAndRepliesTab/PostsAndRepliesTab';
import MediaTab from './MediaTab/MediaTab';
import LikesTab from './LikesTab/LikesTab';
import './MyProfile.css';

function MyProfile({ changeActiveTab, handleSetModalActive, showWarning }) {
  const { userData } = GetUserContext();
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
  const [usrPosts, setUsrPosts] = useState([]);
  const joinedDateFormatted = format(fromUnixTime(joined.seconds), 'dd LLLL yyy');
  const [postsAndReplies, setPostsAndReplies] = useState([]);
  const [media, setMedia] = useState([]);
  const [usrLikes, setUsrLikes] = useState([]);
  const navigate = useNavigate();

  const sortPosts = (lst) => {
    const unsorted = [];
    lst.map((o) => unsorted.push({ postID: o.postID, created: o.created, userID }));
    const sorted = unsorted.sort((a, b) => (a.created.seconds < b.created.seconds ? 1 : -1));
    return sorted;
  };

  // return only the last 25 posts
  const getUserPosts = () => {
    const limitedPosts = [...posts];
    while (limitedPosts.length > 25) {
      limitedPosts.shift();
    }
    setUsrPosts(limitedPosts);
  };

  // get all of the users posts and posts the user has replied to
  const getPostsAndReplies = async () => {
    try {
      const list = [];
      const userReplies = [...replies];

      userReplies.forEach(async (reply) => {
        const q = query(
          collection(database, 'posts'),
          where('postID', '==', reply.postID),
          orderBy('created', 'desc'),
          limit(25)
        );
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
          list.push({ postID: doc.data().postID, created: doc.data().created });
        });
        setPostsAndReplies(sortPosts(list));
      });
    } catch (err) {
      showWarning(err.message);
    }
  };

  // get all of the users posts with an image
  const getMediaPosts = async () => {
    const list = [];
    try {
      const getImages = async () => {
        const q1 = query(
          collection(database, 'posts'),
          where('ownerID', '==', userID),
          where('image.imageRef', '!=', null),
          orderBy('image.imageRef', 'desc'),
          orderBy('created', 'desc'),
          limit(25)
        );
        const querySnapshot = await getDocs(q1);

        querySnapshot.forEach((doc) => {
          list.push({ postID: doc.data().postID, created: doc.data().created });
        });
      };

      const getVideos = async () => {
        const q2 = query(
          collection(database, 'posts'),
          where('ownerID', '==', userID),
          where('videoIDs', '!=', []),
          orderBy('videoIDs', 'desc'),
          orderBy('created', 'desc'),
          limit(25)
        );

        const querySnapshot = await getDocs(q2);
        querySnapshot.forEach((doc) => {
          list.push({ postID: doc.data().postID, created: doc.data().created });
        });
      };

      getImages().then(() => {
        getVideos().then(() => {
          setMedia(list);
        });
      });
    } catch (err) {
      showWarning(err.message);
    }
  };

  // get only the last 25 likes
  const getUserLikes = () => {
    const limitedPosts = [...likes];
    while (limitedPosts.length > 25) {
      limitedPosts.shift();
    }
    setUsrLikes(limitedPosts);
  };

  const linkToUserlistFollowing = (e) => {
    e.stopPropagation();
    navigate('/main/userlist_following');
  };

  const linkToUserlistFollowers = (e) => {
    e.stopPropagation();
    navigate('/main/userlist_followers');
  };

  useEffect(() => {
    getUserPosts();
  }, [activeView === 'posts']);

  useEffect(() => {
    getPostsAndReplies();
  }, [activeView === 'postsAndReplies']);

  useEffect(() => {
    getMediaPosts();
  }, [activeView === 'media']);

  useEffect(() => {
    getUserLikes();
  }, [activeView === 'likes']);

  useEffect(() => {
    changeActiveTab('myprofile');
  }, []);

  useEffect(() => {
    getUserPosts();
  }, [userData.posts]);

  return (
    <div className="profile-container fadein">
      <div
        className="background-wrapper"
        style={{
          backgroundImage: `url(${userData.userBackground})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat'
        }}>
        <div className="profile-header"> My Profile</div>

        <div className="profile-card">
          <div className="card-wrapper">
            <img className="profile-usrpic" src={userPic} alt="user avatar" />

            <div className="profile-userinfo-container">
              <h3 className="profile-username">@{username}</h3>
              <div className="profile-joined">joined {joinedDateFormatted}</div>
              <div className="profile-follow-container">
                <div
                  role="link"
                  tabIndex={0}
                  className="myProfile-following"
                  onClick={linkToUserlistFollowing}
                  onKeyDown={linkToUserlistFollowing}>
                  <span>{following.length - 1}</span> Following
                </div>
                <div
                  role="link"
                  tabIndex={0}
                  className="myProfile-followers"
                  onClick={linkToUserlistFollowers}
                  onKeyDown={linkToUserlistFollowers}>
                  <span>{followers.length}</span> Followers
                </div>
              </div>{' '}
            </div>
            <div className="profile-description">{description}</div>
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
            Likes{' '}
          </div>
        </div>
        {activeView === 'posts' && (
          <PostsTab
            usrPosts={usrPosts}
            sortPosts={sortPosts}
            handleSetModalActive={handleSetModalActive}
          />
        )}
        {activeView === 'postsAndReplies' && (
          <PostsAndRepliesTab
            postsAndReplies={postsAndReplies}
            handleSetModalActive={handleSetModalActive}
          />
        )}
        {activeView === 'media' && (
          <MediaTab media={media} handleSetModalActive={handleSetModalActive} />
        )}
        {activeView === 'likes' && (
          <LikesTab usrLikes={usrLikes} handleSetModalActive={handleSetModalActive} />
        )}
      </div>
    </div>
  );
}

export default MyProfile;

MyProfile.propTypes = {
  changeActiveTab: PropTypes.func.isRequired,
  handleSetModalActive: PropTypes.func.isRequired,
  showWarning: PropTypes.func.isRequired
};
