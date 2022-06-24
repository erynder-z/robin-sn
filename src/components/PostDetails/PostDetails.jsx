import { BiArrowBack, BiTrash } from 'react-icons/bi';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { arrayRemove, deleteDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useLocation, useNavigate } from 'react-router-dom';
import { deleteObject, ref } from 'firebase/storage';
import { database, storage } from '../Firebase/Firebase';
import PostItem from '../PostItem/PostItem';
import Reply from '../Reply/Reply';
import ReplyItem from '../ReplyItem/ReplyItem';
import './PostDetails.css';

function PostDetails({ changeContextBarMode }) {
  const navigate = useNavigate();
  // get state from PostItem component // state: { postID, userID, postOwner }
  const location = useLocation();
  const [replies, setReplies] = useState([]);
  const [post] = useDocumentData(doc(database, 'posts', location.state.postID));

  // delete post from posts-collection and remove it from the user-object
  const deletePost = async (postID, userID) => {
    try {
      const handleDeleteDoc = async () => {
        const docRef = doc(database, 'posts', postID);
        await deleteDoc(docRef);

        if (post.image.imageRef !== null) {
          const getImageRef = post.image.imageRef.split('appspot.com/').pop();
          const imageRef = ref(storage, getImageRef);
          await deleteObject(imageRef);
        }
      };

      const handleDeleteFromUserObject = async () => {
        // need to pass the exact object to delete into arrayRemove(), so we first need to retrieve the post-object from the user object.posts-array
        const userRef = doc(database, 'users', userID);
        const userSnap = await getDoc(userRef);
        const postToDelete = userSnap.data().posts.find((p) => p.postID === postID);
        await updateDoc(userRef, {
          posts: arrayRemove(postToDelete)
        });
      };

      handleDeleteDoc();
      handleDeleteFromUserObject();
      navigate(-1);
    } catch (err) {
      console.log(err);
    }
  };

  // dummy function to prevent passing null.parameter to Reply component
  const dummyModal = () => {};

  useEffect(() => {
    // get all replies of a post
    if (post) {
      setReplies(post.replies);
    }
  }, [post]);

  useEffect(() => {
    if (location.state.postOwner.ownerID === location.state.userID) {
      changeContextBarMode('postdetailsown');
    } else {
      changeContextBarMode('postdetailsother');
    }
  }, []);

  return (
    <div className="post-details-container">
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
        <span>Post</span>
        {location.state.postOwner.ownerID === location.state.userID && (
          <div className="deletePost">
            {' '}
            <BiTrash
              className="post-delete"
              size="1.5rem"
              role="button"
              tabIndex={0}
              onClick={() => {
                deletePost(location.state.postID, location.state.userID);
              }}
              onKeyDown={() => {
                deletePost(location.state.postID, location.state.userID);
              }}
            />
          </div>
        )}
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

PostDetails.propTypes = {
  changeContextBarMode: PropTypes.func.isRequired
};
