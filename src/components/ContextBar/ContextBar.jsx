import PropTypes from 'prop-types';
import React from 'react';
import { arrayRemove, arrayUnion, doc, getDoc, updateDoc } from 'firebase/firestore';
import { TbLayoutSidebarRightCollapse } from 'react-icons/tb';
import FollowUserList from './FollowUserList/FollowUserList';
import ProfileOptions from './ProfileOptions/ProfileOptions';
import PostDetailsOwn from './PostDetailsOwn/PostDetailsOwn';
import PostDetailsOther from './PostDetailsOther/PostDetailsOther';
import './ContextBar.css';
import { GetUserContext } from '../../contexts/UserContext';
import { database } from '../Firebase/Firebase';

function ContextBar({
  activeTab,
  postInfo,
  deleteAccount,
  deletePost,
  isPostBookmarked,
  showContextbar,
  toggleContextbar,
  logout,
  showWarning
}) {
  const { userData } = GetUserContext();
  const { post } = postInfo;

  const bookmarkPost = async () => {
    try {
      const userRef = doc(database, 'users', userData.userID);
      try {
        const docSnap = await getDoc(userRef);
        const found = post.postID;

        const addBookmark = async () => {
          await updateDoc(userRef, {
            bookmarks: arrayUnion({ postID: post.postID, created: post.created })
          });
        };

        const removeBookmark = async () => {
          await updateDoc(userRef, {
            bookmarks: arrayRemove({ postID: post.postID, created: post.created })
          });
        };
        // like a post if not already liked or unlike if already liked
        if (docSnap.data().bookmarks.some((item) => item.postID === found)) {
          removeBookmark();
        } else {
          addBookmark();
        }
      } catch (err) {
        showWarning(err);
      }
    } catch (err) {
      showWarning(err);
    }
  };

  return (
    <div className={`contextbar ${showContextbar ? 'active' : 'inactive'}`}>
      <div className="contextbar-toggle">
        <TbLayoutSidebarRightCollapse
          size="2rem"
          onClick={() => {
            toggleContextbar();
          }}
        />
      </div>
      {(activeTab === 'home' && <FollowUserList showWarning={showWarning} />) ||
        (activeTab === 'explore' && <FollowUserList showWarning={showWarning} />) ||
        (activeTab === 'bookmarks' && <FollowUserList showWarning={showWarning} />) ||
        (activeTab === 'search' && <FollowUserList showWarning={showWarning} />) ||
        (activeTab === 'trends' && <FollowUserList showWarning={showWarning} />) ||
        (activeTab === 'mentions' && <FollowUserList showWarning={showWarning} />)}
      {activeTab === 'myprofile' && (
        <ProfileOptions deleteAccount={deleteAccount} logout={logout} showWarning={showWarning} />
      )}
      {activeTab === 'postdetailsown' && (
        <PostDetailsOwn
          deletePost={deletePost}
          postInfo={postInfo}
          bookmarkPost={bookmarkPost}
          isPostBookmarked={isPostBookmarked}
        />
      )}
      {activeTab === 'postdetailsother' && (
        <PostDetailsOther bookmarkPost={bookmarkPost} isPostBookmarked={isPostBookmarked} />
      )}
    </div>
  );
}

export default ContextBar;

ContextBar.propTypes = {
  postInfo: PropTypes.shape({
    post: PropTypes.shape({
      content: PropTypes.string,
      created: PropTypes.objectOf(PropTypes.number),
      hashtags: PropTypes.arrayOf(PropTypes.string),
      image: PropTypes.objectOf(PropTypes.string),
      likes: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)),
      ownerID: PropTypes.string,
      postID: PropTypes.string,
      replies: PropTypes.arrayOf(
        PropTypes.shape({
          replyContent: PropTypes.string,
          replyDate: PropTypes.objectOf(PropTypes.number),
          replyID: PropTypes.string,
          replyUserID: PropTypes.string
        })
      ),
      reposts: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string))
    })
  }),
  activeTab: PropTypes.string.isRequired,
  deleteAccount: PropTypes.func.isRequired,
  deletePost: PropTypes.func.isRequired,
  isPostBookmarked: PropTypes.bool.isRequired,
  showContextbar: PropTypes.bool.isRequired,
  toggleContextbar: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
  showWarning: PropTypes.func.isRequired
};

ContextBar.defaultProps = {
  postInfo: PropTypes.shape({
    content: '',
    created: {},
    hashtags: [],
    image: {},
    likes: [],
    ownerID: '',
    postID: '',
    replies: {},
    reposts: []
  })
};
