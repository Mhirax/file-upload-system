require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const fileRoutes = require('./routes/fileRoutes');

const app = express();

process.on('uncaughtException', (err) => {
  console.error('💥 Uncaught Exception:', err);
});

process.on('unhandledRejection', (err) => {
  console.error('💥 Unhandled Rejection:', err);
});

const allowedOrigins = [
  'http://localhost:3000',
  process.env.FRONTEND_URL, 
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log("➡️", req.method, req.url);
  next();
});

app.use('/api/files', fileRoutes);

app.use((err, req, res, next) => {
  console.error("🔥 ERROR:", err.message);
  res.status(500).json({ error: err.message });
});

const PORT = process.env.PORT || 5001;

connectDB().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});

setInterval(() => {
  console.log("🟢 Server alive...");
}, 10000);