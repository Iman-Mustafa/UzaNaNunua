const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/products', require('./routes/productRoutes'));

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'UzaNaNunua API is running...' });
});

// Global error handling middleware (ensures JSON responses)
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  const statusCode = res.statusCode === 200 ? (err.statusCode || 500) : res.statusCode;
  res.status(statusCode).json({
    message: err.message || 'An unexpected server error occurred',
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

