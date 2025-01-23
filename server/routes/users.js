const express = require('express')
const { users } = require('../database.js');
const router = express.Router()
const bcrypt = require('bcrypt');
const authenticateToken = require('../middleware/auth.js');

// jwt setup
const jwt = require('jsonwebtoken');
const JWT_SECRET = "abcddd443";

router.post('/login', async (req,res) => {
  const {username, password} = req.body;

  try {
    const user = await users.findOne({ where: { username:username } });
    const userbymail = await users.findOne({ where: { email:username }})
    
    // checking for user existance in database
    if (user == null && userbymail == null) {
      console.error("Wrong username or password");
      return res.status(400).json({ message: 'Wrong username or password' });
    }

    let userData;
    if(user != null) userData = user;
    else userData = userbymail;

    // checking password
    const isPasswordValid = await bcrypt.compare(password, userData.password);
    if (!isPasswordValid) {
      console.error("Wrong username or password");
      return res.status(400).json({ message: 'Wrong username or password' });
    }

    const getRole = () => {
      if(userData.isAdmin) return 'admin'
      else return 'player'
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: userData.id,
        role: getRole(),
        username: userData.username,
      },
      JWT_SECRET,
      { expiresIn: '6h' }
    );
    
    const userPublicData = {
      id:userData.id,
      username:userData.username,
      email:userData.email,
      role:getRole(),
    }

    // logging in as user
    console.log('User found:', userData);
    res.json({ message: `User ${username} found`, userData:userPublicData, jwt:`${token}` });
    
    
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: 'Error searching for user' });
  }
})

// GET Checking the user
router.get('/verifyUser', authenticateToken, async (req, res) => {
  try {
    const userID = req.user.id;

    if(userID === undefined){
      return res.status(404).json({error: "User not logged in."});
    }

    const user = await users.findOne({ where: { id: userID } });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    res.json({
      message: "User verified successfully.",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Error verifying user:", err);
    res.status(500).json({ error: "Failed to verify user." });
  }
});

router.post('/register', async (req,res) => {
  const {email, username, password} = req.body;
  
  // checking the password
  if(password.length <= 6){
    console.error("Password too short! At least 6 characters")
    return res.status(400).json({message: 'Selected password too short!'})
  }

  if(email == "" || password == "" || username == ""){
    console.error("All input fields must be filled!");
    return res.status(400).json({message:'All data input fields must be filled'});
  }
  
  // checking for existing users
  try{
    const user = await users.findOne({where: {email}});
    if(user != null){
      console.error("There is a account made on this mail");
      return res.status(400).json({message: 'Mail taken (account exists)'})
    }
  } catch (error){
    console.error('Error:', error);
    return res.status(500).json({message: 'Error searching for existing users'})
  }

  try{
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await users.create({ email, username, password:hashedPassword });
  return res.status(201).json({ id: newUser.id, email: newUser.email });
  } catch (error) {
    console.error("Error creating user");
    return res.status(500).json({message: 'Error creating user'})
  }
})

router.get('/', async (req, res) => {
  try {
    const allUsers = await users.findAll(); // Get all users
    res.status(200).json(allUsers);
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ message: 'Error fetching users' });
  }
});

// Get specific user by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const user = await users.findOne({ where: { id } }); // Find user by ID
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    return res.status(500).json({ message: 'Error fetching user by ID' });
  }
});

// Update user data (PUT)
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { email, username, password } = req.body;

  try {
    const user = await users.findOne({ where: { id } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // If password is provided, hash it
    let hashedPassword;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    // Update user fields
    await user.update({
      email: email || user.email, // Use the existing email if not provided
      username: username || user.username, // Use the existing username if not provided
      password: hashedPassword || user.password, // Use the existing password if not provided
    });

    res.status(200).json({ message: 'User updated successfully', user });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({ message: 'Error updating user' });
  }
});

// Delete user (DELETE)
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const user = await users.findOne({ where: { id } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.destroy(); // Delete the user
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({ message: 'Error deleting user' });
  }
});


const secretPassword = "dwasomm312kfmsah821omrfas09q32jrim2jrnoakf039qr3jqrkwnfriq3"
// PUT: Update user to admin if password is correct
router.put('/make-admin/:id', async (req, res) => {
  const { id } = req.params;
  const { password } = req.body

  // Check if the provided password is correct
  if (password !== secretPassword) {
    return res.status(403).json({ error: 'Forbidden: Incorrect password' });
  }

  try {
    const user = await users.findOne({ where: { id } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.isAdmin = true;
    await user.save();

    res.json({ message: `User with ID ${id} is now an admin.` });
  } catch (err) {
    console.error('Error making user admin:', err);
    res.status(500).json({ error: 'Failed to update user' });
  }
});


module.exports = router;