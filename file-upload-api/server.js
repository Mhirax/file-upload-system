require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const connectDB = require('./config/db');

const app = express();

// Connect DB
connectDB();


// Store DB reference
mongoose.connection.once('open', () => {
  console.log('MongoDB connection ready');
  app.locals.db = mongoose.connection.db;
  //initGFS(mongoose.connection);
});


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));