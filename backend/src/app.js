import express from 'express';
import cors from 'cors';
import { config } from './config/env.js';
import userRoutes from './routes/userRoutes.js';
import scanRoutes from './routes/scanRoutes.js';
import progressRoutes from './routes/progressRoutes.js';

// Create Express application
const app = express();

// Middleware: CORS configuration
app.use(cors({
  origin: config.cors.origin,
  credentials: true,
}));

// Middleware: Parse JSON request bodies
app.use(express.json());

// Middleware: Parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

// Middleware: Simple request logging
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: config.env,
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'SkinSense API Server',
    version: '1.0.0',
    status: 'running',
  });
});

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/scans', scanRoutes);
app.use('/api/progress', progressRoutes);

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    ...(config.isDevelopment && { stack: err.stack }),
  });
});

export default app;

