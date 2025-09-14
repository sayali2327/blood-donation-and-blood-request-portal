const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  patientName: { type: String, required: true },
  bloodType: { type: String, required: true },
  unitsNeeded: { type: Number, required: true }, // <-- match your form field
  urgency: { type: String, required: true },
  hospital: { type: String, required: true },
  location: { type: String, required: true },
  lat: Number,
  lng: Number,
  contactName: { type: String, required: true },
  contactPhone: { type: String, required: true },
  reason: String,
  additionalNotes: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Request', requestSchema);