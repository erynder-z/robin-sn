import React from 'react';
import PropTypes from 'prop-types';
import { BiMessageRoundedEdit } from 'react-icons/bi';

function SendDmOption({ toggleMessageModal, handleSetModalActive }) {
  return (
    <div
      className="sendDm"
      role="button"
      tabIndex={0}
      onClick={() => {
        toggleMessageModal();
        handleSetModalActive(true);
      }}
      onKeyDown={() => {
        toggleMessageModal();
        handleSetModalActive(true);
      }}>
      <BiMessageRoundedEdit className="sendDm-icon" size="2rem" />
      send DM
    </div>
  );
}

export default SendDmOption;

SendDmOption.propTypes = {
  toggleMessageModal: PropTypes.func.isRequired,
  handleSetModalActive: PropTypes.func.isRequired
};
