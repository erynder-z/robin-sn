import React from 'react';
import PropTypes from 'prop-types';
import { arrayRemove, arrayUnion, doc, getDoc, updateDoc } from 'firebase/firestore';
import { TbLayoutSidebarRightCollapse } from 'react-icons/tb';
import FollowUserList from './FollowUserList/FollowUserList';
import PostDetailsOwn from './PostDetailsOwn/PostDetailsOwn';
import PostDetailsOther from './PostDetailsOther/PostDetailsOther';
import ProfileOptionsOwn from './ProfileOptionsOwn/ProfileOptionsOwn';
import ProfileOptionsOther from './ProfileOptionsOther/ProfileOptionsOther';
import { GetUserContext } from '../../contexts/UserContext';
import { database } from '../Firebase/Firebase';
import './ContextBar.css';

function ContextBar({
  activeTab,
  postInfo,
  deleteAccount,
  deletePost,
  isPostBookmarked,
  showContextbar,
  toggleContextbar,
  logout,
  showWarning,
  userInView
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
        <ProfileOptionsOwn
          deleteAccount={deleteAccount}
          logout={logout}
          showWarning={showWarning}
        />
      )}
      {activeTab === 'userprofile' && (
        <ProfileOptionsOther showWarning={showWarning} userInView={userInView} />
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
  showWarning: PropTypes.func.isRequired,
  userInView: PropTypes.shape({
    userPic: PropTypes.string,
    username: PropTypes.string,
    userBackground: PropTypes.string,
    joined: PropTypes.objectOf(PropTypes.number),
    following: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)),
    followers: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)),
    likes: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)),
    posts: PropTypes.arrayOf(
      PropTypes.shape({
        created: PropTypes.objectOf(PropTypes.number),
        postID: PropTypes.string
      })
    ),
    replies: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)),
    description: PropTypes.string,
    userID: PropTypes.string,
    messages: PropTypes.arrayOf(
      PropTypes.shape({
        messageID: PropTypes.string,
        messageContent: PropTypes.string,
        sender: PropTypes.string,
        isRead: PropTypes.bool,
        sendDate: PropTypes.objectOf(PropTypes.number)
      })
    )
  })
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
  }),
  userInView: PropTypes.shape({
    userPic: '',
    username: '',
    userBackground: '',
    joined: [],
    following: [],
    followers: [],
    likes: [],
    posts: [],
    replies: [],
    description: '',
    userID: '',
    messages: []
  })
};
