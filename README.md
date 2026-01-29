# ClearUp

Web application built with Vue 3 and Firebase for content management and lead generation.

## Stack

- Vue 3 + TypeScript + Vite
- Firebase (Auth, Firestore, Storage)
- Pinia
- Vue Router

## Setup

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

## Architecture

Layered MVC architecture. See `ARCHITECTURE.md` for details.
