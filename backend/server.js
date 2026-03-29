// backend/server.js

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// Import routes
import predictionRoutes from './routes/predictionRoutes.js';
import diseaseRoutes from './routes/diseaseRoutes.js';
import environmentRoutes from './routes/environmentRoutes.js';
import analyticRoutes from './routes/analyticsRoutes.js';
import newsRoutes from './routes/newsRoutes.js';
import authRoutes from './routes/authRoutes.js';


// Loading env variable
dotenv.config();

// Initialize app
const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'https://jalchetna-frontend.onrender.com'
];

// Middleware setup
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("✅ MongoDB Connected Successfully"))
    .catch((err) => {
        console.error('❌ MongoDB Connection Error:', err.message);
        process.exit(1);
    });

// ============= ROUTES ============= //


// Health check endpoint - tests if server is running
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'JalChetna Backend is Running',
    timestamp: new Date().toISOString(),
    endpoints: {
      prediction: '/api/prediction',
      disease: '/api/disease',
      environment: '/api/environment',
      analytics: '/api/analytics'
    }
  });
});

// Root welcome message
app.get('/', (req, res) => {
  res.json({
    name: 'JalChetna API',
    version: '1.0.0',
    description: 'Water-Borne Disease Monitoring & Early Warning Platform',
    endpoints: {
      health: '/api/health',
      prediction: '/api/prediction',
      disease: '/api/disease',
      environment: '/api/environment',
      analytics: '/api/analytics'
    }
  });
});

// Mount all routes
app.use('/api/prediction', predictionRoutes);
app.use('/api/disease', diseaseRoutes);
app.use('/api/environment', environmentRoutes);
app.use('/api/analytics', analyticRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/auth', authRoutes);

// 404 handler for unmatched routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.url}`,
    available_endpoints: [
      'GET /',
      'GET /api/health',
      'POST /api/prediction/analyze',
      'GET /api/prediction/:region',
      'GET /api/prediction/all',
      'POST /api/disease/add',
      'GET /api/disease/trends',
      'GET /api/disease/list',
      'GET /api/disease/summary/:region',
      'GET /api/environment/current/:region',
      'POST /api/environment/add',
      'GET /api/environment/trends/:region',
      'GET /api/environment/regions',
      'GET /api/analytics/dashboard',
      'GET /api/analytics/outbreak-trends',
      'GET /api/analytics/risk-distribution'
    ]
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 JalChetna Server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📍 Root: http://localhost:${PORT}/\n`);
});