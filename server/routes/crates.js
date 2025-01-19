const express = require('express')
const { crates } = require('../database.js');
const authenticateToken = require('../middleware/auth');
const router = express.Router()

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
router.get('/crates/:crateID', async (req, res) => {
  try {
    const crate = await crates.findByPk(req.params.crateID, {
      include: [
        { model: users, as: 'owner' },  // Assuming crates have an ownerID foreign key
      ],
    });

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
  try {
    const userCrates = await crates.findAll({
      where: { ownerID: req.params.userID },
      include: [
        { model: users, as: 'owner' } // Include user information if needed
      ]
    });
    if (userCrates.length === 0) {
      return res.status(404).send({ error: "No crates found for this user." });
    }
    res.json(userCrates);
  } catch (err) {
    res.status(500).send({ error: "Couldn't fetch user crates." });
  }
});


// POST a new crate to the database
router.post('/', authenticateToken, async (req, res) => {
  try {
    console.log("Request Body:", req.body);
    const { crateAssetID, patternIndex, ownerID } = req.body;
    console.log(crateAssetID, patternIndex, ownerID)
    if (crateAssetID === undefined || patternIndex === undefined || ownerID === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    

    const newCrate = await crates.create({ crateAssetID, patternIndex, ownerID });
    res.status(201).json(newCrate);
  } catch (err) {
    console.error(err);
    res.status(400).send({ error: "Couldn't create a crate." });
  }
});


// PUT new data into an existing crate
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { crateAssetID, patternIndex, ownerID} = req.body;
    const crate = await crates.findByPk(req.params.id);

    if (!crate) {
      return res.status(404).send({ error: "Crate not found." });
    }

    crate.crateAssetID = crateAssetID || crate.crateAssetID;
    crate.patternIndex = patternIndex || crate.patternIndex;
    crate.ownerID = ownerID || crate.ownerID;

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

module.exports = router;