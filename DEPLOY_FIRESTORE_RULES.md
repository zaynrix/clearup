# Deploy Firestore Rules - Quick Guide

## The Warning You're Seeing

```
Site settings permission denied. Using default settings. 
Make sure Firestore rules allow public reads for site_settings collection.
```

This means your Firestore rules haven't been deployed to Firebase yet. The app is working fine (using defaults), but you should deploy the rules.

## Quick Fix (5 minutes)

### Step 1: Open Firebase Console
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project

### Step 2: Navigate to Firestore Rules
1. Click **"Firestore Database"** in the left sidebar
2. Click the **"Rules"** tab at the top

### Step 3: Copy Rules from Your Project
1. Open `firestore.rules` file in your project
2. Copy ALL the content (Ctrl+A, Ctrl+C / Cmd+A, Cmd+C)

### Step 4: Paste and Deploy
1. Paste the rules into the Firebase Console rules editor
2. Click **"Publish"** button
3. Wait for confirmation message

### Step 5: Verify
1. Refresh your website
2. The warning should disappear
3. Check browser console - no more permission errors

## What the Rules Do

The rules allow:
- ✅ **Public reads** for `site_settings` (anyone can read)
- ✅ **Public reads** for `home_content` (anyone can read)
- ✅ **Public creates** for `whatsapp_leads` (form submissions)
- ✅ **Authenticated writes** for admins only

## If You Still See Errors

1. **Wait 2-3 minutes** - Rules can take time to propagate
2. **Clear browser cache** - Old cached rules might be interfering
3. **Check rules syntax** - Make sure there are no red error highlights in Firebase Console
4. **Verify collection name** - Make sure it's `site_settings` (with underscore)

## Testing Rules

You can test your rules in Firebase Console:
1. Go to **Rules** tab
2. Click **"Rules Playground"**
3. Test reading `site_settings/main` as unauthenticated user
4. Should show ✅ "Simulated read allowed"

