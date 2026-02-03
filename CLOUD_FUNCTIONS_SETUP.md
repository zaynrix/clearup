# Cloud Functions Setup Guide

This guide explains how to set up and deploy Firebase Cloud Functions for Google Calendar integration.

## Prerequisites

1. Firebase CLI installed: `npm install -g firebase-tools`
2. Firebase project initialized: `firebase login` and `firebase use <project-id>`
3. Node.js 20+ installed

## Step 1: Install Dependencies

```bash
cd functions
npm install
```

## Step 2: Configure Google OAuth Credentials

Set your Google OAuth credentials in Firebase Functions config (legacy method - will be deprecated):

```bash
firebase functions:config:set google.client_id="YOUR_GOOGLE_CLIENT_ID"
firebase functions:config:set google.client_secret="YOUR_GOOGLE_CLIENT_SECRET"
```

**Note:** Replace `YOUR_GOOGLE_CLIENT_ID` and `YOUR_GOOGLE_CLIENT_SECRET` with your actual Google OAuth credentials from Google Cloud Console.

### View Current Config

```bash
firebase functions:config:get
```

## Step 2.5: Configure SMTP Secrets (for Email Sending)

Set up Hostinger SMTP credentials using Firebase Secrets:

```bash
# Set SMTP username (email address)
firebase functions:secrets:set SMTP_USER
# When prompted, enter: meetings@clearupagency.com

# Set SMTP password
firebase functions:secrets:set SMTP_PASSWORD
# When prompted, enter: your-email-password
```

**Important:** 
- Secrets are encrypted and stored securely
- You'll need to grant access to secrets when deploying
- After setting secrets, you must deploy functions for them to be available

## Step 3: Build Functions

```bash
cd functions
npm run build
```

This compiles TypeScript to JavaScript in the `lib/` directory.

## Step 4: Deploy Functions

```bash
# From project root
firebase deploy --only functions
```

Or deploy a specific function:

```bash
firebase deploy --only functions:createGoogleMeetEvent
```

## Step 5: Test Locally (Optional)

To test functions locally before deploying:

```bash
# Start Firebase emulators
firebase emulators:start --only functions

# In another terminal, test the function
# (You'll need to use the emulator URL)
```

## Available Functions

### `createGoogleMeetEvent`

Creates a Google Meet event for a booking.

**Parameters:**
- `adminId` (string, required): Admin user ID
- `summary` (string, required): Event summary/title
- `description` (string, optional): Event description
- `startDateTime` (string, required): ISO 8601 datetime string
- `endDateTime` (string, required): ISO 8601 datetime string
- `timezone` (string, required): Timezone (e.g., "America/New_York")
- `userEmail` (string, required): Guest email
- `userName` (string, required): Guest name
- `adminEmail` (string, required): Admin email
- `notes` (string, optional): Additional notes

**Returns:**
```typescript
{
  success: boolean
  meetLink?: string
  googleEventId?: string
  calendarLink?: string
  error?: string
}
```

### `sendBookingConfirmationEmail`

Sends a booking confirmation email via Hostinger SMTP.

**Parameters:**
- `recipientEmail` (string, required): Recipient email address
- `recipientName` (string, required): Recipient name
- `meetingDate` (string, required): Formatted meeting date
- `meetingTime` (string, required): Meeting time (HH:mm format)
- `meetingLink` (string, required): Google Meet link
- `meetingReason` (string, optional): Meeting reason/notes

**Returns:**
```typescript
{
  success: boolean
  messageId?: string
  recipient?: string
  error?: string
}
```

**Parameters:**
- `adminId` (string, required): Admin user ID
- `summary` (string, required): Event summary/title
- `description` (string, optional): Event description
- `startDateTime` (string, required): ISO 8601 datetime string
- `endDateTime` (string, required): ISO 8601 datetime string
- `timezone` (string, required): Timezone (e.g., "America/New_York")
- `userEmail` (string, required): Guest email
- `userName` (string, required): Guest name
- `adminEmail` (string, required): Admin email
- `notes` (string, optional): Additional notes

**Returns:**
```typescript
{
  success: boolean
  meetLink?: string
  googleEventId?: string
  calendarLink?: string
  error?: string
}
```

## Troubleshooting

### Function Not Found Error

If you see "Function not found" errors:

1. **Check deployment:**
   ```bash
   firebase functions:list
   ```

2. **Check logs:**
   ```bash
   firebase functions:log
   ```

3. **Redeploy:**
   ```bash
   firebase deploy --only functions
   ```

### Authentication Errors

If you see authentication errors:

1. **Check admin tokens in Firestore:**
   - Ensure admin has connected Google Calendar in admin dashboard
   - Check that `admins/{adminId}` document exists with `googleAccessToken` and `googleRefreshToken`

2. **Check OAuth credentials:**
   ```bash
   firebase functions:config:get
   ```
   Ensure `google.client_id` and `google.client_secret` are set correctly.

### Build Errors

If TypeScript compilation fails:

```bash
cd functions
npm run build
```

Check for TypeScript errors and fix them.

### Permission Errors

If you see permission errors:

1. Ensure Firebase project has Functions enabled
2. Check that you're logged in: `firebase login`
3. Check project selection: `firebase use --add`

## Environment Variables

For local development, you can also use environment variables:

```bash
# In functions directory
export GOOGLE_CLIENT_ID="your-client-id"
export GOOGLE_CLIENT_SECRET="your-client-secret"
```

The Cloud Function will check both Firebase config and environment variables.

## Updating Functions

After making changes to function code:

1. **Build:**
   ```bash
   cd functions
   npm run build
   ```

2. **Deploy:**
   ```bash
   firebase deploy --only functions
   ```

## Monitoring

View function logs:

```bash
firebase functions:log
```

View logs for a specific function:

```bash
firebase functions:log --only createGoogleMeetEvent
```

## Security Notes

- Cloud Functions run with admin privileges and can access all Firestore collections
- Admin tokens are stored securely in the `admins` collection
- Only authenticated admins can store/update their own tokens
- Guests cannot access admin tokens (this is why we need Cloud Functions)

## Next Steps

After deploying functions:

1. Test booking creation as a guest user
2. Verify Google Meet links are generated
3. Check function logs for any errors
4. Monitor function usage in Firebase Console

