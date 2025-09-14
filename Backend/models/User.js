const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: String,
  age: Number,
  gender: String,
  bloodGroup: String,
  address: String,
  lat: Number,
  lng: Number
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
