import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import './Explore.css';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { collection, limit, orderBy, query } from 'firebase/firestore';
import { database } from '../Firebase/Firebase';

function Explore({ changeContextBarMode }) {
  const hashtagRef = collection(database, 'hashtags');
  const q = query(hashtagRef, orderBy('count', 'desc'), limit(25));
  const [trends] = useCollectionData(q);

  useEffect(() => {
    changeContextBarMode('explore');
  }, []);

  return (
    <div className="explore-container">
      <div className="explore-header">Trending hashtags</div>
      <div className="explore-content">
        {trends &&
          trends.map((trend) => (
            <h2 key={trend.hashtag.toString()} className="trend-item">
              #{trend.hashtag}
            </h2>
          ))}
      </div>
    </div>
  );
}

export default Explore;

Explore.propTypes = {
  changeContextBarMode: PropTypes.func.isRequired
};
