# SkinSense Backend API

AI-powered skin health analysis backend built with Node.js, Express, and Supabase.

## 🚀 Quick Start

### Prerequisites

- Node.js v18 or higher
- Supabase account and project
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env with your Supabase credentials
```

### Running the Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

Server will start on `http://localhost:4000`

## 📁 Project Structure

```
backend/
├── src/
│   ├── app.js                 # Express app configuration
│   ├── server.js              # Server entry point
│   ├── config/
│   │   └── env.js            # Environment configuration
│   ├── lib/
│   │   └── supabaseClient.js # Supabase client setup
│   ├── middleware/
│   │   └── auth.js           # Authentication middleware
│   ├── routes/
│   │   ├── userRoutes.js     # User endpoints
│   │   ├── scanRoutes.js     # Skin scan endpoints
│   │   └── progressRoutes.js # Progress tracking endpoints
│   ├── services/
│   │   ├── userService.js    # User business logic
│   │   ├── scanService.js    # Scan business logic
│   │   ├── progressService.js # Progress business logic
│   │   └── storageService.js # File upload logic
│   ├── clients/
│   │   └── youcamClient.js   # AI API client (mock mode)
│   └── types/
│       └── skinScan.js       # Type definitions (JSDoc)
├── docs/
│   ├── database-schema.sql   # Database schema for Supabase
│   └── SETUP.md             # Detailed setup instructions
├── .env.example              # Environment variables template
└── package.json
```

## 🔌 API Endpoints

### Health Check

- `GET /api/health` - Server health check

### Authentication

All protected endpoints require `Authorization: Bearer <token>` header with Supabase JWT.

### User Endpoints

- `GET /api/users/me` - Get current user profile
- `PATCH /api/users/me` - Update current user profile
- `GET /api/users/:id` - Get user by ID

### Scan Endpoints

- `POST /api/scans` - Create new skin scan (multipart/form-data with `image` field)
- `GET /api/scans` - Get all scans for current user
- `GET /api/scans/stats` - Get scan statistics
- `GET /api/scans/:id` - Get detailed scan by ID
- `DELETE /api/scans/:id` - Delete scan

### Progress Endpoints

- `GET /api/progress/summary` - Get progress summary
- `GET /api/progress` - Get active progress records
- `GET /api/progress/resolved` - Get resolved issues
- `PATCH /api/progress/:id` - Update progress record
- `POST /api/progress/:id/photo` - Add progress photo
- `POST /api/progress/:id/healing-plan` - Get healing plan for issue
- `DELETE /api/progress/:id` - Delete progress record

## 🔐 Environment Variables

```env
# Server
PORT=4000

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# YouCam AI API (optional, uses mock mode if not set)
YOUCAM_API_BASE_URL=
YOUCAM_API_KEY=

# CORS
FRONTEND_URL=http://localhost:5173

# Environment
NODE_ENV=development
```

## 🗄️ Database Setup

1. Create a Supabase project
2. Run the SQL schema from `docs/database-schema.sql` in Supabase SQL Editor
3. Enable authentication providers (Email, Google)
4. Create storage buckets: `scan-images` and `progress-photos`
5. Configure storage policies (see `docs/SETUP.md`)

## 🧪 Testing Endpoints

### Health Check

```bash
curl http://localhost:4000/api/health
```

### Create Scan (requires auth token)

```bash
curl -X POST http://localhost:4000/api/scans \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "image=@path/to/image.jpg"
```

### Get User Profile

```bash
curl http://localhost:4000/api/users/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🔧 Development

### Mock Mode

The AI skin analysis currently runs in **mock mode** by default. It returns realistic fake data for development purposes.

To enable real AI API:
1. Set `YOUCAM_API_BASE_URL` and `YOUCAM_API_KEY` in `.env`
2. Implement the real API integration in `src/clients/youcamClient.js`

### Adding New Endpoints

1. Create service in `src/services/`
2. Create routes in `src/routes/`
3. Register routes in `src/app.js`
4. Add JSDoc comments for type safety

## 📝 Code Style

- Use ES modules (`import`/`export`)
- Add JSDoc comments for functions
- Use descriptive variable names
- Handle errors properly with try/catch
- Log important operations

## 🔒 Security

- JWT authentication via Supabase
- Row Level Security (RLS) enabled on all tables
- Service role key never exposed to frontend
- File upload validation (type, size)
- User authorization checks on all protected routes

## 🚀 Deployment

### Environment

- Set `NODE_ENV=production`
- Use strong secrets for production
- Enable HTTPS
- Configure CORS for production frontend URL

### Recommended Platforms

- Railway
- Render
- Heroku
- DigitalOcean App Platform
- AWS Elastic Beanstalk

## 📚 Documentation

For detailed setup instructions, see `docs/SETUP.md`

## 🐛 Troubleshooting

### "Missing required environment variable"

Make sure `.env` file exists and contains all required variables.

### "Unable to connect to Supabase"

Verify your `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are correct.

### "Permission denied" errors

Check that RLS policies are set up correctly in Supabase.

### Image upload fails

Ensure storage buckets exist and policies are configured.

## 📄 License

ISC

