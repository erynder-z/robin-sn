import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import uniqid from 'uniqid';
import { useNavigate } from 'react-router-dom';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import {
  arrayUnion,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  arrayRemove,
  increment
} from 'firebase/firestore';
import { database } from '../../../data/firebase';
import { GetUserContext } from '../../../contexts/UserContext';
import Reply from '../Reply/Reply';
import OverlayEffect from '../../Overlays/OverlayEffect/OverlayEffect';
import parsePostText from '../../../helpers/ParsePostText/ParsePostText';
import convertDate from '../../../helpers/ConvertDate/ConvertDate';
import FullscreenImageOverlay from '../../Overlays/FullscreenImageOverlay/FullscreenImageOverlay';
import YoutubeEmbed from './YoutubeEmbed/YoutubeEmbed';
import PostOptionLike from './PostOptionLike/PostOptionLike';
import PostOptionReply from './PostOptionReply/PostOptionReply';
import PostOptionRepost from './PostOptionRepost/PostOptionRepost';
import './PostItem.css';

function PostItem({ postID, handleSetModalActive }) {
  const { userData } = GetUserContext();
  const navigate = useNavigate();
  const [post] = useDocumentData(doc(database, 'posts', postID));
  const [postOwner, setPostOwner] = useState('');
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [clickEffect, setClickEffect] = useState({ reply: false, repost: false, like: false });
  const [errorMessage, setErrorMessage] = useState(null);
  // handle overlayEffect when replying here, because Reply-component gests unmounted before effect can be shown
  const [replyEffect, setReplyEffect] = useState(null);
  const [showFullscreenImage, setShowFullscreenImage] = useState(false);
  const [alreadyReplied, setAlreadyReplied] = useState(null);
  const [alreadyReposted, setAlreadyReposted] = useState(null);
  const [alreadyLiked, setAlreadyLiked] = useState(null);
  const postDocRef = doc(database, 'posts', postID);
  const userDocRef = doc(database, 'users', userData.userID);

  // get necessary data of the current posts' owner
  // get username via getDoc rather than useDocumentData-hook to prevent exposing the whole user object to the front end
  const getOwner = async () => {
    try {
      const ownerDocRef = doc(database, 'users', post.ownerID);
      const docSnap = await getDoc(ownerDocRef);
      setPostOwner({
        username: docSnap.data().username,
        userpic: docSnap.data().userPic,
        ownerID: docSnap.data().userID
      });
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  const addHashtag = async (hashtagArray) => {
    hashtagArray.map(async (hashtag) => {
      try {
        await setDoc(
          doc(database, 'hashtags', hashtag.toLowerCase()),
          {
            hashtag: hashtag.toLowerCase(),
            count: increment(1)
          },
          { merge: true }
        );
      } catch (err) {
        setErrorMessage(err.message);
      }
    });
  };

  const checkPostInteractions = (pID) => {
    const found = pID;

    const checkReply = () => {
      if (userData.replies.some((item) => item.postID === found)) {
        setAlreadyReplied(true);
      } else {
        setAlreadyReplied(false);
      }
    };

    const checkRepost = () => {
      if (userData.reposts.some((item) => item.postID === found)) {
        setAlreadyReposted(true);
      } else {
        setAlreadyReposted(false);
      }
    };

    const checkLike = () => {
      if (userData.likes.some((item) => item.postID === found)) {
        setAlreadyLiked(true);
      } else {
        setAlreadyLiked(false);
      }
    };

    checkReply();
    checkRepost();
    checkLike();
  };

  const repost = async (ownerName) => {
    const found = postID;
    // repost only if not already reposted
    if (userData.reposts.some((item) => item.postID === found) === false) {
      try {
        // copy userID to post document
        await updateDoc(postDocRef, {
          reposts: arrayUnion({ userID: userData.userID })
        });
        // copy postID to user document
        await updateDoc(userDocRef, {
          reposts: arrayUnion({ postID })
        });
        // create a new post in the user document with the repost as content
        const newPostID = uniqid();
        const repostContent = `reposting @${ownerName}: &laquo; ${post.content} &raquo;`;
        await setDoc(doc(database, 'posts', newPostID), {
          created: serverTimestamp(),
          postID: newPostID,
          ownerID: userData.userID,
          content: repostContent,
          hashtags: post.hashtags,
          image: { imageURL: post.image.imageURL, imageRef: post.image.imageRef },
          isRepostOf: post.postID,
          mentions: post.mentions,
          reposts: [],
          likes: [],
          replies: [],
          videoIDs: post.videoIDs
        });

        const addPostToUserObject = async (pID) => {
          const userRef = doc(database, 'users', userData.userID);
          const docRef = doc(database, 'posts', pID);
          const docSnap = await getDoc(docRef);

          await updateDoc(userRef, {
            posts: arrayUnion({ postID: pID, created: docSnap.data().created })
          });
        };

        addPostToUserObject(newPostID);
        addHashtag(post.hashtags);
      } catch (err) {
        setErrorMessage(err.message);
      }
    }
  };

  const like = async (pID) => {
    try {
      const found = pID;

      const likePost = async () => {
        await updateDoc(postDocRef, {
          likes: arrayUnion({ userID: userData.userID })
        });

        await updateDoc(userDocRef, {
          likes: arrayUnion({ postID })
        });
      };

      const unLikePost = async () => {
        await updateDoc(postDocRef, {
          likes: arrayRemove({ userID: userData.userID })
        });

        await updateDoc(userDocRef, {
          likes: arrayRemove({ postID })
        });
      };
      // like a post if not already liked or unlike if already liked
      if (userData.likes.some((item) => item.postID === found)) {
        unLikePost();
      } else {
        likePost();
      }
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  // navigate to the PostDetails component and passing the postID and userID as state
  const linkToPostDetailsComponent = () => {
    navigate('/main/postDetails', { state: { postID, postOwner } });
  };

  const linkToUserProfile = (e) => {
    e.stopPropagation();
    if (postOwner.ownerID === userData.userID) {
      navigate('/main/myProfile');
    } else {
      navigate(`/main/userprofile/${postOwner.ownerID}`, {
        state: { usr: postOwner.ownerID }
      });
    }
  };

  const toggleReplyModal = () => {
    setShowReplyModal(!showReplyModal);
    handleSetModalActive(false);
  };

  useEffect(() => {
    if (post) {
      getOwner();
    }
  }, [post]);

  // use for contitional css-classes
  useEffect(() => {
    if (clickEffect) {
      setTimeout(() => setClickEffect({ reply: false, repost: false, like: false }), 200);
    }
  }, [clickEffect.reply || clickEffect.repost || clickEffect.like]);

  useEffect(() => {
    if (errorMessage) {
      setTimeout(() => setErrorMessage(null), 2000);
    }
  }, [errorMessage]);

  useEffect(() => {
    if (replyEffect) {
      setTimeout(() => setReplyEffect(null), 2000);
    }
  }, [replyEffect]);

  // hide fab when fullscreen image is showing
  useEffect(() => {
    if (showFullscreenImage) {
      handleSetModalActive(true);
    }
  }, [showFullscreenImage]);

  // check if already replied, reposted or liked post
  useEffect(() => {
    checkPostInteractions(postID);
  }, [userData]);

  return (
    post && (
      <div
        className="post-container fadein"
        role="link"
        tabIndex={0}
        onClick={() => {
          linkToPostDetailsComponent();
        }}
        onKeyDown={() => {
          linkToPostDetailsComponent();
        }}>
        <div className="post-left-wrapper">
          <input
            title={`Goto ${postOwner.username}'s profile`}
            type="image"
            className="post-usrpic"
            src={postOwner.userpic}
            alt="user avatar"
            tabIndex={0}
            onClick={linkToUserProfile}
            onKeyDown={linkToUserProfile}
          />
        </div>
        <div className="post-right-wrapper">
          <div className="post-userDetails">
            <div
              title={`Goto ${postOwner.username}'s profile`}
              className="post-author"
              role="link"
              tabIndex={0}
              onClick={linkToUserProfile}
              onKeyDown={linkToUserProfile}>
              @{postOwner.username}
            </div>

            <div className="post-userDetails-separator">∙</div>
            <div className="post-date">{convertDate(post.created.seconds)}</div>
          </div>
          <div className="post-content"> {parsePostText(post.content)}</div>
          {post.videoIDs && post.videoIDs.map((id) => <YoutubeEmbed key={id} embedId={id} />)}
          {post.image.imageURL !== null && (
            <div
              className="image-container"
              role="link"
              tabIndex={0}
              onClick={() => {
                setShowFullscreenImage(true);
              }}
              onKeyDown={() => {
                setShowFullscreenImage(true);
              }}>
              <img className="post-image" src={post.image.imageURL} alt="uploaded content" />
            </div>
          )}
          <div className="post-options">
            <PostOptionReply
              clickEffect={clickEffect}
              alreadyReplied={alreadyReplied}
              toggleReplyModal={toggleReplyModal}
              setClickEffect={setClickEffect}
              numOfReplies={post.replies.length}
            />
            <PostOptionRepost
              clickEffect={clickEffect}
              alreadyReposted={alreadyReposted}
              repost={repost}
              setClickEffect={setClickEffect}
              postOwnerUsername={postOwner.username}
              numOfReposts={post.reposts.length}
            />
            <PostOptionLike
              clickEffect={clickEffect}
              alreadyLiked={alreadyLiked}
              like={like}
              setClickEffect={setClickEffect}
              postID={postID}
              numOfLikes={post.likes.length}
            />
          </div>
        </div>
        {showReplyModal && (
          <Reply
            postID={postID}
            postOwner={postOwner}
            replyMode="modal"
            toggleReplyModal={toggleReplyModal}
            setReplyEffect={setReplyEffect}
          />
        )}
        {replyEffect && <OverlayEffect message={replyEffect} />}
        {showFullscreenImage && (
          <FullscreenImageOverlay
            image={post.image.imageURL}
            setShowFullscreenImage={setShowFullscreenImage}
            handleSetModalActive={handleSetModalActive}
          />
        )}
      </div>
    )
  );
}

export default PostItem;

PostItem.propTypes = {
  postID: PropTypes.string.isRequired,
  handleSetModalActive: PropTypes.func.isRequired
};
