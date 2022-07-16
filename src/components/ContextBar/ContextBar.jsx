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
import { database } from '../../data/firebase';
import './ContextBar.css';
import DirectMessageOptions from './DirectMessageOptions/DirectMessageOptions';

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
  showOverlayEffect,
  userInView,
  toggleMessageModal,
  handleSetModalActive
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
        showWarning(err.message);
      }
    } catch (err) {
      showWarning(err.message);
    }
  };

  const follow = async (followUserID) => {
    try {
      const userToFollowRef = doc(database, 'users', followUserID);
      const userThatFollowsRef = doc(database, 'users', userData.userID);

      await updateDoc(userToFollowRef, {
        followers: arrayUnion({ userID: userData.userID })
      });
      await updateDoc(userThatFollowsRef, {
        following: arrayUnion({ userID: followUserID })
      });
    } catch (err) {
      showWarning(err.message);
    }
  };

  const unFollow = async (followUserID) => {
    try {
      const userToFollowRef = doc(database, 'users', followUserID);
      const userThatFollowsRef = doc(database, 'users', userData.userID);

      await updateDoc(userToFollowRef, {
        followers: arrayRemove({ userID: userData.userID })
      });
      await updateDoc(userThatFollowsRef, {
        following: arrayRemove({ userID: followUserID })
      });
    } catch (err) {
      showWarning(err.message);
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
      {(activeTab === 'home' && (
        <FollowUserList showWarning={showWarning} follow={follow} unFollow={unFollow} />
      )) ||
        (activeTab === 'explore' && (
          <FollowUserList showWarning={showWarning} follow={follow} unFollow={unFollow} />
        )) ||
        (activeTab === 'directmessages' && <DirectMessageOptions showWarning={showWarning} />) ||
        (activeTab === 'bookmarks' && (
          <FollowUserList showWarning={showWarning} follow={follow} unFollow={unFollow} />
        )) ||
        (activeTab === 'search' && (
          <FollowUserList showWarning={showWarning} follow={follow} unFollow={unFollow} />
        )) ||
        (activeTab === 'trends' && (
          <FollowUserList showWarning={showWarning} follow={follow} unFollow={unFollow} />
        )) ||
        (activeTab === 'mentions' && (
          <FollowUserList showWarning={showWarning} follow={follow} unFollow={unFollow} />
        )) ||
        (activeTab === 'userlist' && (
          <FollowUserList showWarning={showWarning} follow={follow} unFollow={unFollow} />
        ))}

      {activeTab === 'myprofile' && (
        <ProfileOptionsOwn
          deleteAccount={deleteAccount}
          logout={logout}
          showWarning={showWarning}
        />
      )}
      {activeTab === 'userprofile' && (
        <ProfileOptionsOther
          showWarning={showWarning}
          showOverlayEffect={showOverlayEffect}
          userInView={userInView}
          follow={follow}
          unFollow={unFollow}
          toggleMessageModal={toggleMessageModal}
          handleSetModalActive={handleSetModalActive}
        />
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
  showOverlayEffect: PropTypes.func.isRequired,
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
    replies: PropTypes.arrayOf(
      PropTypes.shape({ created: PropTypes.objectOf(PropTypes.number), postID: PropTypes.string })
    ),
    description: PropTypes.string,
    userID: PropTypes.string,
    messages: PropTypes.arrayOf(
      PropTypes.shape({
        messageID: PropTypes.string,
        messageContent: PropTypes.string,
        senderID: PropTypes.string,
        isRead: PropTypes.bool,
        sendDate: PropTypes.objectOf(PropTypes.number),
        senderUsername: PropTypes.string.isRequired
      })
    )
  }),
  toggleMessageModal: PropTypes.func.isRequired,
  handleSetModalActive: PropTypes.func.isRequired
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
