import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { deleteObject, ref } from 'firebase/storage';
import { arrayRemove, arrayUnion, deleteDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { database, storage } from '../Firebase/Firebase';
import './Main.css';
import CreateUserAccount from '../CreateUserAccount/CreateUserAccount';
import Home from '../Home/Home';
import Sidebar from '../Sidebar/Sidebar';
import ContextBar from '../ContextBar/ContextBar';
import FloatingMenu from '../FloatingMenu/FloatingMenu';
import NewPostModal from '../NewPostModal/NewPostModal';
import PostDetails from '../PostDetails/PostDetails';
import MyProfile from '../MyProfile/MyProfile.jsx';
import UserProfile from '../UserProfile/UserProfile';

function Main({ userCredentials }) {
  const navigate = useNavigate();
  const { uid } = userCredentials;
  const [usr] = useDocumentData(doc(database, 'users', uid));
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [isUserSetup, setIsUserSetup] = useState(false);
  const [userData, setUserData] = useState({});
  const [contextBarMode, setContextBarMode] = useState('');
  const [postInfo, setPostInfo] = useState({});

  // save post info so it can be passed down to the contextbar
  const handlePostInfo = (post) => {
    setPostInfo(post);
  };

  const changeContextBarMode = (mode) => {
    setContextBarMode(mode);
  };

  const toggleNewPostModal = () => {
    setShowNewPostModal(!showNewPostModal);
  };

  // is user isSetup, the CreateUserAccount component will not be shown
  const checkUserSetup = () => {
    if (usr.isSetup) {
      setIsUserSetup(true);
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

      handleDeleteDoc();
      handleDeleteFromUserObject();
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
          bookmarks: arrayUnion({ postID: postInfo.post.postID })
        });
      };

      const removeBookmark = async () => {
        await updateDoc(userRef, {
          bookmarks: arrayRemove({ postID: postInfo.post.postID })
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
    if (usr) {
      checkUserSetup();
      setUserData(usr);
    }
  }, [usr]);

  return (
    <div className="main-container">
      {isUserSetup && <Sidebar userData={userData} />}
      <Routes>
        <Route
          path="/"
          element={
            isUserSetup ? (
              <Home userData={userData} changeContextBarMode={changeContextBarMode} />
            ) : (
              <CreateUserAccount userCredentials={userCredentials} />
            )
          }
        />
        {/* make nested route so UI elements like the sidebar don't have to be re-rendered on component change.  */}
        <Route
          path="home"
          element={
            isUserSetup ? (
              <Home userData={userData} changeContextBarMode={changeContextBarMode} />
            ) : null
          }
        />
        <Route
          path="myprofile"
          element={
            isUserSetup ? (
              <MyProfile userData={userData} changeContextBarMode={changeContextBarMode} />
            ) : null
          }
        />
        <Route path="userprofile/:id" element={isUserSetup ? <UserProfile /> : null} />
        <Route
          path="postDetails"
          element={
            isUserSetup ? (
              <PostDetails
                userData={userData}
                changeContextBarMode={changeContextBarMode}
                handlePostInfo={handlePostInfo}
              />
            ) : null
          }
        />
      </Routes>
      {isUserSetup && (
        <ContextBar
          userData={userData}
          mode={contextBarMode}
          postInfo={postInfo}
          deletePost={deletePost}
          bookmarkPost={bookmarkPost}
        />
      )}
      {isUserSetup && <FloatingMenu toggleNewPostModal={toggleNewPostModal} />}
      {isUserSetup && showNewPostModal && (
        <NewPostModal toggleNewPostModal={toggleNewPostModal} userData={userData} />
      )}
    </div>
  );
}

export default Main;

Main.propTypes = {
  userCredentials: PropTypes.shape({
    uid: PropTypes.string.isRequired
  }).isRequired
};
