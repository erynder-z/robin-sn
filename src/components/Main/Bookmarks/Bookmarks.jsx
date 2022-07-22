import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { BiSpaceBar } from 'react-icons/bi';
import { arrayRemove, doc, getDoc, updateDoc } from 'firebase/firestore';
import { GetUserContext } from '../../../contexts/UserContext';
import PostItem from '../../Posts/PostItem/PostItem';
import FetchingIcon from '../FetchingIcon/FetchingIcon';
import { database } from '../../../data/firebase';

function Bookmarks({ changeActiveTab, handleSetModalActive, showWarning }) {
  const { userData } = GetUserContext();
  const [bookmarks, setBookmarks] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkBookmarks = () => {
    const checkIfBookmarkExists = async (postID) => {
      const docRef = doc(database, 'posts', postID);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return null;
      }
      const userRef = doc(database, 'users', userData.userID);

      const userSnap = await getDoc(userRef);
      if (userSnap.data()) {
        const postToDelete = userSnap.data().bookmarks.find((p) => p.postID === postID);
        await updateDoc(userRef, {
          bookmarks: arrayRemove(postToDelete)
        });
      }
      showWarning('Purged bookmarks that no longer exist');
      return null;
    };

    bookmarks.forEach((bookmark) => {
      checkIfBookmarkExists(bookmark.postID);
    });
    setBookmarks(userData.bookmarks);
  };

  const sortPosts = (lst) => {
    const unsorted = [];
    lst.map((o) =>
      unsorted.push({ postID: o.postID, created: o.created, userID: userData.userID })
    );
    const sorted = unsorted.sort((a, b) => (a.created.seconds < b.created.seconds ? 1 : -1));

    return sorted;
  };

  useEffect(() => {
    if (bookmarks) {
      checkBookmarks();
    }
  }, [bookmarks]);

  useEffect(() => {
    changeActiveTab('bookmarks');

    setLoading(false);
  }, []);

  useEffect(() => {
    setBookmarks(userData.bookmarks);
  }, [userData.bookmarks]);

  return (
    <div className="bookmarks-container fadein">
      <div className="bookmarks-header">Bookmarked posts</div>
      {loading ? (
        <FetchingIcon />
      ) : (
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
                  handleSetModalActive={handleSetModalActive}
                />
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Bookmarks;

Bookmarks.propTypes = {
  changeActiveTab: PropTypes.func.isRequired,
  handleSetModalActive: PropTypes.func.isRequired,
  showWarning: PropTypes.func.isRequired
};
