import React from 'react';
import PropTypes from 'prop-types';
import { BsBookmarkPlus } from 'react-icons/bs';
import './DirectMessageOptions.css';

function DirectMessageOptions({ showWarning }) {
  console.log(showWarning);
  return (
    <div className="directMessages fadein">
      <div className="directMessages-context-header">Options</div>
      <div className="something">
        <div
          className="something-something"
          role="button"
          tabIndex={0}
          onClick={() => {
            //
          }}
          onKeyDown={() => {
            //
          }}>
          <BsBookmarkPlus size="2rem" className="something-something-icon" />
          Something
        </div>
      </div>
    </div>
  );
}

export default DirectMessageOptions;

DirectMessageOptions.propTypes = {
  showWarning: PropTypes.func.isRequired
};
