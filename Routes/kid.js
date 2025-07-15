// routes/kid.js
const express = require('express');
const auth = require('../middleware/auth');
const Kid = require('../models/kid');

const router = express.Router();

router.use(auth); // Protect all routes below

// Create Kid
router.post('/', async (req, res) => {
  const { name, age } = req.body;
  if (!name || !age) return res.status(400).json({ message: 'Name and age required' });

  try {
    const kid = new Kid({ name, age, user: req.user.userId });
    await kid.save();
    res.status(201).json(kid);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all Kids of logged-in user
router.get('/', async (req, res) => {
  try {
    const kids = await Kid.find({ user: req.user.userId });
    res.json(kids);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get one Kid by id (only if owned by user)
router.get('/:id', async (req, res) => {
  try {
    const kid = await Kid.findOne({ _id: req.params.id, user: req.user.userId });
    if (!kid) return res.status(404).json({ message: 'Kid not found' });
    res.json(kid);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update Kid
router.put('/:id', async (req, res) => {
  const { name, age } = req.body;
  try {
    const kid = await Kid.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId },
      { name, age },
      { new: true }
    );
    if (!kid) return res.status(404).json({ message: 'Kid not found' });
    res.json(kid);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete Kid
router.delete('/:id', async (req, res) => {
  try {
    const kid = await Kid.findOneAndDelete({ _id: req.params.id, user: req.user.userId });
    if (!kid) return res.status(404).json({ message: 'Kid not found' });
    res.json({ message: 'Kid deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
