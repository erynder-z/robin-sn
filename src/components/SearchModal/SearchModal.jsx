import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { BiSend } from 'react-icons/bi';
import './SearchModal.css';
import { useNavigate } from 'react-router-dom';

function SearchModal({ handleSearchQuery, toggleSearchModal }) {
  const navigate = useNavigate();
  const [text, setText] = useState('');

  const search = () => {
    handleSearchQuery(text);
    navigate('/main/search');
  };

  return (
    <div
      className="searchModal-overlay"
      role="button"
      tabIndex={0}
      onClick={() => {
        toggleSearchModal();
      }}
      onKeyDown={() => {
        toggleSearchModal();
      }}>
      <div
        role="textbox"
        tabIndex={0}
        className="searchModal-body"
        onClick={(e) => {
          e.stopPropagation();
        }}
        onKeyDown={(e) => {
          e.stopPropagation();
        }}>
        <div className="searchModal-upper">
          <div className="search-header">Search users</div>
          <div
            className="close"
            role="button"
            tabIndex={0}
            onClick={() => {
              toggleSearchModal();
            }}
            onKeyDown={() => {
              toggleSearchModal();
            }}>
            &times;
          </div>
        </div>
        <div className="input-wrapper">
          <input
            type="query"
            placeholder="username"
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              e.preventDefault();
            }}
          />
          <button
            type="button"
            onClick={() => {
              toggleSearchModal();
              search();
            }}
            onKeyDown={() => {
              toggleSearchModal();
              search();
            }}>
            {' '}
            <BiSend />
          </button>
        </div>
      </div>
    </div>
  );
}

export default SearchModal;

SearchModal.propTypes = {
  handleSearchQuery: PropTypes.func.isRequired,
  toggleSearchModal: PropTypes.func.isRequired
};
