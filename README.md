# ClearUp

Web application built with Vue 3 and Firebase for content management and lead generation.

## Stack

- Vue 3 + TypeScript + Vite
- Firebase (Auth, Firestore, Storage)
- Pinia
- Vue Router

## Setup

### Option 1: Docker (Recommended for Teams)

**Requirements:** Docker and Docker Compose

```bash
# Build and start development server
docker-compose up

# Or run in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop container
docker-compose down
```

The app will be available at `http://localhost:5173`

**Benefits:**
- ✅ Consistent Node.js version across all team members
- ✅ No need to install Node.js locally
- ✅ Same environment for everyone
- ✅ Easy onboarding for new team members

### Option 2: Local Development

**Requirements:** Node.js v20.19.0+ and a Firebase project.

```bash
npm install
npm run dev
```

**Firebase Setup:**

1. Create Firebase project and enable Email/Password authentication
2. Create Firestore database
3. Add environment variables to `.env`:

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

4. Deploy `firestore.rules` and `storage.rules` to Firebase

## Deployment

Deploys to GitHub Pages via GitHub Actions. Configure these secrets in repository settings:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_MEASUREMENT_ID` (optional)

Add `zaynrix.github.io` to Firebase Authentication authorized domains.

## Scripts

- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run type-check` - TypeScript validation
- `npm run lint` - Code linting

## Docker Commands

**Development:**
```bash
docker-compose up          # Start dev server
docker-compose down        # Stop container
docker-compose logs -f     # View logs
docker-compose exec app sh # Access container shell
```

**Production Build:**
```bash
docker build -f Dockerfile.prod -t clearup:prod .
docker run -p 8080:80 clearup:prod
```

## Architecture

Layered MVC architecture. See `ARCHITECTURE.md` for details.
