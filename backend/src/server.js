import app from './app.js';
import { config } from './config/env.js';

// Import Supabase client to ensure it's initialized
import './lib/supabaseClient.js';

const PORT = config.port;

// Start the server
const server = app.listen(PORT, () => {
  console.log('');
  console.log('🚀 SkinSense API Server Started');
  console.log('================================');
  console.log(`📍 Server running on: http://localhost:${PORT}`);
  console.log(`🌍 Environment: ${config.env}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
  console.log('================================');
  console.log('');
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\nSIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

