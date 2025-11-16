# SkinSense – Step-by-Step Implementation Plan (for CursorAI)

--

    @RULES.md RULES : 



      You are an expert in Web development, including JavaScript, Vue.js, CSS, Node.js. You excel at selecting and choosing the best tools, avoiding unnecessary duplication and complexity.

      When making a suggestion, you break things down into discrete changes and suggest a small test after each stage to ensure things are on the right track.

      Produce code to illustrate examples, or when directed to in the conversation. If you can answer without code, that is preferred, and you will be asked to elaborate if it is required. Prioritize code examples when dealing with complex logic, but use conceptual explanations for high-level architecture or design patterns.

      Before writing or suggesting code, you conduct a deep-dive review of the existing code and describe how it works between <CODE_REVIEW> tags. Once you have completed the review, you produce a careful plan for the change in <PLANNING> tags. Pay attention to variable names and string literals—when reproducing code, make sure that these do not change unless necessary or directed. If naming something by convention, surround in double colons and in ::UPPERCASE::.

      Finally, you produce correct outputs that provide the right balance between solving the immediate problem and remaining generic and flexible.

      You always ask for clarification if anything is unclear or ambiguous. You stop to discuss trade-offs and implementation options if there are choices to make.

      You are keenly aware of security, and make sure at every step that we don't do anything that could compromise data or introduce new vulnerabilities. Whenever there is a potential security risk (e.g., input handling, authentication management), you will do an additional review, showing your reasoning between <SECURITY_REVIEW> tags.

      Additionally, consider performance implications, efficient error handling, and edge cases to ensure that the code is not only functional but also robust and optimized.

      Everything produced must be operationally sound. We consider how to host, manage, monitor, and maintain our solutions. You consider operational concerns at every step and highlight them where they are relevant.

      Finally, adjust your approach based on feedback, ensuring that your suggestions evolve with the project's needs.
    



PROGECT DESCRIPTION : 


SkinSense — AI-Powered Skin Health Web Application

SkinSense is a modern AI-driven web application designed to analyze a user’s facial skin in real time using their device’s camera. After capturing a photo, the system sends the image to an external AI Skin Analysis API (YouCam), detects potential skin issues, and provides personalized recommendations for improving skin health.

The platform allows users to track their skin condition over time, monitor healing progress, and follow a structured skincare routine generated specifically for their detected issues.

SkinSense combines clean architecture, a neumorphic UI design, and a seamless user journey to deliver a professional health-tech experience.





--








Your job: implement the **SkinSense** web app step by step, without skipping steps, using this exact tech stack:








- Backend: Node.js + Express.js
- Database & Auth: Supabase (PostgreSQL)
- Optional ORM: Prisma (only if explicitly requested later)
- Frontend: Vue.js + Vite
- External AI: "AI Skin Analysis API" (YouCam online editor API – treat as REST API with image upload + JSON response)




Follow these rules:

1. **Do not invent APIs.**  
   For the AI Skin Analysis API, if real docs are not available, create a clearly marked **mock module** with a fake but realistic response structure.

2. **Work in very small steps.**  
   Complete each step fully (compiling, no obvious errors) before moving to the next.

3. **Keep code organized and minimal.**  
   Use clean architecture, no unnecessary abstractions. Name things clearly.

4. **Security basics.**  
   Never expose secrets in frontend code. Use environment variables on the backend for all keys (Supabase, YouCam).

5. **Design system.**  
   Implement a neumorphic UI using the SkinSense design JSON (colors, radii, typography).  
   Create reusable components instead of hard-coding styles everywhere.

---

## 0. Project Structure (root level)

Create a monorepo-style structure:

- `/backend` – Node.js + Express API
- `/frontend` – Vite + Vue.js SPA
- `/README.md` – high-level project description

Tasks:

0.1. Initialize a root Git repo (if not already).
0.2. Inside `/backend` run `npm init -y`.  
0.3. Inside `/frontend` run `npm create vite@latest` with Vue (JavaScript, not TypeScript, unless the user asks for TS later).
0.4. Add basic `.gitignore` for Node, Vite, logs, env files.

