import mongoose from 'mongoose';

const DonorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number },
  gender: { type: String, enum: ['male','female','other'], default: 'other' },
  bloodGroup: { type: String, required: true },
  contact: {
    email: { type: String },
    phone: { type: String }
  },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0,0] } // [lng, lat]
  },
  availability: { type: Boolean, default: true },
  lastDonationDate: { type: Date },
  role: { type: String, default: 'donor' }
}, { timestamps: true });

DonorSchema.index({ location: '2dsphere' });

export default mongoose.model('Donor', DonorSchema);
