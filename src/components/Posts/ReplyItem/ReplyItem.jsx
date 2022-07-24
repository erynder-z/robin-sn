import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { doc, getDoc } from 'firebase/firestore';
import { database } from '../../../data/firebase';
import parseReplyText from '../../../helpers/ParseReplyText/ParseReplyText';
import placeholder from '../../../assets/placeholder.png';
import convertDate from '../../../helpers/ConvertDate/ConvertDate';
import './ReplyItem.css';

function ReplyItem({ reply }) {
  const [replyUser, setReplyUser] = useState();
  const [errorMessage, setErrorMessage] = useState(null);

  // get the details of the replying user
  const getReplyUserData = async () => {
    const { replyUserID } = reply;
    try {
      const docRef = doc(database, 'users', replyUserID);
      const docSnap = await getDoc(docRef);
      if (!docSnap.data()) {
        setReplyUser({
          username: 'deleted user',
          userpic: placeholder,
          replyDate: reply.replyDate.seconds
        });
      }
      setReplyUser({
        username: docSnap.data().username,
        userpic: docSnap.data().userPic,
        replyDate: reply.replyDate.seconds
      });
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  useEffect(() => {
    if (errorMessage) {
      setTimeout(() => setErrorMessage(null), 2000);
    }
  }, [errorMessage]);

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
            <div className="reply-author">@{replyUser.username} </div>
            <div className="reply-userDetails-separator">∙</div>
            <div className="reply-date"> {convertDate(replyUser.replyDate)}</div>
          </div>
          <div className="post-content">{parseReplyText(reply.replyContent)}</div>
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