Do not move to step 1 until the skeleton structure is created.

IF THE STRUCTURE IS ALREADY CREATED, MOVE ON!

---

## 1. Backend – Setup & Supabase Integration

### 1.1 Basic Express Server

Create in `/backend`:

- `src/app.js` – creates Express app
- `src/server.js` – starts the server

Requirements:

- Use ES modules or CommonJS consistently; pick one and stick to it.
- Add middleware: `express.json()`, simple request logging, CORS (configurable origin).
- Add route `GET /api/health` returning `{ status: "ok" }`.

### 1.2 Environment Configuration

Add:

- `dotenv` dependency.
- `.env.example` with keys (no real values):

  - `PORT=4000`
  - `SUPABASE_URL=`
  - `SUPABASE_SERVICE_ROLE_KEY=`
  - `YOUCAM_API_BASE_URL=`
  - `YOUCAM_API_KEY=`
  - `FRONTEND_URL=http://localhost:5173`

Implement:

- `src/config/env.js` that reads these variables and throws clear errors if missing.
- Use this config in `app.js` / `server.js`.

### 1.3 Supabase Client (Service Role)

Create:

- `src/lib/supabaseClient.js`

Use the official `@supabase/supabase-js`:

- Initialize client with `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`.
- Export a configured client to be used by repositories.

---

## 2. Backend – Database Schema (Supabase)

### 2.1 Define Tables

In `docs/database-schema.sql` (or similar) write SQL for Supabase to create three main tables:

1. `users`
   - `id uuid primary key default uuid_generate_v4()`
   - `email text unique not null`
   - `full_name text`
   - `created_at timestamptz default now()`

2. `skin_scans`
   - `id uuid primary key default uuid_generate_v4()`
   - `user_id uuid references users(id) on delete cascade`
   - `scan_date timestamptz not null`
   - `image_url text not null`
   - `detected_issues jsonb not null` (list of issues)
   - `overall_skin_health_score integer not null`
   - `recommendations jsonb` (structured data for skin care tips)
   - `analysis_notes text`
   - `created_at timestamptz default now()`

3. `healing_progress`
   - `id uuid primary key default uuid_generate_v4()`
   - `user_id uuid references users(id) on delete cascade`
   - `related_scan_id uuid references skin_scans(id) on delete set null`
   - `issue_name text not null`
   - `progress_percentage integer default 0`
   - `status text not null` — enum-like string: "active" | "improving" | "resolved"
   - `start_date date not null`
   - `last_updated timestamptz default now()`
   - `notes text`
   - `photos jsonb` (array of URLs to progress photos)
   - `created_at timestamptz default now()`

Note: `detected_issues` and `recommendations` should be structured in a way that can be easily rendered on the frontend (name, severity, location, description, etc.).

### 2.2 Run Schema in Supabase

Instruction for human developer:

- Create Supabase project.
- Run `database-schema.sql` in Supabase SQL editor.
- Enable Supabase Auth with email/password + Google provider.

Cursor should **not** try to run Supabase itself; only maintain the SQL file and assumptions.

---

## 3. Backend – Auth Model & User Sync

We will use **Supabase Auth** for login/registration on the frontend.

Backend must:

- Trust Supabase’s JWT and map it to our `users` table.

### 3.1 Auth Middleware

Create:

- `src/middleware/auth.js`:

  - Extract `Authorization: Bearer <token>` from headers.
  - Verify token with Supabase’s `auth.getUser()` using the supabase client.
  - On success, attach `{ userId, email }` to `req.user`.
  - On failure, respond `401 Unauthorized`.

### 3.2 User Synchronization

Create `src/services/userService.js`:

- Function `ensureUserExists(supabaseUser)`:
  - Look up user in `users` table by `email`.
  - If not found, insert a new record with `email` and `full_name` (if available).
  - Return internal `user` record (id, email, full_name).

Update `auth` middleware:

- After verifying token, call `ensureUserExists` and attach `req.user.internalId`.

---

## 4. Backend – Skin Scan API

Goal: an endpoint that accepts an image from frontend, calls AI API, stores data in Supabase, and returns structured result.

