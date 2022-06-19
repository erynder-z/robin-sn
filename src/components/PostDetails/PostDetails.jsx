import { BiArrowBack } from 'react-icons/bi';
import { doc, getDoc } from 'firebase/firestore';
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { database } from '../Firebase/Firebase';
import PostItem from '../PostItem/PostItem';
import Reply from '../Reply/Reply';
import ReplyItem from '../ReplyItem/ReplyItem';
import './PostDetails.css';

function PostDetails() {
  const navigate = useNavigate();
  // get state from PostItem component // state: { postID, userID, postOwner }
  const location = useLocation();
  /*   console.log(location.state); */
  const [replies, setReplies] = useState([]);

  // get all replies of a post
  const getReplies = async (postID) => {
    const docRef = doc(database, 'posts', postID);
    const docSnap = await getDoc(docRef);
    const list = docSnap.data().replies;
    setReplies(list);
  };

  // dummy function to prevent passing null.parameter to Reply component
  const dummyModal = () => {};

  useEffect(() => {
    getReplies(location.state.postID);
  }, [replies]);

  return (
    <div className="post-details-container">
      <div className="post-header">
        <BiArrowBack
          size="1.5rem"
          role="button"
          tabIndex={0}
          onClick={() => {
            navigate(-1);
          }}
          onKeyDown={() => {
            navigate(-1);
          }}
        />
        <span>Post</span>
      </div>
      <PostItem
        key={location.state.postID}
        postID={location.state.postID}
        userID={location.state.userID}
      />
      <Reply
        postID={location.state.postID}
        userID={location.state.userID}
        postOwner={location.state.postOwner}
        replyMode="append"
        toggleReplyModal={dummyModal}
      />
      {replies.map((reply) => (
        <ReplyItem key={reply.replyID} postID={location.state.postID} reply={reply} />
      ))}
    </div>
  );
}

export default PostDetails;
