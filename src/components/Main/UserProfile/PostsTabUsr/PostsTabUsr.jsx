import React from 'react';
import PropTypes from 'prop-types';
import { BiSpaceBar } from 'react-icons/bi';
import { GetUserContext } from '../../../../contexts/UserContext';
import PostItem from '../../../Posts/PostItem/PostItem';

function PostsTabUsr({ user, sortPosts, handleSetModalActive }) {
  const { userData } = GetUserContext();
  return (
    <div className="posts fadein">
      {user?.posts.length <= 0 && (
        <div className="empty">
          <BiSpaceBar size="3rem" />
          <h4> empty...</h4>
          <h5> all of {user.username}&apos;s recent posts will show up here</h5>
        </div>
      )}
      {user &&
        sortPosts(user.posts).map((post) => (
          <PostItem
            key={post.postID}
            postID={post.postID}
            userID={userData.userID}
            userPic={userData.userPic}
            handleSetModalActive={handleSetModalActive}
          />
        ))}
    </div>
  );
}

export default PostsTabUsr;

PostsTabUsr.propTypes = {
  user: PropTypes.shape({
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
  }).isRequired,
  sortPosts: PropTypes.func.isRequired,
  handleSetModalActive: PropTypes.func.isRequired
};
