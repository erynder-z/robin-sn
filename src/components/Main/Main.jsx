import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { deleteObject, ref } from 'firebase/storage';
import { arrayRemove, deleteDoc, doc, getDoc, increment, updateDoc } from 'firebase/firestore';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { deleteUser, signOut } from 'firebase/auth';
import { auth, database, storage } from '../../data/firebase';
import SetupUserAccount from '../SetupUserAccount/SetupUserAccount';
import Home from './Home/Home';
import Sidebar from '../Sidebar/Sidebar';
import ContextBar from '../ContextBar/ContextBar';
import FloatingMenu from '../FloatingMenu/FloatingMenu';
import NewPostModal from '../Modals/NewPostModal/NewPostModal';
import PostDetails from '../Posts/PostDetails/PostDetails';
import MyProfile from './MyProfile/MyProfile';
import UserProfile from './UserProfile/UserProfile';
import Bookmarks from './Bookmarks/Bookmarks';
import Explore from './Explore/Explore';
import SearchModal from '../Modals/SearchModal/SearchModal';
import Search from '../Search/Search';
import Trends from './Explore/Trends/Trends';
import OverlayEffect from '../Overlays/OverlayEffect/OverlayEffect';
import Mentions from './Mentions/Mentions';
import WarningModal from '../Modals/WarningModal/WarningModal';
import DirectMessages from './DirectMessages/DirectMessages';
import UserlistFollowing from './UserlistFollowing/UserlistFollowing';
import UserlistFollowers from './UserlistFollowers/UserlistFollowers';
import MessageModal from '../Modals/MessageModal/MessageModal';
import StatsModal from '../Modals/StatsModal/StatsModal';
import DeleteUserModal from '../Modals/DeleteUserModal/DeleteUserModal';
import UpdateUserDescModal from '../Modals/UpdateUserDescModal/UpdateUserDescModal';
import LoadingScreen from '../Overlays/LoadingScreen/LoadingScreen';
import ChangePasswordModal from '../Modals/ChangePasswordModal/ChangePasswordModal';
import UserlistFollowersOther from './UserlistFollowersOther/UserlistFollowersOther';
import UserlistFollowingOther from './UserlistFollowingOther/UserlistFollowingOther';
import './Main.css';

