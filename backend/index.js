const express = require('express');
const { User, sequelize, Entry } = require('../database/db'); 
const cors = require('cors');
const app = express();
const port = 3001;
const bcrypt = require('bcrypt');
const saltRounds = 10;

const jwt = require('jsonwebtoken');

app.use(express.json());
app.use(cors({origin: 'http://localhost:3000'}));


app.get('/', (req, res) => {
  res.send('Welcome to the journal app backend!');
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


// Register
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    const existingUser = await User.findOne({ where: { username } });

    if (existingUser) {
      return res.status(409).json({ error: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await User.create({
      username,
      password: hashedPassword,
    });

    res.status(201).json({ message: 'User registered successfully', newUser });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Could not register user' });
  }
});


// Login 
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ where: { username } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    //generate jwt token
    const token = jwt.sign({ userId: user.id }, 'your-secret-key', { expiresIn: '1h' });

    res.status(200).json({ message: 'Login successful', token });

  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Could not log in' });
  }
});


// middleware to verify token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  console.log("Header:" + authHeader); 

  const token = authHeader && authHeader.split(' ')[1];
  console.log("Token in middleware:" + token); 

  if (!token) {
    console.log("Token in if:" + token);
    return res.sendStatus(401); // no token -> unauth
  }

  jwt.verify(token, 'your-secret-key', (err, user) => {
    if (err) {
      console.log("Error verifying token:", err);
      return res.sendStatus(403); // if token invalid
    }
    req.user = user; // attach user data to req obj
    next();
  });
}


// Endpoint pt fetch data
app.get('/api/user-data', authenticateToken, async (req, res) => {
  try {
    // userId from authenticated request
    const userId = req.user.userId;

    // fetch from db with userId
    const userData = await User.findByPk(userId); 

    if (!userData) {
      return res.status(404).json({ error: 'User data not found' });
    }

    res.status(200).json({ userData });
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ error: 'Could not fetch user data' });
  }
});

// ---- Journal Entries ----
// fetch entries
app.get('/api/user/:userId/entries', authenticateToken, async (req, res) => {
  try {
    const userId = Number(req.params.userId);

    // fetch din db
    const userEntries = await Entry.findAll({
      where: { UserId: userId },
    });

    if (!userEntries || userEntries.length === 0) {
      return res.status(404).json({ error: 'User entries not found' });
    }

    res.status(200).json({ entries: userEntries });
  } catch (error) {
    console.error('Error fetching user entries:', error);
    res.status(500).json({ error: 'Could not fetch user entries' });
  }
});


// -------- CRUD Ops ----------

app.post('/api/user/:userId/entries', authenticateToken, async (req, res) => {
  try {
    const { title, description, date } = req.body;
    const userId = Number(req.params.userId);

    console.log("User stuff "+ userId+ ", "+ req.user.userId);
    console.log("Tip date:" + typeof(userId) + ", " + typeof(req.user.userId));
    // authenticated userId === sent userId from req
    if (req.user.userId !== userId) {
      console.log("intrat aici");
      return res.status(403).json({ error: 'Unauthorized access' });
    }

    // create new entry for userId
    const newEntry = await Entry.create({ title, description, date, UserId: userId });

    res.status(201).json({ message: 'Entry added successfully', newEntry });
  } catch (error) {
    console.error('Error adding entry:', error);
    res.status(500).json({ error: 'Could not add entry' });
  }
});

// -- Delete entries ---
app.delete('/api/user/:userId/entries/:entryId', authenticateToken, async (req, res) => {
  try {
    const { userId, entryId } = req.params;

    // check auth userId === from req
    if (req.user.userId !== Number(userId)) {
      return res.status(403).json({ error: 'Unauthorized access' });
    }
    
    // find entry by id
    const entry = await Entry.findOne({
      where: {
        id: entryId,
        UserId: userId,
      },
    });

    if (!entry) {
      return res.status(404).json({ error: 'Entry not found' });
    }

    // actual removal
    await entry.destroy();

    res.status(200).json({ message: 'Entry deleted successfully' });
  } catch (error) {
    console.error('Error deleting entry:', error);
    res.status(500).json({ error: 'Could not delete entry' });
  }
});


// update an entry for a user
app.put('/api/user/:userId/entries/:entryId', authenticateToken, async (req, res) => {
  try {
    const { userId, entryId } = req.params;
    const { title, description } = req.body;

    // check req vs userId
    if (req.user.userId !== Number(userId)) {
      return res.status(403).json({ error: 'Unauthorized access' });
    }

    const entryToUpdate = await Entry.findOne({
      where: {
        id: entryId,
        UserId: Number(userId),
      },
    });

    if (!entryToUpdate) {
      return res.status(404).json({ error: 'Entry not found' });
    }

    // actual Update
    entryToUpdate.title = title;
    entryToUpdate.description = description;
    await entryToUpdate.save();

    res.status(200).json({ message: 'Entry updated successfully', updatedEntry: entryToUpdate });
  } catch (error) {
    console.error('Error updating entry:', error);
    res.status(500).json({ error: 'Could not update entry' });
  }
});
