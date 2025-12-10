import { supabase } from '../lib/supabaseClient.js';

/**
 * Scan Service
 * Handles skin scan operations and database interactions
 */

/**
 * Create a new skin scan record
 * 
 * @param {Object} scanData
 * @param {string} scanData.user_id - User ID
 * @param {string} scanData.image_url - URL to stored image
 * @param {Array} scanData.detected_issues - Array of detected issues
 * @param {number} scanData.overall_skin_health_score - Overall score (0-100)
 * @param {Array} scanData.recommendations - Array of recommendations
 * @param {string} [scanData.analysis_notes] - Optional analysis notes
 * @returns {Promise<Object>} Created scan record
 */
export async function createScan(scanData) {
  try {
    const { data, error } = await supabase
      .from('skin_scans')
      .insert({
        user_id: scanData.user_id,
        scan_date: new Date().toISOString(),
        image_url: scanData.image_url,
        detected_issues: scanData.detected_issues,
        overall_skin_health_score: scanData.overall_skin_health_score,
        recommendations: scanData.recommendations,
        analysis_notes: scanData.analysis_notes || null,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    console.log(`✅ Scan created for user ${scanData.user_id}`);
    return data;
  } catch (error) {
    console.error('Error creating scan:', error);
    throw error;
  }
}

/**
 * Get all scans for a user
 * 
 * @param {string} userId - User ID
 * @param {Object} options - Query options
 * @param {number} [options.limit=10] - Number of scans to return
 * @param {number} [options.offset=0] - Offset for pagination
 * @returns {Promise<Array>} Array of scan records
 */
export async function getUserScans(userId, options = {}) {
  try {
    const { limit = 10, offset = 0 } = options;

    const { data, error } = await supabase
      .from('skin_scans')
      .select('*')
      .eq('user_id', userId)
      .order('scan_date', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching user scans:', error);
    throw error;
  }
}

/**
 * Get a single scan by ID
 * 
 * @param {string} scanId - Scan ID
 * @param {string} userId - User ID (for authorization check)
 * @returns {Promise<Object|null>} Scan record or null if not found
 */
export async function getScanById(scanId, userId) {
  try {
    const { data, error } = await supabase
      .from('skin_scans')
      .select('*')
      .eq('id', scanId)
      .eq('user_id', userId) // Ensure user owns this scan
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error fetching scan:', error);
    throw error;
  }
}

/**
 * Delete a scan
 * 
 * @param {string} scanId - Scan ID
 * @param {string} userId - User ID (for authorization check)
 * @returns {Promise<boolean>} Success status
 */
export async function deleteScan(scanId, userId) {
  try {
    const { error } = await supabase
      .from('skin_scans')
      .delete()
      .eq('id', scanId)
      .eq('user_id', userId);

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Error deleting scan:', error);
    throw error;
  }
}

/**
 * Get scan statistics for a user
 * 
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Statistics object
 */
export async function getUserScanStats(userId) {
  try {
    // Get all scans for the user
    const { data: scans, error } = await supabase
      .from('skin_scans')
      .select('overall_skin_health_score, detected_issues')
      .eq('user_id', userId);

    if (error) {
      throw error;
    }

    if (!scans || scans.length === 0) {
      return {
        totalScans: 0,
        averageScore: 0,
        totalIssuesDetected: 0,
      };
    }

    // Calculate statistics
    const totalScans = scans.length;
    const averageScore = Math.round(
      scans.reduce((sum, scan) => sum + scan.overall_skin_health_score, 0) / totalScans
    );
    const totalIssuesDetected = scans.reduce(
      (sum, scan) => sum + (scan.detected_issues?.length || 0),
      0
    );

    return {
      totalScans,
      averageScore,
      totalIssuesDetected,
    };
  } catch (error) {
    console.error('Error fetching scan stats:', error);
    throw error;
  }
}

