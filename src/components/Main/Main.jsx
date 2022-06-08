import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { doc, getDoc } from 'firebase/firestore';
import { database } from '../Firebase/Firebase';
import './Main.css';
import CreateUserAccount from '../CreateUserAccount/CreateUserAccount';
import Home from '../Home/Home';
import Sidebar from '../Sidebar/Sidebar';
import ContextBar from '../ContextBar/ContextBar';

function Start({ user }) {
  const [isUserSetup, setIsUserSetup] = useState(false);
  const { uid } = user;

  const checkUserSetup = async () => {
    const checkIsSetup = (currentUserFromDB) => {
      if (currentUserFromDB.isSetup) {
        setIsUserSetup(true);
      }
    };

    const getUserInfo = async () => {
      const userRef = doc(database, 'users', uid);
      const docSnap = await getDoc(userRef);

      if (!docSnap.exists()) {
        console.log('User not found!');
      }
      return docSnap.data();
    };

    const currentUserFromDB = await getUserInfo();

    if (currentUserFromDB) {
      return checkIsSetup(currentUserFromDB.userObject);
    }
    return null;

    /* return checkIsSetup(currentUserFromDB.userObject); */
  };

  useEffect(() => {
    checkUserSetup();
  }, []);

  return (
    <div className="main-container">
      {isUserSetup ? <Home user={user} /> : <CreateUserAccount user={user} />}
    </div>
  );
}

export default Start;

Start.propTypes = {
  user: PropTypes.shape({
    uid: PropTypes.string.isRequired
  }).isRequired
};
