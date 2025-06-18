// backend/src/server.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import transactionRoutes from './routes/transactions.js';
import categoryRoutes from './routes/categories.js';
import budgetRoutes from './routes/budgets.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// Load environment variables
dotenv.config();
console.log('SERVER STARTUP DEBUG: JWT_SECRET from .env:', process.env.JWT_SECRET);

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

// ✅ CORS setup for both local dev and production
// src/server.js

const allowedOrigins = [
  'http://localhost:5173',
  'https://kasi-budgetly.netlify.app',
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS: ' + origin));
      }
    },
    credentials: true,
  })
);



// Test route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/budgets', budgetRoutes);

// Error middleware
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
