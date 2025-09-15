const mongoose = require('mongoose');
const User = require('./models/User'); // your User model

mongoose.connect('mongodb://127.0.0.1:27017/blood_donation');

async function updateLocations() {
  const users = await User.find().lean(); // use .lean() to get plain JS objects

  for (let user of users) {
    const lat = parseFloat(user.lat);
    const lng = parseFloat(user.lng);

    if (!isNaN(lat) && !isNaN(lng)) {
      await User.updateOne(
        { _id: user._id },
        { $set: { location: { type: 'Point', coordinates: [lng, lat] } } }
      );
      console.log(`✅ Updated location for ${user.fullName}`);
    } else {
      console.log(`⚠️ Skipped ${user.fullName}: invalid lat/lng`);
    }
  }

  console.log('All users updated!');
  mongoose.disconnect();
}

updateLocations();
