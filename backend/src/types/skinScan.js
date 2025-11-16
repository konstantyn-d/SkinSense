/**
 * Type definitions for Skin Scan data structures
 * Using JSDoc comments for type documentation
 */

/**
 * @typedef {Object} DetectedIssue
 * @property {string} name - Name of the skin issue (e.g., "Acne", "Dark Spots", "Wrinkles")
 * @property {string} severity - Severity level: "mild" | "moderate" | "severe"
 * @property {string} location - Location on face (e.g., "forehead", "cheeks", "chin")
 * @property {string} description - Detailed description of the issue
 * @property {number} score - Numeric score (0-100, higher = more severe)
 * @property {number} confidence - AI confidence level (0-1)
 */

/**
 * @typedef {Object} Recommendation
 * @property {string} title - Recommendation title
 * @property {string} description - Detailed recommendation description
 * @property {string} category - Category: "skincare" | "lifestyle" | "diet" | "medical"
 * @property {string} priority - Priority level: "high" | "medium" | "low"
 * @property {string[]} [ingredients] - Recommended skincare ingredients (optional)
 */

/**
 * @typedef {Object} SkinScanResult
 * @property {number} overallScore - Overall skin health score (0-100)
 * @property {DetectedIssue[]} issues - Array of detected skin issues
 * @property {Recommendation[]} recommendations - Array of recommendations
 * @property {Object} [metadata] - Additional metadata from AI analysis
 */

/**
 * @typedef {Object} SkinScanRecord
 * @property {string} id - Scan ID (UUID)
 * @property {string} user_id - User ID (UUID)
 * @property {string} scan_date - ISO timestamp of scan
 * @property {string} image_url - URL to stored scan image
 * @property {DetectedIssue[]} detected_issues - Array of detected issues
 * @property {number} overall_skin_health_score - Overall score (0-100)
 * @property {Recommendation[]} recommendations - Array of recommendations
 * @property {string} [analysis_notes] - Additional notes from analysis
 * @property {string} created_at - ISO timestamp of record creation
 */

/**
 * @typedef {Object} HealingProgressRecord
 * @property {string} id - Progress record ID (UUID)
 * @property {string} user_id - User ID (UUID)
 * @property {string} [related_scan_id] - Related scan ID (UUID, optional)
 * @property {string} issue_name - Name of the issue being tracked
 * @property {number} progress_percentage - Progress percentage (0-100)
 * @property {string} status - Status: "active" | "improving" | "resolved"
 * @property {string} start_date - ISO date when tracking started
 * @property {string} last_updated - ISO timestamp of last update
 * @property {string} [notes] - User notes
 * @property {Array<{url: string, date: string, notes?: string}>} photos - Progress photos
 * @property {string} created_at - ISO timestamp of record creation
 */

// Export empty object to make this a module
export {};

