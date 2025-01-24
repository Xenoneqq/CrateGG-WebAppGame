const express = require('express');
const { crateMarket, crateMarketHist, crates, users , sequelize, userCurrency } = require('../database.js');
const authenticateToken = require('../middleware/auth');
const router = express.Router();
const { Sequelize, Op  } = require('sequelize');
const authenticateTokenAndAdmin = require('../middleware/adminauth.js');

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

// GET with sorting options
router.get('/search', async (req, res) => {
  const { name, rarity, orderby, direction = 'DESC' } = req.query;

  console.log('Search name:', name);
  console.log('Order by:', orderby);
  console.log('Sort direction:', direction);

  try {
    const whereConditions = {};

    if (name) {
      whereConditions['$crate.name$'] = {
        [Op.like]: `%${name}%`,
      };
    }
    
    if (rarity) {
      whereConditions['$crate.rarity$'] = parseInt(rarity, 10); // Konwersja na liczbę
    }
    
    const order = [];
    
    if (orderby) {
      if (orderby === 'price' || orderby === 'rarity' || orderby === 'createdAt') {
        const directionValid = direction.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
        // Jeżeli sortowanie po rzadkości, używaj crate.rarity
        if (orderby === 'rarity') {
          order.push([Sequelize.col('crate.rarity'), directionValid]);
        } else {
          order.push([orderby, directionValid]);
        }
      } else {
        return res.status(400).send({ error: 'Invalid orderby parameter.' });
      }
    }
    

    const cratesResult = await crateMarket.findAll({
      where: whereConditions,
      order,
      include: [
        {
          model: users,
          attributes: ['id', 'username', 'email'],
        },
        {
          model: crates,
        },
      ],
    });

    res.json(cratesResult);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'Failed to search crates.' });
  }
});




// POST a new crate listing in the market
router.post('/', authenticateTokenAndAdmin, async (req, res) => {
  try {
    const { crateID, sellerID, price } = req.body;
    const newListing = await crateMarket.create({ crateID, sellerID, price });
    res.status(201).json(newListing);
  } catch (err) {
    res.status(400).send({ error: "Couldn't create crate market listing." });
  }
});

// DELETE a crate listing by id
router.delete('/:id', authenticateTokenAndAdmin, async (req, res) => {
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
      const sellerID = marketEntry.sellerID; // Pobierz ID sprzedawcy

      // Sprawdzenie, czy użytkownik próbuje kupić swoją własną skrzynkę
      if (sellerID == userID) {
        throw new Error("You cannot buy your own crate.");
      }

      // Pobranie waluty kupującego
      const userBalance = await userCurrency.findOne({ where: { userID }, transaction });

      if (!userBalance || userBalance.currency < cratePrice) {
        throw new Error('Not enough currency to buy the crate.');
      }

      // Pobranie waluty sprzedającego
      const sellerBalance = await userCurrency.findOne({ where: { userID: sellerID }, transaction });

      if (!sellerBalance) {
        throw new Error('Seller does not have a currency account.');
      }

      // Aktualizacja waluty kupującego
      userBalance.currency = parseInt(userBalance.currency) - parseInt(cratePrice);
      await userBalance.save({ transaction });

      console.log('seller balance : ' , sellerBalance)
      console.log(cratePrice);

      // Aktualizacja waluty sprzedającego
      sellerBalance.currency = parseInt(sellerBalance.currency) + parseInt(cratePrice);
      await sellerBalance.save({ transaction });

      console.log('seller balance after : ' , sellerBalance)

      // Przypisanie skrzynki do kupującego
      const crate = marketEntry.crate;
      crate.ownerID = userID;
      crate.updatedAt = new Date();
      await crate.save({ transaction });

      // Usunięcie wpisu z marketu
      await marketEntry.destroy({ transaction });

      // Zapisanie historii transakcji
      await crateMarketHist.create(
        {
          crateID: crate.id,
          sellerID,
          buyerID: userID,
          price: cratePrice,
        },
        { transaction }
      );

      // Zatwierdzenie transakcji
      await transaction.commit();

      res.json({
        message: 'Crate purchased successfully.',
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


// POST Setting up a sell order
router.post('/sell', authenticateToken , async (req, res) => {
  const { crateID, userID, price } = req.body;

  // 1. Checking the variables
  if (!crateID || !userID || typeof price !== 'number' || price <= 0) {
    console.log(crateID, userID, price)
    return res.status(400).send({ error: 'Invalid input. Crate ID, User ID, and valid price are required.' });
  }

  try {
    // 2. Check if not allready on server
    const existingMarketEntry = await crateMarket.findOne({ where: { crateID } });
    if (existingMarketEntry) {
      return res.status(400).send({ error: 'This crate is already listed on the market.' });
    }

    // 3. Check if in possesion
    const userCrate = await crates.findOne({ where: { id: crateID, ownerID: userID } });
    if (!userCrate) {
      return res.status(403).send({ error: 'You do not own this crate or it does not exist.' });
    }

    // 4. Put it out onto market
    const newMarketEntry = await crateMarket.create({
      crateID,
      sellerID: userID,
      price,
      createdAt: new Date(),
    });

    res.status(201).send({
      message: 'Crate successfully listed on the market.',
      marketEntry: newMarketEntry,
    });
  } catch (err) {
    console.error('Error listing crate on the market:', err);
    res.status(500).send({ error: 'Failed to list crate on the market. Please try again later.' });
  }
});

router.delete('/removeFromMarket/:crateID', authenticateToken, async (req, res) => {
  const { crateID } = req.params;
  const userID = req.user.id;
  if (!crateID || !userID) {
    console.log(crateID, userID);
    return res.status(400).send({ error: "crateID and userID are required." });
  }

  try {
    // 1. Check for crate on market
    const crateMarketEntry = await crateMarket.findOne({
      where: { crateID: crateID },
    });

    if (!crateMarketEntry) {
      return res.status(404).send({ error: "Crate is not listed on the market." });
    }

    // 2. Check if user has crate
    if (crateMarketEntry.sellerID !== userID && req.user.role !== 'admin'){
      return res.status(403).send({ error: "You do not own this crate." });
    }

    // 3. Remove crate from market
    await crateMarket.destroy({
      where: { crateID: crateID },
    });

    res.status(200).send({ message: "Crate removed from market successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Couldn't remove crate from the market." });
  }
});






module.exports = router;