### 4.1 Define Data Types (in comments/JSDoc)

In `src/types/skinScan.js` (or simply JSDoc comments):

- Describe shape of **DetectedIssue**:
  - `name`, `severity`, `location`, `description`, `score` etc.
- Describe shape of **Recommendation**:
  - `title`, `description`, `category` (skincare / lifestyle), `priority`.

These types guide future code and frontend.

### 4.2 AI Client Wrapper

Create `src/clients/youcamClient.js`:

- Export async function `analyzeSkin({ imageBuffer })`.
- For now, implement two modes:
  1. **Mock mode** (default): returns a fixed but realistic JSON object with:
     - `overallScore`
     - `issues` array
     - `recommendations` array
  2. TODO comment: "Replace with real YouCam API integration once docs are available".

This prevents hallucinations about real endpoints.

### 4.3 Routes for Scans

Create `src/routes/scanRoutes.js` and register in `app.js` under `/api/scans`.

Endpoints:

1. `POST /api/scans`
   - Protected by `auth` middleware.
   - Accepts multipart/form-data with:
     - `image` (file)
   - Steps:
     - Read image into memory (use `multer` or similar).
     - Call `youcamClient.analyzeSkin`.
     - Upload the original image to Supabase Storage (or another bucket) and get `image_url`.
     - Insert row into `skin_scans`.
     - For each detected issue, insert a row into `healing_progress` with:
       - `user_id`, `related_scan_id`, `issue_name`, `status="active"`, `progress_percentage=0`, `start_date=now()`, `notes` from AI, no photos.
     - Return JSON with:
       - scan data
       - list of issues
       - recommendations.

2. `GET /api/scans`
   - Protected.
   - Query `skin_scans` by `user_id`, order by `scan_date desc`, limit & offset.
   - Return minimal list for “Recent Scans”:
     - `id`, `scan_date`, `image_url`, `overall_skin_health_score`, number of issues.

3. `GET /api/scans/:id`
   - Protected.
   - Return detailed scan:
     - full detected issues, recommendations, analysis notes.

---

## 5. Backend – Healing Progress API

Create `src/routes/progressRoutes.js` and register under `/api/progress`.

Endpoints:

1. `GET /api/progress/summary`
   - Protected.
   - For current user, calculate:
     - `activeIssues` – count of `status != 'resolved'`
     - `avgProgress` – average of `progress_percentage` for active issues
     - `resolvedIssues` – count of `status = 'resolved'`
   - Return JSON with these numbers.

2. `GET /api/progress`
   - Protected.
   - List all **active** issues with data needed for Progress page:
     - `id`, `issue_name`, `progress_percentage`, `status`, `start_date`, `last_updated`, `notes`, optionally last photo URL.

3. `PATCH /api/progress/:id`
   - Protected.
   - Body allows:
     - `progress_percentage` (number)
     - `status` (string)
     - `notes` (string)
     - `photo_url` optional: if provided, append to `photos` array.
   - Update row and `last_updated`.

4. `GET /api/progress/resolved`
   - Protected.
   - List resolved issues (for “Resolved Issues” section).

5. Optional: endpoint `POST /api/progress/:id/healing-plan`
   - For MVP, simply returns a **static generated plan template** based on issue name and severity.
   - This will back the “How to Heal” modal.
   - Structure:
     - `overview`, `commonCauses`, `dailyRoutine.morning`, `dailyRoutine.evening`, `ingredients`, `lifestyleChanges`.

---

## 6. Frontend – Vite + Vue Setup

### 6.1 Vite + Vue Base

Inside `/frontend`:

- Ensure project created with Vue + Vite.
- Clean default boilerplate.

Create:

- `src/main.js` – mount Vue app.
- `src/App.vue` – base layout with `<router-view />`.
- Install and configure:
  - `vue-router`
  - `axios` (for API calls)
  - optionally `pinia` for state management (helpful for auth/user).

### 6.2 Routing

Configure routes:

- `/login` – Login/Registration page.
- `/profile` – Profile dashboard.
- `/scan` – Scan page.
- `/progress` – Progress tracking page.

Add **route guards**:

