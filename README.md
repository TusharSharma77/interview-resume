# AI Interview Prep Platform

This project is a full-stack interview preparation web app. A user can register, log in, upload a PDF resume, paste a job description, add a short self-description, and generate an AI-assisted interview report.

The project is split into:

- `FRONTEND/` for the React + Vite client
- `BACKEND/` for the Express + MongoDB API

## What The App Does

The main workflow is:

1. A user creates an account or logs in.
2. The frontend stores auth using an HTTP-only cookie handled by the backend.
3. The user uploads a PDF resume and submits job details.
4. The backend reads the PDF text, sends a compact prompt to Gemini, and stores the generated report in MongoDB.
5. The frontend navigates to an interview screen after report generation.

## Tech Stack

### Frontend

- React
- React Router
- Axios
- Vite
- SCSS

### Backend

- Node.js
- Express
- MongoDB with Mongoose
- JWT authentication
- Multer for file upload
- `pdf-parse` for reading resume PDFs
- Google Gemini API via `@google/genai`
- Zod for validating AI output

## Project Structure

```text
GENAI-PROJECT/
├─ BACKEND/
│  ├─ server.js
│  ├─ package.json
│  └─ src/
│     ├─ app.js
│     ├─ config/
│     ├─ controllers/
│     ├─ middlewares/
│     ├─ models/
│     ├─ routes/
│     └─ services/
├─ FRONTEND/
│  ├─ package.json
│  ├─ index.html
│  └─ src/
│     ├─ App.jsx
│     ├─ app.routes.jsx
│     ├─ services/
│     └─ features/
└─ README.md
```

## Setup

### 1. Backend environment

Create `BACKEND/.env` with:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GOOGLE_GENAI_API_KEY=your_gemini_api_key
```

### 2. Install dependencies

Backend:

```bash
cd BACKEND
npm install
```

Frontend:

```bash
cd FRONTEND
npm install
```

### 3. Run the app

Backend:

```bash
cd BACKEND
npm run dev
```

Frontend:

```bash
cd FRONTEND
npm run dev
```

Frontend runs on `http://localhost:5173` and backend runs on `http://localhost:3000`.

## API Overview

### Auth routes

- `POST /api/auth/register` creates a new user
- `POST /api/auth/login` logs in and sets the auth cookie
- `POST /api/auth/logout` clears the auth cookie and blacklists the token
- `GET /api/auth/get-me` returns the currently logged-in user

### Interview route

- `POST /api/interview/` accepts:
  - `file` as a PDF resume
  - `jobDescription`
  - `selfDescription`

It then:

- extracts text from the PDF
- sends a compact prompt to Gemini
- validates the AI response
- stores the report in MongoDB

## Current Status

What is working:

- User registration and login
- Protected routes
- Resume upload
- PDF text extraction
- Gemini integration
- Report creation and storage

Known limitations:

- Gemini requires available quota or billing-enabled API access
- The interview detail page currently uses a static UI component rather than rendering stored report data
- There are two auth middleware filenames, one of which exists mainly as a compatibility wrapper
- Some extra files are present for testing or earlier iterations

## File-By-File Explanation

### Root

- `package.json`
  - Root-level dependency list currently containing some AI-related packages. The real app runtime is split between `BACKEND/` and `FRONTEND/`.
- `package-lock.json`
  - Lockfile for the root package definition.
- `.gitignore`
  - Git ignore rules.
- `.txt`
  - Miscellaneous local text file, not part of the main app flow.
- `README.md`
  - Main documentation for the project.

### Backend

- `BACKEND/server.js`
  - Loads backend environment variables, connects to MongoDB, imports the Express app, and starts the server.

- `BACKEND/package.json`
  - Backend dependencies and scripts. This is the main package file for the server.

- `BACKEND/package-lock.json`
  - Exact dependency lockfile for the backend.

- `BACKEND/.env`
  - Local environment configuration for port, MongoDB, JWT, and Gemini API key. This file should not be committed publicly.

### Backend source

- `BACKEND/src/app.js`
  - Creates the Express app, enables JSON parsing, cookies, CORS, and mounts auth and interview routes.

#### Config

- `BACKEND/src/config/database.js`
  - Connects Mongoose to MongoDB using `process.env.MONGO_URI`.

#### Controllers

- `BACKEND/src/controllers/auth.controller.js`
  - Handles user registration, login, logout, and current-user fetch logic.

- `BACKEND/src/controllers/interview.controller.js`
  - Accepts the uploaded resume and form fields, extracts PDF text, calls the Gemini service, saves the generated interview report, and returns it.

#### Middlewares

- `BACKEND/src/middlewares/auth.mideleware.js`
  - Main auth guard. Reads the JWT from cookies, checks whether the token is blacklisted, verifies it, and attaches the decoded user to `req.user`.

- `BACKEND/src/middlewares/auth.middleware.js`
  - Thin compatibility wrapper that re-exports `auth.mideleware.js`. Useful because the original middleware filename contains a spelling mistake.

- `BACKEND/src/middlewares/file.middleware.js`
  - Configures Multer to accept uploaded files in memory and limits resume uploads to 3 MB.

#### Models

