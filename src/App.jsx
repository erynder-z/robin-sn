import './App.css';
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './components/Firebase/Firebase';
import Login from './components/Login/Login';
import Main from './components/Main/Main';

function App() {
  const [userCredentials] = useAuthState(auth);

  return (
    <div className="App">
      <Routes>
        <Route
          path="/"
          element={
            !userCredentials ? <Navigate replace to="/login" /> : <Navigate replace to="/main" />
          }
        />
        <Route path="/login" element={<Login />} />
        <Route
          path="/main/*"
          element={
            !userCredentials ? (
              <Navigate replace to="/login" />
            ) : (
              <Main userCredentials={userCredentials} />
            )
          }
        />
      </Routes>
    </div>
  );
}

export default App;

/* Structure of the userData object:
usr: {
  userID: "string",
  isSetup: boolean,
  username: "string",
  description: "string",
  userPic: imagefile / blob,
  useremail: "string",
  joined: {seconds: number, nanseconds: number},
  followers: [{userID: "string"}],
  following: [{userID: "string"}],
  posts: [{postID: "string"}],
  replies: [{postID: "string"}],
  reposts: [{postID: "string"}],
  likes: [{postID: "string"}],
  bookmarks: [{postID: "string"}]
} */

/* Structure of the post object:
pst: {
  content: "string",
  created: {seconds: number, nanseconds: number},
  hasHashtag: boolean,
  hashtags: ["string"],
  likes: [{userID: "string"}],
  ownerID: "string",
  postID: "string",
  replies: [{replyContent: "string", replyDate: {seconds: number, nanoseconds: number}, replyID: "string", replyUserID: "string"}],
  reposts: [{userID: "string"}],
  imageURL: "string"
} */
