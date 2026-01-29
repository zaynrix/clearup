# Firestore Security Rules Guide

## Quick Setup

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Go to **Firestore Database** > **Rules** tab
4. Copy and paste the rules from `firestore.rules` file
5. Click **"Publish"**

## Rules Explanation

### Users Collection (`/users/{userId}`)

- **Create**: Users can create their own document during registration (must match their auth UID)
- **Read**: Users can only read their own document
- **Update**: Users can only update their own document
- **Delete**: Users can only delete their own document

**Why**: This ensures users can register and manage their own profile, but cannot access other users' data.

### WhatsApp Leads Collection (`/whatsapp_leads/{leadId}`)

- **Create**: Anyone can create leads (public form submissions)
- **Read**: Only authenticated users can read leads (for admin dashboard)
- **Update/Delete**: Only authenticated users can modify leads

**Why**: Allows public form submissions while protecting lead data from unauthorized access.

### Home Content Collection (`/home_content/{documentId}`)

- **Read**: Anyone can read (for displaying homepage)
- **Write**: Only authenticated users can create/update/delete (for admin dashboard)

**Why**: Homepage content needs to be publicly readable, but only admins should be able to edit it.

## Troubleshooting

### "Missing or insufficient permissions" Error

**Common Causes:**

1. **Not logged in**: Some operations require authentication
   - Solution: Make sure you're logged in before accessing protected features

2. **Wrong user ID**: Trying to access another user's data
   - Solution: Only access your own user document

3. **Rules not published**: Rules were edited but not published
   - Solution: Click "Publish" after editing rules in Firebase Console

4. **Rules syntax error**: Invalid rule syntax
   - Solution: Check the rules editor for syntax errors (highlighted in red)

5. **Site Settings Permission Error**: If you see "Missing or insufficient permissions" when fetching site settings
   - **Solution**: 
     - Go to Firebase Console > Firestore Database > Rules
     - Make sure the `site_settings` rule is: `allow read: if true;`
     - Click "Publish" to deploy the rules
     - Wait a few minutes for rules to propagate
     - The app will use default settings if it can't fetch from Firestore

### Testing Rules

You can test your rules in Firebase Console:

1. Go to **Firestore Database** > **Rules** tab
2. Click **"Rules Playground"**
3. Select a collection and operation
4. Test different scenarios (authenticated/unauthenticated, different user IDs)

## Production Considerations

For production, consider:

1. **Role-based access**: Add admin roles for managing all content
2. **Rate limiting**: Prevent abuse of public write operations
3. **Data validation**: Add validation rules in Firestore
4. **Audit logging**: Track who made what changes

### Example: Role-Based Rules

```javascript
// Add to helper functions
function isAdmin() {
  return isAuthenticated() && 
    get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
}

// Then use in rules
match /home_content/{documentId} {
  allow read: if true;
  allow write: if isAdmin(); // Only admins can edit
}
```

## Security Best Practices

1. **Never allow unrestricted access**: Always require authentication for sensitive operations
2. **Use helper functions**: Makes rules more maintainable
3. **Test thoroughly**: Use Rules Playground before deploying
4. **Monitor access**: Check Firebase logs for unauthorized access attempts
5. **Update regularly**: Review and update rules as your app evolves

## Need Help?

- Check Firebase Console for specific error messages
- Review [Firestore Security Rules Documentation](https://firebase.google.com/docs/firestore/security/get-started)
- Test rules in Rules Playground before deploying

