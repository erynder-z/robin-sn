import React from 'react';
import PropTypes from 'prop-types';
import './FloatingMenu.css';
import { BiPlus, BiPencil, BiSearch } from 'react-icons/bi';
import { Fab, Action } from 'react-tiny-fab';
import 'react-tiny-fab/dist/styles.css';

function FloatingMenu({ toggleNewPostModal, toggleSearchModal }) {
  const mainButtonStyles = {
    color: 'var(--text-bright)',
    backgroundColor: 'var(--button)',
    padding: '10px',
    fontWeight: 'bold'
  };

  const newPostActionBtn = {
    color: 'var(--text-bright)',
    backgroundColor: 'var(--button)',
    padding: '10px',
    fontWeight: 'bold'
  };

  const searchActionBtn = {
    color: 'var(--text-bright)',
    backgroundColor: 'var(--button)',
    padding: '10px',
    fontWeight: 'bold'
  };

  return (
    <div className="floating-menu-container">
      <Fab mainButtonStyles={mainButtonStyles} icon={<BiPlus size="2rem" />}>
        <Action
          style={newPostActionBtn}
          text="New post"
          onClick={(e) => {
            toggleNewPostModal();
            e.stopPropagation();
          }}
          onKeyDown={(e) => {
            toggleNewPostModal();
            e.stopPropagation();
          }}>
          {' '}
          <BiPencil size="2rem" />
        </Action>
        <Action
          style={searchActionBtn}
          text="Search"
          onClick={(e) => {
            toggleSearchModal();
            e.stopPropagation();
          }}
          onKeyDown={(e) => {
            toggleSearchModal();
            e.stopPropagation();
          }}>
          {' '}
          <BiSearch size="2rem" />
        </Action>
      </Fab>
    </div>
  );
}

export default FloatingMenu;

FloatingMenu.propTypes = {
  toggleNewPostModal: PropTypes.func.isRequired,
  toggleSearchModal: PropTypes.func.isRequired
};
