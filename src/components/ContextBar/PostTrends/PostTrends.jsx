import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import './PostTrends.css';

function PostTrends({ handleSearchQuery, hashtag }) {
  const navigate = useNavigate();

  const linkToTrend = () => {
    handleSearchQuery(hashtag);
    navigate('/main/trends');
  };

  return (
    <div
      className="postTrend-item"
      role="button"
      tabIndex={0}
      onClick={() => {
        linkToTrend(hashtag);
      }}
      onKeyDown={() => {
        linkToTrend(hashtag);
      }}>
      <span>#{hashtag}</span>
    </div>
  );
}
export default PostTrends;

PostTrends.propTypes = {
  hashtag: PropTypes.string.isRequired,
  handleSearchQuery: PropTypes.func.isRequired
};
