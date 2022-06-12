import { collection, getDocs } from 'firebase/firestore';
import React, { useState, useEffect } from 'react';
import { database } from '../Firebase/Firebase';
import './ContextBar.css';

function ContextBar() {
  const [userList, setUserList] = useState([]);

  const getSomeUsers = async () => {
    const querySnapshot = await getDocs(collection(database, 'users'));

    const list = [];
    querySnapshot.forEach((doc) => {
      list.push({
        userID: doc.data().userID,
        username: doc.data().username,
        userPic: doc.data().userPic
      });
      setUserList(list);
    });
  };

  useEffect(() => {
    getSomeUsers();
  }, []);

  const userItem = (usr) => (
    <div className="userlist-item" key={usr.userID}>
      <img className="userlist-usrpic" src={usr.userPic} alt="user avatar" />
      <div className="userlist-username">@{usr.username}</div>
      <div className="userlist-follow">follow</div>
    </div>
  );

  return (
    <div className="contextbar">
      <div className="userlist">{userList.map((user) => userItem(user))}</div>
    </div>
  );
}

export default ContextBar;
