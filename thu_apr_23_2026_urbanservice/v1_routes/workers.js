const express = require('express');
const Worker = require('../models/Worker');
const Location = require('../models/Location');
const auth = require('../middleware/auth');
const router = express.Router();

// Get available workers
router.get('/available', async (req, res) => {
  try {
    const workers = await Worker.find({ isApproved: true, isOnline: true });
    res.json(workers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update worker location
router.post('/location', auth, async (req, res) => {
  try {
    const { bookingId, latitude, longitude } = req.body;
    
    const location = new Location({
      workerId: req.userId,
      bookingId,
      latitude,
      longitude
    });

    await location.save();
    res.json(location);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get worker location
router.get('/location/:bookingId', async (req, res) => {
  try {
    const location = await Location.findOne({ bookingId: req.params.bookingId })
      .sort({ timestamp: -1 });
    res.json(location);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;