const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: String,
  age: Number,
  gender: String,
  bloodGroup: { type: String, required: true },
  address: String,
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [lng, lat]
      index: '2dsphere'
    }
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
