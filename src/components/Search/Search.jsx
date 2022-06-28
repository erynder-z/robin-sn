import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './Search.css';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { database } from '../Firebase/Firebase';

function Search({ searchQuery, changeContextBarMode }) {
  const [userResults, setUserResults] = useState([]);
  const [search, setSearch] = useState('');

  const getSearchResults = async (s) => {
    const foundUsers = [];
    const usersRef = collection(database, 'users');
    const q = query(usersRef, where('username', '==', s.toLowerCase()));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      foundUsers.push(doc.data());
    });
    setUserResults(foundUsers);
  };

  useEffect(() => {
    setSearch(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    changeContextBarMode('search');
    getSearchResults(search);
  }, [search]);

  return (
    <div className="search-container">
      <div className="search-header">Search</div>
      <div className="search-content">
        <div className="results">
          {userResults.length <= 0 ? (
            <h2 className="notFound">No users found</h2>
          ) : (
            userResults.map((user) => (
              <li key={user.toString()} className="userResult-item">
                {user.username}
              </li>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Search;

Search.propTypes = {
  searchQuery: PropTypes.string.isRequired,
  changeContextBarMode: PropTypes.func.isRequired
};
