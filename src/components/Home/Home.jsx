import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { BiSpaceBar } from 'react-icons/bi';
import { doc, getDoc } from 'firebase/firestore';
import { database } from '../Firebase/Firebase';
import { GetUserContext } from '../../contexts/UserContext';
import limitNumberOfPosts from '../../helpers/LimitNumberOfPosts/limitNumberOfPosts';
import PostItem from '../PostItem/PostItem';

function Home({ changeActiveTab, handleSetIsReplyModalActive, showWarning }) {
  const { userData } = GetUserContext();
  const [followedUsersPosts, setFollowingPosts] = useState([]);

  useEffect(() => {
    changeActiveTab('home');
  }, []);

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

    // return only the 25 most recent posts
    return limitNumberOfPosts(docSnap.data().posts);
    /*   return docSnap.data().posts; */
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
    try {
      await Promise.all(
        idList.map(async (user) => {
          const postList = await getUserPosts(user.userID);

          list.push({ userID: user.userID, postIDs: [postList] });
        })
      );
      setFollowingPosts(sortPosts(list));
    } catch (err) {
      showWarning(err);
    }
  };

  useEffect(() => {
    getPostsList();
  }, [userData]);

  return (
    <div className="home-container fadein">
      <div className="home-header">Home</div>
      <div className="home-content">
        <div className="posts">
          {followedUsersPosts?.length <= 0 && (
            <div className="empty">
              <BiSpaceBar size="3rem" />
              <h4> empty...</h4>
              <h5> your own recent posts and recent posts of users you follow will show up here</h5>
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
  handleSetIsReplyModalActive: PropTypes.func.isRequired,
  showWarning: PropTypes.func.isRequired
};
