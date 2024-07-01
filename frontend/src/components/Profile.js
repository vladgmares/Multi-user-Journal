import React, { useState, useEffect } from 'react';
import axios from 'axios';
import JournalEntries from './JournalEntries';

const Profile = ({ username }) => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');

        const response = await axios.get('/api/user-data', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUserData(response.data.userData); // update userData from response
      } catch (error) {
        console.error('Error fetching user data:', error.response?.data || error.message);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    // clear token when logout 
    localStorage.removeItem('token');

    // refresh page => logout sim
    window.location.reload();
  };

  return (
    <div className='profile-container'>
      <div className='welcome-section'>
        <h2>Welcome, {username}!</h2>
      </div>
      <div className='logout-section'>
        <button className='signup-btn' onClick={handleLogout}>Logout</button>
      </div>
      <JournalEntries userId={userData ? Number(userData.id) : null} />
    </div>
  );
};

export default Profile;
