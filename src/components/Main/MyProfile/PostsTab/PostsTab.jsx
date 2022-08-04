import React from 'react';
import PropTypes from 'prop-types';
import { BiSpaceBar } from 'react-icons/bi';
import { GetUserContext } from '../../../../contexts/UserContext';
import PostItem from '../../../Posts/PostItem/PostItem';

function PostsTab({ usrPosts, sortPosts, handleSetModalActive }) {
  const { userData } = GetUserContext();
  return (
    <div className="posts fadein">
      {usrPosts?.length <= 0 && (
        <div className="empty">
          <BiSpaceBar size="3rem" />
          <h4> empty...</h4>
          <h5> your recent posts will show up here</h5>
        </div>
      )}
      {sortPosts(usrPosts).map((post) => (
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

export default PostsTab;

PostsTab.propTypes = {
  usrPosts: PropTypes.arrayOf(
    PropTypes.shape({
      post: PropTypes.shape({
        content: PropTypes.string,
        created: PropTypes.objectOf(PropTypes.number),
        hashtags: PropTypes.arrayOf(PropTypes.string),
        image: PropTypes.objectOf(PropTypes.string),
        isRepostOf: PropTypes.string,
        likes: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)),
        mentions: PropTypes.arrayOf(PropTypes.string),
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
        reposts: PropTypes.arrayOf(
          PropTypes.shape({
            userID: PropTypes.string
          })
        ),
        videoIDs: PropTypes.arrayOf(PropTypes.string)
      })
    })
  ).isRequired,
  sortPosts: PropTypes.func.isRequired,
  handleSetModalActive: PropTypes.func.isRequired
};
