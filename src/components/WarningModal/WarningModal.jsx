import React from 'react';
import PropTypes from 'prop-types';
import { BiMessageX } from 'react-icons/bi';
import './WarningModal.css';

function WarningModal({ errorMessage }) {
  return (
    <div className="emptyMessageWarning-overlay">
      <BiMessageX className="emptyMessageWarning-icon" size="5rem" />
      {errorMessage}
    </div>
  );
}

export default WarningModal;

WarningModal.propTypes = {
  errorMessage: PropTypes.string.isRequired
};
