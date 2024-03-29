import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { BiArrowBack } from 'react-icons/bi';
import { collection, getDocs, limit, orderBy, query, where } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { database } from '../../data/firebase';
import { GetUserContext } from '../../contexts/UserContext';
import PostItem from '../Posts/PostItem/PostItem';
import SearchResultUser from './SearchResultUser/SearchResultUser';
import FetchingIcon from '../Main/FetchingIcon/FetchingIcon';
import './Search.css';

function Search({ searchQuery, changeActiveTab, handleSetModalActive, showWarning }) {
  const { userData } = GetUserContext();
  const navigate = useNavigate();
  const [userResults, setUserResults] = useState([]);
  const [postResults, setPostResults] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const getSearchResults = async (string) => {
    try {
      // check if query/string machtes any username in the database
      const getUserResults = async (s) => {
        const foundUsers = [];
        const usersRef = collection(database, 'users');
        const q = query(
          usersRef,
          where('username', '==', s.toLowerCase()),
          where('active', '==', true),
          limit(25)
        );

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          foundUsers.push({
            username: doc.data().username,
            userID: doc.data().userID,
            userPic: doc.data().userPic
          });
        });
        setUserResults(foundUsers);
        setLoading(false);
      };

      // check if any post's hashtag-array contains search quers/string
      const getPostResults = async (s) => {
        const foundPosts = [];
        const postsRef = collection(database, 'posts');
        const q = query(
          postsRef,
          where('hashtags', 'array-contains', s.toLowerCase()),
          orderBy('created', 'desc'),
          limit(25)
        );

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          foundPosts.push(doc.data());
        });
        setPostResults(foundPosts);
        setLoading(false);
      };

      getUserResults(string);
      getPostResults(string);
    } catch (err) {
      showWarning(err.message);
    }
  };

  // set search query in main component, so it can be accessed by other components
  useEffect(() => {
    setLoading(true);
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
        <span title={`Searching ${searchQuery}`}>Searching {searchQuery}</span>
      </div>
      {loading ? (
        <FetchingIcon />
      ) : (
        <div className="search-content">
          <div className="results">
            <div className="user-results">
              {userResults.length <= 0 ? (
                <h3 className="notFound">No users found...</h3>
              ) : (
                <div className="found-container">
                  <h3 className="found">Found users:</h3>
                  {userResults.map((user) => (
                    <SearchResultUser key={user.username.toString()} user={user} />
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
                    <PostItem
                      key={p.postID}
                      postID={p.postID}
                      userID={userData.userID}
                      userPic={userData.userPic}
                      handleSetModalActive={handleSetModalActive}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Search;

Search.propTypes = {
  searchQuery: PropTypes.string.isRequired,
  changeActiveTab: PropTypes.func.isRequired,
  handleSetModalActive: PropTypes.func.isRequired,
  showWarning: PropTypes.func.isRequired
};
