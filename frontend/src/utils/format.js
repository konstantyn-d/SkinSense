/**
 * Formatting Utilities
 * 
 * Helper functions for formatting dates, numbers, and other data
 */

/**
 * Format date to readable string
 * @param {string|Date} dateString - Date string or Date object
 * @param {string} locale - Locale for formatting (default: 'en-US')
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString, locale = 'en-US') => {
  if (!dateString) return ''

  try {
    const date = new Date(dateString)
    
    // Check if date is valid
    if (isNaN(date.getTime())) return dateString

    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }

    return new Intl.DateTimeFormat(locale, options).format(date)
  } catch (error) {
    console.error('Error formatting date:', error)
    return dateString
  }
}

/**
 * Format date and time to readable string
 * @param {string|Date} dateString - Date string or Date object
 * @param {string} locale - Locale for formatting (default: 'en-US')
 * @returns {string} Formatted date and time string
 */
export const formatDateTime = (dateString, locale = 'en-US') => {
  if (!dateString) return ''

  try {
    const date = new Date(dateString)
    
    // Check if date is valid
    if (isNaN(date.getTime())) return dateString

    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }

    return new Intl.DateTimeFormat(locale, options).format(date)
  } catch (error) {
    console.error('Error formatting date time:', error)
    return dateString
  }
}

/**
 * Format date to relative time (e.g., "2 days ago")
 * @param {string|Date} dateString - Date string or Date object
 * @returns {string} Relative time string
 */
export const formatRelativeTime = (dateString) => {
  if (!dateString) return ''

  try {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now - date) / 1000)

    if (diffInSeconds < 60) {
      return 'just now'
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60)
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`
    }

    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`
    }

    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 30) {
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`
    }

    const diffInMonths = Math.floor(diffInDays / 30)
    if (diffInMonths < 12) {
      return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`
    }

    const diffInYears = Math.floor(diffInMonths / 12)
    return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`
  } catch (error) {
    console.error('Error formatting relative time:', error)
    return dateString
  }
}

/**
 * Format score with maximum value
 * @param {number} score - Score value
 * @param {number} maxScore - Maximum score (default: 100)
 * @returns {string} Formatted score string
 */
export const formatScore = (score, maxScore = 100) => {
  if (score === null || score === undefined) return '--'
  
  return `${Math.round(score)}/${maxScore}`
}

/**
 * Format percentage
 * @param {number} value - Percentage value (0-100)
 * @param {number} decimals - Number of decimal places (default: 0)
 * @returns {string} Formatted percentage string
 */
export const formatPercentage = (value, decimals = 0) => {
  if (value === null || value === undefined) return '--'
  
  return `${value.toFixed(decimals)}%`
}

/**
 * Format number with thousand separators
 * @param {number} value - Number value
 * @param {string} locale - Locale for formatting (default: 'en-US')
 * @returns {string} Formatted number string
 */
export const formatNumber = (value, locale = 'en-US') => {
  if (value === null || value === undefined) return '0'
  
  return new Intl.NumberFormat(locale).format(value)
}

/**
 * Format file size in bytes to human-readable string
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size string
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

/**
 * Truncate text with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length (default: 50)
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text) return ''
  if (text.length <= maxLength) return text
  
  return `${text.substring(0, maxLength)}...`
}

/**
 * Get initials from name
 * @param {string} name - Full name
 * @returns {string} Initials (e.g., "John Doe" -> "JD")
 */
export const getInitials = (name) => {
  if (!name) return '?'
  
  const parts = name.trim().split(' ')
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase()
  }
  
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
}

/**
 * Format severity level to readable string with emoji
 * @param {string} severity - Severity level (low, medium, high)
 * @returns {object} Object with label and emoji
 */
export const formatSeverity = (severity) => {
  const severityMap = {
    low: { label: 'Low', emoji: '🟢', color: 'success' },
    medium: { label: 'Medium', emoji: '🟡', color: 'warning' },
    high: { label: 'High', emoji: '🔴', color: 'error' }
  }
  
  return severityMap[severity?.toLowerCase()] || { label: severity, emoji: '⚪', color: 'default' }
}

/**
 * Format status to readable string with emoji
 * @param {string} status - Status (active, improving, resolved)
 * @returns {object} Object with label and emoji
 */
export const formatStatus = (status) => {
  const statusMap = {
    active: { label: 'Active', emoji: '🎯', color: 'primary' },
    improving: { label: 'Improving', emoji: '📈', color: 'success' },
    resolved: { label: 'Resolved', emoji: '✅', color: 'success' }
  }
  
  return statusMap[status?.toLowerCase()] || { label: status, emoji: '⚪', color: 'default' }
}

export default {
  formatDate,
  formatDateTime,
  formatRelativeTime,
  formatScore,
  formatPercentage,
  formatNumber,
  formatFileSize,
  truncateText,
  getInitials,
  formatSeverity,
  formatStatus
}

