import './App.css';
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './components/Firebase/Firebase';
import Login from './components/Login/Login';
import Main from './components/Main/Main';
import CreateUserAccount from './components/CreateUserAccount/CreateUserAccount';
import Home from './components/Home/Home';

function App() {
  const [userCredentials] = useAuthState(auth);

  /*   const logout = async () => {
    await signOut(auth);
  }; */

  return (
    <div className="App">
      <Routes>
        <Route
          path="/main"
          element={
            !userCredentials ? (
              <Navigate replace to="/" />
            ) : (
              <Main userCredentials={userCredentials} />
            )
          }
        />
        <Route
          path="/"
          element={!userCredentials ? <Login /> : <Main userCredentials={userCredentials} />}
        />
        <Route
          path="/home"
          element={
            !userCredentials ? (
              <Navigate replace to="/" />
            ) : (
              <Home userCredentials={userCredentials} />
            )
          }
        />
        <Route
          path="/createaccount"
          element={
            !userCredentials ? (
              <Navigate replace to="/" />
            ) : (
              <CreateUserAccount userCredentials={userCredentials} />
            )
          }
        />
      </Routes>
    </div>
  );
}

export default App;
