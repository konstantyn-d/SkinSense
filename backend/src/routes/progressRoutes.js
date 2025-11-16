import express from 'express';
import multer from 'multer';
import { authMiddleware } from '../middleware/auth.js';
import {
  getProgressSummary,
  getActiveProgress,
  getResolvedProgress,
  updateProgress,
  addProgressPhoto,
  deleteProgress,
} from '../services/progressService.js';
import { uploadProgressPhoto, validateImageFile } from '../services/storageService.js';

const router = express.Router();

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

/**
 * GET /api/progress/summary
 * Get progress summary for current user
 * Protected route - requires authentication
 */
router.get('/summary', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const summary = await getProgressSummary(userId);

    res.json({
      success: true,
      data: summary,
    });
  } catch (error) {
    console.error('Error fetching progress summary:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch progress summary',
    });
  }
});

/**
 * GET /api/progress
 * Get active progress records for current user
 * Protected route - requires authentication
 */
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const progress = await getActiveProgress(userId);

    res.json({
      success: true,
      data: progress,
    });
  } catch (error) {
    console.error('Error fetching active progress:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch progress',
    });
  }
});

/**
 * GET /api/progress/resolved
 * Get resolved progress records for current user
 * Protected route - requires authentication
 */
router.get('/resolved', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const resolved = await getResolvedProgress(userId);

    res.json({
      success: true,
      data: resolved,
    });
  } catch (error) {
    console.error('Error fetching resolved progress:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch resolved progress',
    });
  }
});

/**
 * PATCH /api/progress/:id
 * Update progress record
 * Protected route - requires authentication
 */
router.patch('/:id', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { progress_percentage, status, notes } = req.body;

    // Validate at least one field is provided
    if (progress_percentage === undefined && !status && notes === undefined) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'At least one field (progress_percentage, status, notes) must be provided',
      });
    }

    const updated = await updateProgress(id, userId, {
      progress_percentage,
      status,
      notes,
    });

    res.json({
      success: true,
      data: updated,
      message: 'Progress updated successfully',
    });
  } catch (error) {
    console.error('Error updating progress:', error);
    
    if (error.message.includes('must be')) {
      return res.status(400).json({
        error: 'Bad Request',
        message: error.message,
      });
    }

    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to update progress',
    });
  }
});

/**
 * POST /api/progress/:id/photo
 * Add progress photo to a progress record
 * Protected route - requires authentication
 */
router.post('/:id/photo', authMiddleware, upload.single('photo'), async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const file = req.file;
    const { notes } = req.body;

    // Validate file
    if (!file) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Photo file is required',
      });
    }

    try {
      validateImageFile(file);
    } catch (validationError) {
      return res.status(400).json({
        error: 'Bad Request',
        message: validationError.message,
      });
    }

    // Upload photo to storage
    const photoUrl = await uploadProgressPhoto({
      fileBuffer: file.buffer,
      userId,
      mimeType: file.mimetype,
    });

    // Add photo to progress record
    const updated = await addProgressPhoto(id, userId, photoUrl, notes);

    res.json({
      success: true,
      data: updated,
      message: 'Progress photo added successfully',
    });
  } catch (error) {
    console.error('Error adding progress photo:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to add progress photo',
    });
  }
});

/**
 * POST /api/progress/:id/healing-plan
 * Get healing plan for a specific issue
 * Protected route - requires authentication
 */
router.post('/:id/healing-plan', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    // For MVP, return a static template
    // In the future, this could be generated by AI based on the issue
    const healingPlan = generateHealingPlanTemplate(req.body.issue_name || 'Acne');

    res.json({
      success: true,
      data: healingPlan,
    });
  } catch (error) {
    console.error('Error generating healing plan:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to generate healing plan',
    });
  }
});

/**
 * DELETE /api/progress/:id
 * Delete progress record
 * Protected route - requires authentication
 */
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    await deleteProgress(id, userId);

    res.json({
      success: true,
      message: 'Progress record deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting progress:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to delete progress record',
    });
  }
});

/**
 * Generate static healing plan template
 * TODO: Replace with AI-generated plans in the future
 * 
 * @param {string} issueName - Name of the skin issue
 * @returns {Object} Healing plan template
 */
