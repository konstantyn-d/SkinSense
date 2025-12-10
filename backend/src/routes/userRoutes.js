import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { getUserById, updateUserProfile } from '../services/userService.js';

const router = express.Router();

/**
 * GET /api/users/me
 * Get current user profile
 * Protected route - requires authentication
 */
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = req.user.dbUser;

    res.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        created_at: user.created_at,
      },
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch user profile',
    });
  }
});

/**
 * PATCH /api/users/me
 * Update current user profile
 * Protected route - requires authentication
 */
router.patch('/me', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { full_name } = req.body;

    // Validate input
    if (!full_name || typeof full_name !== 'string') {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'full_name is required and must be a string',
      });
    }

    // Update user profile
    const updatedUser = await updateUserProfile(userId, { full_name });

    res.json({
      success: true,
      data: {
        id: updatedUser.id,
        email: updatedUser.email,
        full_name: updatedUser.full_name,
        created_at: updatedUser.created_at,
      },
      message: 'Profile updated successfully',
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to update user profile',
    });
  }
});

/**
 * GET /api/users/:id
 * Get user by ID (for admin purposes or future features)
 * Protected route - requires authentication
 */
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    // Only allow users to fetch their own profile (for now)
    if (id !== req.user.id) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You can only access your own profile',
      });
    }

    const user = await getUserById(id);

    if (!user) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        created_at: user.created_at,
      },
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch user',
    });
  }
});

export default router;