- If user is not authenticated (no Supabase session), redirect to `/login`.
- If authenticated, redirect `/` to `/profile`.

---

## 7. Frontend – Auth with Supabase

### 7.1 Supabase Client on Frontend

Create:

- `src/lib/supabaseClient.js`
  - Initialize Supabase with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from `.env`.

### 7.2 Auth Store / Composable

Create `src/stores/authStore.js` (Pinia) or `src/composables/useAuth.js`:

- Methods:
  - `signInWithEmail(email, password)`
  - `signUpWithEmail(email, password, fullName)`
  - `signInWithGoogle()`
  - `signOut()`
  - `getCurrentSession()` / reactive user object

Make sure to:

- Persist session in Supabase (it already handles localStorage).
- Provide `access_token` to backend via Axios `Authorization` header.

### 7.3 Login/Registration Page

Create `src/views/LoginView.vue`:

- Split screen or card with tabs: "Login" and "Register".
- Inputs:
  - email, password, full name (for registration).
- Buttons:
  - "Continue with Google"
  - "Login"
  - "Create account"
- On success:
  - Redirect to `/profile`.

Apply neumorphic styling based on design system:

- Background: soft light gray.
- Card with soft outer & inner shadows.
- Primary button using `primary.main` color.

---

## 8. Frontend – Design System & Layout

### 8.1 Design Tokens

Create `src/styles/design-tokens.css`:

- CSS variables for colors, typography, spacing, radii, shadows based on SkinSense design JSON:
  - `--color-primary`, `--color-background`, `--radius-lg`, etc.

### 8.2 Global Styles

Create `src/styles/global.css`:

- Set base font to Inter.
- Set body background to neumorphic light gray.
- Reset margins/paddings.
- Include `.neumorphic-card`, `.neumorphic-button`, `.stat-card`, `.progress-bar`, etc.

Import global styles in `main.js`.

### 8.3 Layout Shell

Create `src/layouts/MainLayout.vue`:

- Top header with logo "SkinSense" and small subtitle.
- Main content area (centered, max-width ~960px).
- Bottom navigation bar with 3 items:
  - Profile, Scan, Progress
  - Icons + labels, active state highlighted.

Use `MainLayout` for all authenticated pages.

---

## 9. Frontend – Profile Page

Create `src/views/ProfileView.vue`.

### 9.1 Header Card

- Show avatar (placeholder), user full name, email.
- Show small badges:
  - total scans
  - resolved issues count
- Logout button.

Fetch data from backend:

- `GET /api/scans` for total scans.
- `GET /api/progress/summary` for resolved issues.

### 9.2 Stat Cards

Three neumorphic stat cards:

- "Average Health Score" – computed from all scans.
  - If backend doesn’t provide a dedicated endpoint, compute by averaging `overall_skin_health_score` from `/api/scans`.
- "Total Scans" – length of scans list.
- "Tracking Issues" – `activeIssues` from `/api/progress/summary`.

### 9.3 Recent Scans List

Under header:

- For each scan from `/api/scans`:
  - Thumbnail image (small avatar)
  - `scan_date` (formatted)
  - Number of issues (derived from `detected_issues.length` or provided by backend)
  - Score badge on the right.

On click of a scan:

- Open modal `ScanDetailsModal.vue`.
- Fetch details via `GET /api/scans/:id` if not already present.

---

## 10. Frontend – Scan Page (Webcam + AI Call)

Create `src/views/ScanView.vue`.

### 10.1 Hero Section

- Centered card with:
  - Large scan icon.
  - Title: "Start Your Skin Analysis".
  - Subtitle text from your design.
  - Primary button "Begin Scan".

### 10.2 Webcam Component

Create `src/components/CameraCapture.vue`:

- Use `navigator.mediaDevices.getUserMedia({ video: true })`.
- Display `<video>` preview.
- Button "Capture" to take snapshot using `<canvas>`.
- Emit captured image as Blob/File to parent component.

Integrate in ScanView:

- When user presses "Begin Scan":
  - Show `CameraCapture` in a modal or below hero.
  - After capture, show preview image and "Analyze" button.

### 10.3 Call Backend Scan API

