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

function Main({ userCredentials }) {
  const { uid } = userCredentials;
  const [usr] = useDocumentData(doc(database, 'users', uid));
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [isUserSetup, setIsUserSetup] = useState(false);
  const [userData, setUserData] = useState({});

  const toggleModal = () => {
    setShowNewPostModal(!showNewPostModal);
  };

  const checkUserSetup = () => {
    if (usr.userObject.isSetup) {
      setIsUserSetup(true);
    }
  };

  useEffect(() => {
    if (usr) {
      checkUserSetup();
      setUserData(usr.userObject);
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
              <Home userCredentials={userCredentials} />
            ) : (
              <CreateUserAccount userCredentials={userCredentials} />
            )
          }
        />
        <Route path="home" element={<Home userCredentials={userCredentials} />} />
        <Route path="profile" element={<Profile userCredentials={userCredentials} />} />
      </Routes>
      {isUserSetup && <ContextBar />}
      {isUserSetup && <FloatingMenu toggleModal={toggleModal} />}
      {isUserSetup && showNewPostModal && (
        <NewPostModal toggleModal={toggleModal} userCredentials={userCredentials} />
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
