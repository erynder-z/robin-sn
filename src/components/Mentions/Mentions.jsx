import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { BiSpaceBar } from 'react-icons/bi';
import { collection, getDocs, limit, orderBy, query, where } from 'firebase/firestore';
import { GetUserContext } from '../../contexts/UserContext';
import { database } from '../../data/firebase';
import PostItem from '../PostItem/PostItem';

function Mentions({ changeActiveTab, handleSetModalActive, showWarning }) {
  const { userData } = GetUserContext();
  const [mentions, setMentions] = useState(null);

  const sortPosts = (lst) => {
    const unsorted = [];
    lst.map((o) =>
      unsorted.push({ postID: o.postID, created: o.created, userID: userData.userID })
    );
    const sorted = unsorted.sort((a, b) => (a.created.seconds < b.created.seconds ? 1 : -1));
    return sorted;
  };

  const getMentions = async () => {
    try {
      const postsWithMentions = [];
      const mentionsRef = collection(database, 'posts');
      const q = query(
        mentionsRef,
        where('mentions', 'array-contains', userData.username),
        orderBy('created', 'desc'),
        limit(25)
      );

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        postsWithMentions.push({
          postID: doc.data().postID,
          created: doc.data().created
        });
      });
      setMentions(postsWithMentions);
    } catch (err) {
      showWarning(err.message);
    }
  };

  useEffect(() => {
    changeActiveTab('mentions');
    getMentions();
  }, []);

  return (
    <div className="mentions-container fadein">
      <div className="mentions-header">Mentions</div>
      <div className="mentions-content">
        <div className="posts">
          {mentions?.length <= 0 && (
            <div className="empty">
              <BiSpaceBar size="3rem" />
              <h4> empty...</h4>
              <h5> recent posts you were mentioned in will show up here</h5>
            </div>
          )}
          {mentions &&
            sortPosts(mentions).map((post) => (
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
    </div>
  );
}

export default Mentions;

Mentions.propTypes = {
  changeActiveTab: PropTypes.func.isRequired,
  handleSetModalActive: PropTypes.func.isRequired,
  showWarning: PropTypes.func.isRequired
};
