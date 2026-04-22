const express = require('express');
const Booking = require('../models/Booking');
const auth = require('../middleware/auth');
const router = express.Router();

// Create booking
router.post('/', auth, async (req, res) => {
  try {
    const { service, date, time, address, latitude, longitude, amount } = req.body;
    
    const booking = new Booking({
      userId: req.userId,
      service,
      date,
      time,
      address,
      latitude,
      longitude,
      amount
    });

    await booking.save();
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user bookings
router.get('/user/bookings', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.userId }).populate('workerId');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update booking status
router.put('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;