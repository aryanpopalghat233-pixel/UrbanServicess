const express = require('express');
const router = express.Router();

const services = [
  { id: 1, name: 'Plumbing', icon: '🔧', price: 299 },
  { id: 2, name: 'Electrical', icon: '⚡', price: 349 },
  { id: 3, name: 'Cleaning', icon: '🧹', price: 199 },
  { id: 4, name: 'Carpentry', icon: '🪛', price: 399 },
  { id: 5, name: 'Painting', icon: '🎨', price: 499 },
  { id: 6, name: 'AC Service', icon: '❄️', price: 299 }
];

router.get('/', (req, res) => {
  res.json(services);
});

router.get('/:id', (req, res) => {
  const service = services.find(s => s.id === parseInt(req.params.id));
  if (!service) return res.status(404).json({ message: 'Service not found' });
  res.json(service);
});

module.exports = router;