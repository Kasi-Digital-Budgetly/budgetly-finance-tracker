// backend/src/server.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import transactionRoutes from './routes/transactions.js';
import categoryRoutes from './routes/categories.js';
import budgetRoutes from './routes/budgets.js'; // <-- NEW: Import budget routes
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// Load environment variables from .env file
dotenv.config();
console.log('SERVER STARTUP DEBUG: JWT_SECRET from .env:', process.env.JWT_SECRET);

const app = express();

// Connect to the database
connectDB();

// Middleware
app.use(express.json());
//app.use(cors());
app.use(cors({
  origin: 'https://kasi-budgetly.netlify.app',
  credentials: true,
}));



// Define a simple root route for testing
app.get('/', (req, res) => {
  res.send('API is running...');
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/budgets', budgetRoutes); // <-- NEW: Use budget routes

// Error handling middleware functions
app.use(notFound);
app.use(errorHandler);

// Define the port to listen on
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
