const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user');

const router = express.Router();

// Create a new user
router.post('/', async (req, res) => {
  const { username, password, name } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Both username and password must be provided' });
  }

  if (username.length < 3 || password.length < 3) {
    return res.status(400).json({ error: 'Username and password must be at least 3 characters long' });
  }

  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.status(400).json({ error: 'Username must be unique' });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = new User({
    username,
    passwordHash,
    name,
  });

  try {
    // Save the user to the database
    const savedUser = await user.save();

    // Send the response
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create user' });
  }
});


router.get('/', async (req, res) => {
    try {
      const users = await User.find({}).populate('blogs', 'title author url');
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  });  

module.exports = router;
