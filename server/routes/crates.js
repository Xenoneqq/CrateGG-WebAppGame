const express = require('express')
const { crates, users, crateMarket, sequelize } = require('../database.js');
const { Sequelize, Op  } = require('sequelize');
const authenticateToken = require('../middleware/auth');
const router = express.Router()
const OpenCrate = require('../logic/crateOpener.js');
const JWT_SECRET = require('../secrets.js');


// GET all crates from database
router.get('/', async (req, res) => {
  try{
    const allCrates = await crates.findAll();
    res.json(allCrates);
  } catch (err) {
    res.status(500).send({ error: "Couldn't fetch all crates from database."});
  }
})

// GET specific crate by crateID
router.get('/id/:crateID', async (req, res) => {
  try {
    const crate = await crates.findByPk(req.params.crateID);

    if (!crate) {
      return res.status(404).send({ error: "Crate not found." });
    }
    res.json(crate);
  } catch (err) {
    res.status(500).send({ error: "Couldn't fetch the crate." });
  }
});



// GET all crates owned by a user with userID
router.get('/user/:userID', async (req, res) => {
  const { userID } = req.params;

  if (!userID) {
    return res.status(400).send({ error: "UserID is required." });
  }

  try {
    const userCrates = await crates.findAll({
      where: { ownerID: userID },
      include: [
        { model: users, attributes: ['id', 'username'] }
      ]
    });

    if (userCrates.length === 0) {
      return res.status(404).send({ error: "No crates found for this user." });
    }

    res.json(userCrates);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Couldn't fetch user crates." });
  }
});

// GET all crates owned by a user with userID including market info
router.get('/userandmarket/:userID', async (req, res) => {
  const { userID } = req.params;
  console.log("fetched from crates")
  if (!userID) {
    return res.status(400).send({ error: "UserID is required." });
  }

  try {
    const userCrates = await crates.findAll({
      where: { ownerID: userID },
      include: [
        { 
          model: users, 
          attributes: ['id', 'username'],
        },
        { 
          model: crateMarket,
          attributes: ['id', 'price', 'createdAt'],
          required: false,
        },
      ],
    });

    if (userCrates.length === 0) {
      return res.status(404).send({ error: "No crates found for this user." });
    }

    res.json(userCrates);
  } catch (err) {
    console.error(err);  // Możesz dodać logowanie błędów dla lepszego śledzenia
    res.status(500).send({ error: "Couldn't fetch user crates." });
  }
});




// POST a new crate to the database
router.post('/', authenticateToken, async (req, res) => {
  try {
    console.log("Request Body:", req.body);
    const { crateAssetID, patternIndex, ownerID, name, rarity } = req.body;
    console.log(crateAssetID, name, rarity, patternIndex, ownerID)
    if (crateAssetID === undefined || patternIndex === undefined || ownerID === undefined || rarity === undefined || name === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    

    const newCrate = await crates.create({ crateAssetID, name, rarity, patternIndex, ownerID });
    res.status(201).json(newCrate);
  } catch (err) {
    console.error(err);
    res.status(400).send({ error: "Couldn't create a crate." });
  }
});


// PUT new data into an existing crate
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { crateAssetID, name, rarity, patternIndex, ownerID} = req.body;
    const crate = await crates.findByPk(req.params.id);

    if (!crate) {
      return res.status(404).send({ error: "Crate not found." });
    }

    crate.crateAssetID = crateAssetID || crate.crateAssetID;
    crate.patternIndex = patternIndex || crate.patternIndex;
    crate.ownerID = ownerID || crate.ownerID;
    crate.name = name || crate.name;
    crate.rarity = rarity || crate.rarity;

    await crate.save();
    res.json(crate);
  } catch (err) {
    console.error(err);
    res.status(400).send({ error: "Couldn't update the crate." });
  }
});

// DELETE a crate
router.delete('/:id', authenticateToken , async (req, res) => {
  try {
    const crate = await crates.findByPk(req.params.id);
    if (!crate) {
      return res.status(404).send({ error: "Crate not found." });
    }

    await crate.destroy();
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Couldn't delete the crate" });
  }
});

