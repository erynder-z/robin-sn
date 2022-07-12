import { doc } from 'firebase/firestore';
import React, { useContext, useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { auth, database } from '../data/firebase';

const UserContext = React.createContext();

export function GetUserContext() {
  return useContext(UserContext);
}

export function UserProvider({ children }) {
  const [usr] = useDocumentData(doc(database, 'users', auth.currentUser.uid));

  const [userData, setUserData] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUserData(usr);
    setLoading(false);
  }, [usr]);

  const value = useMemo(() => ({ userData }), [userData]);

  return <UserContext.Provider value={value}>{!loading && children}</UserContext.Provider>;
}

UserProvider.propTypes = {
  children: PropTypes.node.isRequired
};
