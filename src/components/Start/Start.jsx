import React, { useEffect, useState } from 'react';
import { query, collection, getDocs } from 'firebase/firestore';
import { database } from '../Firebase/Firebase';
import './Start.css';
import CreateUserAccount from '../CreateUserAccount/CreateUserAccount';
import Home from '../Home/Home';

function Start({ auth }) {
  const [isUserSetup, setIsUserSetup] = useState(false);
  const { uid } = auth.currentuser.uid;

  const checkUserSetup = async () => {
    const checkIsSetup = (currentUser) => {
      if (currentUser.isUserSetup) {
        setIsUserSetup(true);
      }
    };

    const getUserInfo = async () => {
      const userRef = collection(database, 'users', uid);
      const q = query(userRef);
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((document) => document.data());
    };

    const currentUser = await getUserInfo();

    return checkIsSetup(currentUser);
  };

  useEffect(() => {
    checkUserSetup();
  }, []);

  return <div className="start-container">{isUserSetup ? <Home /> : <CreateUserAccount />}</div>;
}

export default Start;