// POST Opening a crate
router.post('/openCrate', authenticateToken, async (req, res) => {
  const { crateID } = req.body;
  const userID = req.user.id;

  const transaction = await sequelize.transaction();

  try {
    // 1. Check for crate
    const userCrate = await crates.findOne({
      where: { id: crateID, ownerID: userID },
      transaction,
    });

    if (!userCrate) {
      await transaction.rollback();
      return res.status(404).json({ error: "Crate not found or not owned by user." });
    }

    // 2. Remove crate from market
    await crateMarket.destroy({
      where: { crateID },
      transaction,
    });

    // 3. Set ownerID to null
    await userCrate.update({ ownerID: null }, { transaction });

    // 4. Get crate drops
    let newCrates = OpenCrate(userCrate.crateAssetID);
    newCrates = newCrates.filter(crate => crate != null);

    console.log(newCrates);
    // 5. Add new crates to database
    const createdCrates = await Promise.all(
      newCrates.map(crate => {
        return crates.create({
          ...crate,
          ownerID: userID,
        }, { transaction });
      })
    );

    await transaction.commit();

    res.status(201).json({
      message: "Crate opened successfully!",
      newCrates: createdCrates,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error opening crate:", error);
    res.status(500).json({ error: "Failed to open crate." });
  }
});

// GET crates with filters (user crates + optional market info)
router.get('/filtered', async (req, res) => {
  const { userID: queryUserID, name, rarity, order, sortDirection } = req.query;
  
  // Use userID from query if provided
  let userID = queryUserID;

  if (!userID) {
    return res.status(404).json({ error: 'No userID was passed' });
  }

  // Prepare filter conditions
  const whereConditions = {};
  if (name) {
    whereConditions.name = { [Op.like]: `%${name}%` };
  }
  if (rarity) {
    whereConditions.rarity = rarity;
  }

  try {
    // Fetch crates
    const cratesList = await crates.findAll({
      where: userID ? { ownerID: userID, ...whereConditions } : whereConditions,
      include: [
        {
          model: crateMarket, // Join with crateMarket
          required: false,    // Only include if a record exists
        },
      ],
    });

    // Sort crates
    const sortingOptions = {
      '0': 'createdAt',
      '1': 'price',
      '2': 'rarity',
    };
    const sortField = sortingOptions[order] || 'createdAt';
    const sortDir = sortDirection === '1' ? 'ASC' : 'DESC';

    const sortedCrates = cratesList.sort((a, b) => {
      if (a[sortField] < b[sortField]) return sortDir === 'ASC' ? -1 : 1;
      if (a[sortField] > b[sortField]) return sortDir === 'ASC' ? 1 : -1;
      return 0;
    });

    res.json(sortedCrates);
  } catch (err) {
    console.error('Error fetching crates:', err);
    res.status(500).json({ error: 'Failed to fetch crates.' });
  }
});

// GET count of wooden crates
router.get('/wooden-crates', authenticateToken, async (req, res) => {
  const { user } = req; // `user` is added by `authenticateToken`

  try {
    const woodenCratesCount = await crates.count({
      where: {
        ownerID: user.id,
        crateAssetID: 'wooden_crate',
      },
    });

    res.json({ woodenCratesCount });
  } catch (err) {
    console.error('Error fetching wooden crates count:', err);
    res.status(500).json({ error: 'Failed to fetch wooden crates count.' });
  }
});

// POST add wooden crates if count is 0
router.post('/add-wooden-crates', authenticateToken, async (req, res) => {
  const { user } = req;

  try {
    // Check the count of wooden crates
    const woodenCratesCount = await crates.count({
      where: {
        ownerID: user.id,
        crateAssetID: 'wooden_crate',
      },
    });

    // If the user has 0 wooden crates, add 5 new wooden crates
    if (woodenCratesCount === 0) {
      const newCrates = [];
      for (let i = 0; i < 5; i++) {
        const patternIndex = Math.floor(Math.random() * 501);
        newCrates.push({
          ownerID: user.id,
          crateAssetID: 'wooden_crate',
          name: 'wooden crate',
          rarity: 0,
          patternIndex: patternIndex,
        });
      }

      // Insert the new crates into the database
      await crates.bulkCreate(newCrates);

      res.json({ message: '5 wooden crates added to your account.' });
    } else {
      res.json({ message: `You already have ${woodenCratesCount} wooden crates.` });
    }
  } catch (err) {
    console.error('Error adding wooden crates:', err);
    res.status(500).json({ error: 'Failed to add wooden crates.' });
  }
});



module.exports = router;