import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { BiSearch } from 'react-icons/bi';
import './SearchModal.css';
import { useNavigate } from 'react-router-dom';

function SearchModal({ handleSearchQuery, toggleSearchModal }) {
  const navigate = useNavigate();
  const [text, setText] = useState('');
  const [fadeModal, setFadeModal] = useState(false);

  const search = () => {
    handleSearchQuery(text);
    navigate('/main/search');
  };

  return (
    <div className={`searchModal-overlay ${fadeModal ? 'fadeout' : 'fadein'}`}>
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
        <div className="searchModal-left">
          <div
            className="search-closeBtn"
            role="button"
            tabIndex={0}
            onClick={() => {
              setFadeModal(true);
              setTimeout(() => toggleSearchModal(), 100);
            }}
            onKeyDown={() => {
              setFadeModal(true);
              setTimeout(() => toggleSearchModal(), 100);
            }}>
            &times;
          </div>
        </div>
        <div className="input-wrapper">
          <input
            type="query"
            placeholder="search users or hashtags"
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              e.preventDefault();
            }}
          />
          <button
            type="button"
            onClick={() => {
              setFadeModal(true);
              setTimeout(() => toggleSearchModal(), 100);
              search();
            }}
            onKeyDown={() => {
              setFadeModal(true);
              setTimeout(() => toggleSearchModal(), 100);
              search();
            }}>
            {' '}
            <BiSearch size="1.5rem" />
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
