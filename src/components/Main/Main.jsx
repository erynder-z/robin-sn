import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { doc } from 'firebase/firestore';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { database } from '../Firebase/Firebase';
import './Main.css';
import CreateUserAccount from '../CreateUserAccount/CreateUserAccount';
import Home from '../Home/Home';
import Sidebar from '../Sidebar/Sidebar';
import ContextBar from '../ContextBar/ContextBar';
import FloatingMenu from '../FloatingMenu/FloatingMenu';
import NewPostModal from '../NewPostModal/NewPostModal';

function Main({ user }) {
  const { uid } = user;
  const [usr] = useDocumentData(doc(database, 'users', uid));
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [isUserSetup, setIsUserSetup] = useState(false);

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
    }
  }, [usr]);

  return (
    <div className="main-container">
      {isUserSetup && <Sidebar />}
      {isUserSetup ? <Home /> : <CreateUserAccount user={user} />}
      {isUserSetup && <ContextBar />}
      {isUserSetup && <FloatingMenu toggleModal={toggleModal} />}
      {isUserSetup && showNewPostModal && <NewPostModal toggleModal={toggleModal} />}
    </div>
  );
}

export default Main;

Main.propTypes = {
  user: PropTypes.shape({
    uid: PropTypes.string.isRequired
  }).isRequired
};
