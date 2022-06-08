import './App.css';
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './components/Firebase/Firebase';
import LoginScreen from './components/LoginScreen/LoginScreen';
import Start from './components/Start/Start';
import Home from './components/Home/Home';
import CreateUserAccount from './components/CreateUserAccount/CreateUserAccount';

function App() {
  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <Routes>
        <Route
          path="/start"
          element={!user ? <Navigate replace to="/" /> : <Start user={user} />}
        />
        <Route path="/" element={!user ? <LoginScreen /> : <Start user={user} />} />
        <Route path="/home" element={!user ? <Navigate replace to="/" /> : <Home />} />
        <Route
          path="/createaccount"
          element={!user ? <Navigate replace to="/" /> : <CreateUserAccount user={user} />}
        />
      </Routes>
    </div>
  );
}

export default App;
