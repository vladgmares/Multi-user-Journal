import React, { useState } from 'react';
import axios from 'axios';
import Profile from './Profile';
import SignUp from './SignUp';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [showSignUp, setShowSignUp] = useState(false); 

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/api/login', {
        username,
        password,
      });

      const { token } = response.data; // token from response

      // storing token in local storage
      localStorage.setItem('token', token);

      console.log('Login successful:', response.data);
      setLoggedIn(true);
      setLoginError('');
    } catch (error) {
      console.error('Login failed:', error.response?.data || error.message);
      setLoggedIn(false);
      setLoginError('Invalid username or password. Please try again.');
    }
  };

  const toggleSignUp = () => {
    setShowSignUp(!showSignUp);  // signup form visibility
  };

  return (
    <div>
      {loggedIn ? (
        <Profile username={username} />
      ) : (
        <div>
          {showSignUp ? (
            <SignUp />
          ) : (
            <div className='login-container'>
              <h2 className='title'>Welcome to JournalApp</h2>
              {loginError && <p style={{ color: 'red' }}>{loginError}</p>}
              <form className="input-group" onSubmit={handleLogin}>
                <input
                  className='input-field'
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <input
                  className='input-field'
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button className='login-btn' type="submit">Login</button>
              </form>
              <button className='signup-btn' onClick={toggleSignUp}>Sign Up</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Login;
