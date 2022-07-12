import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { deleteObject, ref } from 'firebase/storage';
import { arrayRemove, deleteDoc, doc, getDoc, increment, updateDoc } from 'firebase/firestore';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { deleteUser, signOut } from 'firebase/auth';
import { auth, database, storage } from '../Firebase/Firebase';
import SetupUserAccount from '../SetupUserAccount/SetupUserAccount';
import Home from '../Home/Home';
import Sidebar from '../Sidebar/Sidebar';
import ContextBar from '../ContextBar/ContextBar';
import FloatingMenu from '../FloatingMenu/FloatingMenu';
import NewPostModal from '../NewPostModal/NewPostModal';
import PostDetails from '../PostDetails/PostDetails';
import MyProfile from '../MyProfile/MyProfile.jsx';
import UserProfile from '../UserProfile/UserProfile';
import Bookmarks from '../Bookmarks/Bookmarks';
import Explore from '../Explore/Explore';
import SearchModal from '../SearchModal/SearchModal';
import Search from '../Search/Search';
import Trends from '../Trends/Trends';
import NewPostEffect from '../NewPostEffect/NewPostEffect';
import Mentions from '../Mentions/Mentions';
import WarningModal from '../WarningModal/WarningModal';
import './Main.css';
import DirectMessages from '../DirectMessages/DirectMessages';

function Main({ userCredentials }) {
  const navigate = useNavigate();
  const { uid } = userCredentials;
  const [usr] = useDocumentData(doc(database, 'users', uid));
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [isUserSetup, setIsUserSetup] = useState(false);
  const [activeTab, setActiveTab] = useState('');
  const [postInfo, setPostInfo] = useState({});
  const [isPostBookmarked, setIsPostBookmarked] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newPostEffect, setNewPostEffect] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [showContextbar, setShowContextbar] = useState(false);
  const [isModalActive, setIsModalActive] = useState(false);
  const [userInView, setUserInView] = useState(null);

  const logout = async () => {
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
  const showNewPostEffect = (string) => {
    setNewPostEffect(string);
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

  // close search-modal when opening new post modal
  const toggleNewPostModal = () => {
    setShowNewPostModal(!showNewPostModal);
    setShowSearchModal(false);
  };

  // close new post modal when opening search modal
  const toggleSearchModal = () => {
    setShowSearchModal(!showSearchModal);
    setShowNewPostModal(false);
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
            setErrorMessage(err);
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
      setErrorMessage(err);
    }
  };

  // delete user account
  const deleteAccount = async () => {
    // delete all of users posts in database
    const deletePosts = async () => {
      const IDArray = [];
      usr.posts.forEach((post) => {
        IDArray.push(post.postID);
      });
      IDArray.forEach(async (id) => {
        const docRef = doc(database, 'posts', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const p = docSnap.data();
          deletePost(p);
        } else {
          setErrorMessage('no such document!');
        }
      });
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

    // remove user from database
    const deleteUserInDatabase = async () => {
      await deleteDoc(doc(database, 'users', usr.userID));
      deleteUserAuthentication();
    };

    navigate('/login');
    await deletePosts();
    await deleteUserInDatabase();
  };

  // check if the user's account setup is complete
  useEffect(() => {
    if (usr) {
      checkUserSetup();
    }
  }, [usr]);

  // check if post is bookmarket whenever a new post is selected
  useEffect(() => {
    if (postInfo.post) {
      checkIsPostbookmarked();
    }
  }, [postInfo]);

  // remove new post effect overlay
  useEffect(() => {
    if (newPostEffect) {
      setTimeout(() => setNewPostEffect(null), 2000);
    }
  }, [newPostEffect]);

  // remove error message overlay
  useEffect(() => {
    if (errorMessage) {
      setTimeout(() => setErrorMessage(null), 2000);
    }
  }, [errorMessage]);

  return (
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
                showNewPostEffect={showNewPostEffect}
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
              />
            ) : null
          }
        />
      </Routes>

      {isUserSetup && (
        <ContextBar
          activeTab={activeTab}
          postInfo={postInfo}
          deleteAccount={deleteAccount}
          deletePost={deletePost}
          isPostBookmarked={isPostBookmarked}
          showContextbar={showContextbar}
          toggleContextbar={toggleContextbar}
          logout={logout}
          showWarning={showWarning}
          showNewPostEffect={showNewPostEffect}
          userInView={userInView}
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
          showNewPostEffect={showNewPostEffect}
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
      {newPostEffect && <NewPostEffect message={newPostEffect} />}
      {errorMessage && <WarningModal errorMessage={errorMessage} />}
    </div>
  );
}

export default Main;

Main.propTypes = {
  userCredentials: PropTypes.shape({
    uid: PropTypes.string.isRequired
  }).isRequired
};
