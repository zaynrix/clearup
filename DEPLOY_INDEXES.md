# Deploy Firestore Indexes

This project requires Firestore composite indexes for optimal performance. The indexes are defined in `firestore.indexes.json`.

## Deploy Indexes

### Option 1: Using Firebase CLI (Recommended)

1. Install Firebase CLI if you haven't already:
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Deploy the indexes:
   ```bash
   firebase deploy --only firestore:indexes
   ```

### Option 2: Using Firebase Console

1. Open the Firebase Console: https://console.firebase.google.com
2. Select your project
3. Go to Firestore Database → Indexes
4. Click "Create Index"
5. For each index in `firestore.indexes.json`, create it manually:
   - Collection: `maintenance_requests`
     - Field: `status` (Ascending)
     - Field: `createdAt` (Descending)
   - Collection: `maintenance_requests`
     - Field: `createdAt` (Descending)
   - Collection: `analytics_visits`
     - Field: `date` (Ascending)
     - Field: `timestamp` (Descending)
   - Collection: `analytics_visits`
     - Field: `date` (Descending)
     - Field: `timestamp` (Descending)
   - Collection: `analytics_visits`
     - Field: `month` (Ascending)
     - Field: `timestamp` (Descending)
   - Collection: `analytics_visits`
     - Field: `year` (Ascending)
     - Field: `timestamp` (Descending)

### Option 3: Click the Link in Console

When you see the index warning in the browser console, click the provided link to automatically create the index in Firebase Console.

## Note

The application will work without these indexes (it falls back to in-memory filtering), but queries will be slower. Deploying the indexes will improve performance significantly.

