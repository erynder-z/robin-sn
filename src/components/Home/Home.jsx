import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './Home.css';
import { doc, getDoc } from 'firebase/firestore';
import { database } from '../Firebase/Firebase';
import PostItem from '../PostItem/PostItem';

function Home({ userData }) {
  const { following } = userData;
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

  // merge userIDs & posts and save them in state
  const getPostsList = async () => {
    setFollowingPosts([]);
    const list = [];
    const idList = await getUserIdList();
    idList.map(async (user) => {
      const postList = await getUserPosts(user.userID);
      list.push({ userID: user.userID, postIDs: [postList] });
      setFollowingPosts(list);
    });
  };

  useEffect(() => {
    getPostsList();
  }, [following]);

  return (
    <div className="home-container">
      {followedUsersPosts.map((userObject) =>
        userObject.postIDs.map((idArray) =>
          idArray.map((id) => (
            <PostItem key={id.postID} postID={id.postID} userID={userData.userID} />
          ))
        )
      )}
    </div>
  );
}

export default Home;

Home.propTypes = {
  userData: PropTypes.shape({
    userID: PropTypes.string.isRequired,
    isSetup: PropTypes.bool.isRequired,
    username: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    userPic: PropTypes.string.isRequired,
    useremail: PropTypes.string.isRequired,
    joined: PropTypes.objectOf(PropTypes.number).isRequired,
    followers: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)).isRequired,
    following: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)).isRequired,
    posts: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)).isRequired,
    replies: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)).isRequired,
    bookmarks: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)).isRequired
  }).isRequired
};
