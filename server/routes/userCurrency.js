const express = require('express');
const { userCurrency, users } = require('../database.js');
const authenticateToken = require('../middleware/auth');
const router = express.Router();

// GET all users' currency balances
router.get('/', async (req, res) => {
  try {
    const allUsersCurrency = await userCurrency.findAll();
    res.json(allUsersCurrency);
  } catch (err) {
    res.status(500).send({ error: "Couldn't fetch users' currency balances." });
  }
});

// GET a specific user's currency balance by userID
router.get('/:userID', async (req, res) => {
  try {
    const userCurrencyData = await userCurrency.findOne({ where: { userID: req.params.userID } });
    if (!userCurrencyData) {
      return res.status(404).send({ error: "User currency not found." });
    }
    res.json(userCurrencyData);
  } catch (err) {
    res.status(500).send({ error: "Couldn't fetch user currency." });
  }
});

// PUT update a user's currency balance
router.put('/:userID', authenticateToken, async (req, res) => {
  try {
    const { currency } = req.body;
    const userCurrencyData = await userCurrency.findOne({ where: { userID: req.params.userID } });

    if (!userCurrencyData) {
      return res.status(404).send({ error: "User currency not found." });
    }

    userCurrencyData.currency = currency || userCurrencyData.currency;
    await userCurrencyData.save();
    res.json(userCurrencyData);
  } catch (err) {
    res.status(400).send({ error: "Couldn't update user currency." });
  }
});

// POST add a new user currency entry
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { userID, currency } = req.body;
    const newUserCurrency = await userCurrency.create({ userID, currency: currency || 250 });
    res.status(201).json(newUserCurrency);
  } catch (err) {
    res.status(400).send({ error: "Couldn't create user currency entry." });
  }
});

module.exports = router;
