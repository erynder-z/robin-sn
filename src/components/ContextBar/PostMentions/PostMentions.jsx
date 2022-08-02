import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { GetUserContext } from '../../../contexts/UserContext';

function PostMentions({ name, id }) {
  const { userData } = GetUserContext();
  const navigate = useNavigate();
  const linkToUserProfile = (e) => {
    e.stopPropagation();
    if (id === userData.userID) {
      navigate('/main/myProfile');
    } else {
      navigate(`/main/userprofile/${id}`, {
        state: { usr: id }
      });
    }
  };

  return (
    <div
      className="mention-user"
      role="button"
      tabIndex={0}
      onClick={(e) => {
        linkToUserProfile(e, id);
      }}
      onKeyDown={(e) => {
        linkToUserProfile(e, id);
      }}>
      @{name}
    </div>
  );
}
export default PostMentions;

PostMentions.propTypes = {
  name: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired
};
