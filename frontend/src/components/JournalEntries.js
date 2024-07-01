import React, { useState, useEffect } from 'react';
import axios from 'axios';

const JournalEntries = ({ userId }) => {
  const token = localStorage.getItem('token');
  const [entries, setEntries] = useState([]);
  const [newEntry, setNewEntry] = useState({
    title: '',
    description: '',
  });

  const [editEntryId, setEditEntryId] = useState(null);
  const [updatedEntry, setUpdatedEntry] = useState({
    id: null,
    title: '',
    description: '',
  });

  const updateEntry = async (entryId, translate = false) => {
    try {
      let entryToUpdate = updatedEntry;
  
      if (translate) {
        // Translate the description if 'translate' flag is set to true
        const apiKey = 'AIzaSyC0pxNDgmVDfVOzJcMOdwQyIYzEu5a9KSU';
        const response = await axios.post(
          `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
          {
            q: updatedEntry.description,
            source: 'ro', // source lang
            target: 'en', // target lang
            format: 'text',
          }
        );
  
        const translatedText = response.data.data.translations[0].translatedText;
        entryToUpdate = { ...updatedEntry, description: translatedText };
      }
  
      const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      const entryWithDate = { ...entryToUpdate, date: currentDate }; 
      await axios.put(`/api/user/${userId}/entries/${entryId}`, entryWithDate, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      fetchEntries(); // update entries
      setEditEntryId(null); // close form after update
    } catch (error) {
      console.error('Error updating entry:', error.response?.data || error.message);
    }
  };
  

  // Cancel functionality
  const cancelEdit = () => {
    setEditEntryId(null);
    setUpdatedEntry({ id: null, title: '', description: '' });
  };

  // entries for every user
  const fetchEntries = async () => {
    try {
      const response = await axios.get(`/api/user/${userId}/entries`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.status === 200) {
        if (response.data.entries && response.data.entries.length > 0) {
          setEntries(response.data.entries);
        } else {
          setEntries([]); // if not found
        }
      } else {
        console.error('Failed to fetch entries:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching entries:', error.response?.data || error.message);
    }
  };
  


  const addEntry = async (e) => {
    e.preventDefault();
    try {
        //const token = localStorage.getItem('token');
        const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
        const entryWithDate = { ...newEntry, date: currentDate }; 
        console.log(token);
        console.log(currentDate);
        console.log(entryWithDate);
        await axios.post(`/api/user/${userId}/entries`, entryWithDate, {
            headers: {
            Authorization: `Bearer ${token}`
            }
        });
      
      fetchEntries();
  
      // clear form
      setNewEntry({ title: '', description: '' });
    } catch (error) {
      console.error('Error adding entry:', error.response?.data || error.message);
    }
  };


  const deleteEntry = async (entryId) => {
    try {
      await axios.delete(`/api/user/${userId}/entries/${entryId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      // update list 
      const updatedEntries = entries.filter((entry) => entry.id !== entryId);
      setEntries(updatedEntries);
    } catch (error) {
      console.error('Error deleting entry:', error.response?.data || error.message);
    }
  };

  
  

 useEffect(() => {
    if (userId) {
      fetchEntries();
    }
    // eslint-disable-next-line
  }, [userId]);



  return (
    <div className="journal-entries-container">
      <h2>Your Journal Entries</h2>
  
      {entries.length === 0 ? (
        <div>
          <p>No journal entries yet</p>
        </div>
      ) : (
        <div className='journal-container'>
          {/* Entries */}
          <div className="entries-list">
            {entries.map((entry) => (
              <div key={entry.id} className="entry-item">
                {editEntryId === entry.id ? (
                  // edit one entry
                  <form
                    className='edit-entry-form'
                    onSubmit={(e) => {
                      e.preventDefault();
                      updateEntry(entry.id, false);
                    }}
                  >
                    <input
                      type="text"
                      value={updatedEntry.title}
                      onChange={(e) => setUpdatedEntry({ ...updatedEntry, title: e.target.value })}
                      className="edit-input"
                    />
                    <textarea
                      value={updatedEntry.description}
                      onChange={(e) => setUpdatedEntry({ ...updatedEntry, description: e.target.value })}
                      className="edit-textarea"
                    ></textarea>
                    <div className="edit-buttons">
                      <button className='signup-btn' type="submit">Update</button>
                      <button className='signup-btn' onClick={() => updateEntry(entry.id, true)}>Translate Description</button> 
                      <button className='signup-btn' onClick={cancelEdit}>Cancel</button>

                    </div>
                  </form>
                ) : (
                  // Display with buttons
                  <div className="entry-container">
                    <div className="entry-content">
                      <h3>{entry.title}</h3>
                      <p>{entry.description}</p>
                    </div>
                    <div className="entry-buttons">
                      <button className='signup-btn' onClick={() => {
                        setEditEntryId(entry.id);
                        setUpdatedEntry({ id: entry.id, title: entry.title, description: entry.description });
                      }}>Edit</button>
                      <button className='signup-btn' onClick={() => deleteEntry(entry.id)}>Delete</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
  
      {/* Adding new entries */}
      <form onSubmit={addEntry} className="new-entry-form">
        <input
          type="text"
          placeholder="Title"
          value={newEntry.title}
          onChange={(e) => setNewEntry((prevEntry) => ({ ...prevEntry, title: e.target.value }))}
        />
        <textarea
          placeholder="Description"
          value={newEntry.description}
          onChange={(e) => setNewEntry((prevEntry) => ({ ...prevEntry, description: e.target.value }))}
        ></textarea>
        <button className='login-btn' type="submit">Add Entry</button>
      </form>
    </div>
  );
  
  
  
   
};

export default JournalEntries;