- `BACKEND/src/models/user.model.js`
  - Mongoose schema and model for registered users.

- `BACKEND/src/models/blacklist.model.js`
  - Stores invalidated JWT tokens after logout so blacklisted tokens can no longer be used.

- `BACKEND/src/models/interviewReport.model.js`
  - Mongoose schema for saved interview reports, including technical questions, behavioral questions, skill gaps, preparation plans, and report metadata.

#### Routes

- `BACKEND/src/routes/auth.routes.js`
  - Defines auth endpoints and maps them to auth controller functions.

- `BACKEND/src/routes/interview.routes.js`
  - Defines the protected interview generation endpoint and attaches auth + file upload middleware.

#### Services

- `BACKEND/src/services/ai.service.js`
  - Main Gemini integration. Loads the API key, defines the expected JSON shape using Zod, sends a compact prompt to Gemini, normalizes the result, validates it, and returns clean structured data.

- `BACKEND/src/services/temp.js`
  - Temporary sample resume, self-description, and job description data. Useful for local testing or prompt experiments, but not part of the main production flow.

### Frontend

- `FRONTEND/package.json`
  - Frontend dependencies and Vite scripts.

- `FRONTEND/package-lock.json`
  - Exact frontend dependency lockfile.

- `FRONTEND/index.html`
  - Vite HTML entry template.

- `FRONTEND/vite.config.js`
  - Vite build and dev server configuration.

- `FRONTEND/eslint.config.js`
  - ESLint configuration for the frontend codebase.

- `FRONTEND/README.md`
  - Default Vite README created for the frontend app.

#### Public assets

- `FRONTEND/public/favicon.svg`
  - Favicon used by the frontend app.

- `FRONTEND/public/icons.svg`
  - Shared SVG icon asset file.

#### Frontend source

- `FRONTEND/src/main.jsx`
  - Frontend entry point that renders the React app and loads the global stylesheet.

- `FRONTEND/src/App.jsx`
  - Wraps the router in the auth provider.

- `FRONTEND/src/app.routes.jsx`
  - Defines client-side routes for login, register, home, and interview pages.

- `FRONTEND/src/style.scss`
  - Main global stylesheet for the frontend.

- `FRONTEND/src/styles/button.scss`
  - Shared button styles.

#### Frontend services

- `FRONTEND/src/services/auth.api.js`
  - Axios helper functions for register, login, logout, and current-user requests.

- `FRONTEND/src/services/interview.api.js`
  - Axios helper for uploading the resume and submitting interview-generation requests.

#### Auth feature

- `FRONTEND/src/features/auth/auth.context.jsx`
  - Holds auth state and exposes it through React context.

- `FRONTEND/src/features/auth/Hooks/useAuth.js`
  - Custom hook for auth actions like login, register, logout, and refreshing the current user.

- `FRONTEND/src/features/auth/components/protected.jsx`
  - Route guard component that redirects unauthenticated users to `/login`.

- `FRONTEND/src/features/auth/pages/login.jsx`
  - Login page UI and submit handling.

- `FRONTEND/src/features/auth/pages/Register.jsx`
  - Registration page UI and submit handling.

- `FRONTEND/src/features/auth/auth.form.scss`
  - Auth page styling for login and register forms.

#### Interview feature

- `FRONTEND/src/features/interview/pages/Home.jsx`
  - Main form screen where the user enters the job description, self-description, and uploads a PDF resume before generating a report.

- `FRONTEND/src/features/interview.jsx`
  - Current interview display component used by the route. At the moment it renders static placeholder interview content rather than fetching the saved report by ID.

- `FRONTEND/src/features/interview/pages/interview.jsx`
  - Currently empty. It appears intended to become the real dynamic interview report page in the future.

- `FRONTEND/src/features/interview/style/home.scss`
  - Styling for the home/upload form page.

- `FRONTEND/src/features/interview/style/interview.scss`
  - Styling for the interview report display page.

- `FRONTEND/src/features/interview.scss`
  - Styles imported by the current static interview component.

#### Frontend assets

- `FRONTEND/src/assets/hero.png`
  - Hero image asset.

- `FRONTEND/src/assets/react.svg`
  - Default React asset.

- `FRONTEND/src/assets/vite.svg`
  - Default Vite asset.

## How Frontend And Backend Connect

- The frontend sends auth requests to `http://localhost:3000/api/auth`
- The frontend sends interview-generation requests to `http://localhost:3000/api/interview`
- Cookies are sent with `withCredentials: true`
- The backend CORS config allows the local Vite frontend origin

## Gemini Notes

The Gemini integration depends on:

- a valid `GOOGLE_GENAI_API_KEY`
- an enabled Gemini API project
- available quota or billing

If the app returns quota errors such as `429 RESOURCE_EXHAUSTED`, the code path is usually working and the remaining problem is Google API quota or billing.

## Suggested Next Improvements

- Fetch and display real saved interview report data on `/interview/:interviewId`
- Show better error messages in the frontend for Gemini quota failures
- Add form validation feedback for auth pages
- Move duplicated dependency declarations fully into the correct package folders
- Add tests for auth, interview generation, and AI response normalization

