const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  workerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Worker', required: true },
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Location', locationSchema);