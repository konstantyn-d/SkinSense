import express from 'express';
import multer from 'multer';
import { authMiddleware } from '../middleware/auth.js';
import { analyzeSkin } from '../clients/youcamClient.js';
import { createScan, getUserScans, getScanById, deleteScan, getUserScanStats } from '../services/scanService.js';
import { uploadScanImage, validateImageFile } from '../services/storageService.js';
import { createProgressRecords } from '../services/progressService.js';

const router = express.Router();

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

/**
 * POST /api/scans
 * Create new skin scan
 * Protected route - requires authentication
 */
router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const userId = req.user.id;
    const file = req.file;

    // Validate file
    if (!file) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Image file is required',
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

    // Analyze skin with AI
    console.log(`🔍 Analyzing skin for user ${userId}...`);
    const analysisResult = await analyzeSkin({
      imageBuffer: file.buffer,
    });

    // Upload image to storage
    console.log(`📤 Uploading image to storage...`);
    const imageUrl = await uploadScanImage({
      fileBuffer: file.buffer,
      userId,
      mimeType: file.mimetype,
    });

    // Create scan record in database
    const scan = await createScan({
      user_id: userId,
      image_url: imageUrl,
      detected_issues: analysisResult.issues,
      overall_skin_health_score: analysisResult.overallScore,
      recommendations: analysisResult.recommendations,
      analysis_notes: JSON.stringify(analysisResult.metadata),
    });

    // Create healing progress records for each detected issue
    const progressRecords = await createProgressRecords({
      userId,
      scanId: scan.id,
      issues: analysisResult.issues,
    });

    // Return response
    res.status(201).json({
      success: true,
      data: {
        scan: {
          id: scan.id,
          scan_date: scan.scan_date,
          image_url: scan.image_url,
          overall_skin_health_score: scan.overall_skin_health_score,
          detected_issues: scan.detected_issues,
          recommendations: scan.recommendations,
        },
        progress_records: progressRecords,
      },
      message: 'Scan completed successfully',
    });
  } catch (error) {
    console.error('Error creating scan:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to process scan',
    });
  }
});

/**
 * GET /api/scans
 * Get all scans for current user
 * Protected route - requires authentication
 */
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;

    const scans = await getUserScans(userId, { limit, offset });

    // Return minimal data for list view
    const simplifiedScans = scans.map(scan => ({
      id: scan.id,
      scan_date: scan.scan_date,
      image_url: scan.image_url,
      overall_skin_health_score: scan.overall_skin_health_score,
      issues_count: scan.detected_issues?.length || 0,
    }));

    res.json({
      success: true,
      data: simplifiedScans,
      pagination: {
        limit,
        offset,
        total: simplifiedScans.length,
      },
    });
  } catch (error) {
    console.error('Error fetching scans:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch scans',
    });
  }
});

/**
 * GET /api/scans/stats
 * Get scan statistics for current user
 * Protected route - requires authentication
 */
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const stats = await getUserScanStats(userId);

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Error fetching scan stats:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch scan statistics',
    });
  }
});

/**
 * GET /api/scans/:id
 * Get detailed scan by ID
 * Protected route - requires authentication
 */
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const scan = await getScanById(id, userId);

    if (!scan) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Scan not found',
      });
    }

    res.json({
      success: true,
      data: scan,
    });
  } catch (error) {
    console.error('Error fetching scan:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch scan',
    });
  }
});

/**
 * DELETE /api/scans/:id
 * Delete scan by ID
 * Protected route - requires authentication
 */
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    // Check if scan exists
    const scan = await getScanById(id, userId);
    if (!scan) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Scan not found',
      });
    }

    // Delete scan (cascade will delete related progress records)
    await deleteScan(id, userId);

    res.json({
      success: true,
      message: 'Scan deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting scan:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to delete scan',
    });
  }
});

export default router;

