import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { collection, getDocs } from 'firebase/firestore';
import { BiUserPlus, BiUserMinus } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import { GetUserContext } from '../../../contexts/UserContext';
import { database } from '../../../data/firebase';
import './FollowUserList.css';

function FollowUserList({ showWarning, follow, unFollow }) {
  const { userData } = GetUserContext();
  const navigate = useNavigate();
  const { following } = userData;
  const [userList, setUserList] = useState([]);

  // get all list of all users in the datababse
  const getUserList = async () => {
    try {
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
        if (document.data().userID !== userData.userID && document.data().active) {
          list.push({
            userID: document.data().userID,
            username: document.data().username,
            userPic: document.data().userPic,
            following: checkIfAlreadyFollowing(userData, document.data().userID)
          });
        }

        // return only 15 random users
        const createLimitedUserlist = (userlist) => {
          if (userlist.length > 15) {
            while (userlist.length > 15) {
              const random = Math.floor(Math.random() * userlist.length);
              // eslint-disable-next-line no-unused-expressions
              userlist.splice(random, 1)[0];
            }
          }
          return userlist;
        };

        setUserList(createLimitedUserlist(list));
      });
    } catch (err) {
      showWarning(err.message);
    }
  };

  useEffect(() => {
    getUserList();
  }, [following]);

  const linkToUserProfile = (e, usrID) => {
    e.stopPropagation();
    navigate(`/main/userprofile/${usrID}`, {
      state: { usr: usrID }
    });
  };

  const userItem = (usr) => (
    <div className="userlist-item" key={usr.userID}>
      <input
        title={`Goto ${usr.username}'s profile`}
        type="image"
        className="userlist-usrpic"
        src={usr.userPic}
        alt="user avatar"
        tabIndex={0}
        onClick={(e) => {
          linkToUserProfile(e, usr.userID);
        }}
        onKeyDown={(e) => {
          linkToUserProfile(e, usr.userID);
        }}
      />
      <div
        title={`Goto ${usr.username}'s profile`}
        className="userlist-username"
        role="link"
        tabIndex={0}
        onClick={(e) => {
          linkToUserProfile(e, usr.userID);
        }}
        onKeyDown={(e) => {
          linkToUserProfile(e, usr.userID);
        }}>
        @{usr.username}
      </div>
      {!usr.following && (
        <div
          title="Follow"
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
          title="Unfollow"
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

FollowUserList.propTypes = {
  showWarning: PropTypes.func.isRequired,
  follow: PropTypes.func.isRequired,
  unFollow: PropTypes.func.isRequired
};
