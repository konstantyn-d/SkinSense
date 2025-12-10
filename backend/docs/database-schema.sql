-- SkinSense Database Schema for Supabase
-- This file contains the complete database schema for the SkinSense application
-- Run this in Supabase SQL Editor after creating your project

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- TABLE: users
-- Stores user profile information
-- ============================================================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- ============================================================================
-- TABLE: skin_scans
-- Stores results of skin analysis scans
-- ============================================================================
CREATE TABLE IF NOT EXISTS skin_scans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  scan_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  image_url TEXT NOT NULL,
  detected_issues JSONB NOT NULL DEFAULT '[]'::jsonb,
  overall_skin_health_score INTEGER NOT NULL CHECK (overall_skin_health_score >= 0 AND overall_skin_health_score <= 100),
  recommendations JSONB DEFAULT '[]'::jsonb,
  analysis_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_skin_scans_user_id ON skin_scans(user_id);
CREATE INDEX IF NOT EXISTS idx_skin_scans_scan_date ON skin_scans(scan_date DESC);
CREATE INDEX IF NOT EXISTS idx_skin_scans_user_date ON skin_scans(user_id, scan_date DESC);

-- ============================================================================
-- TABLE: healing_progress
-- Tracks healing progress for detected skin issues
-- ============================================================================
CREATE TABLE IF NOT EXISTS healing_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  related_scan_id UUID REFERENCES skin_scans(id) ON DELETE SET NULL,
  issue_name TEXT NOT NULL,
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  status TEXT NOT NULL CHECK (status IN ('active', 'improving', 'resolved')),
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  notes TEXT,
  photos JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_healing_progress_user_id ON healing_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_healing_progress_status ON healing_progress(status);
CREATE INDEX IF NOT EXISTS idx_healing_progress_user_status ON healing_progress(user_id, status);
CREATE INDEX IF NOT EXISTS idx_healing_progress_related_scan ON healing_progress(related_scan_id);

-- ============================================================================
-- COMMENTS: Add descriptions to tables and columns
-- ============================================================================

COMMENT ON TABLE users IS 'User profile information';
COMMENT ON COLUMN users.id IS 'Unique user identifier';
COMMENT ON COLUMN users.email IS 'User email address (unique)';
COMMENT ON COLUMN users.full_name IS 'User full name';

COMMENT ON TABLE skin_scans IS 'Results of AI skin analysis scans';
COMMENT ON COLUMN skin_scans.detected_issues IS 'Array of detected skin issues with details (name, severity, location, description, score)';
COMMENT ON COLUMN skin_scans.overall_skin_health_score IS 'Overall skin health score (0-100)';
COMMENT ON COLUMN skin_scans.recommendations IS 'Array of personalized recommendations (title, description, category, priority)';

COMMENT ON TABLE healing_progress IS 'Tracks healing progress for skin issues over time';
COMMENT ON COLUMN healing_progress.status IS 'Current status: active, improving, or resolved';
COMMENT ON COLUMN healing_progress.progress_percentage IS 'Healing progress percentage (0-100)';
COMMENT ON COLUMN healing_progress.photos IS 'Array of progress photo URLs';

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Enable RLS to ensure users can only access their own data
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE skin_scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE healing_progress ENABLE ROW LEVEL SECURITY;

-- Users table policies
CREATE POLICY "Users can view their own profile"
  ON users FOR SELECT
  USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update their own profile"
  ON users FOR UPDATE
  USING (auth.uid()::text = id::text);

-- Skin scans table policies
CREATE POLICY "Users can view their own scans"
  ON skin_scans FOR SELECT
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert their own scans"
  ON skin_scans FOR INSERT
  WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete their own scans"
  ON skin_scans FOR DELETE
  USING (auth.uid()::text = user_id::text);

-- Healing progress table policies
CREATE POLICY "Users can view their own progress"
  ON healing_progress FOR SELECT
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert their own progress"
  ON healing_progress FOR INSERT
  WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update their own progress"
  ON healing_progress FOR UPDATE
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete their own progress"
  ON healing_progress FOR DELETE
  USING (auth.uid()::text = user_id::text);

-- ============================================================================
-- SAMPLE DATA STRUCTURE EXAMPLES (for reference, not inserted)
-- ============================================================================

/*
Example detected_issues structure:
[
  {
    "name": "Acne",
    "severity": "moderate",
    "location": "forehead",
    "description": "Moderate acne detected on forehead area",
    "score": 65,
    "confidence": 0.85
  }
]

Example recommendations structure:
[
  {
    "title": "Use salicylic acid cleanser",
    "description": "Apply twice daily to reduce acne",
    "category": "skincare",
    "priority": "high"
  },
  {
    "title": "Reduce dairy intake",
    "description": "Dairy products may trigger acne",
    "category": "lifestyle",
    "priority": "medium"
  }
]

Example photos structure in healing_progress:
[
  {
    "url": "https://storage.supabase.co/...",
    "date": "2024-01-15T10:30:00Z",
    "notes": "Week 1 progress"
  }
]
*/

-- ============================================================================
-- FUNCTIONS: Helper functions for common operations
-- ============================================================================

-- Function to update last_updated timestamp automatically
CREATE OR REPLACE FUNCTION update_last_updated_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_updated = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update last_updated in healing_progress
CREATE TRIGGER update_healing_progress_last_updated
  BEFORE UPDATE ON healing_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_last_updated_column();

-- ============================================================================
-- STORAGE BUCKETS (for Supabase Storage)
-- Run these commands in Supabase Dashboard > Storage
-- ============================================================================

/*
Create storage buckets for images:

1. Bucket name: "scan-images"
   - Public: false
   - File size limit: 10MB
   - Allowed MIME types: image/jpeg, image/png, image/webp

2. Bucket name: "progress-photos"
   - Public: false
   - File size limit: 10MB
   - Allowed MIME types: image/jpeg, image/png, image/webp

Storage policies (to be created in Supabase Dashboard):
- Users can upload to their own folder: user_id/filename
- Users can read their own images
- Users can delete their own images
*/

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================

