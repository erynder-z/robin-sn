import { arrayRemove, arrayUnion, collection, doc, getDocs, updateDoc } from 'firebase/firestore';
import React, { useState, useEffect } from 'react';
import { BiUserPlus, BiUserMinus } from 'react-icons/bi';
import { GetUserContext } from '../../../contexts/UserContext';
import { database } from '../../Firebase/Firebase';
import './FollowUserList.css';

function FollowUserList() {
  const { userData } = GetUserContext();
  const { userID, following } = userData;
  const [userList, setUserList] = useState([]);

  // get all list of all users in the datababse
  // TODO: limit number of users
  const getUserList = async () => {
    const querySnapshot = await getDocs(collection(database, 'users'));

    const list = [];
    querySnapshot.forEach((document) => {
      // for each user: check if we are already following that user
      const checkIfAlreadyFollowing = (usr, followUsr) => {
        const followingList = usr.following;

        if (followingList.some((e) => e.userID === followUsr)) {
          return true;
        }
        return false;
      };
      if (document.data().userID !== userData.userID) {
        list.push({
          userID: document.data().userID,
          username: document.data().username,
          userPic: document.data().userPic,
          following: checkIfAlreadyFollowing(userData, document.data().userID)
        });
      }
      setUserList(list);
    });
  };

  useEffect(() => {
    getUserList();
  }, [following]);

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

  const unFollow = async (followUserID) => {
    const userToFollowRef = doc(database, 'users', followUserID);
    const userThatFollowsRef = doc(database, 'users', userID);

    await updateDoc(userToFollowRef, {
      followers: arrayRemove({ userID })
    });
    await updateDoc(userThatFollowsRef, {
      following: arrayRemove({ userID: followUserID })
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
          <BiUserPlus size="1.5rem" />
        </div>
      )}
      {usr.following && (
        <div
          className="userlist-unfollow"
          role="button"
          tabIndex={0}
          onClick={() => {
            unFollow(usr.userID);
          }}
          onKeyDown={() => {
            unFollow(usr.userID);
          }}>
          <BiUserMinus size="1.5rem" />
        </div>
      )}
    </div>
  );

  return (
    <div className="userlist">
      <div className="userlist-header">Who to follow:</div>
      {userList.map((user) => userItem(user))}
    </div>
  );
}

export default FollowUserList;
