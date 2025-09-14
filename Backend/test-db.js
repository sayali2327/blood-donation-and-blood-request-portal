const mongoose = require('mongoose');

async function testDB() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/blood_donation_db', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB!');
    mongoose.connection.close();
  } catch (err) {
    console.error('❌ DB Connection Failed:', err);
  }
}

testDB();
