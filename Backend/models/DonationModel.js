const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  donor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  request: { type: mongoose.Schema.Types.ObjectId, ref: 'Request' },
  donationDate: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Donation', donationSchema);

