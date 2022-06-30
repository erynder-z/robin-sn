import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './Bookmarks.css';
import PostItem from '../PostItem/PostItem';

function Bookmarks({ userData, changeActiveTab }) {
  const [bookmarks, setBookmarks] = useState(null);

  const sortPosts = (lst) => {
    const unsorted = [];
    lst.map((o) =>
      unsorted.push({ postID: o.postID, created: o.created, userID: userData.userID })
    );
    const sorted = unsorted.sort((a, b) => (a.created.seconds < b.created.seconds ? 1 : -1));
    return sorted;
  };

  useEffect(() => {
    changeActiveTab('bookmarks');
    setBookmarks(userData.bookmarks);
  }, []);

  return (
    <div className="bookmarks-container fadein">
      <div className="bookmarks-header">Bookmarked posts</div>
      <div className="bookmarks-content">
        <div className="posts">
          {bookmarks &&
            sortPosts(bookmarks).map((post) => (
              <PostItem
                key={post.postID}
                postID={post.postID}
                userID={userData.userID}
                userPic={userData.userPic}
              />
            ))}
        </div>
      </div>
    </div>
  );
}

export default Bookmarks;

Bookmarks.propTypes = {
  userData: PropTypes.shape({
    userID: PropTypes.string.isRequired,
    isSetup: PropTypes.bool.isRequired,
    username: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    userPic: PropTypes.string.isRequired,
    useremail: PropTypes.string.isRequired,
    joined: PropTypes.objectOf(PropTypes.number),
    followers: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)).isRequired,
    following: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)).isRequired,
    posts: PropTypes.arrayOf(
      PropTypes.shape({
        created: PropTypes.objectOf(PropTypes.number),
        postID: PropTypes.string
      })
    ).isRequired,
    replies: PropTypes.arrayOf(
      PropTypes.shape({
        created: PropTypes.objectOf(PropTypes.number),
        postID: PropTypes.string
      })
    ).isRequired,
    reposts: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)).isRequired,
    likes: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)).isRequired,
    bookmarks: PropTypes.arrayOf(
      PropTypes.shape({
        created: PropTypes.objectOf(PropTypes.number),
        postID: PropTypes.string
      })
    ).isRequired
  }).isRequired,
  changeActiveTab: PropTypes.func.isRequired
};
