import { supabase } from '../lib/supabaseClient.js';

/**
 * Progress Service
 * Handles healing progress tracking operations
 */

/**
 * Create healing progress records for detected issues
 * 
 * @param {Object} params
 * @param {string} params.userId - User ID
 * @param {string} params.scanId - Related scan ID
 * @param {Array} params.issues - Array of detected issues
 * @returns {Promise<Array>} Created progress records
 */
export async function createProgressRecords({ userId, scanId, issues }) {
  try {
    const records = issues.map(issue => ({
      user_id: userId,
      related_scan_id: scanId,
      issue_name: issue.name,
      progress_percentage: 0,
      status: 'active',
      start_date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
      notes: issue.description || null,
      photos: [],
    }));

    const { data, error } = await supabase
      .from('healing_progress')
      .insert(records)
      .select();

    if (error) {
      throw error;
    }

    console.log(`✅ Created ${data.length} progress records for user ${userId}`);
    return data;
  } catch (error) {
    console.error('Error creating progress records:', error);
    throw error;
  }
}

/**
 * Get progress summary for a user
 * 
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Progress summary
 */
export async function getProgressSummary(userId) {
  try {
    const { data, error } = await supabase
      .from('healing_progress')
      .select('status, progress_percentage')
      .eq('user_id', userId);

    if (error) {
      throw error;
    }

    if (!data || data.length === 0) {
      return {
        activeIssues: 0,
        avgProgress: 0,
        resolvedIssues: 0,
      };
    }

    const activeIssues = data.filter(p => p.status !== 'resolved').length;
    const resolvedIssues = data.filter(p => p.status === 'resolved').length;
    
    const activeProgress = data.filter(p => p.status !== 'resolved');
    const avgProgress = activeProgress.length > 0
      ? Math.round(
          activeProgress.reduce((sum, p) => sum + p.progress_percentage, 0) / activeProgress.length
        )
      : 0;

    return {
      activeIssues,
      avgProgress,
      resolvedIssues,
    };
  } catch (error) {
    console.error('Error fetching progress summary:', error);
    throw error;
  }
}

/**
 * Get active progress records for a user
 * 
 * @param {string} userId - User ID
 * @returns {Promise<Array>} Array of active progress records
 */
export async function getActiveProgress(userId) {
  try {
    const { data, error } = await supabase
      .from('healing_progress')
      .select('*')
      .eq('user_id', userId)
      .neq('status', 'resolved')
      .order('last_updated', { ascending: false });

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching active progress:', error);
    throw error;
  }
}

/**
 * Get resolved progress records for a user
 * 
 * @param {string} userId - User ID
 * @returns {Promise<Array>} Array of resolved progress records
 */
export async function getResolvedProgress(userId) {
  try {
    const { data, error } = await supabase
      .from('healing_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'resolved')
      .order('last_updated', { ascending: false });

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching resolved progress:', error);
    throw error;
  }
}

/**
 * Update progress record
 * 
 * @param {string} progressId - Progress record ID
 * @param {string} userId - User ID (for authorization)
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object>} Updated progress record
 */
export async function updateProgress(progressId, userId, updates) {
  try {
    const allowedFields = ['progress_percentage', 'status', 'notes'];
    const filteredUpdates = {};

    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        filteredUpdates[field] = updates[field];
      }
    }

    // Validate progress_percentage
    if (filteredUpdates.progress_percentage !== undefined) {
      const percentage = parseInt(filteredUpdates.progress_percentage, 10);
      if (isNaN(percentage) || percentage < 0 || percentage > 100) {
        throw new Error('progress_percentage must be between 0 and 100');
      }
      filteredUpdates.progress_percentage = percentage;
    }

    // Validate status
    if (filteredUpdates.status !== undefined) {
      const validStatuses = ['active', 'improving', 'resolved'];
      if (!validStatuses.includes(filteredUpdates.status)) {
        throw new Error(`status must be one of: ${validStatuses.join(', ')}`);
      }
    }

    const { data, error } = await supabase
      .from('healing_progress')
      .update(filteredUpdates)
      .eq('id', progressId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error updating progress:', error);
    throw error;
  }
}

/**
 * Add photo to progress record
 * 
 * @param {string} progressId - Progress record ID
 * @param {string} userId - User ID (for authorization)
 * @param {string} photoUrl - URL of uploaded photo
 * @param {string} [notes] - Optional notes for the photo
 * @returns {Promise<Object>} Updated progress record
 */
export async function addProgressPhoto(progressId, userId, photoUrl, notes = null) {
  try {
    // Get current record
    const { data: current, error: fetchError } = await supabase
      .from('healing_progress')
      .select('photos')
      .eq('id', progressId)
      .eq('user_id', userId)
      .single();

    if (fetchError) {
      throw fetchError;
    }

    // Add new photo to array
    const photos = current.photos || [];
    photos.push({
      url: photoUrl,
      date: new Date().toISOString(),
      notes: notes || null,
    });

    // Update record
    const { data, error } = await supabase
      .from('healing_progress')
      .update({ photos })
      .eq('id', progressId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error adding progress photo:', error);
    throw error;
  }
}

/**
 * Delete progress record
 * 
 * @param {string} progressId - Progress record ID
 * @param {string} userId - User ID (for authorization)
 * @returns {Promise<boolean>} Success status
 */
export async function deleteProgress(progressId, userId) {
  try {
    const { error } = await supabase
      .from('healing_progress')
      .delete()
      .eq('id', progressId)
      .eq('user_id', userId);

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Error deleting progress:', error);
    throw error;
  }
}

