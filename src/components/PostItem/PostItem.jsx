import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './PostItem.css';
import { BiMessageRounded, BiRepost, BiLike } from 'react-icons/bi';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { arrayUnion, doc, getDoc, updateDoc } from 'firebase/firestore';
import { format, fromUnixTime } from 'date-fns';
import { database } from '../Firebase/Firebase';

function PostItem({ postID, userID }) {
  const [post] = useDocumentData(doc(database, 'posts', postID));
  const [ownerID, setOwnerID] = useState('');
  const [postOwner, setPostOwner] = useState('');
  const [postDate, setPostDate] = useState('');

  const getOwnerID = () => {
    if (post) {
      setOwnerID(post.ownerID);
    }
  };

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
    setPostOwner(docSnap.data().username);
  };

  const like = async () => {
    const docRef = doc(database, 'posts', postID);

    await updateDoc(docRef, {
      likes: arrayUnion({ userID })
    });
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
      <div className="post-container">
        <div className="post-header">
          <div className="post-author">@{postOwner} - </div>
          <div className="post-date">{postDate}</div>
        </div>
        <div className="post-content">{post.content}</div>
        <div className="post-options">
          <div className="optionItem">
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
            onClick={() => {
              like();
            }}
            onKeyDown={() => {
              like();
            }}>
            <BiLike size="1.5rem" />
            {post.likes.length}
          </div>
        </div>
      </div>
    )
  );
}

export default PostItem;

PostItem.propTypes = {
  postID: PropTypes.string.isRequired,
  userID: PropTypes.string.isRequired
};