function Main({ userCredentials, setShowGoodbyleOverlay }) {
  const navigate = useNavigate();
  const { uid } = userCredentials;
  const [usr, loading] = useDocumentData(doc(database, 'users', uid));
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [showDeleteUserModal, setShowDeleteUserModal] = useState(false);
  const [showUpdateUserDescModal, setShowUpdateUserDescModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [isUserSetup, setIsUserSetup] = useState(false);
  const [activeTab, setActiveTab] = useState('');
  const [postInfo, setPostInfo] = useState({});
  const [isPostBookmarked, setIsPostBookmarked] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [overlayEffect, setOverlayEffect] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [showContextbar, setShowContextbar] = useState(false);
  const [isModalActive, setIsModalActive] = useState(false);
  const [userInView, setUserInView] = useState(null);

  const logout = async () => {
    setShowGoodbyleOverlay(true);
    await signOut(auth);
  };

  // indicate if reply-modal is currently shown
  const handleSetModalActive = () => {
    setIsModalActive(!isModalActive);
  };

  // indicate if contextbar is currently visible (for mobile UI)
  const toggleContextbar = () => {
    setShowContextbar(!showContextbar);
  };

  // show oberlay effect when posting
  const showOverlayEffect = (string) => {
    setOverlayEffect(string);
  };

  // show overlay warning
  const showWarning = (message) => {
    setErrorMessage(message);
  };

  // save post info so it can be passed down to the contextbar
  const handlePostInfo = (post) => {
    setPostInfo(post);
  };

  // indicate currently active component in order to show matching contextbar-content
  const changeActiveTab = (mode) => {
    setActiveTab(mode);
  };

  // close search and new post-modal when opening new post modal
  const toggleNewPostModal = () => {
    setShowNewPostModal(!showNewPostModal);
    setShowSearchModal(false);
    setShowMessageModal(false);
  };

  // close new post and message modal when opening search modal
  const toggleSearchModal = () => {
    setShowSearchModal(!showSearchModal);
    setShowNewPostModal(false);
    setShowMessageModal(false);
  };

  // close new post and search modal when opening search modal
  const toggleMessageModal = () => {
    setShowMessageModal(!showMessageModal);
    setShowNewPostModal(false);
    setShowSearchModal(false);
  };

  // set search query to be accessed from child components
  const handleSearchQuery = (q) => {
    setSearchQuery(q.toLowerCase());
  };

  // is user isSetup, the CreateUserAccount component will not be shown
  const checkUserSetup = () => {
    if (usr.isSetup) {
      setIsUserSetup(true);
    }
  };

  // check if currently shown post is bookmarked
  const checkIsPostbookmarked = () => {
    if (usr.bookmarks.some((bookmark) => bookmark.postID === postInfo.post.postID)) {
      setIsPostBookmarked(true);
    } else {
      setIsPostBookmarked(false);
    }
  };

  // delete post from posts-collection and remove it from the user-object
  const deletePost = async (post) => {
    const docRef = doc(database, 'posts', post.postID);
    const userRef = doc(database, 'users', usr.userID);
    try {
      const handleDeleteDoc = async () => {
        await deleteDoc(docRef);
        if (post.image.imageRef !== null && post.isRepost === false) {
          const getImageRef = post.image.imageRef.split('appspot.com/').pop();
          const imageRef = ref(storage, getImageRef);
          await deleteObject(imageRef);
        }
      };

      // relete postID from userObject
      const handleDeleteFromUserObject = async () => {
        // need to pass the exact object to delete into arrayRemove(), so we first need to retrieve the post-object from the user object.posts-array
        const userSnap = await getDoc(userRef);
        if (userSnap.data()) {
          const postToDelete = userSnap.data().posts.find((p) => p.postID === post.postID);
          await updateDoc(userRef, {
            posts: arrayRemove(postToDelete)
          });
          // if post is a repost, also delete it from the reposts-array
          if (post.isRepostOf) {
            const repostToDelete = userSnap
              .data()
              .reposts.find((r) => r.postID === post.isRepostOf);
            await updateDoc(userRef, {
              reposts: arrayRemove(repostToDelete)
            });
          }
        }
      };

      // remove hashtag / decrement hashtag count associated with deleted post
      const handleRemoveHashtag = async (hashtagArray) => {
        hashtagArray.map(async (hashtag) => {
          const hashtagRef = doc(database, 'hashtags', hashtag.toLowerCase());
          try {
            await updateDoc(hashtagRef, {
              hashtag: hashtag.toLowerCase(),
              count: increment(-1)
            });
          } catch (err) {
            setErrorMessage(err.message);
          }

          const hashtagSnap = await getDoc(hashtagRef);
          if (hashtagSnap.data().count <= 0) {
            await deleteDoc(hashtagRef);
          }
        });
      };

      handleDeleteDoc();
      handleDeleteFromUserObject();
      if (post.hashtags.length > 0) {
        handleRemoveHashtag(post.hashtags);
      }

      navigate(-1);
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  // delete user account
  const deleteAccount = async () => {
    // create residue profile
    const parseUserProfile = async () => {
      const userRef = doc(database, 'users', uid);

      try {
        updateDoc(userRef, {
          description: 'This account is no longer active',
          useremail: null,
          followers: [],
          following: [{ userID: null }],
          active: false
        });
      } catch (err) {
        showWarning(err.message);
      }
    };

    // delete user firebase authentication
    const deleteUserAuthentication = async () => {
      const user = auth.currentUser;
      deleteUser(user)
        .then(() => {
          setErrorMessage('user deleted');
        })
        .catch((error) => {
          setErrorMessage(`an error occurred: ${error}`);
        });
    };

    setShowGoodbyleOverlay(true);
    navigate('/login');
    parseUserProfile().then(() => {
      deleteUserAuthentication();
    });
  };

  // check for any references to deleted posts in user object and purge them
  const checkForDeletedPosts = async () => {
    const userRef = doc(database, 'users', uid);
    const userSnap = await getDoc(userRef);

    // delete likes that do not exist in the database
    const purgeDeadLikes = async () => {
      const checkIfLikeExists = async (postID) => {
        const docRef = doc(database, 'posts', postID);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          return null;
        }

        if (userSnap.data()) {
          const likeToDelete = userSnap.data().likes.find((l) => l.postID === postID);
          await updateDoc(userRef, {
            likes: arrayRemove(likeToDelete)
          });
        }
        return null;
      };

      usr?.likes.forEach((like) => {
        checkIfLikeExists(like.postID);
      });
    };

    // delete replies that do not exists in the database
    const purgeDeadReplies = async () => {
      const checkIfReplyExists = async (postID) => {
        const docRef = doc(database, 'posts', postID);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          return null;
        }

        if (userSnap.data()) {
          const replyToDelete = userSnap.data().replies.find((r) => r.postID === postID);
          await updateDoc(userRef, {
            replies: arrayRemove(replyToDelete)
          });
        }
        return null;
      };

      usr?.replies.forEach((reply) => {
        checkIfReplyExists(reply.postID);
      });
    };

    purgeDeadLikes();
    purgeDeadReplies();
  };

  // check if user has finished setup
  useEffect(() => {
    if (usr) {
      checkUserSetup();
    }
  }, [usr && !usr.isSetup]);

  // check if the user's account setup is complete
  useEffect(() => {
    if (usr) {
      checkForDeletedPosts();
    }
  }, [!loading]);

  // check if post is bookmarket whenever a new post is selected
  useEffect(() => {
    if (postInfo.post) {
      checkIsPostbookmarked();
    }
  }, [postInfo]);

  // remove new post effect overlay
  useEffect(() => {
    if (overlayEffect) {
      setTimeout(() => setOverlayEffect(null), 2000);
    }
  }, [overlayEffect]);

  // remove error message overlay
  useEffect(() => {
    if (errorMessage) {
      setTimeout(() => setErrorMessage(null), 2000);
    }
  }, [errorMessage]);

  return loading ? (
    <LoadingScreen message="getting user info" />
  ) : (
    <div className="main-container">
      {isUserSetup && <Sidebar activeTab={activeTab} logout={logout} />}
      <Routes>
        <Route
          path="/"
          element={
            isUserSetup ? (
              <Home
                changeActiveTab={changeActiveTab}
                handleSetModalActive={handleSetModalActive}
                showWarning={showWarning}
              />
            ) : (
              <SetupUserAccount userCredentials={userCredentials} />
            )
          }
        />
        {/* make nested route so UI elements like the sidebar don't have to be re-rendered on component change.  */}
        <Route
          path="home"
          element={
            isUserSetup ? (
              <Home
                changeActiveTab={changeActiveTab}
                handleSetModalActive={handleSetModalActive}
                showWarning={showWarning}
              />
            ) : null
          }
        />
        <Route
          path="explore"
          element={
            isUserSetup ? (
              <Explore handleSearchQuery={handleSearchQuery} changeActiveTab={changeActiveTab} />
            ) : null
          }
        />
        <Route
          path="bookmarks"
          element={
            isUserSetup ? (
              <Bookmarks
                changeActiveTab={changeActiveTab}
                handleSetModalActive={handleSetModalActive}
                showWarning={showWarning}
              />
            ) : null
          }
        />
        <Route
          path="myprofile"
          element={
            isUserSetup ? (
              <MyProfile
                changeActiveTab={changeActiveTab}
                handleSetModalActive={handleSetModalActive}
                showWarning={showWarning}
              />
            ) : null
          }
        />
        <Route
          path="userprofile/:id"
          element={
            isUserSetup ? (
              <UserProfile
                handleSetModalActive={handleSetModalActive}
                changeActiveTab={changeActiveTab}
                showWarning={showWarning}
                setUserInView={setUserInView}
              />
            ) : null
          }
        />
        <Route
          path="search"
          element={
            isUserSetup ? (
              <Search
                searchQuery={searchQuery}
                changeActiveTab={changeActiveTab}
                handleSetModalActive={handleSetModalActive}
                showWarning={showWarning}
              />
            ) : null
          }
        />
        <Route
          path="trends"
          element={
            isUserSetup ? (
              <Trends
                searchQuery={searchQuery}
                changeActiveTab={changeActiveTab}
                handleSetModalActive={handleSetModalActive}
                showWarning={showWarning}
              />
            ) : null
          }
        />
        <Route
          path="mentions"
          element={
            isUserSetup ? (
              <Mentions
                changeActiveTab={changeActiveTab}
                handleSetModalActive={handleSetModalActive}
                showWarning={showWarning}
              />
            ) : null
          }
        />

        <Route
          path="directmessages"
          element={
            isUserSetup ? (
              <DirectMessages
                changeActiveTab={changeActiveTab}
                showWarning={showWarning}
                showOverlayEffect={showOverlayEffect}
                toggleMessageModal={toggleMessageModal}
                handleSetModalActive={handleSetModalActive}
                setUserInView={setUserInView}
              />
            ) : null
          }
        />

        <Route
          path="postDetails"
          element={
            isUserSetup ? (
              <PostDetails
                changeActiveTab={changeActiveTab}
                handlePostInfo={handlePostInfo}
                handleSetModalActive={handleSetModalActive}
                showOverlayEffect={showOverlayEffect}
              />
            ) : null
          }
        />

        <Route
          path="userlist_following"
          element={
            isUserSetup ? (
              <UserlistFollowing changeActiveTab={changeActiveTab} showWarning={showWarning} />
            ) : null
          }
        />

        <Route
          path="userlist_followers"
          element={
            isUserSetup ? (
              <UserlistFollowers changeActiveTab={changeActiveTab} showWarning={showWarning} />
            ) : null
          }
        />
        <Route
          path="userlist_following_other"
          element={
            isUserSetup ? (
              <UserlistFollowingOther
                changeActiveTab={changeActiveTab}
                showWarning={showWarning}
                userInView={userInView}
              />
            ) : null
          }
        />
        <Route
          path="userlist_followers_other"
          element={
            isUserSetup ? (
              <UserlistFollowersOther
                changeActiveTab={changeActiveTab}
                showWarning={showWarning}
                userInView={userInView}
              />
            ) : null
          }
        />
      </Routes>{' '}
      {isUserSetup && (
        <ContextBar
          activeTab={activeTab}
          postInfo={postInfo}
          deletePost={deletePost}
          isPostBookmarked={isPostBookmarked}
          showContextbar={showContextbar}
          toggleContextbar={toggleContextbar}
          logout={logout}
          showWarning={showWarning}
          showOverlayEffect={showOverlayEffect}
          userInView={userInView}
          toggleMessageModal={toggleMessageModal}
          handleSetModalActive={handleSetModalActive}
          setShowStatsModal={setShowStatsModal}
          setShowDeleteUserModal={setShowDeleteUserModal}
          setShowUpdateUserDescModal={setShowUpdateUserDescModal}
          setShowChangePasswordModal={setShowChangePasswordModal}
          handleSearchQuery={handleSearchQuery}
        />
      )}
      {isUserSetup && !showSearchModal && !showNewPostModal && !isModalActive && (
        <FloatingMenu
          toggleNewPostModal={toggleNewPostModal}
          toggleSearchModal={toggleSearchModal}
          toggleContextbar={toggleContextbar}
          showContextbar={showContextbar}
        />
      )}
      {isUserSetup && showNewPostModal && (
        <NewPostModal
          toggleNewPostModal={toggleNewPostModal}
          showOverlayEffect={showOverlayEffect}
          showWarning={showWarning}
        />
      )}
      {isUserSetup && showSearchModal && (
        <SearchModal
          handleSearchQuery={handleSearchQuery}
          toggleSearchModal={toggleSearchModal}
          showWarning={showWarning}
        />
      )}
      {isUserSetup && showMessageModal && (
        <MessageModal
          userInView={userInView}
          showWarning={showWarning}
          showOverlayEffect={showOverlayEffect}
          toggleMessageModal={toggleMessageModal}
          handleSetModalActive={handleSetModalActive}
        />
      )}
      {overlayEffect && <OverlayEffect message={overlayEffect} />}
      {errorMessage && <WarningModal errorMessage={errorMessage} />}
      {showStatsModal && <StatsModal setShowStatsModal={setShowStatsModal} />}
      {showDeleteUserModal && (
        <DeleteUserModal
          setShowDeleteUserModal={setShowDeleteUserModal}
          deleteAccount={deleteAccount}
        />
      )}
      {showUpdateUserDescModal && (
        <UpdateUserDescModal
          setShowUpdateUserDescModal={setShowUpdateUserDescModal}
          showWarning={showWarning}
          showOverlayEffect={showOverlayEffect}
        />
      )}
      {showChangePasswordModal && (
        <ChangePasswordModal
          setShowChangePasswordModal={setShowChangePasswordModal}
          showWarning={showWarning}
          showOverlayEffect={showOverlayEffect}
        />
      )}
    </div>
  );
}

export default Main;

Main.propTypes = {
  setShowGoodbyleOverlay: PropTypes.func.isRequired,
  userCredentials: PropTypes.shape({
    uid: PropTypes.string.isRequired
  }).isRequired
};
