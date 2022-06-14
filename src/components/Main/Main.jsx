import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { doc } from 'firebase/firestore';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { Route, Routes } from 'react-router-dom';
import { database } from '../Firebase/Firebase';
import './Main.css';
import CreateUserAccount from '../CreateUserAccount/CreateUserAccount';
import Home from '../Home/Home';
import Sidebar from '../Sidebar/Sidebar';
import ContextBar from '../ContextBar/ContextBar';
import FloatingMenu from '../FloatingMenu/FloatingMenu';
import NewPostModal from '../NewPostModal/NewPostModal';
import Profile from '../Profile/Profile';
import PostDetails from '../PostDetails/PostDetails';

function Main({ userCredentials }) {
  const { uid } = userCredentials;
  const [usr] = useDocumentData(doc(database, 'users', uid));
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [isUserSetup, setIsUserSetup] = useState(false);
  const [userData, setUserData] = useState({});

  const toggleNewPostModal = () => {
    setShowNewPostModal(!showNewPostModal);
  };

  const checkUserSetup = () => {
    if (usr.isSetup) {
      setIsUserSetup(true);
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
              <Home userData={userData} />
            ) : (
              <CreateUserAccount userCredentials={userCredentials} />
            )
          }
        />
        {/* make nested route so UI elements like the sidebar don't have to be re-rendered on component change.  */}
        <Route path="home" element={isUserSetup ? <Home userData={userData} /> : null} />
        <Route path="profile" element={isUserSetup ? <Profile userData={userData} /> : null} />
        <Route
          path="postDetails"
          element={isUserSetup ? <PostDetails userData={userData} /> : null}
        />
      </Routes>
      {isUserSetup && <ContextBar userData={userData} />}
      {isUserSetup && <FloatingMenu toggleNewPostModal={toggleNewPostModal} />}
      {isUserSetup && showNewPostModal && (
        <NewPostModal toggleNewPostModal={toggleNewPostModal} userCredentials={userCredentials} />
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
