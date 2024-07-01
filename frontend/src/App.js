import React, { useState } from 'react';
import Login from './components/Login';
import Profile from './components/Profile';
import './App.css';


const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  const handleLogin = (user) => {
    setUsername(user); // set the username if login success
    setLoggedIn(true);
  };


  return (
    <div>
      {loggedIn ? (
        <Profile username={username} />
      ) : (
        <Login handleLogin={handleLogin} />
      )}
    </div>
  );
};

export default App;
