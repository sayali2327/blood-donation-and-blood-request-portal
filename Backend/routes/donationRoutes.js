const express = require('express');
const Donation = require('../models/DonationModel');
const router = express.Router();

// Record a new donation
router.post('/', async (req, res) => {
  try {
    const donation = new Donation(req.body);
    await donation.save();
    res.json(donation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all donations
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
