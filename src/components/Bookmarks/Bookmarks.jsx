import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { BiSpaceBar } from 'react-icons/bi';
import { GetUserContext } from '../../contexts/UserContext';
import PostItem from '../PostItem/PostItem';

function Bookmarks({ changeActiveTab, handleSetIsReplyModalActive }) {
  const { userData } = GetUserContext();
  const [bookmarks, setBookmarks] = useState(null);

  useEffect(() => {
    changeActiveTab('bookmarks');
    setBookmarks(userData.bookmarks);
  }, []);

  const sortPosts = (lst) => {
    const unsorted = [];
    lst.map((o) =>
      unsorted.push({ postID: o.postID, created: o.created, userID: userData.userID })
    );
    const sorted = unsorted.sort((a, b) => (a.created.seconds < b.created.seconds ? 1 : -1));
    return sorted;
  };

  return (
    <div className="bookmarks-container fadein">
      <div className="bookmarks-header">Bookmarked posts</div>
      <div className="bookmarks-content">
        <div className="posts">
          {bookmarks?.length <= 0 && (
            <div className="empty">
              <BiSpaceBar size="3rem" />
              <h4> empty...</h4>
              <h5> bookmarked posts will show up here</h5>
            </div>
          )}
          {bookmarks &&
            sortPosts(bookmarks).map((post) => (
              <PostItem
                key={post.postID}
                postID={post.postID}
                userID={userData.userID}
                userPic={userData.userPic}
                handleSetIsReplyModalActive={handleSetIsReplyModalActive}
              />
            ))}
        </div>
      </div>
    </div>
  );
}

export default Bookmarks;

Bookmarks.propTypes = {
  changeActiveTab: PropTypes.func.isRequired,
  handleSetIsReplyModalActive: PropTypes.func.isRequired
};
