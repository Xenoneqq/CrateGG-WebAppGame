const express = require('express');
const { crateMarketHist, crates, users } = require('../database.js');
const authenticateToken = require('../middleware/auth');
const router = express.Router();

// GET all market transactions (history)
router.get('/', async (req, res) => {
  try {
    const allTransactions = await crateMarketHist.findAll({
      include: [
        { model: crates, as: 'crate' },
        { model: users, as: 'seller' },
        { model: users, as: 'buyer' },
      ],
    });
    res.json(allTransactions);
  } catch (err) {
    res.status(500).send({ error: "Couldn't fetch transaction history." });
  }
});

// GET specific crate transaction by crateMarketHistID
router.get('/hist/:crateMarketHistID', async (req, res) => {
  try {
    const transaction = await crateMarketHist.findByPk(req.params.crateMarketHistID, {
      include: [
        { model: crates, as: 'crate' },
        { model: users, as: 'seller' },
        { model: users, as: 'buyer' },
      ],
    });
    if (!transaction) {
      return res.status(404).send({ error: "Transaction not found in market history." });
    }
    res.json(transaction);
  } catch (err) {
    res.status(500).send({ error: "Couldn't fetch the transaction from market history." });
  }
});

// GET all market transactions for crates of a specific crateAssetID
router.get('/hist/type/:crateAssetID', async (req, res) => {
  try {
    const transactionsForType = await crateMarketHist.findAll({
      include: [
        { model: crates, as: 'crate', where: { crateAssetID: req.params.crateAssetID } },
        { model: users, as: 'seller' },
        { model: users, as: 'buyer' },
      ],
    });
    if (transactionsForType.length === 0) {
      return res.status(404).send({ error: "No transactions found for this type of crate." });
    }
    res.json(transactionsForType);
  } catch (err) {
    res.status(500).send({ error: "Couldn't fetch transactions for this type of crate." });
  }
});

// POST add a new transaction to the market history (a sale)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { crateID, sellerID, buyerID, price } = req.body;
    const newTransaction = await crateMarketHist.create({ crateID, sellerID, buyerID, price });
    res.status(201).json(newTransaction);
  } catch (err) {
    res.status(400).send({ error: "Couldn't record transaction." });
  }
});

module.exports = router;
