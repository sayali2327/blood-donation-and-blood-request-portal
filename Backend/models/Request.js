const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  patientName: { type: String, required: true },
  bloodType: { type: String, required: true },
  unitsNeeded: { type: Number, required: true },
  urgency: { type: String, enum: ['critical', 'urgent', 'normal'], required: true },
  hospital: { type: String, required: true },
  location: { type: String, required: true },
  lat: { type: Number },
  lng: { type: Number },
  contactName: { type: String, required: true },
  contactPhone: { type: String, required: true },
  reason: { type: String },
  additionalNotes: { type: String },
  status: { type: String, default: 'pending' }, // pending, fulfilled, canceled
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Request', requestSchema);
