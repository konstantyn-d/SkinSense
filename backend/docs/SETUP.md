# Backend Setup Instructions

## Prerequisites

- Node.js (v18 or higher)
- Supabase account
- npm or yarn

## Step 1: Install Dependencies

```bash
cd backend
npm install
```

## Step 2: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be fully initialized
3. Note down your project URL and API keys

## Step 3: Setup Database Schema

1. Open your Supabase project dashboard
2. Go to **SQL Editor** (left sidebar)
3. Click **New Query**
4. Copy the entire contents of `backend/docs/database-schema.sql`
5. Paste into the SQL editor and click **Run**
6. Verify all tables were created successfully

## Step 4: Enable Authentication

1. In Supabase Dashboard, go to **Authentication** > **Providers**
2. Enable **Email** provider:
   - Enable email/password authentication
   - Optionally configure email templates
3. Enable **Google** provider (optional):
   - Create OAuth credentials in Google Cloud Console
   - Add Client ID and Client Secret to Supabase
   - Add authorized redirect URI: `https://your-project.supabase.co/auth/v1/callback`

## Step 5: Setup Storage Buckets

1. Go to **Storage** in Supabase Dashboard
2. Create two new buckets:

### Bucket 1: scan-images
- Name: `scan-images`
- Public: **No** (private)
- File size limit: 10MB
- Allowed MIME types: `image/jpeg`, `image/png`, `image/webp`

### Bucket 2: progress-photos
- Name: `progress-photos`
- Public: **No** (private)
- File size limit: 10MB
- Allowed MIME types: `image/jpeg`, `image/png`, `image/webp`

### Storage Policies

For each bucket, add these policies:

**Insert Policy:**
```sql
-- Users can upload to their own folder
CREATE POLICY "Users can upload own images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'scan-images' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

**Select Policy:**
```sql
-- Users can view their own images
CREATE POLICY "Users can view own images"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'scan-images' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

**Delete Policy:**
```sql
-- Users can delete their own images
CREATE POLICY "Users can delete own images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'scan-images' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

Repeat for `progress-photos` bucket.

## Step 6: Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in your Supabase credentials:
   ```env
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

   **Where to find these:**
   - Go to **Project Settings** > **API**
   - `SUPABASE_URL` = Project URL
   - `SUPABASE_SERVICE_ROLE_KEY` = service_role key (⚠️ Keep this secret!)

3. Configure other variables as needed

## Step 7: Run the Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## Step 8: Verify Installation

Test the health endpoint:
```bash
curl http://localhost:4000/api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "environment": "development"
}
```

## Security Notes

⚠️ **IMPORTANT:**
- Never commit `.env` file to version control
- Never expose `SUPABASE_SERVICE_ROLE_KEY` to frontend
- Use `SUPABASE_ANON_KEY` on frontend only
- Always validate user input on backend
- Enable RLS (Row Level Security) on all tables

## Troubleshooting

### Error: "Missing required environment variable"
- Make sure `.env` file exists and contains all required variables
- Check that variable names match exactly

### Error: "Unable to connect to Supabase"
- Verify your `SUPABASE_URL` is correct
- Check that your API key is valid
- Ensure your Supabase project is active

### Error: "Permission denied" when querying database
- Verify RLS policies are set up correctly
- Check that user is authenticated
- Ensure JWT token is valid

## Next Steps

After setup is complete:
- Proceed to implement Auth Middleware (Step 3 in development plan)
- Test authentication flow
- Implement Skin Scan API endpoints

