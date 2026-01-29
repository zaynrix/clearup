# Firebase Setup Guide

This guide will help you connect your ClearUp project to Firebase.

## Prerequisites

- A Firebase account ([Sign up here](https://console.firebase.google.com))
- Node.js installed (v20.19.0 or >=22.12.0)

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click **"Add project"** or select an existing project
3. Enter your project name (e.g., "ClearUp")
4. Follow the setup wizard:
   - Enable/disable Google Analytics (optional)
   - Choose or create a Google Analytics account (if enabled)
5. Click **"Create project"**

## Step 2: Get Firebase Configuration

1. In Firebase Console, click the gear icon ⚙️ next to "Project Overview"
2. Select **"Project settings"**
3. Scroll down to **"Your apps"** section
4. Click the **Web icon** (`</>`) to add a web app
5. Register your app:
   - Enter app nickname (e.g., "ClearUp Web")
   - Check "Also set up Firebase Hosting" (optional)
   - Click **"Register app"**
6. Copy the Firebase configuration object

## Step 3: Configure Environment Variables

1. Create a `.env` file in the root directory of your project:

```bash
# In the project root directory
touch .env
```

2. Add your Firebase configuration to the `.env` file:

```env
VITE_FIREBASE_API_KEY=your-api-key-here
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

3. Replace the placeholder values with your actual Firebase credentials from Step 2

**Important:** Never commit your `.env` file to version control. It's already in `.gitignore`.

## Step 4: Enable Firebase Services

### Enable Authentication

1. In Firebase Console, go to **"Authentication"** in the left sidebar
2. Click **"Get started"**
3. Go to **"Sign-in method"** tab
4. Enable **"Email/Password"** provider:
   - Click on "Email/Password"
   - Toggle "Enable" to ON
   - Click **"Save"**

### Enable Firestore Database

1. In Firebase Console, go to **"Firestore Database"** in the left sidebar
2. Click **"Create database"**
3. Choose security rules:
   - **Start in test mode** (for development)
   - Or **Start in production mode** (for production)
4. Choose a location for your database (select closest to your users)
5. Click **"Enable"**

### Enable Storage

1. In Firebase Console, go to **"Storage"** in the left sidebar
2. Click **"Get started"**
3. Review security rules (start with test mode for development)
4. Choose a location (same as Firestore recommended)
5. Click **"Done"**

**Important:** After enabling Storage, you need to set up security rules:

1. Go to **"Storage"** > **"Rules"** tab in Firebase Console
2. Replace the rules with the content from `storage.rules` file in your project root
3. Click **"Publish"** to apply the rules

The Storage rules allow:
- Authenticated users to upload videos to their own folder
- Anyone to read/view videos (for displaying on the website)

## Step 5: Configure Firestore Security Rules

**Important:** These rules are required for the application to work properly!

1. Go to **"Firestore Database"** > **"Rules"** tab in Firebase Console
2. Replace the rules with the following:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper function to check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Helper function to check if user owns the document
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    // Users collection
    // - Users can create their own document during registration
    // - Users can read/update/delete their own document
    match /users/{userId} {
      allow create: if isAuthenticated() && request.auth.uid == userId;
      allow read: if isOwner(userId);
      allow update: if isOwner(userId);
      allow delete: if isOwner(userId);
    }
    
    // WhatsApp leads collection
    // - Anyone can create leads (for form submissions)
    // - Authenticated users can read all leads
    match /whatsapp_leads/{leadId} {
      allow create: if true;
      allow read: if isAuthenticated();
      allow update, delete: if isAuthenticated();
    }
    
    // Home content collection
    // - Anyone can read (for displaying homepage)
    // - Only authenticated users can write (for admin dashboard)
    match /home_content/{documentId} {
      allow read: if true;
      allow write: if isAuthenticated();
    }
    
    // Default deny rule for any other collections
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

3. Click **"Publish"** to save the rules

**Note:** A `firestore.rules` file is also included in the project root for reference. You can copy the rules from there.

## Step 6: Test Firebase Connection

1. Start your development server:

```bash
npm run dev
```

2. Open your browser console (F12)
3. Check for any Firebase initialization errors
4. Try submitting the WhatsApp form on the homepage
5. Check Firestore Console to see if the lead was created in the `whatsapp_leads` collection

## Step 7: Verify Integration

### Check Firestore Data

1. Go to Firebase Console > **"Firestore Database"**
2. You should see a `whatsapp_leads` collection
3. New leads should appear when users submit the form

### Check Authentication (if using login)

1. Try registering a new user
2. Check **"Authentication"** > **"Users"** tab
3. You should see the new user

## Troubleshooting

### Firebase initialization error

**Error:** `Firebase initialization error`

**Solution:**
- Verify all environment variables in `.env` are correct
- Make sure `.env` file is in the root directory
- Restart your development server after creating/updating `.env`

### Firestore permission denied

**Error:** `Missing or insufficient permissions`

**Solution:**
- Check Firestore security rules
- For development, temporarily allow all reads/writes
- For production, implement proper authentication-based rules

### Environment variables not loading

**Solution:**
- Ensure variables start with `VITE_` prefix
- Restart the development server
- Clear browser cache

## Production Setup

Before deploying to production:

1. **Update Firestore Security Rules** - Remove test mode rules
2. **Set up proper authentication** - Require authentication for sensitive operations
3. **Configure CORS** - If using Firebase Storage
4. **Set up Firebase Hosting** (optional) - For deploying your app
5. **Enable Firebase Analytics** - For tracking user behavior
6. **Set up Firebase Functions** - For server-side operations (optional)

## Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [Firebase Storage](https://firebase.google.com/docs/storage)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)

## Support

If you encounter issues:
1. Check the browser console for errors
2. Verify Firebase project settings
3. Ensure all services are enabled in Firebase Console
4. Review the [ARCHITECTURE.md](./ARCHITECTURE.md) for project structure

