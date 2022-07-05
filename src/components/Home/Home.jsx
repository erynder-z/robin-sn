import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { BiMeh } from 'react-icons/bi';
import './Home.css';
import { doc, getDoc } from 'firebase/firestore';
import { database } from '../Firebase/Firebase';
import PostItem from '../PostItem/PostItem';
import { GetUserContext } from '../../contexts/UserContext';

function Home({ changeActiveTab, handleSetIsReplyModalActive }) {
  const { userData } = GetUserContext();
  const [followedUsersPosts, setFollowingPosts] = useState([]);

  // make a list with the ID of all users we are following
  const getUserIdList = async () => {
    const userIDList = [];
    userData.following.map((item) => userIDList.push({ userID: item.userID }));
    return userIDList;
  };

  // look up that user and get the IDs of all its posts
  const getUserPosts = async (ownerID) => {
    const docRef = doc(database, 'users', ownerID);
    const docSnap = await getDoc(docRef);
    return docSnap.data().posts;
  };

  // create a array with all postIDs sorted by creation date
  const sortPosts = (list) => {
    const unsorted = [];
    list.map((u) =>
      u.postIDs.map((a) =>
        a.map((i) =>
          unsorted.push({ postID: i.postID, created: i.created, userID: userData.userID })
        )
      )
    );
    const sorted = unsorted.sort((a, b) => (a.created.seconds < b.created.seconds ? 1 : -1));

    return sorted;
  };

  // merge userIDs & posts and save them in state
  const getPostsList = async () => {
    const list = [];
    const idList = await getUserIdList();

    await Promise.all(
      idList.map(async (user) => {
        const postList = await getUserPosts(user.userID);

        list.push({ userID: user.userID, postIDs: [postList] });
      })
    );
    setFollowingPosts(sortPosts(list));
  };

  useEffect(() => {
    getPostsList();
  }, [userData]);

  useEffect(() => {
    changeActiveTab('home');
  }, []);

  return (
    <div className="home-container fadein">
      <div className="home-header">Home</div>
      <div className="home-content">
        <div className="posts">
          {followedUsersPosts && followedUsersPosts.length <= 0 && (
            <div className="empty">
              <BiMeh size="3rem" />
              <h4> empty...</h4>
              <h5> your own posts and posts of users you follow will show up here</h5>
            </div>
          )}
          {followedUsersPosts.map((p) => (
            <PostItem
              key={p.postID}
              postID={p.postID}
              userID={userData.userID}
              userPic={userData.userPic}
              handleSetIsReplyModalActive={handleSetIsReplyModalActive}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;

Home.propTypes = {
  changeActiveTab: PropTypes.func.isRequired,
  handleSetIsReplyModalActive: PropTypes.func.isRequired
};
