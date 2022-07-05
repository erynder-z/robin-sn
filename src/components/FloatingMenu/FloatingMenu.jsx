import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './FloatingMenu.css';
import { BiPlus, BiPencil, BiSearch } from 'react-icons/bi';
import { TbLayoutSidebarRightExpand, TbLayoutSidebarRightCollapse } from 'react-icons/tb';
import { Fab, Action } from 'react-tiny-fab';
import 'react-tiny-fab/dist/styles.css';

function FloatingMenu({ toggleNewPostModal, toggleSearchModal, toggleContextbar, showContextbar }) {
  const [toggleContextbarBtnStyle, setToggleContextbarBtnStyle] = useState();
  const [fabStyle, setFabStyle] = useState();

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

  const toggleContextbarBtn = toggleContextbarBtnStyle;

  // set breakpoint for mobile devices since we cannot use inline media queries
  useEffect(() => {
    if (window.innerWidth < 768) {
      setToggleContextbarBtnStyle({
        color: 'var(--text-bright)',
        backgroundColor: 'var(--button)',
        padding: '10px',
        fontWeight: 'bold'
      });
      setFabStyle({
        bottom: 40,
        right: 1
      });
    } else {
      setToggleContextbarBtnStyle({
        display: 'none'
      });
      setFabStyle({
        bottom: 1,
        right: 1
      });
    }
  }, []);

  return (
    <div className="floating-menu-container">
      <Fab style={fabStyle} mainButtonStyles={mainButtonStyles} icon={<BiPlus size="2rem" />}>
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
        <Action
          style={toggleContextbarBtn}
          text="Toggle contextbar"
          onClick={(e) => {
            toggleContextbar();
            e.stopPropagation();
          }}
          onKeyDown={(e) => {
            toggleContextbar();
            e.stopPropagation();
          }}>
          {' '}
          {showContextbar ? (
            <TbLayoutSidebarRightCollapse size="2rem" />
          ) : (
            <TbLayoutSidebarRightExpand size="2rem" />
          )}
        </Action>
      </Fab>
    </div>
  );
}

export default FloatingMenu;

FloatingMenu.propTypes = {
  toggleNewPostModal: PropTypes.func.isRequired,
  toggleSearchModal: PropTypes.func.isRequired,
  toggleContextbar: PropTypes.func.isRequired,
  showContextbar: PropTypes.bool.isRequired
};
