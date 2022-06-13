import { arrayUnion, collection, doc, getDocs, updateDoc } from 'firebase/firestore';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { database } from '../Firebase/Firebase';
import './ContextBar.css';

function ContextBar({ userData }) {
  const { userID } = userData;
  const [userList, setUserList] = useState([]);

  const getSomeUsers = async () => {
    const querySnapshot = await getDocs(collection(database, 'users'));

    const list = [];
    querySnapshot.forEach((document) => {
      // check if we are already following that user
      const checkIfAlreadyFollowing = (usr, followUsr) => {
        const followingList = usr.following;

        if (followingList.some((e) => e.userID === followUsr)) {
          return true;
        }
        return false;
      };

      list.push({
        userID: document.data().userID,
        username: document.data().username,
        userPic: document.data().userPic,
        following: checkIfAlreadyFollowing(userData, document.data().userID)
      });
      setUserList(list);
    });
  };

  useEffect(() => {
    getSomeUsers();
  }, []);

  const follow = async (followUserID) => {
    const userToFollowRef = doc(database, 'users', followUserID);
    const userThatFollowsRef = doc(database, 'users', userID);

    await updateDoc(userToFollowRef, {
      followers: arrayUnion({ userID })
    });
    await updateDoc(userThatFollowsRef, {
      following: arrayUnion({ userID: followUserID })
    });
  };

  const userItem = (usr) => (
    <div className="userlist-item" key={usr.userID}>
      <img className="userlist-usrpic" src={usr.userPic} alt="user avatar" />
      <div className="userlist-username">@{usr.username}</div>
      {!usr.following && (
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
      )}
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
  userData: PropTypes.shape({
    userID: PropTypes.string.isRequired,
    isSetup: PropTypes.bool.isRequired,
    username: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    userPic: PropTypes.string.isRequired,
    useremail: PropTypes.string.isRequired,
    joined: PropTypes.objectOf(PropTypes.number).isRequired,
    numberOfPosts: PropTypes.number.isRequired,
    followers: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)).isRequired,
    following: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)).isRequired,
    posts: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)).isRequired,
    replies: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)).isRequired,
    bookmarks: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)).isRequired
  }).isRequired
};
