const express = require('express');
const Request = require('../models/Request');
const router = express.Router();

// Create a new blood request
router.post('/', async (req, res) => {
  try {
    const request = new Request(req.body);
    await request.save();
    res.json(request);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all blood requests
router.get('/', async (req, res) => {
  try {
    const requests = await Request.find().populate('recipient');
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
