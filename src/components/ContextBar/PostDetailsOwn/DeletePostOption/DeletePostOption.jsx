import React from 'react';
import PropTypes from 'prop-types';
import { BiTrash } from 'react-icons/bi';

function DeletePostOption({ handleDeletePost }) {
  return (
    <div className="deletePost">
      {' '}
      <div
        className="post-delete"
        size="2rem"
        role="button"
        tabIndex={0}
        onClick={() => {
          handleDeletePost();
        }}
        onKeyDown={() => {
          handleDeletePost();
        }}>
        <BiTrash size="2rem" className="post-delete-icon" />
        Remove Post
      </div>
    </div>
  );
}

export default DeletePostOption;

DeletePostOption.propTypes = {
  handleDeletePost: PropTypes.func.isRequired
};
