const express = require('express');
const { crateMarket, crates, users } = require('../database.js');
const authenticateToken = require('../middleware/auth');
const router = express.Router();

// GET all crate market listings
router.get('/', async (req, res) => {
  try {
    const allCratesOnMarket = await crateMarket.findAll({
      include: [
        { model: crates, as: 'crate' },  // Referencing the crate model via 'crate' alias
        { model: users, as: 'seller' },  // Referencing the user model via 'seller' alias
      ],
    });
    res.json(allCratesOnMarket);
  } catch (err) {
    res.status(500).send({ error: "Couldn't fetch crates from the market." });
  }
});

// GET specific crateMarket listing by crateMarketID
router.get('/market/:crateMarketID', async (req, res) => {
  try {
    const crateMarketItem = await crateMarket.findByPk(req.params.crateMarketID, {
      include: [
        { model: crates, as: 'crate' },
        { model: users, as: 'seller' },
      ],
    });

    if (!crateMarketItem) {
      return res.status(404).send({ error: "Crate not found in the market." });
    }
    res.json(crateMarketItem);
  } catch (err) {
    res.status(500).send({ error: "Couldn't fetch the crate from the market." });
  }
});


// GET all crates in the market with a specific crateAssetID
router.get('/market/type/:crateAssetID', async (req, res) => {
  try {
    const cratesOfType = await crateMarket.findAll({
      include: [
        {
          model: crates,
          as: 'crate', // Make sure you have 'crate' as the alias in your associations
          where: { crateAssetID: req.params.crateAssetID }, // Filter crates by crateAssetID
        },
        { model: users, as: 'seller' },
      ],
    });

    if (cratesOfType.length === 0) {
      return res.status(404).send({ error: "No crates of this type found in the market." });
    }

    res.json(cratesOfType);
  } catch (err) {
    res.status(500).send({ error: "Couldn't fetch crates of this type from the market." });
  }
});


// POST a new crate listing in the market
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { crateID, sellerID, price } = req.body;
    const newListing = await crateMarket.create({ crateID, sellerID, price });
    res.status(201).json(newListing);
  } catch (err) {
    res.status(400).send({ error: "Couldn't create crate market listing." });
  }
});

// DELETE a crate listing by id
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const crateListing = await crateMarket.findByPk(req.params.id);
    if (!crateListing) {
      return res.status(404).send({ error: "Crate market listing not found." });
    }
    await crateListing.destroy();
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Couldn't delete crate market listing." });
  }
});

module.exports = router;
