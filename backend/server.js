import express from 'express';
import connectDB from './config/db.js';
import cors from 'cors';
import dotenv from 'dotenv';
import businessFormRoutes from './routes/businessForm.route.js';
import adminAnalysisRoutes from './routes/adminAnalysis.route.js'

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to database
connectDB()

// Routes
app.use('/api/businesses', businessFormRoutes);
app.use('/api/admin/analysis', adminAnalysisRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});