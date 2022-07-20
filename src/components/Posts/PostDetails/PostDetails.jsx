import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { BiArrowBack } from 'react-icons/bi';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { doc } from 'firebase/firestore';
import { useLocation, useNavigate } from 'react-router-dom';
import { database } from '../../../data/firebase';
import { GetUserContext } from '../../../contexts/UserContext';
import PostItem from '../PostItem/PostItem';
import Reply from '../Reply/Reply';
import ReplyItem from '../ReplyItem/ReplyItem';
import limitNumberOfPosts from '../../../helpers/LimitNumberOfPosts/limitNumberOfPosts';
import './PostDetails.css';
import FetchingIcon from '../../Main/FetchingIcon/FetchingIcon';

function PostDetails({ changeActiveTab, handlePostInfo, handleSetModalActive, showOverlayEffect }) {
  const { userData } = GetUserContext();
  const navigate = useNavigate();
  // get state from PostItem component // state: { postID, userID, postOwner }
  const location = useLocation();
  const { userID, userPic } = userData;
  const [replies, setReplies] = useState([]);
  const [post, loading] = useDocumentData(doc(database, 'posts', location.state.postID));

  // dummy function to prevent passing null.parameter to Reply component
  const dummyModal = () => {};

  useEffect(() => {
    // get a limted number of  replies of a post
    if (post) {
      setReplies(limitNumberOfPosts(post.replies));
    }
  }, [post]);

  // determine weather post was created by the user or by another user
  useEffect(() => {
    if (location.state.postOwner.ownerID === userID) {
      changeActiveTab('postdetailsown');
    } else {
      changeActiveTab('postdetailsother');
    }
  }, []);

  useEffect(() => {
    handlePostInfo({ post });
  }, [post]);

  return (
    <div className="post-details-container fadein">
      <div className="post-header">
        <div className="backPost">
          <BiArrowBack
            className="post-back"
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
        </div>
        Post
      </div>
      {loading && <FetchingIcon />}
      <PostItem
        key={location.state.postID}
        postID={location.state.postID}
        handleSetModalActive={handleSetModalActive}
      />
      <Reply
        postID={location.state.postID}
        userID={userID}
        userPic={userPic}
        postOwner={location.state.postOwner}
        replyMode="append"
        toggleReplyModal={dummyModal}
        setReplyEffect={showOverlayEffect}
      />
      {replies.map((reply) => (
        <ReplyItem key={reply.replyID} postID={location.state.postID} reply={reply} />
      ))}
    </div>
  );
}

export default PostDetails;

PostDetails.propTypes = {
  changeActiveTab: PropTypes.func.isRequired,
  handlePostInfo: PropTypes.func.isRequired,
  handleSetModalActive: PropTypes.func.isRequired,
  showOverlayEffect: PropTypes.func.isRequired
};