function generateHealingPlanTemplate(issueName) {
  const templates = {
    'Acne': {
      overview: 'Acne is a common skin condition caused by clogged pores, bacteria, and inflammation. With consistent care and the right products, most acne can be significantly improved within 6-12 weeks.',
      commonCauses: [
        'Excess oil production',
        'Clogged hair follicles',
        'Bacteria (P. acnes)',
        'Hormonal changes',
        'Stress and diet',
      ],
      dailyRoutine: {
        morning: [
          'Cleanse with salicylic acid cleanser',
          'Apply niacinamide serum',
          'Moisturize with oil-free moisturizer',
          'Apply SPF 30+ sunscreen',
        ],
        evening: [
          'Double cleanse (oil cleanser + water-based cleanser)',
          'Apply benzoyl peroxide or retinoid treatment',
          'Use lightweight moisturizer',
          'Spot treat active breakouts',
        ],
      },
      ingredients: [
        'Salicylic Acid (2%)',
        'Benzoyl Peroxide (2.5-5%)',
        'Niacinamide',
        'Retinoids',
        'Azelaic Acid',
      ],
      lifestyleChanges: [
        'Change pillowcases regularly',
        'Avoid touching your face',
        'Stay hydrated (8+ glasses water daily)',
        'Reduce dairy and high-glycemic foods',
        'Manage stress through exercise or meditation',
        'Get 7-9 hours of sleep',
      ],
    },
    'Dark Spots': {
      overview: 'Dark spots (hyperpigmentation) are caused by excess melanin production. With consistent use of brightening ingredients and sun protection, most dark spots fade within 3-6 months.',
      commonCauses: [
        'Sun exposure',
        'Post-inflammatory hyperpigmentation',
        'Hormonal changes',
        'Aging',
        'Skin injuries',
      ],
      dailyRoutine: {
        morning: [
          'Cleanse gently',
          'Apply vitamin C serum',
          'Use brightening moisturizer',
          'Apply SPF 50+ sunscreen (crucial!)',
        ],
        evening: [
          'Gentle cleanser',
          'Apply alpha arbutin or kojic acid',
          'Use retinol or retinoid',
          'Moisturize well',
        ],
      },
      ingredients: [
        'Vitamin C (L-Ascorbic Acid)',
        'Alpha Arbutin',
        'Kojic Acid',
        'Niacinamide',
        'Retinol',
        'Tranexamic Acid',
      ],
      lifestyleChanges: [
        'Wear sunscreen daily (even indoors)',
        'Wear a hat outdoors',
        'Avoid picking at skin',
        'Stay hydrated',
        'Eat antioxidant-rich foods',
        'Consider professional treatments (chemical peels, laser)',
      ],
    },
    'Fine Lines': {
      overview: 'Fine lines are early signs of aging caused by collagen loss and environmental damage. With proper care, fine lines can be minimized and further aging can be prevented.',
      commonCauses: [
        'Natural aging process',
        'Sun damage',
        'Dehydration',
        'Smoking',
        'Repetitive facial expressions',
      ],
      dailyRoutine: {
        morning: [
          'Gentle cleanser',
          'Hydrating toner',
          'Vitamin C serum',
          'Eye cream',
          'Moisturizer with peptides',
          'SPF 50+ sunscreen',
        ],
        evening: [
          'Gentle cleanser',
          'Retinol or retinoid',
          'Hydrating serum',
          'Rich moisturizer',
          'Eye cream',
        ],
      },
      ingredients: [
        'Retinol/Retinoids',
        'Peptides',
        'Hyaluronic Acid',
        'Vitamin C',
        'Niacinamide',
        'Ceramides',
      ],
      lifestyleChanges: [
        'Sleep on your back',
        'Stay well hydrated',
        'Quit smoking',
        'Reduce alcohol consumption',
        'Use a humidifier',
        'Facial massage or gua sha',
        'Consider professional treatments (Botox, fillers, microneedling)',
      ],
    },
  };

  // Return template for the issue, or default to Acne template
  return templates[issueName] || templates['Acne'];
}

export default router;

