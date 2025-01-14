const express = require('express')
const { users } = require('../database.js');
const router = express.Router()
const bcrypt = require('bcrypt');

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

    // logging in as user
    console.log('User found:', userData);
    res.json({ message: `User ${username} found`, userData });
    
    
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: 'Error searching for user' });
  }
})

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

module.exports = router;