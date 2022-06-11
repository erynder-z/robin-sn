import React from 'react';
import PropTypes from 'prop-types';
import './FloatingMenu.css';
import { BiPencil } from 'react-icons/bi';

function FloatingMenu({ toggleModal }) {
  return (
    <div
      className="floating-menu"
      role="button"
      tabIndex={0}
      onClick={() => {
        toggleModal();
      }}
      onKeyDown={() => {
        toggleModal();
      }}>
      <BiPencil size="2rem" color="whitesmoke" />
    </div>
  );
}

export default FloatingMenu;

FloatingMenu.propTypes = {
  toggleModal: PropTypes.func.isRequired
};
