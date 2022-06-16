import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './PostItem.css';
import { useNavigate } from 'react-router-dom';
import { BiMessageRounded, BiRepost, BiLike } from 'react-icons/bi';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { arrayUnion, doc, getDoc, updateDoc } from 'firebase/firestore';
import { format, fromUnixTime } from 'date-fns';
import { database } from '../Firebase/Firebase';
import Reply from '../Reply/Reply';
import parseText from '../../helpers/ParseText/parseText';

function PostItem({ postID, userID }) {
  const navigate = useNavigate();
  const [post] = useDocumentData(doc(database, 'posts', postID));
  const [ownerID, setOwnerID] = useState('');
  const [postOwner, setPostOwner] = useState('');
  const [postDate, setPostDate] = useState('');
  const [showReplyModal, setShowReplyModal] = useState(false);

  // get the ownerID of the post so it can be used to retrieve the username of the post owner
  const getOwnerID = () => {
    if (post) {
      setOwnerID(post.ownerID);
    }
  };

  // make date human-readable
  const getPostDate = () => {
    if (post) {
      const postDateFormatted = format(fromUnixTime(post.created.seconds), 'PPP');

      setPostDate(postDateFormatted);
    }
  };

  // get username via getDoc rather than useDocumentData-hook to prevent exposing the whole user object to the front end
  const getOwner = async () => {
    const docRef = doc(database, 'users', ownerID);
    const docSnap = await getDoc(docRef);
    setPostOwner({ username: docSnap.data().username, userpic: docSnap.data().userPic });
  };

  const like = async () => {
    const docRef = doc(database, 'posts', postID);

    await updateDoc(docRef, {
      likes: arrayUnion({ userID })
    });
  };

  // navigate to the PostDetails component and passing the postID and userID as state
  const linkToPostDetailsComponent = () => {
    navigate('/main/postDetails', { state: { postID, userID, postOwner } });
  };

  const toggleReplyModal = () => {
    setShowReplyModal(!showReplyModal);
  };

  useEffect(() => {
    if (post) {
      getOwner();
    }
  }, [ownerID]);

  useEffect(() => {
    getOwnerID();
    getPostDate();
  }, [post]);
  return (
    post && (
      <div
        className="post-container"
        role="link"
        tabIndex={0}
        onClick={() => {
          linkToPostDetailsComponent();
        }}
        onKeyDown={() => {
          linkToPostDetailsComponent();
        }}>
        <div className="post-left-wrapper">
          {' '}
          <img className="post-usrpic" src={postOwner.userpic} alt="user avatar" />
        </div>
        <div className="post-right-wrapper">
          <div className="post-userDetails">
            <div className="post-author">@{postOwner.username}</div>
            <div className="post-userDetails-separator">∙</div>
            <div className="post-date">{postDate}</div>
          </div>
          <div className="post-content"> {parseText(post.content)}</div>
          <div className="post-options">
            <div
              className="optionItem"
              role="button"
              tabIndex={0}
              onClick={(e) => {
                toggleReplyModal();
                e.stopPropagation();
              }}
              onKeyDown={(e) => {
                toggleReplyModal();
                e.stopPropagation();
              }}>
              <BiMessageRounded size="1.5rem" />
              {post.replies.length}
            </div>
            <div className="optionItem">
              <BiRepost size="1.5rem" />
              {post.reposts.length}
            </div>
            <div
              className="optionItem"
              role="button"
              tabIndex={0}
              onClick={(e) => {
                like();
                e.stopPropagation();
              }}
              onKeyDown={(e) => {
                like();
                e.stopPropagation();
              }}>
              <BiLike size="1.5rem" />
              {post.likes.length}
            </div>
          </div>
        </div>
        {showReplyModal && (
          <Reply
            postID={postID}
            userID={userID}
            postOwner={postOwner}
            replyMode="modal"
            toggleReplyModal={toggleReplyModal}
          />
        )}
      </div>
    )
  );
}

export default PostItem;

PostItem.propTypes = {
  postID: PropTypes.string.isRequired,
  userID: PropTypes.string.isRequired
};
