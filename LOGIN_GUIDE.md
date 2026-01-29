# Login Guide

## How to Login to the Website

### Option 1: Direct URL Access

1. **Navigate to the login page** by going to:
   - **Local development**: `http://localhost:5173/login`
   - **Production**: `https://zaynrix.github.io/clearup/login`

2. **Enter your credentials**:
   - **Email**: Your registered email address
   - **Password**: Your account password

3. Click **"Login"** button

4. After successful login, you'll be redirected to the **Dashboard** (`/dashboard`)

### Option 2: Contact Administrator

If you don't have an account, you need to contact an administrator to create one for you. Only administrators can add new users to the system.

### Option 3: Access Protected Routes

If you try to access a protected route (like `/dashboard` or `/admin-dashboard`) without being logged in, you'll be automatically redirected to the login page.

## Routes Overview

- **`/`** - Home page (public)
- **`/login`** - Login page (public, redirects to dashboard if already logged in)
- **`/dashboard`** - User dashboard (requires authentication)
- **`/admin-dashboard`** - Admin dashboard (requires authentication + admin role)

## Authentication Features

- ✅ Email/Password authentication via Firebase
- ✅ Persistent login (stays logged in until logout)
- ✅ Automatic redirects based on auth state
- ✅ Protected routes require authentication
- ✅ Admin-only routes check for admin role

## Troubleshooting

### "Invalid email or password"
- Make sure you're using the correct email and password
- Check if you've registered an account first
- Verify your email is correct (case-sensitive)

### "User not found"
- You need to contact an administrator to create an account for you
- Only administrators can add new users to the system

### "Network error" or "Firebase error"
- Check your internet connection
- Verify Firebase is properly configured (see `FIREBASE_SETUP.md`)
- Check browser console for detailed error messages

### Can't access dashboard after login
- Check browser console for errors
- Verify Firebase Authentication is enabled in Firebase Console
- Make sure Firestore rules allow authenticated users to read their data

## Logout

To logout, you can:
1. Clear your browser's local storage
2. Or add a logout button in the dashboard (if implemented)

## Security Notes

- Passwords are securely stored by Firebase Authentication
- Never share your login credentials
- Use a strong password (at least 6 characters, but longer is better)
- The app uses Firebase's built-in security features

