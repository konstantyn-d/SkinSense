import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

/**
 * Validates that a required environment variable exists
 * @param {string} key - Environment variable name
 * @returns {string} - Environment variable value
 * @throws {Error} - If environment variable is missing
 */
function requireEnv(key) {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

/**
 * Gets an optional environment variable with a default value
 * @param {string} key - Environment variable name
 * @param {string} defaultValue - Default value if not set
 * @returns {string} - Environment variable value or default
 */
function getEnv(key, defaultValue = '') {
  return process.env[key] || defaultValue;
}

// Export configuration object
export const config = {
  // Server configuration
  port: parseInt(getEnv('PORT', '4000'), 10),
  
  // Supabase configuration
  supabase: {
    url: requireEnv('SUPABASE_URL'),
    serviceRoleKey: requireEnv('SUPABASE_SERVICE_ROLE_KEY'),
  },
  
  // YouCam AI API configuration
  youcam: {
    baseUrl: getEnv('YOUCAM_API_BASE_URL', ''),
    apiKey: getEnv('YOUCAM_API_KEY', ''),
  },
  
  // CORS configuration
  cors: {
    origin: getEnv('NODE_ENV', 'development') === 'development' 
      ? ['http://localhost:5173', 'http://localhost:5174']
      : getEnv('FRONTEND_URL', 'http://localhost:5173'),
  },
  
  // Environment
  env: getEnv('NODE_ENV', 'development'),
  isDevelopment: getEnv('NODE_ENV', 'development') === 'development',
  isProduction: getEnv('NODE_ENV', 'development') === 'production',
};

// Validate critical configuration on startup
try {
  config.supabase.url;
  config.supabase.serviceRoleKey;
  console.log('✅ Environment configuration loaded successfully');
} catch (error) {
  console.error('❌ Environment configuration error:', error.message);
  console.error('Please check your .env file and ensure all required variables are set.');
  process.exit(1);
}

