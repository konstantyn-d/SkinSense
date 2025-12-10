import { supabase } from '../lib/supabaseClient.js';

/**
 * User Service
 * Handles user-related operations and synchronization with database
 */

/**
 * Ensures user exists in our database
 * If user doesn't exist, creates a new record
 * 
 * @param {Object} supabaseUser - User object from Supabase Auth
 * @param {string} supabaseUser.id - User ID from Supabase Auth
 * @param {string} supabaseUser.email - User email
 * @param {Object} supabaseUser.metadata - User metadata (contains full_name, etc.)
 * @returns {Promise<Object>} User record from database
 */
export async function ensureUserExists(supabaseUser) {
  try {
    const { id, email, metadata } = supabaseUser;
    const user_metadata = metadata;

    // Check if user already exists in our database
    const { data: existingUser, error: selectError } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    // If user exists, return it
    if (existingUser && !selectError) {
      return existingUser;
    }

    // If user doesn't exist, create new record
    const fullName = user_metadata?.full_name || user_metadata?.name || email?.split('@')[0] || 'User';
    
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert({
        id,
        email,
        full_name: fullName,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Failed to create user:', insertError.message);
      throw new Error(`Failed to create user: ${insertError.message}`);
    }

    console.log(`✅ New user created: ${email}`);
    return newUser;
  } catch (error) {
    console.error('Error in ensureUserExists:', error.message);
    throw error;
  }
}

/**
 * Get user by ID
 * 
 * @param {string} userId - User ID
 * @returns {Promise<Object|null>} User record or null if not found
 */
export async function getUserById(userId) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        return null;
      }
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in getUserById:', error);
    throw error;
  }
}

/**
 * Get user by email
 * 
 * @param {string} email - User email
 * @returns {Promise<Object|null>} User record or null if not found
 */
export async function getUserByEmail(email) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in getUserByEmail:', error);
    throw error;
  }
}

/**
 * Update user profile
 * 
 * @param {string} userId - User ID
 * @param {Object} updates - Fields to update
 * @param {string} updates.full_name - User's full name
 * @returns {Promise<Object>} Updated user record
 */
export async function updateUserProfile(userId, updates) {
  try {
    const allowedFields = ['full_name'];
    const filteredUpdates = {};

    // Only allow updating specific fields
    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        filteredUpdates[field] = updates[field];
      }
    }

    const { data, error } = await supabase
      .from('users')
      .update(filteredUpdates)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in updateUserProfile:', error);
    throw error;
  }
}

/**
 * Delete user (soft delete - just for reference, actual deletion handled by Supabase Auth)
 * 
 * @param {string} userId - User ID
 * @returns {Promise<boolean>} Success status
 */
export async function deleteUser(userId) {
  try {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', userId);

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteUser:', error);
    throw error;
  }
}

