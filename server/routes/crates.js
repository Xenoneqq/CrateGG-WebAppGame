const express = require('express')
const { crates, users, crateMarket } = require('../database.js');
const authenticateToken = require('../middleware/auth');
const router = express.Router()
const OpenCrate = require('../logic/crateOpener.js');

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

  try {
    // 1. Check for crate
    const userCrate = await crates.findOne({
      where: { id: crateID, ownerID: userID },
    });

    if (!userCrate) {
      return res.status(404).json({ error: "Crate not found or not owned by user." });
    }

    // 2. Remove crate from market
    await crateMarket.destroy({
      where: { crateID },
    });

    // 3. Set onwerID to null
    await userCrate.update({ ownerID: null });

    // 4. Get crate drops
    const newCrates = OpenCrate(userCrate.crateAssetID);

    // 5. Add new crates to database
    const createdCrates = await Promise.all(
      newCrates.map(crate => {
        return crates.create({
          ...crate,
          ownerID: userID,
        });
      })
    );

    res.status(201).json({
      message: "Crate opened successfully!",
      newCrates: createdCrates,
    });
  } catch (error) {
    console.error("Error opening crate:", error);
    res.status(500).json({ error: "Failed to open crate." });
  }
});

module.exports = router;