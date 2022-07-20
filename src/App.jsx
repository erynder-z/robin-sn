import './App.css';
import './components/shared-styles.css';
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './data/firebase';
import Login from './components/Login/Login';
import Main from './components/Main/Main';
import LoadingScreen from './components/Overlays/LoadingScreen/LoadingScreen';
import { UserProvider } from './contexts/UserContext';
import GoodbyeOverlay from './components/Overlays/GoodbyeOverlay/GoodbyeOverlay';

function App() {
  const [userCredentials, loading] = useAuthState(auth);
  const [showLoading, setShowLoading] = useState(true);
  const [showGoodbyeOverlay, setShowGoodbyleOverlay] = useState(false);

  // remove goodbye overlay
  useEffect(() => {
    if (showGoodbyeOverlay) {
      setTimeout(() => setShowGoodbyleOverlay(false), 2000);
    }
  }, [showGoodbyeOverlay]);

  useEffect(() => {
    if (loading === false) {
      setShowLoading(false);
    }
  }, [loading]);

  return (
    <div className="App">
      {showLoading ? (
        <LoadingScreen />
      ) : (
        <Routes>
          <Route
            path="/"
            element={
              !userCredentials ? (
                <Navigate replace to="/login" />
              ) : (
                <UserProvider>
                  <Navigate replace to="/main" />
                </UserProvider>
              )
            }
          />
          <Route path="/login" element={<Login />} />
          <Route
            path="/main/*"
            element={
              !userCredentials ? (
                <Navigate replace to="/login" />
              ) : (
                <UserProvider>
                  <Main
                    userCredentials={userCredentials}
                    setShowGoodbyleOverlay={setShowGoodbyleOverlay}
                  />
                </UserProvider>
              )
            }
          />
        </Routes>
      )}
      {showGoodbyeOverlay && <GoodbyeOverlay />}
    </div>
  );
}

export default App;
