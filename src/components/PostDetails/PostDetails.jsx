import React from 'react';
import { useLocation } from 'react-router-dom';
import PostItem from '../PostItem/PostItem';
import Reply from '../Reply/Reply';
import ReplyItem from '../ReplyItem/ReplyItem';
import './PostDetails.css';

function PostDetails() {
  const location = useLocation();
  /*   console.log(location.state); */

  return (
    <div className="post-details-container">
      <PostItem
        key={location.state.postID}
        postID={location.state.postID}
        userID={location.state.userID}
      />
      <ReplyItem
        key={location.state.postID}
        postID={location.state.postID}
        userID={location.state.userID}
      />
      <Reply postID={location.state.postID} userID={location.state.userID} replyMode="append" />
    </div>
  );
}

export default PostDetails;
