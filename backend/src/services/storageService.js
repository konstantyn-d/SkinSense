import { supabase } from '../lib/supabaseClient.js';
import { randomUUID } from 'crypto';

/**
 * Storage Service
 * Handles file uploads to Supabase Storage
 */

/**
 * Upload scan image to Supabase Storage
 * 
 * @param {Object} params
 * @param {Buffer} params.fileBuffer - Image file buffer
 * @param {string} params.userId - User ID (for folder organization)
 * @param {string} params.mimeType - MIME type of the image
 * @returns {Promise<string>} Public URL of uploaded image
 */
export async function uploadScanImage({ fileBuffer, userId, mimeType }) {
  try {
    // Generate unique filename
    const fileExtension = getFileExtension(mimeType);
    const fileName = `${userId}/${randomUUID()}.${fileExtension}`;
    const bucketName = 'scan-images';

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, fileBuffer, {
        contentType: mimeType,
        upsert: false,
      });

    if (error) {
      throw error;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(fileName);

    console.log(`✅ Image uploaded: ${fileName}`);
    return urlData.publicUrl;
  } catch (error) {
    console.error('Error uploading scan image:', error);
    throw error;
  }
}

/**
 * Upload progress photo to Supabase Storage
 * 
 * @param {Object} params
 * @param {Buffer} params.fileBuffer - Image file buffer
 * @param {string} params.userId - User ID (for folder organization)
 * @param {string} params.mimeType - MIME type of the image
 * @returns {Promise<string>} Public URL of uploaded image
 */
export async function uploadProgressPhoto({ fileBuffer, userId, mimeType }) {
  try {
    const fileExtension = getFileExtension(mimeType);
    const fileName = `${userId}/${randomUUID()}.${fileExtension}`;
    const bucketName = 'progress-photos';

    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, fileBuffer, {
        contentType: mimeType,
        upsert: false,
      });

    if (error) {
      throw error;
    }

    const { data: urlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(fileName);

    console.log(`✅ Progress photo uploaded: ${fileName}`);
    return urlData.publicUrl;
  } catch (error) {
    console.error('Error uploading progress photo:', error);
    throw error;
  }
}

/**
 * Delete image from Supabase Storage
 * 
 * @param {string} imageUrl - Full URL of the image
 * @param {string} bucketName - Bucket name ('scan-images' or 'progress-photos')
 * @returns {Promise<boolean>} Success status
 */
export async function deleteImage(imageUrl, bucketName) {
  try {
    // Extract file path from URL
    const urlParts = imageUrl.split(`/${bucketName}/`);
    if (urlParts.length < 2) {
      throw new Error('Invalid image URL format');
    }
    const filePath = urlParts[1];

    const { error } = await supabase.storage
      .from(bucketName)
      .remove([filePath]);

    if (error) {
      throw error;
    }

    console.log(`✅ Image deleted: ${filePath}`);
    return true;
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
}

/**
 * Get file extension from MIME type
 * 
 * @param {string} mimeType - MIME type
 * @returns {string} File extension
 */
function getFileExtension(mimeType) {
  const mimeMap = {
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
  };

  return mimeMap[mimeType] || 'jpg';
}

/**
 * Validate image file
 * 
 * @param {Object} file - File object from multer
 * @returns {boolean} True if valid
 * @throws {Error} If validation fails
 */
export function validateImageFile(file) {
  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const maxSize = 10 * 1024 * 1024; // 10MB

  if (!file) {
    throw new Error('No file provided');
  }

  if (!allowedMimeTypes.includes(file.mimetype)) {
    throw new Error(`Invalid file type. Allowed types: ${allowedMimeTypes.join(', ')}`);
  }

  if (file.size > maxSize) {
    throw new Error(`File too large. Maximum size: ${maxSize / 1024 / 1024}MB`);
  }

  return true;
}

