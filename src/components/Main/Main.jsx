import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { deleteObject, ref } from 'firebase/storage';
import {
  arrayRemove,
  arrayUnion,
  deleteDoc,
  doc,
  getDoc,
  increment,
  updateDoc
} from 'firebase/firestore';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { database, storage } from '../Firebase/Firebase';
import './Main.css';
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

function Main({ userCredentials }) {
  const navigate = useNavigate();
  const { uid } = userCredentials;
  const [usr] = useDocumentData(doc(database, 'users', uid));
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [isUserSetup, setIsUserSetup] = useState(false);
  const [userData, setUserData] = useState({});
  const [activeTab, setActiveTab] = useState('');
  const [postInfo, setPostInfo] = useState({});
  const [isPostBookmarked, setIsPostBookmarked] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newPostEffect, setNewPostEffect] = useState(false);

  const showNewPostEffect = () => {
    setNewPostEffect(true);
  };

  // save post info so it can be passed down to the contextbar
  const handlePostInfo = (post) => {
    setPostInfo(post);
  };

  const changeActiveTab = (mode) => {
    setActiveTab(mode);
  };

  const toggleNewPostModal = () => {
    setShowNewPostModal(!showNewPostModal);
    setShowSearchModal(false);
  };

  const toggleSearchModal = () => {
    setShowSearchModal(!showSearchModal);
    setShowNewPostModal(false);
  };

  const handleSearchQuery = (q) => {
    setSearchQuery(q.toLowerCase());
  };

  // is user isSetup, the CreateUserAccount component will not be shown
  const checkUserSetup = () => {
    if (usr.isSetup) {
      setIsUserSetup(true);
    }
  };

  const checkIsPostbookmarked = () => {
    if (usr.bookmarks.some((bookmark) => bookmark.postID === postInfo.post.postID)) {
      setIsPostBookmarked(true);
    } else {
      setIsPostBookmarked(false);
    }
  };

  // delete post from posts-collection and remove it from the user-object
  const deletePost = async () => {
    const docRef = doc(database, 'posts', postInfo.post.postID);
    const userRef = doc(database, 'users', uid);
    try {
      const handleDeleteDoc = async () => {
        await deleteDoc(docRef);
        if (postInfo.post.image.imageRef !== null) {
          const getImageRef = postInfo.post.image.imageRef.split('appspot.com/').pop();
          const imageRef = ref(storage, getImageRef);
          await deleteObject(imageRef);
        }
      };

      const handleDeleteFromUserObject = async () => {
        // need to pass the exact object to delete into arrayRemove(), so we first need to retrieve the post-object from the user object.posts-array
        const userSnap = await getDoc(userRef);
        const postToDelete = userSnap.data().posts.find((p) => p.postID === postInfo.post.postID);
        await updateDoc(userRef, {
          posts: arrayRemove(postToDelete)
        });
      };

      const handleRemoveHashtag = async (hashtagArray) => {
        hashtagArray.map(async (hashtag) => {
          const hashtagRef = doc(database, 'hashtags', hashtag.toLowerCase());
          try {
            await updateDoc(hashtagRef, {
              hashtag: hashtag.toLowerCase(),
              count: increment(-1)
            });
          } catch (err) {
            console.log(err);
          }

          const hashtagSnap = await getDoc(hashtagRef);
          if (hashtagSnap.data().count <= 0) {
            await deleteDoc(hashtagRef);
          }
        });
      };

      handleDeleteDoc();
      handleDeleteFromUserObject();
      if (postInfo.post.hashtags.length > 0) {
        handleRemoveHashtag(postInfo.post.hashtags);
      }
      navigate(-1);
    } catch (err) {
      console.log(err);
    }
  };

  const bookmarkPost = async () => {
    const userRef = doc(database, 'users', uid);
    try {
      const docSnap = await getDoc(userRef);
      const found = postInfo.post.postID;

      const addBookmark = async () => {
        await updateDoc(userRef, {
          bookmarks: arrayUnion({ postID: postInfo.post.postID, created: postInfo.post.created })
        });
      };

      const removeBookmark = async () => {
        await updateDoc(userRef, {
          bookmarks: arrayRemove({ postID: postInfo.post.postID, created: postInfo.post.created })
        });
      };
      // like a post if not already liked or unlike if already liked
      if (docSnap.data().bookmarks.some((item) => item.postID === found)) {
        removeBookmark();
      } else {
        addBookmark();
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (postInfo.post) {
      checkIsPostbookmarked();
    }
  }, [postInfo]);

  useEffect(() => {
    if (usr) {
      checkUserSetup();
      setUserData(usr);
    }
  }, [usr]);

  useEffect(() => {
    if (newPostEffect) {
      setTimeout(() => setNewPostEffect(false), 2000);
    }
  }, [newPostEffect]);

  return (
    <div className="main-container">
      {isUserSetup && <Sidebar userData={userData} activeTab={activeTab} />}
      <Routes>
        <Route
          path="/"
          element={
            isUserSetup ? (
              <Home userData={userData} changeActiveTab={changeActiveTab} />
            ) : (
              <SetupUserAccount userCredentials={userCredentials} />
            )
          }
        />
        {/* make nested route so UI elements like the sidebar don't have to be re-rendered on component change.  */}
        <Route
          path="home"
          element={
            isUserSetup ? <Home userData={userData} changeActiveTab={changeActiveTab} /> : null
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
            isUserSetup ? <Bookmarks userData={userData} changeActiveTab={changeActiveTab} /> : null
          }
        />
        <Route
          path="myprofile"
          element={
            isUserSetup ? <MyProfile userData={userData} changeActiveTab={changeActiveTab} /> : null
          }
        />
        <Route
          path="userprofile/:id"
          element={isUserSetup ? <UserProfile userData={userData} /> : null}
        />
        <Route
          path="search"
          element={
            isUserSetup ? (
              <Search
                userData={userData}
                searchQuery={searchQuery}
                changeActiveTab={changeActiveTab}
              />
            ) : null
          }
        />
        <Route
          path="trends"
          element={
            isUserSetup ? (
              <Trends
                userData={userData}
                searchQuery={searchQuery}
                changeActiveTab={changeActiveTab}
              />
            ) : null
          }
        />

        <Route
          path="postDetails"
          element={
            isUserSetup ? (
              <PostDetails
                userData={userData}
                changeActiveTab={changeActiveTab}
                handlePostInfo={handlePostInfo}
              />
            ) : null
          }
        />
      </Routes>

      {isUserSetup && (
        <ContextBar
          userData={userData}
          activeTab={activeTab}
          postInfo={postInfo}
          deletePost={deletePost}
          bookmarkPost={bookmarkPost}
          isPostBookmarked={isPostBookmarked}
        />
      )}
      {isUserSetup && (
        <FloatingMenu
          toggleNewPostModal={toggleNewPostModal}
          toggleSearchModal={toggleSearchModal}
        />
      )}
      {isUserSetup && showNewPostModal && (
        <NewPostModal
          toggleNewPostModal={toggleNewPostModal}
          userData={userData}
          showNewPostEffect={showNewPostEffect}
        />
      )}
      {isUserSetup && showSearchModal && (
        <SearchModal handleSearchQuery={handleSearchQuery} toggleSearchModal={toggleSearchModal} />
      )}
      {newPostEffect && <NewPostEffect />}
    </div>
  );
}

export default Main;

Main.propTypes = {
  userCredentials: PropTypes.shape({
    uid: PropTypes.string.isRequired
  }).isRequired
};
