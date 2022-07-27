import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import PropTypes from 'prop-types';
import { BiSpaceBar, BiArrowBack } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import { database } from '../../../data/firebase';
import SearchResultUser from '../../Search/SearchResultUser/SearchResultUser';

function UserlistFollowingOther({ changeActiveTab, showWarning, userInView }) {
  const [userList, setUserList] = useState([]);
  const navigate = useNavigate();

  // get all list of all users in the datababse
  const getUserList = async () => {
    try {
      const querySnapshot = await getDocs(collection(database, 'users'));
      const followingList = userInView.following;
      const list = [];
      querySnapshot.forEach((doc) => {
        if (followingList.some((user) => user.userID === doc.data().userID)) {
          if (doc.data().userID !== userInView.userID) {
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
  }, [userInView.following]);

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
        Users @{userInView.username} follows
      </div>
      <div className="userlistFollow-content">
        <div className="userlistFollow">
          <div className="users">
            {userList?.length <= 0 && (
              <div className="empty">
                <BiSpaceBar size="3rem" />
                <h4> empty...</h4>
                <h5> @{userInView.username} is not following anybody...</h5>
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

export default UserlistFollowingOther;

UserlistFollowingOther.propTypes = {
  changeActiveTab: PropTypes.func.isRequired,
  showWarning: PropTypes.func.isRequired,
  userInView: PropTypes.shape({
    userPic: PropTypes.string,
    username: PropTypes.string,
    userBackground: PropTypes.string,
    joined: PropTypes.objectOf(PropTypes.number),
    following: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)),
    followers: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)),
    likes: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)),
    posts: PropTypes.arrayOf(
      PropTypes.shape({
        created: PropTypes.objectOf(PropTypes.number),
        postID: PropTypes.string
      })
    ),
    replies: PropTypes.arrayOf(
      PropTypes.shape({ created: PropTypes.objectOf(PropTypes.number), postID: PropTypes.string })
    ),
    description: PropTypes.string,
    userID: PropTypes.string,
    messages: PropTypes.arrayOf(
      PropTypes.shape({
        messageID: PropTypes.string,
        messageContent: PropTypes.string,
        senderID: PropTypes.string,
        isRead: PropTypes.bool,
        sendDate: PropTypes.objectOf(PropTypes.number),
        senderUsername: PropTypes.string.isRequired
      })
    )
  })
};
UserlistFollowingOther.defaultProps = {
  userInView: PropTypes.shape({
    userPic: '',
    username: '',
    userBackground: '',
    joined: [],
    following: [],
    followers: [],
    likes: [],
    posts: [],
    replies: [],
    description: '',
    userID: '',
    messages: []
  })
};
