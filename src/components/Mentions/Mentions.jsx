import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { BiMeh } from 'react-icons/bi';
import './Mentions.css';
import { collection, getDocs, query, where } from 'firebase/firestore';
import PostItem from '../PostItem/PostItem';
import { GetUserContext } from '../../contexts/UserContext';
import { database } from '../Firebase/Firebase';

function Mentions({ changeActiveTab, handleSetIsReplyModalActive }) {
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
    const postsWithMentions = [];
    const mentionsRef = collection(database, 'posts');
    const q = query(mentionsRef, where('mentions', 'array-contains', userData.username));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      postsWithMentions.push({
        postID: doc.data().postID,
        created: doc.data().created
      });
    });
    setMentions(postsWithMentions);
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
          {mentions && mentions.length <= 0 && (
            <div className="empty">
              <BiMeh size="3rem" />
              <h4> empty...</h4>
              <h5> posts you were mentioned in will show up here</h5>
            </div>
          )}
          {mentions &&
            sortPosts(mentions).map((post) => (
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

export default Mentions;

Mentions.propTypes = {
  changeActiveTab: PropTypes.func.isRequired,
  handleSetIsReplyModalActive: PropTypes.func.isRequired
};
