import './App.css';
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { database, auth } from './components/Firebase/Firebase';
import LoginScreen from './components/LoginScreen/LoginScreen';
import Start from './components/Start/Start';
import Home from './components/Home/Home';
import CreateUserAccount from './components/CreateUserAccount/CreateUserAccount';

function App() {
  const [user] = useAuthState(auth);

  return (
    <div className="App">
      {user ? <Start user={user} /> : <LoginScreen />}{' '}
      <Routes>
        <Route path="/start" element={!user ? <Navigate replace to="/" /> : <Start />} />
        <Route path="/login" element={!user ? <Navigate replace to="/" /> : <LoginScreen />} />
        <Route path="/home" element={!user ? <Home replace to="/" /> : <Home />} />
        <Route
          path="/createaccount"
          element={!user ? <Home replace to="/" /> : <CreateUserAccount />}
        />
      </Routes>
    </div>
  );
}

export default App;
