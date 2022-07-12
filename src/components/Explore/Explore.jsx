import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { BiSpaceBar } from 'react-icons/bi';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { collection, limit, orderBy, query } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { database } from '../../data/firebase';
import './Explore.css';

function Explore({ handleSearchQuery, changeActiveTab }) {
  const navigate = useNavigate();
  const hashtagRef = collection(database, 'hashtags');
  const q = query(hashtagRef, orderBy('count', 'desc'), limit(25));
  const [trends] = useCollectionData(q);

  // pass hashtag-string to parent in order to run a search query
  const handleClick = (hashtag) => {
    handleSearchQuery(hashtag);
    navigate('/main/trends');
  };

  useEffect(() => {
    changeActiveTab('explore');
  }, []);

  return (
    <div className="explore-container fadein">
      <div className="explore-header">Trending hashtags</div>
      <div className="explore-content">
        <div className="trends">
          {trends?.length <= 0 && (
            <div className="empty">
              <BiSpaceBar size="3rem" />
              <h4> empty...</h4>
              <h5> trends will show up here</h5>
            </div>
          )}
          <div className="topTrends-container">
            {trends?.map((trend) =>
              trends.indexOf(trend) < 10 ? (
                <div
                  key={trend.hashtag.toString()}
                  className={`trend-item trend${trends.indexOf(trend)}`}
                  role="link"
                  tabIndex={0}
                  onClick={() => {
                    handleClick(trend.hashtag);
                  }}
                  onKeyDown={() => {
                    handleClick(trend.hashtag);
                  }}>
                  {trends.indexOf(trend) < 10 && <span>{trends.indexOf(trend) + 1} </span>}#
                  {trend.hashtag}
                </div>
              ) : null
            )}
          </div>
          {trends?.length > 10 && <div className="other-trends"> Other trends:</div>}
          <div className="otherTrends-container">
            {trends?.map((trend) =>
              trends.indexOf(trend) > 10 ? (
                <div
                  key={trend.hashtag.toString()}
                  className={`trend-item trend${trends.indexOf(trend)}`}
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
              ) : null
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Explore;

Explore.propTypes = {
  handleSearchQuery: PropTypes.func.isRequired,
  changeActiveTab: PropTypes.func.isRequired
};
