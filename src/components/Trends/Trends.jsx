import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { BiArrowBack } from 'react-icons/bi';
import './Trends.css';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { database } from '../Firebase/Firebase';
import PostItem from '../PostItem/PostItem';

function Trends({ userData, searchQuery, changeActiveTab }) {
  const navigate = useNavigate();
  const [postResults, setPostResults] = useState([]);
  const [search, setSearch] = useState('');

  const getSearchResults = async (string) => {
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

    getPostResults(string);
  };

  useEffect(() => {
    setSearch(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    changeActiveTab('trends');
    getSearchResults(search);
  }, [search]);

  return (
    <div className="trends-container fadein">
      <div className="trends-header">
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
        <span>#{search}</span>
      </div>
      <div className="trends-content">
        <div className="results">
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
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Trends;

Trends.propTypes = {
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
