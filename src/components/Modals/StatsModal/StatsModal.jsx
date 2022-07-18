import React from 'react';
import PropTypes from 'prop-types';
import '../Modals.css';
import { GetUserContext } from '../../../contexts/UserContext';

function StatsModal({ setShowStatsModal }) {
  const { userData } = GetUserContext();

  return (
    <div className="statsModal-overlay fadein">
      <div className="statsModal">
        <h4>Total posts: {userData.posts.length}</h4>
        <h4>Total replies: {userData.replies.length}</h4>
        <h4>Total reposts: {userData.reposts.length}</h4>
        <h4>Total likes: {userData.likes.length}</h4>
        <div
          className="stats-closeBtn"
          role="button"
          tabIndex={0}
          onClick={() => {
            setShowStatsModal(false);
          }}
          onKeyDown={() => {
            setShowStatsModal(false);
          }}>
          Close stats
        </div>
      </div>
    </div>
  );
}

export default StatsModal;

StatsModal.propTypes = {
  setShowStatsModal: PropTypes.func.isRequired
};
