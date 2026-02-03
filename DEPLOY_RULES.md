# Deploy Firestore Rules

The Firestore security rules need to be deployed to Firebase for changes to take effect in production.

## Quick Deploy

1. **Install Firebase CLI** (if not already installed):
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**:
   ```bash
   firebase login
   ```

3. **Select your Firebase project** (if you have multiple projects):
   ```bash
   firebase use --add
   ```
   Select your production project from the list.

4. **Deploy the rules**:
   ```bash
   npm run deploy:rules
   ```
   
   Or deploy both rules and indexes:
   ```bash
   npm run deploy:firestore
   ```

## Verify Deployment

After deploying, verify the rules are active:

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Navigate to **Firestore Database** → **Rules**
4. You should see the updated rules with the guest booking update permissions

## Troubleshooting

### Error: "No project active"
- Run `firebase use --add` to select your project
- Or set it explicitly: `firebase use <project-id>`

### Error: "Permission denied"
- Make sure you're logged in: `firebase login`
- Verify you have the correct permissions in the Firebase project

### Rules not working after deployment
- Wait a few seconds for rules to propagate
- Clear browser cache and try again
- Check browser console for specific Firestore permission errors

## Important Notes

- **Always test rules locally first** using the Firebase Emulator Suite
- **Rules take effect immediately** after deployment (usually within seconds)
- **Back up your rules** before making changes (they're in `firestore.rules`)
- **Test guest bookings** after deploying to ensure they work correctly

