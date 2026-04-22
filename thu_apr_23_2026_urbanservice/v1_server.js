const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: "*" } });

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// Database Connection
const connectDB = require('./config/db');
connectDB();

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/services', require('./routes/services'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/workers', require('./routes/workers'));
app.use('/api/admin', require('./routes/admin'));

// Socket.io for real-time location updates
io.on('connection', (socket) => {
  console.log('Worker connected:', socket.id);
  
  socket.on('updateLocation', (data) => {
    io.emit('workerLocation', data);
  });
  
  socket.on('disconnect', () => {
    console.log('Worker disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});