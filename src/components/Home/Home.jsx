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
    const sorted = unsorted.sort((a, b) => (a.created.seconds > b.created.seconds ? 1 : -1));

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
  }, [following]);

  return (
    <div className="home-container">
      <div className="home-header">Home</div>
      <div className="home-content">
        <div className="posts">
          {followedUsersPosts.map((p) => (
            <PostItem key={p.postID} postID={p.postID} userID={userData.userID} />
          ))}
        </div>
      </div>
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
    posts: PropTypes.arrayOf(
      PropTypes.shape({
        created: PropTypes.objectOf(PropTypes.number),
        postID: PropTypes.string
      })
    ).isRequired,
    replies: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)).isRequired,
    reposts: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)).isRequired,
    likes: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)).isRequired,
    bookmarks: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)).isRequired
  }).isRequired
};
