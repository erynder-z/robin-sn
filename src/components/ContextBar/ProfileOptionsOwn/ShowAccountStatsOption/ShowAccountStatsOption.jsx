import React from 'react';
import PropTypes from 'prop-types';
import { BiBarChart } from 'react-icons/bi';

function ShowAccountStatsOption({ setShowStatsModal }) {
  return (
    <div
      className="accountStats"
      role="button"
      tabIndex={0}
      onClick={() => {
        setShowStatsModal(true);
      }}
      onKeyDown={() => {
        setShowStatsModal(true);
      }}>
      <BiBarChart className="accountStats-icon" size="2rem" />
      show account stats
    </div>
  );
}

export default ShowAccountStatsOption;

ShowAccountStatsOption.propTypes = {
  setShowStatsModal: PropTypes.func.isRequired
};
