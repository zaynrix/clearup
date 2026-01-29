# Fix Site Settings Permissions Error

## Problem
You're seeing: `Error fetching site settings: FirebaseError: Missing or insufficient permissions.`

## Solution

The Firestore rules already allow public reads for `site_settings`, but you need to make sure they're deployed to Firebase.

### Step 1: Deploy Firestore Rules

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Navigate to **Firestore Database** > **Rules** tab
4. Copy the contents of `firestore.rules` file from your project
5. Paste it into the rules editor
6. Click **"Publish"** button
7. Wait for the confirmation message

### Step 2: Verify the Rules

The `site_settings` collection should have these rules:
```javascript
match /site_settings/{documentId} {
  allow read: if true;  // Anyone can read
  allow write: if isAdmin();  // Only admins can write
}
```

### Step 3: Create the Document (Optional)

If the `site_settings/main` document doesn't exist, you can create it:

1. Go to **Firestore Database** > **Data** tab
2. Click **"Start collection"** if collections are empty
3. Collection ID: `site_settings`
4. Document ID: `main`
5. Add fields:
   - `disabledSections` (type: array, value: `[]`)
   - `maintenanceMode` (type: boolean, value: `false`)
   - `maintenanceMessage` (type: string, value: `"This section is temporarily unavailable."`)
6. Click **"Save"**

### Step 4: Test

After deploying the rules:
1. Refresh your website
2. The error should be gone
3. If the document doesn't exist, the app will use default settings automatically

## Why This Happens

The error occurs when:
- Firestore rules haven't been deployed yet
- Rules were edited but not published
- There's a syntax error in the rules
- The document doesn't exist (though the app handles this gracefully)

## Current Behavior

The app now handles permission errors gracefully:
- If it can't fetch site settings, it uses default settings
- The app continues to work normally
- You'll see a warning in the console, but the app won't crash

## Still Having Issues?

1. **Check Firebase Console** for rule syntax errors (highlighted in red)
2. **Use Rules Playground** to test:
   - Go to **Firestore Database** > **Rules** > **Rules Playground**
   - Select collection: `site_settings`
   - Select document: `main`
   - Select operation: `get`
   - Select location: `unauthenticated`
   - Click **"Run"** - it should pass
3. **Check browser console** for more detailed error messages
4. **Wait a few minutes** after publishing rules for them to propagate

