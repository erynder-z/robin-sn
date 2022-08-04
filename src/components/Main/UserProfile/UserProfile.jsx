import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { format, fromUnixTime } from 'date-fns';
import { BiArrowBack } from 'react-icons/bi';
import { useLocation, useNavigate } from 'react-router-dom';
import { collection, doc, getDoc, getDocs, limit, orderBy, query, where } from 'firebase/firestore';
import { database } from '../../../data/firebase';
import limitNumberOfPosts from '../../../helpers/LimitNumberOfPosts/limitNumberOfPosts';
import './UserProfile.css';
import PostsTabUsr from './PostsTabUsr/PostsTabUsr';
import PostsAndRepliesTabUsr from './PostsAndRepliesTabUsr/PostsAndRepliesTabUsr';
import MediaTabUsr from './MediaTabUsr/MediaTabUsr';
import LikesTabUsr from './LikesTabUsr/LikesTabUsr';

function UserProfile({ handleSetModalActive, changeActiveTab, showWarning, setUserInView }) {
  const navigate = useNavigate();
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
        likes: limitNumberOfPosts(docSnap.data().likes),
        posts: limitNumberOfPosts(docSnap.data().posts),
        replies: limitNumberOfPosts(docSnap.data().replies),
        description: docSnap.data().description,
        userID: docSnap.data().userID,
        active: docSnap.data().active
      });
    } catch (err) {
      showWarning(err.message);
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
    try {
      const list = [];
      const userReplies = [...user.replies];

      userReplies.forEach(async (reply) => {
        const q = query(collection(database, 'posts'), where('postID', '==', reply.postID));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((d) => {
          list.push({ postID: d.data().postID, created: d.data().created });
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
          where('ownerID', '==', user.userID),
          where('image.imageRef', '!=', null),
          orderBy('image.imageRef', 'desc'),
          orderBy('created', 'desc'),
          limit(25)
        );
        const querySnapshot = await getDocs(q1);

        querySnapshot.forEach((d) => {
          list.push({ postID: d.data().postID, created: d.data().created });
        });
      };

      const getVideos = async () => {
        const q2 = query(
          collection(database, 'posts'),
          where('ownerID', '==', user.userID),
          where('videoIDs', '!=', []),
          orderBy('videoIDs', 'desc'),
          orderBy('created', 'desc'),
          limit(25)
        );

        const querySnapshot = await getDocs(q2);
        querySnapshot.forEach((d) => {
          list.push({ postID: d.data().postID, created: d.data().created });
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

  const linkToUserlistFollowingOther = (e) => {
    e.stopPropagation();
    navigate('/main/userlist_following_other');
  };

  const linkToUserlistFollowersOther = (e) => {
    e.stopPropagation();
    navigate('/main/userlist_followers_other');
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

  useEffect(() => {
    if (user) {
      setUserInView(user);
    }
  }, [user]);

  useEffect(() => {
    changeActiveTab('userprofile');
  }, []);

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
            <div className="profile-header">
              {' '}
              <div className="backPost">
                <BiArrowBack
                  className="post-back"
                  size="1.5rem"
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    navigate(-1);
                  }}
                  onKeyDown={() => {
                    navigate(-1);
                  }}
                />
              </div>
              <span title={`${user.username}'s Profile`}> {user.username}&apos;s</span>
              &nbsp; Profile
            </div>
            <div className="profile-card">
              <div className="card-wrapper">
                <img className="profile-usrpic" src={user.userPic} alt="user avatar" />

                <div className="profile-userinfo-container">
                  <h3 className="profile-username">@{user.username}</h3>
                  <div className="profile-joined">
                    joined {format(fromUnixTime(user.joined.seconds), 'dd LLLL yyy')}
                  </div>
                  <div className="profile-follow-container">
                    <div
                      className="profile-following"
                      role="link"
                      tabIndex={0}
                      onClick={(e) => {
                        linkToUserlistFollowingOther(e);
                      }}
                      onKeyDown={(e) => {
                        linkToUserlistFollowingOther(e);
                      }}>
                      <span>{user.following.length - 1}</span> Following
                    </div>
                    <div
                      className="profile-followers"
                      role="link"
                      tabIndex={0}
                      onClick={(e) => {
                        linkToUserlistFollowersOther(e);
                      }}
                      onKeyDown={(e) => {
                        linkToUserlistFollowersOther(e);
                      }}>
                      <span>{user.followers.length}</span> Followers
                    </div>
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
            {activeView === 'posts' && (
              <PostsTabUsr
                user={user}
                sortPosts={sortPosts}
                handleSetModalActive={handleSetModalActive}
              />
            )}
            {activeView === 'postsAndReplies' && (
              <PostsAndRepliesTabUsr
                postsAndReplies={postsAndReplies}
                username={user?.username}
                handleSetModalActive={handleSetModalActive}
              />
            )}
            {activeView === 'media' && (
              <MediaTabUsr
                media={media}
                username={user?.username}
                handleSetModalActive={handleSetModalActive}
              />
            )}
            {activeView === 'likes' && (
              <LikesTabUsr
                usrLikes={user?.likes}
                username={user?.username}
                handleSetModalActive={handleSetModalActive}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default UserProfile;

UserProfile.propTypes = {
  handleSetModalActive: PropTypes.func.isRequired,
  changeActiveTab: PropTypes.func.isRequired,
  showWarning: PropTypes.func.isRequired,
  setUserInView: PropTypes.func.isRequired
};
