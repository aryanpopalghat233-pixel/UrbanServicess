const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  workerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Worker' },
  service: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  address: { type: String, required: true },
  latitude: { type: Number },
  longitude: { type: Number },
  status: { 
    type: String, 
    enum: ['Pending', 'Accepted', 'On the way', 'Completed', 'Cancelled'],
    default: 'Pending'
  },
  amount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', bookingSchema);