const express = require('express');
const Donation = require('../models/Donation'); // fixed import
const router = express.Router();

// Record a new donation
router.post('/', async (req, res) => {
  try {
    const donation = new Donation(req.body);
    await donation.save();
    res.status(201).json(donation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all donations with populated data
router.get('/', async (req, res) => {
  try {
    const donations = await Donation.find()
      .populate('donor')
      .populate('recipient')
      .populate('request');
    res.json(donations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