On "Analyze":

- Send `POST /api/scans` with multipart/form-data:
  - `image` = captured photo Blob.
  - Include `Authorization` header with Supabase token.

Show loading state during analysis.

On success:

- Show a modal with:
  - Detected issues (name, severity, bars).
  - Recommendations list.
- Optionally navigate to `/profile` and refresh recent scans / stats.

---

## 11. Frontend – Progress Page

Create `src/views/ProgressView.vue`.

### 11.1 Summary Cards

At top, three stat cards:

- "Active Issues" – from `/api/progress/summary`.
- "Avg Progress" – from `/api/progress/summary` (percentage).
- "Resolved" – from `/api/progress/summary`.

### 11.2 "Track New Issue" Button

Button that opens a modal:

- Allows user to manually add an issue:
  - `issue_name`, optional `related_scan_id`, `notes`.
- Calls `POST /api/progress` (if created) or reuse an extension of existing API.
- For now, if there is no POST endpoint, leave this as UI stub with TODO note.

### 11.3 Active Issues List

Below:

- Fetch `GET /api/progress`.
- Render each issue as card with:
  - Title (issue_name) and status badge (active/improving/resolved).
  - Progress bar showing `progress_percentage`.
  - Buttons:
    - "-10%", "+10%" – adjust progress (locally then send PATCH).
    - "How to Heal" – opens healing plan modal.
    - "Mark Resolved" – sets status to "resolved" via PATCH.

Implement:

- Debounced PATCH calls when adjusting progress.
- UI update after successful response.

### 11.4 Resolved Issues Section

At bottom:

- Fetch `GET /api/progress/resolved`.
- Render simplified cards (issue name + resolved date).

---

## 12. Frontend – Healing Plan Modal

Create `src/components/HealingPlanModal.vue`.

- Props:
  - `issueName`
  - `issueId`
- On open:
  - Call backend `POST /api/progress/:id/healing-plan` or generate static plan on frontend (matching the sample you have from React).
- Display:
  - Overview paragraph
  - Common causes (bullet list)
  - Daily routine split into "Morning" and "Evening" boxes
  - "Look for these ingredients" chips
  - Lifestyle changes checklist

Style the modal using neumorphism and the design system.

---

## 13. Reuse Design JSON

Create helper file: `src/design/designSystem.js`:

- Copy key values from `SkinSense-Design-Json` (colors, radii, shadow tokens).
- Export constants used across components.
- Do **not** hardcode magic numbers everywhere; use these tokens.

Where possible:

- Map design values to CSS variables in `design-tokens.css`.
- Use these variables in Vue components via class names or inline styles.

---

## 14. Shared Frontend Utilities

### 14.1 Axios API Client

Create `src/lib/apiClient.js`:

- Axios instance with:
  - `baseURL` = backend URL (e.g. `http://localhost:4000/api`).
  - Request interceptor: inject `Authorization` header with Supabase token if available.
  - Basic error handling.

Use this client in all views (`ProfileView`, `ScanView`, `ProgressView`) instead of repeating fetch logic.

### 14.2 Date & Formatting Helpers

Create `src/utils/format.js`:

- `formatDate(dateString)`
- `formatScore(score)`
- `formatPercentage(value)`

Use in UI for consistent formatting.

---

## 15. Optional – Prisma Integration (Only if Requested)

If the user asks to use Prisma with Supabase:

1. Initialize Prisma in `/backend`.
2. Generate schema with `provider = "postgresql"` pointing to Supabase connection string.
3. Model `User`, `SkinScan`, `HealingProgress` to match existing tables.
4. Switch repositories from `supabase-js` to Prisma where appropriate, without breaking API responses.

Do **not** introduce Prisma automatically; leave it as a clearly separated optional phase.

---

## 16. Final Polish

- Add simple error handling and toast notifications on frontend (can be a minimalist custom component).
- Add loading skeletons for scans and progress lists.
- Ensure mobile responsiveness:
  - Cards full width, stacked stat cards.
- Add a short `README.md` explaining:
  - How to run backend
  - How to run frontend
  - How to configure Supabase and env vars.

End of plan.
