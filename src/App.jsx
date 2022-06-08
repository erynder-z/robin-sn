import './App.css';
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './components/Firebase/Firebase';
import LoginScreen from './components/LoginScreen/LoginScreen';
import Main from './components/Main/Main';
import CreateUserAccount from './components/CreateUserAccount/CreateUserAccount';
import Home from './components/Home/Home';

function App() {
  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <Routes>
        <Route path="/main" element={!user ? <Navigate replace to="/" /> : <Main user={user} />} />
        <Route path="/" element={!user ? <LoginScreen /> : <Main user={user} />} />
        <Route path="/home" element={!user ? <Navigate replace to="/" /> : <Home user={user} />} />
        <Route
          path="/createaccount"
          element={!user ? <Navigate replace to="/" /> : <CreateUserAccount user={user} />}
        />
      </Routes>
    </div>
  );
}

export default App;
