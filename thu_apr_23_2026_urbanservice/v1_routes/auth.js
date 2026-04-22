const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Worker = require('../models/Worker');
const router = express.Router();

// User Signup
router.post('/user/signup', async (req, res) => {
  try {
    const { name, email, phone, password, address, city } = req.body;
    
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    user = new User({ name, email, phone, password, address, city });
    await user.save();

    const token = jwt.sign({ id: user._id, role: 'user' }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// User Login
router.post('/user/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id, role: 'user' }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Worker Signup
router.post('/worker/signup', async (req, res) => {
  try {
    const { name, email, phone, password, skills, city } = req.body;
    
    let worker = await Worker.findOne({ email });
    if (worker) return res.status(400).json({ message: 'Worker already exists' });

    worker = new Worker({ name, email, phone, password, skills, city });
    await worker.save();

    const token = jwt.sign({ id: worker._id, role: 'worker' }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, worker });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Worker Login
router.post('/worker/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const worker = await Worker.findOne({ email });
    
    if (!worker) return res.status(401).json({ message: 'Worker not found' });

    const isMatch = await worker.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid password' });

    const token = jwt.sign({ id: worker._id, role: 'worker' }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, worker });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;