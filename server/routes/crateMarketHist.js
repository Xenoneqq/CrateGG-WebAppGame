const express = require('express');
const { crateMarketHist, crates, users } = require('../database.js');
const { Sequelize, Op  } = require('sequelize');
const authenticateToken = require('../middleware/auth');
const authenticateTokenAdmin = require('../middleware/adminauth.js');
const router = express.Router();

// GET all market transactions (history)
router.get('/', async (req, res) => {
  try {
    const allTransactions = await crateMarketHist.findAll();
    res.json(allTransactions);
  } catch (err) {
    res.status(500).send({ error: "Couldn't fetch transaction history." });
  }
});

// GET specific crate transaction by crateMarketHistID
router.get('/id/:crateMarketHistID', async (req, res) => {
  try {
    const transaction = await crateMarketHist.findByPk(req.params.crateMarketHistID);
    if (!transaction) {
      return res.status(404).send({ error: "Transaction not found in market history." });
    }
    res.json(transaction);
  } catch (err) {
    res.status(500).send({ error: "Couldn't fetch the transaction from market history." });
  }
});

// GET all market transactions for crates of a specific crateAssetID
router.get('/crate/:crateAssetID', async (req, res) => {
  try {
    const transactionsForType = await crateMarketHist.findAll();
    if (transactionsForType.length === 0) {
      return res.status(404).send({ error: "No transactions found for this type of crate." });
    }
    res.json(transactionsForType);
  } catch (err) {
    res.status(500).send({ error: "Couldn't fetch transactions for this type of crate." });
  }
});

// POST add a new transaction to the market history (a sale)
router.post('/', authenticateTokenAdmin, async (req, res) => {
  try {
    const { crateID, sellerID, buyerID, price } = req.body;
    const newTransaction = await crateMarketHist.create({ crateID, sellerID, buyerID, price });
    res.status(201).json(newTransaction);
  } catch (err) {
    res.status(400).send({ error: "Couldn't record transaction." });
  }
});

// GET trade history of user
router.get('/history', authenticateToken, async (req, res) => {
  const user = req.user;
  try {
    // Fetch trade history
    const history = await crateMarketHist.findAll({
      where: {
        [Op.or]: [{ buyerID: user.id }, { sellerID: user.id }],
      },
      include: [
        {
          model: users,
          as: 'buyer',
          attributes: ['id', 'username'],
        },
        {
          model: users,
          as: 'seller', 
          attributes: ['id', 'username'],
        },
        {
          model: crates,
          as: 'crate',
        },
      ],
      order: [['createdAt', 'DESC']],
    });
    

    const result = history.map((entry) => {
      const isUserSeller = entry.sellerID === user.id;
      return {
        id: entry.id,
        crate: entry.crate,
        price: entry.price,
        createdAt: entry.createdAt,
        buyerID: entry.buyerID,
        sellerID: entry.sellerID,
        user: isUserSeller
          ? entry.seller 
          : entry.buyer,
        other: isUserSeller
          ? entry.buyer 
          : entry.seller,
      };
    });

    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching market history:', error);
    res.status(500).json({ error: 'Failed to fetch market history.' });
  }
});


module.exports = router;
