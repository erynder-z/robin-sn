import './App.css';
import './components/shared-styles.css';
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './components/Firebase/Firebase';
import Login from './components/Login/Login';
import Main from './components/Main/Main';
import LoadingScreen from './components/LoadingScreen/LoadingScreen';

function App() {
  const [userCredentials] = useAuthState(auth);
  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setShowLoading(false), 2000);
  }, []);

  return (
    <div className="App">
      {showLoading ? (
        <LoadingScreen />
      ) : (
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
      )}
    </div>
  );
}

export default App;
