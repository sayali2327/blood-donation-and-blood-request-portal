import mongoose from 'mongoose';

const RequestSchema = new mongoose.Schema({
  recipientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  bloodGroup: { type: String, required: true },
  units: { type: Number, default: 1 },
  urgency: { type: String, enum: ['low','medium','high','critical'], default: 'medium' },
  hospital: { type: String },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true } // [lng, lat]
  },
  status: { type: String, enum: ['pending','assigned','completed','rejected','expired'], default: 'pending' },
  donorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Donor' }
}, { timestamps: true });

RequestSchema.index({ location: '2dsphere' });
RequestSchema.index({ status: 1, bloodGroup: 1 });

export default mongoose.model('Request', RequestSchema);