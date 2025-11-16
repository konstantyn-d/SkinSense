# Changelog

## [Unreleased] - 2025-11-16

### Fixed
- Fixed CORS configuration to support multiple development ports (5173, 5174)
- Fixed authentication flow on Profile page
- Added missing Supabase environment variables configuration for frontend
- Temporarily disabled RLS for users table in development environment

### Changed
- Simplified authentication middleware logging
- Optimized user creation flow in userService
- Fixed Vite dev server port to 5173 with strict port mode

### Added
- Frontend .env configuration file
- Improved error handling in authentication middleware

### Technical Details
- **CORS Fix**: Backend now accepts requests from both localhost:5173 and localhost:5174 in development
- **Environment Variables**: Created frontend/.env with Supabase configuration
- **RLS**: Disabled Row-Level Security for users table (development only, needs proper policies for production)
- **Port Configuration**: Fixed frontend dev server to port 5173 to avoid conflicts

### Known Issues
- RLS is disabled for users table (acceptable for development, must be configured before production)
- Need to set up proper RLS policies before deploying to production

### Migration Notes
If you're setting up this project:
1. Copy `frontend/.env.example` to `frontend/.env` and fill in your Supabase credentials
2. Run the database schema from `backend/docs/database-schema.sql`
3. Temporarily disable RLS for users table: `ALTER TABLE users DISABLE ROW LEVEL SECURITY;`
4. This is for development only - configure proper RLS policies before production deployment

