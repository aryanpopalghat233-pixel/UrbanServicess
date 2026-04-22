const express = require('express');
const Booking = require('../models/Booking');
const Worker = require('../models/Worker');
const auth = require('../middleware/auth');
const router = express.Router();

// Get all bookings
router.get('/bookings', auth, async (req, res) => {
  try {
    const bookings = await Booking.find().populate('userId').populate('workerId');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all workers
router.get('/workers', auth, async (req, res) => {
  try {
    const workers = await Worker.find();
    res.json(workers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Assign worker to booking
router.put('/assign/:bookingId/:workerId', auth, async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.bookingId,
      { workerId: req.params.workerId, status: 'Accepted' },
      { new: true }
    );
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Approve worker
router.put('/approve-worker/:workerId', auth, async (req, res) => {
  try {
    const worker = await Worker.findByIdAndUpdate(
      req.params.workerId,
      { isApproved: true },
      { new: true }
    );
    res.json(worker);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;