import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { database } from '../Firebase/Firebase';
import './Start.css';
import CreateUserAccount from '../CreateUserAccount/CreateUserAccount';
import Home from '../Home/Home';

function Start({ user }) {
  const [isUserSetup, setIsUserSetup] = useState(false);
  const { uid, displayName } = user;

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
    return checkIsSetup(currentUserFromDB.userObject);
  };

  useEffect(() => {
    checkUserSetup();
  }, []);

  return (
    <div className="start-container">
      {isUserSetup ? <Home user={user} /> : <CreateUserAccount user={user} />}
    </div>
  );
}

export default Start;
