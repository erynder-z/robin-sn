import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { BiArrowBack } from 'react-icons/bi';
import './Search.css';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { database } from '../Firebase/Firebase';
import PostItem from '../PostItem/PostItem';

function Search({ userData, searchQuery, changeActiveTab }) {
  const navigate = useNavigate();
  const [userResults, setUserResults] = useState([]);
  const [postResults, setPostResults] = useState([]);
  const [search, setSearch] = useState('');

  const getSearchResults = async (string) => {
    const getUserResults = async (s) => {
      const foundUsers = [];
      const usersRef = collection(database, 'users');
      const q = query(usersRef, where('username', '==', s.toLowerCase()));

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        foundUsers.push({
          username: doc.data().username,
          userID: doc.data().userID,
          userPic: doc.data().userPic
        });
      });
      setUserResults(foundUsers);
    };

    const getPostResults = async (s) => {
      const foundPosts = [];
      const postsRef = collection(database, 'posts');
      const q = query(postsRef, where('hashtags', 'array-contains', s.toLowerCase()));

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        foundPosts.push(doc.data());
      });
      setPostResults(foundPosts);
    };

    getUserResults(string);
    getPostResults(string);
  };

  useEffect(() => {
    setSearch(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    changeActiveTab('search');
    getSearchResults(search);
  }, [search]);

  return (
    <div className="search-container fadein">
      <div className="search-header">
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
        <span>Search</span>
      </div>
      <div className="search-content">
        <div className="results">
          <div className="user-results">
            {userResults.length <= 0 ? (
              <h3 className="notFound">No users found...</h3>
            ) : (
              <div className="found-container">
                <h3 className="found">Found users:</h3>
                {userResults.map((user) => (
                  <div
                    key={user.toString()}
                    className="userResult-item"
                    role="link"
                    tabIndex={0}
                    onClick={() => {
                      navigate(`/main/userprofile/${user.userID}`, {
                        state: { usr: user.userID }
                      });
                    }}
                    onKeyDown={() => {
                      navigate(`/main/userprofile/${user.userID}`, {
                        state: { usr: user.userID }
                      });
                    }}>
                    <img className="profile-usrpic" src={user.userPic} alt="user avatar" />@
                    {user.username}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="post-results">
            {postResults.length <= 0 ? (
              <h3 className="notFound">No posts found...</h3>
            ) : (
              <div className="found-container">
                <h3 className="found">Found posts:</h3>
                {postResults.map((p) => (
                  <PostItem key={p.postID} postID={p.postID} userID={userData.userID} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Search;

Search.propTypes = {
  userData: PropTypes.shape({
    userID: PropTypes.string.isRequired,
    isSetup: PropTypes.bool.isRequired,
    username: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    userPic: PropTypes.string.isRequired,
    useremail: PropTypes.string.isRequired,
    joined: PropTypes.objectOf(PropTypes.number),
    followers: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)).isRequired,
    following: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)).isRequired,
    posts: PropTypes.arrayOf(
      PropTypes.shape({
        created: PropTypes.objectOf(PropTypes.number),
        postID: PropTypes.string
      })
    ).isRequired,
    replies: PropTypes.arrayOf(
      PropTypes.shape({
        created: PropTypes.objectOf(PropTypes.number),
        postID: PropTypes.string
      })
    ).isRequired,
    reposts: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)).isRequired,
    likes: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)).isRequired,
    bookmarks: PropTypes.arrayOf(
      PropTypes.shape({
        created: PropTypes.objectOf(PropTypes.number),
        postID: PropTypes.string
      })
    ).isRequired
  }).isRequired,
  searchQuery: PropTypes.string.isRequired,
  changeActiveTab: PropTypes.func.isRequired
};
