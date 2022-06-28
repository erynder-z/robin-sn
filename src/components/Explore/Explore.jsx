import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import './Explore.css';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { collection, limit, orderBy, query } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { database } from '../Firebase/Firebase';

function Explore({ handleSearchQuery, changeContextBarMode }) {
  const navigate = useNavigate();
  const hashtagRef = collection(database, 'hashtags');
  const q = query(hashtagRef, orderBy('count', 'desc'), limit(25));
  const [trends] = useCollectionData(q);

  const handleClick = (hashtag) => {
    handleSearchQuery(hashtag);
    navigate('/main/trends');
  };

  useEffect(() => {
    changeContextBarMode('explore');
  }, []);

  return (
    <div className="explore-container">
      <div className="explore-header">Trending hashtags</div>
      <div className="explore-content">
        {trends &&
          trends.map((trend) => (
            <div
              key={trend.hashtag.toString()}
              className="trend-item"
              role="link"
              tabIndex={0}
              onClick={() => {
                handleClick(trend.hashtag);
              }}
              onKeyDown={() => {
                handleClick(trend.hashtag);
              }}>
              #{trend.hashtag}
            </div>
          ))}
      </div>
    </div>
  );
}

export default Explore;

Explore.propTypes = {
  handleSearchQuery: PropTypes.func.isRequired,
  changeContextBarMode: PropTypes.func.isRequired
};
