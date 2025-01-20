const express = require('express');
const { crateMarket, crateMarketHist, crates, users , sequelize, userCurrency } = require('../database.js');
const authenticateToken = require('../middleware/auth');
const router = express.Router();

// GET all crate market listings
router.get('/', async (req, res) => {
  try {
    const allCratesOnMarket = await crateMarket.findAll();
    res.json(allCratesOnMarket);
  } catch (err) {
    res.status(500).send({ error: "Couldn't fetch crates from the market." });
  }
});

// GET specific crateMarket listing by crateMarketID
router.get('/id/:crateMarketID', async (req, res) => {
  try {
    console.log(req.body);
    const crateMarketItem = await crateMarket.findByPk(req.params.crateMarketID, {
      include: [
        { model: crates },
        { model: users },
      ],
    });
    
    if (!crateMarketItem) {
      return res.status(404).send({ error: "Crate Market listing not found." });
    }

    res.json(crateMarketItem);
  } catch (err) {
    res.status(500).send({ error: "Couldn't fetch the crate market listing." });
  }
});


// GET all crates in the market with a specific crateAssetID
router.get('/type/:crateAssetID', async (req, res) => {
  try {
    const cratesOfType = await crateMarket.findAll({
      include: [
        {
          model: crates,
          where: { crateAssetID: req.params.crateAssetID }, // Filter crates by crateAssetID
        },
        { model: users },  // No 'as' here, refer to users model directly
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

// OTHER SPECIFIC QUERRIES

router.get('/alldata', async (req, res) => {
  try {
    const marketData = await crateMarket.findAll({
      include: [
        { model: crates },
        { model: users },
      ],
    });
    res.json(marketData);
  } catch (err) {
    res.status(500).send({ error: "Couldn't fetch market data." });
  }
});

// Purchasing the crate

router.post('/buy', authenticateToken, async (req, res) => {
  const { userID, marketID } = req.body;
  console.log(req.body);

  if (!userID || !marketID) {
    return res.status(400).json({ error: 'Missing userID or marketID.' });
  }

  try {
    // Rozpoczęcie transakcji
    const transaction = await sequelize.transaction();

    try {
      // Pobranie danych skrzynki z marketu
      const marketEntry = await crateMarket.findOne({
        where: { id: marketID },
        include: [{ model: crates }, { model: users }],
        transaction,
      });

      if (!marketEntry) {
        throw new Error('Market entry not found.');
      }

      const cratePrice = marketEntry.price;

      // Pobranie waluty gracza
      const userBalance = await userCurrency.findOne({ where: { userID }, transaction });

      if (!userBalance || userBalance.currency < cratePrice) {
        throw new Error('Not enough currency to buy the crate.');
      }

      // Aktualizacja waluty kupującego
      userBalance.currency -= cratePrice;
      await userBalance.save({ transaction });

      // Przypisanie skrzynki do kupującego
      const crate = marketEntry.crate;
      crate.ownerID = userID;
      await crate.save({ transaction });

      // Usunięcie wpisu z marketu
      await marketEntry.destroy({ transaction });

      // Zapisanie historii transakcji
      await crateMarketHist.create(
        {
          crateID: crate.id,
          sellerID: marketEntry.sellerID,
          buyerID: userID,
          price: cratePrice,
        },
        { transaction }
      );

      // Zatwierdzenie transakcji
      await transaction.commit();

      res.json({ message: 'Crate purchased successfully.',
        currency: userBalance.currency,
       });
    } catch (err) {
      // Cofnięcie transakcji w przypadku błędu
      await transaction.rollback();
      res.status(500).json({ error: err.message });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to process the transaction.' });
  }
});



module.exports = router;
