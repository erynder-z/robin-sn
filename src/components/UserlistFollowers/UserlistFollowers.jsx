import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import PropTypes from 'prop-types';
import { BiSpaceBar, BiArrowBack } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import { GetUserContext } from '../../contexts/UserContext';
import { database } from '../../data/firebase';
import SearchResultUser from '../SearchResultUser/SearchResultUser';

function UserlistFollowers({ changeActiveTab, showWarning }) {
  const { userData } = GetUserContext();
  const [userList, setUserList] = useState([]);
  const navigate = useNavigate();

  // get all list of all users in the datababse
  const getUserList = async () => {
    try {
      const querySnapshot = await getDocs(collection(database, 'users'));
      const followersList = userData.followers;
      const list = [];
      querySnapshot.forEach((doc) => {
        if (followersList.some((user) => user.userID === doc.data().userID)) {
          if (doc.data().userID !== userData.userID) {
            list.push({
              userID: doc.data().userID,
              username: doc.data().username,
              userPic: doc.data().userPic
            });
          }
        }

        setUserList(list);
      });
    } catch (err) {
      showWarning(err.message);
    }
  };

  useEffect(() => {
    getUserList();
  }, [userData.followers]);

  useEffect(() => {
    changeActiveTab('userlist');
  }, []);

  return (
    <div className="userlistFollow-container fadein">
      <div className="userlistFollow-header">
        <div className="backPost">
          <BiArrowBack
            className="post-back"
            size="1.5rem"
            role="button"
            tabIndex={0}
            onClick={() => {
              navigate(-1);
            }}
            onKeyDown={() => {
              navigate(-1);
            }}
          />
        </div>
        Users you follow
      </div>
      <div className="userlistFollow-content">
        <div className="userlistFollow">
          <div className="users">
            {userList?.length <= 0 && (
              <div className="empty">
                <BiSpaceBar size="3rem" />
                <h4> empty...</h4>
                <h5> you have no followers yet...</h5>
              </div>
            )}
            {userList &&
              userList.map((user) => (
                <SearchResultUser key={user.username.toString()} user={user} />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserlistFollowers;

UserlistFollowers.propTypes = {
  changeActiveTab: PropTypes.func.isRequired,
  showWarning: PropTypes.func.isRequired
};
