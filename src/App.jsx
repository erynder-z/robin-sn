import './App.css';
import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { database, auth } from './components/Firebase/Firebase';
import LoginScreen from './components/LoginScreen/LoginScreen';
import Start from './components/Start/Start';

function App() {
  const [user] = useAuthState(auth);

  return <div className="App">{user ? <Start /> : <LoginScreen />}</div>;
}

export default App;
