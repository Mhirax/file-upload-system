const mongoose = require('mongoose');
const { initGFS } = require('../controllers/fileController');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${mongoose.connection.host}`);
    initGFS(mongoose.connection); // ✅ pass mongoose.connection, not conn
    return mongoose.connection;
  } catch (error) {
    console.error('❌ DB Connection Error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;