import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { database } from '../../../data/firebase';
import BookmarkOption from '../BookmarkOption/BookmarkOption';
import RemoveBookmarkOption from '../RemoveBookmarkOption/RemoveBookmarkOption';
import PostMentions from '../PostMentions/PostMentions';
import PostTrends from '../PostTrends/PostTrends';
import './PostDetailsOther.css';

function PostDetailsOther({ bookmarkPost, isPostBookmarked, postInfo, handleSearchQuery }) {
  const [bookmarkCheck, setBookmarkCheck] = useState(null);
  const [mentionedUsersDetails, setMentionedUsersDetails] = useState([]);

  // get userID's of metioned users to pass into PostMentions component
  const getUserDetails = () => {
    setMentionedUsersDetails([]);
    postInfo?.post?.mentions?.forEach(async (usr) => {
      const q = query(collection(database, 'users'), where('username', '==', usr));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setMentionedUsersDetails((current) => [
          ...current,
          { username: doc.data().username, userID: doc.data().userID }
        ]);
      });
    });
  };

  const handleBookmark = () => {
    bookmarkPost();
    setBookmarkCheck(!bookmarkCheck);
  };

  // check if post is aleady bookmarked
  useEffect(() => {
    setBookmarkCheck(isPostBookmarked);
  }, [isPostBookmarked]);

  useEffect(() => {
    getUserDetails();
  }, [postInfo]);

  return (
    <div className="postDetails-other fadein">
      <div className="otherPost-header">Post options</div>
      <div className="bookmarkPost">
        {bookmarkCheck && <BookmarkOption handleBookmark={handleBookmark} />}
        {!bookmarkCheck && <RemoveBookmarkOption handleBookmark={handleBookmark} />}
      </div>
      {mentionedUsersDetails.length > 0 && (
        <>
          <div className="mentionUser-header">Mentioned users</div>
          <div className="mentionUser-container">
            {mentionedUsersDetails?.map((u) => (
              <PostMentions key={u.userID} name={u.username} id={u.userID} />
            ))}
          </div>
        </>
      )}

      {postInfo?.post?.hashtags?.length > 0 && (
        <div className="postHashtag-header">Hashtags in post</div>
      )}
      <div className="postHashtag-container">
        {postInfo?.post?.hashtags?.map((h) => (
          <PostTrends key={h} hashtag={h} handleSearchQuery={handleSearchQuery} />
        ))}
      </div>
    </div>
  );
}

export default PostDetailsOther;

PostDetailsOther.propTypes = {
  bookmarkPost: PropTypes.func.isRequired,
  isPostBookmarked: PropTypes.bool.isRequired,
  handleSearchQuery: PropTypes.func.isRequired,
  postInfo: PropTypes.shape({
    post: PropTypes.shape({
      content: PropTypes.string,
      created: PropTypes.objectOf(PropTypes.number),
      hashtags: PropTypes.arrayOf(PropTypes.string),
      image: PropTypes.objectOf(PropTypes.string),
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
      )
    })
  })
};

PostDetailsOther.defaultProps = {
  postInfo: PropTypes.shape({
    content: '',
    created: {},
    hashtags: [],
    image: {},
    likes: [],
    mentions: [],
    ownerID: '',
    postID: '',
    replies: {},
    reposts: []
  })
};
