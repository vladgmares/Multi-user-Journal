import React, { useState } from 'react';
import axios from 'axios';
import Login from './Login';

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [signupError, setSignupError] = useState('');
  const [showLogin, setShowLogin] = useState(false);

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/register', {
        username,
        password,
      });

      console.log('Sign Up successful:', response.data);
      setSignupError('');
      setShowLogin(true); //redirect to Login component if success
    } catch (error) {
        console.error('Sign Up failed:', error.response?.data || error.message);
        if (error.response?.data.error === 'Username already exists') {
          setSignupError('Username already exists!');
        } else {
          setSignupError('Could not sign up. Please try again.');
        }
      }
  };
  const handleBackToLogin = () => {
    setShowLogin(true);
  };

  if (showLogin) {
    return <Login />;
  }


  return (
    <div>
      {showLogin ? (
        <Login />
      ) : (
        <div className='login-container'>
          <h2>Sign Up</h2>
          {signupError && <p style={{ color: 'red' }}>{signupError}</p>}
          <form className='input-group' onSubmit={handleSignUp}>
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
            <button className='login-btn' type="submit">Sign Up</button>
          </form>
          <button className='signup-btn' onClick={handleBackToLogin}>Back to Login</button>
        </div>
      )}
    </div>
  );
  
};

export default SignUp;
