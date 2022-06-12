import { arrayUnion, collection, doc, getDocs, updateDoc } from 'firebase/firestore';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { database } from '../Firebase/Firebase';
import './ContextBar.css';

function ContextBar({ userCredentials }) {
  const { uid } = userCredentials;
  const [userList, setUserList] = useState([]);

  const getSomeUsers = async () => {
    const querySnapshot = await getDocs(collection(database, 'users'));

    const list = [];
    querySnapshot.forEach((document) => {
      list.push({
        userID: document.data().userID,
        username: document.data().username,
        userPic: document.data().userPic
      });
      setUserList(list);
    });
  };

  useEffect(() => {
    getSomeUsers();
  }, []);

  const follow = async (followUserID) => {
    const userToFollowRef = doc(database, 'users', followUserID);
    const userThatFollowsRef = doc(database, 'users', uid);

    await updateDoc(userToFollowRef, {
      followers: arrayUnion({ userID: uid })
    });
    await updateDoc(userThatFollowsRef, {
      following: arrayUnion({ userID: followUserID })
    });
  };

  const userItem = (usr) => (
    <div className="userlist-item" key={usr.userID}>
      <img className="userlist-usrpic" src={usr.userPic} alt="user avatar" />
      <div className="userlist-username">@{usr.username}</div>
      <div
        className="userlist-follow"
        role="button"
        tabIndex={0}
        onClick={() => {
          follow(usr.userID);
        }}
        onKeyDown={() => {
          follow(usr.userID);
        }}>
        follow
      </div>
    </div>
  );

  return (
    <div className="contextbar">
      <div className="userlist">{userList.map((user) => userItem(user))}</div>
    </div>
  );
}

export default ContextBar;

ContextBar.propTypes = {
  userCredentials: PropTypes.shape({
    uid: PropTypes.string.isRequired
  }).isRequired
};
