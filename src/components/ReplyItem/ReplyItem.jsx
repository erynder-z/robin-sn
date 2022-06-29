import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './ReplyItem.css';
import { format, fromUnixTime } from 'date-fns';
import { doc, getDoc } from 'firebase/firestore';
import { database } from '../Firebase/Firebase';
import parseURL from '../../helpers/URLify/URLify';

function ReplyItem({ reply }) {
  const [replyUser, setReplyUser] = useState();

  // get the details of the replying user
  const getReplyUserData = async () => {
    const { replyUserID } = reply;

    const docRef = doc(database, 'users', replyUserID);
    const docSnap = await getDoc(docRef);
    setReplyUser({
      username: docSnap.data().username,
      userpic: docSnap.data().userPic,
      replyDate: format(fromUnixTime(reply.replyDate.seconds), 'PPP')
    });
  };

  useEffect(() => {
    getReplyUserData();
  }, []);

  return (
    replyUser && (
      <div className="reply-body fadein">
        <div className="reply-left-wrapper">
          {' '}
          <img className="reply-usrpic" src={replyUser.userpic} alt="user avatar" />
        </div>
        <div className="reply-right-wrapper">
          <div className="reply-header">
            <div className="reply-author">@{replyUser.username} - </div>
            <div className="reply-date">{replyUser.replyDate}</div>
          </div>
          <div className="post-content">{parseURL(reply.replyContent)}</div>
        </div>
      </div>
    )
  );
}

export default ReplyItem;

ReplyItem.propTypes = {
  reply: PropTypes.shape([
    PropTypes.shape({
      replyContent: PropTypes.string.isRequired,
      replyUserID: PropTypes.string.isRequired,
      replyID: PropTypes.string.isRequired,
      replyDate: PropTypes.shape({
        nanoseconds: PropTypes.number.isRequired,
        seconds: PropTypes.number.isRequired
      })
    })
  ])
}.isRequired;
