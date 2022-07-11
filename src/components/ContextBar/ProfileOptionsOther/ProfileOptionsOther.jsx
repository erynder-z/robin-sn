import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { BiMessageRoundedEdit } from 'react-icons/bi';
import './ProfileOptionsOther.css';
import MessageModal from '../../MessageModal/MessageModal';

function ProfileOptionsOther({ showWarning, showNewPostEffect, userInView }) {
  const [showMessageModal, setShowMessageModal] = useState(false);

  return (
    <div className="profileOptionsOther-container">
      <div className="profileOptionsOther-header">Profile options</div>
      <div
        className="sendDm"
        role="button"
        tabIndex={0}
        onClick={() => {
          setShowMessageModal(true);
        }}
        onKeyDown={() => {
          setShowMessageModal(true);
        }}>
        <BiMessageRoundedEdit className="sendDm-icon" size="2rem" />
        send DM
      </div>
      {showMessageModal && (
        <MessageModal
          userInView={userInView}
          showWarning={showWarning}
          setShowMessageModal={setShowMessageModal}
          showNewPostEffect={showNewPostEffect}
        />
      )}
    </div>
  );
}

export default ProfileOptionsOther;

ProfileOptionsOther.propTypes = {
  showWarning: PropTypes.func.isRequired,
  showNewPostEffect: PropTypes.func.isRequired,
  userInView: PropTypes.shape({
    userPic: PropTypes.string,
    username: PropTypes.string,
    userBackground: PropTypes.string,
    joined: PropTypes.objectOf(PropTypes.number),
    following: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)),
    followers: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)),
    likes: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)),
    posts: PropTypes.arrayOf(
      PropTypes.shape({
        created: PropTypes.objectOf(PropTypes.number),
        postID: PropTypes.string
      })
    ),
    replies: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)),
    description: PropTypes.string,
    userID: PropTypes.string,
    messages: PropTypes.arrayOf(
      PropTypes.shape({
        messageID: PropTypes.string,
        messageContent: PropTypes.string,
        sender: PropTypes.string,
        isRead: PropTypes.bool,
        sendDate: PropTypes.objectOf(PropTypes.number)
      })
    )
  })
};

ProfileOptionsOther.defaultProps = {
  userInView: PropTypes.shape({
    userPic: '',
    username: '',
    userBackground: '',
    joined: [],
    following: [],
    followers: [],
    likes: [],
    posts: [],
    replies: [],
    description: '',
    userID: '',
    messages: []
  })
};
