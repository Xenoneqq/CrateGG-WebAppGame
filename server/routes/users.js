const express = require('express')
const { users } = require('../database.js');
const router = express.Router()

router.post('/', async (req,res) => {
  const {username, password} = req.body;

  try {
    const user = await users.findOne({ where: { username } });

    if (user == null) {
      console.error("User not found");
      return res.status(400).json({ message: 'User not found' });
    }

    console.log('User found:', user);
    res.json({ message: `User ${username} found`, user });
    
    
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: 'Error searching for user' });
  }
})

module.exports = router;