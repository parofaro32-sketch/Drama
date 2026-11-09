require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const axios = require('axios');

const dailymotionRoutes = require('./routes/dailymotion');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiting to protect the Dailymotion API proxy
app.use(
  rateLimit({
    windowMs: 60 * 1000,
    max: 100,
    message: { error: 'Too many requests, please try again later.' },
  })
);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'drama-search-server' });
});

// Dailymotion API proxy routes (keeps any credentials server-side)
app.use('/api/dailymotion', dailymotionRoutes);

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Drama search server running on port ${PORT}`);
});
