const mongoose = require('mongoose');

const workerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  skills: [String],
  city: { type: String, required: true },
  idProof: { type: String },
  profileImage: { type: String },
  isApproved: { type: Boolean, default: false },
  rating: { type: Number, default: 0 },
  totalJobs: { type: Number, default: 0 },
  isOnline: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Worker', workerSchema);