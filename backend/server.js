const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Root endpoint for direct browser visits to the backend service.
app.get('/', (req, res) => {
  res.json({
    name: 'SneakerHub API',
    status: 'ok',
    health: '/api/health'
  });
});

app.get('/favicon.ico', (req, res) => {
  res.status(204).end();
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/sneakers', require('./routes/sneakerRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
