import React from 'react';
import PropTypes from 'prop-types';
import './FloatingMenu.css';
import { BiPencil } from 'react-icons/bi';

function FloatingMenu({ toggleNewPostModal }) {
  return (
    <div
      className="floating-menu"
      role="button"
      tabIndex={0}
      onClick={() => {
        toggleNewPostModal();
      }}
      onKeyDown={() => {
        toggleNewPostModal();
      }}>
      <BiPencil size="2rem" color="whitesmoke" />
    </div>
  );
}

export default FloatingMenu;

FloatingMenu.propTypes = {
  toggleNewPostModal: PropTypes.func.isRequired
};
