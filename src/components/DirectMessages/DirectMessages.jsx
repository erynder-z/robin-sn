import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './DirectMessages.css';
import { GetUserContext } from '../../contexts/UserContext';
import DirectMessageItem from '../DirectMessageItem/DirectMessageItem';

function DirectMessages({ changeActiveTab, showWarning }) {
  const { userData } = GetUserContext();
  const [userMessages, setUserMessages] = useState([...userData.messages]);

  useEffect(() => {
    changeActiveTab('directmessages');
  }, []);

  return (
    <div className="directMessages-container fadein">
      <div className="directMessages-header">Direct messages</div>
      <div className="directMessages-content">
        {userMessages?.map((message) => (
          <DirectMessageItem key={message.messageID} message={message} showWarning={showWarning} />
        ))}
      </div>
    </div>
  );
}

export default DirectMessages;

DirectMessages.propTypes = {
  changeActiveTab: PropTypes.func.isRequired,
  showWarning: PropTypes.func.isRequired
};
