// routes/userRoutes.js
const express = require('express');
const User = require('../models/User');
const router = express.Router();

// 🔹 Test route to see if it works
router.get('/all', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Keep your nearby search route here
router.get('/nearby', async (req, res) => {
  try {
    const { lat, lng, bloodGroup, maxDistance = 50000 } = req.query;

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    const distance = parseInt(maxDistance);

    if (isNaN(latitude) || isNaN(longitude) || !bloodGroup) {
      return res.status(400).json({ error: "Valid lat, lng, and bloodGroup are required" });
    }

    const donors = await User.aggregate([
      {
        $geoNear: {
          near: { type: "Point", coordinates: [longitude, latitude] },
          distanceField: "distance",
          spherical: true,
          maxDistance: distance,
          query: { bloodGroup: bloodGroup.trim() }
        }
      }
    ]);

    res.json(donors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
