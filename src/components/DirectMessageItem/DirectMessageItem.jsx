import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { format, fromUnixTime } from 'date-fns';
import { BiEnvelope, BiEnvelopeOpen, BiReply } from 'react-icons/bi';
import './DirectMessageItem.css';

function DirectMessageItem({ message, handleMarkMessageAsRead }) {
  const [expandMessage, setExpandMessage] = useState(false);

  const showMessageDetails = () => {
    setExpandMessage(!expandMessage);
    if (!message.isRead) {
      handleMarkMessageAsRead(message);
    }
  };

  return (
    <div
      className="messageListItem"
      role="link"
      tabIndex={0}
      onClick={() => {
        showMessageDetails();
      }}
      onKeyDown={() => {
        showMessageDetails();
      }}>
      <div className={`messageListItem-upper ${expandMessage ? 'selected' : null}`}>
        {message.isRead ? <BiEnvelopeOpen size="1.5rem" /> : <BiEnvelope size="1.5rem" />}
        <h5>from: {message.senderUsername}</h5>
        <h5 className="messageListItem-date">
          recieved: {format(fromUnixTime(message.sendDate.seconds), 'dd. MMM uuu, HH:mm')}
        </h5>
      </div>
      <div className={`messageListItem-lower ${expandMessage ? 'expand' : null}`}>
        <p className="messageListItem-content">
          {message.messageContent}

          <BiReply size="2rem" className="messageListItem-reply" />
        </p>
      </div>
    </div>
  );
}

export default DirectMessageItem;

DirectMessageItem.propTypes = {
  message: PropTypes.shape({
    messageID: PropTypes.string.isRequired,
    messageContent: PropTypes.string.isRequired,
    senderID: PropTypes.string.isRequired,
    isRead: PropTypes.bool.isRequired,
    sendDate: PropTypes.objectOf(PropTypes.number).isRequired,
    senderUsername: PropTypes.string.isRequired
  }).isRequired,
  handleMarkMessageAsRead: PropTypes.func.isRequired
};
