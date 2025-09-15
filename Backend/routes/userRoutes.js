// routes/userRoutes.js
const express = require('express');
const User = require('../models/User');
const router = express.Router();

router.get('/nearby', async (req, res) => {
  try {
    const { lat, lng, bloodGroup, maxDistance = 50000 } = req.query;

    // Validate input
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    const distance = parseInt(maxDistance);

    if (isNaN(latitude) || isNaN(longitude) || !bloodGroup) {
      return res.status(400).json({ error: "Valid lat, lng, and bloodGroup are required" });
    }

    console.log("Search Params:", { latitude, longitude, bloodGroup, distance });

    const donors = await User.aggregate([
      {
        $geoNear: {
          near: { type: "Point", coordinates: [longitude, latitude] },
          distanceField: "distance",
          spherical: true,
          maxDistance: distance,
          query: { bloodGroup: bloodGroup.trim() } // trims spaces
        }
      }
    ]);

    console.log("Donors Found:", donors);
    res.json(donors);
  } catch (err) {
    console.error("Geo Query Error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

