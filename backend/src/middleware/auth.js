import { supabase } from '../lib/supabaseClient.js';
import { ensureUserExists } from '../services/userService.js';

/**
 * Authentication middleware
 * Verifies JWT token from Supabase and attaches user info to request
 * Also ensures user exists in our database
 * 
 * Usage: app.get('/protected-route', authMiddleware, handler)
 * 
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function
 */
export async function authMiddleware(req, res, next) {
  try {
    // Extract Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Missing or invalid authorization header',
      });
    }

    // Extract token
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      console.error('Auth error:', error?.message || 'No user found');
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid or expired token',
      });
    }

    // Ensure user exists in our database and get internal user record
    const dbUser = await ensureUserExists({
      id: user.id,
      email: user.email,
      metadata: user.user_metadata,
    });

    // Attach user info to request
    req.user = {
      id: user.id,
      email: user.email,
      metadata: user.user_metadata,
      dbUser, // Full database user record
    };

    // Continue to next middleware/handler
    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Authentication failed',
    });
  }
}

/**
 * Optional authentication middleware
 * Similar to authMiddleware but doesn't fail if no token is provided
 * Useful for endpoints that work differently for authenticated vs anonymous users
 * 
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function
 */
export async function optionalAuthMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // No token provided, continue without user info
      req.user = null;
      return next();
    }

    const token = authHeader.substring(7);
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      // Invalid token, continue without user info
      req.user = null;
      return next();
    }

    req.user = {
      id: user.id,
      email: user.email,
      metadata: user.user_metadata,
    };

    next();
  } catch (error) {
    console.error('Optional auth middleware error:', error);
    req.user = null;
    next();
  }
}

