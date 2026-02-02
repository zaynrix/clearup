# Google Calendar Integration Setup Guide

This guide explains how to set up and use the Google Calendar integration feature for automatic Google Meet link generation.

## Features Implemented

✅ **Automatic Google Meet Creation**: When a user books a meeting, a Google Calendar event with a Google Meet link is automatically created
✅ **OAuth 2.0 Integration**: Secure connection to Google Calendar using OAuth 2.0
✅ **Admin Account Connection**: Each admin can connect their own Google Calendar account
✅ **Calendar Invites**: Automatic calendar invites sent to both admin and user
✅ **Event Updates**: When bookings are rescheduled, Google Calendar events are automatically updated
✅ **Event Cancellation**: When bookings are cancelled, Google Calendar events are automatically deleted
✅ **ICS File Generation**: Calendar .ics files generated for easy calendar import
✅ **Email Templates**: Enhanced email templates with Google Meet links

## Setup Instructions

### 1. Google Cloud Project Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Google Calendar API**:
   - Navigate to "APIs & Services" > "Library"
   - Search for "Google Calendar API"
   - Click "Enable"

### 2. Configure OAuth Consent Screen

**⚠️ IMPORTANT: This must be done BEFORE creating OAuth credentials**

1. Navigate to "APIs & Services" > "OAuth consent screen"
2. Select User Type:
   - **External** (for public use) - Recommended for testing
   - **Internal** (only if using Google Workspace)
3. Fill in App information:
   - **App name**: ClearUP Booking System
   - **User support email**: Your email address
   - **Developer contact information**: Your email address
4. Add Scopes (click "Add or Remove Scopes"):
   - `https://www.googleapis.com/auth/calendar`
   - `https://www.googleapis.com/auth/calendar.events`
   - Click "Update" to save
5. Add Test Users (if App is in Testing mode):
   - Click "Add Users"
   - Add your email address (the one you'll use to connect)
   - Add any other admin emails that need access
   - Click "Add"
6. Save and Continue through all steps
7. **For Testing**: Leave app in "Testing" mode and add test users
8. **For Production**: Click "PUBLISH APP" after testing is complete

### 3. Create OAuth 2.0 Credentials

1. Navigate to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. Create OAuth client ID:
   - Application type: **Web application**
   - Name: ClearUP Web Client
   - Authorized JavaScript origins:
     - `http://localhost:5173` (for development)
     - `https://yourdomain.com` (for production)
   - Authorized redirect URIs:
     - `http://localhost:5173/auth/google/callback` (for development)
     - `https://yourdomain.com/auth/google/callback` (for production)
4. Click "Create"
5. Copy the **Client ID** and **Client Secret**

### 3. Environment Variables

Add the following environment variables to your `.env` file:

```env
# Google Calendar OAuth Credentials
VITE_GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
VITE_GOOGLE_CLIENT_SECRET=your-client-secret-here
VITE_GOOGLE_REDIRECT_URI=http://localhost:5173/auth/google/callback
```

**For Production:**
- Update `VITE_GOOGLE_REDIRECT_URI` to your production domain
- Add the production redirect URI to Google Cloud Console
- Set these as GitHub Secrets if using GitHub Actions for deployment

### 4. Firestore Rules

The Firestore rules have been updated to allow admins to store their Google Calendar tokens in the `admins` collection. The rules ensure:
- Only authenticated admins can create/update their own admin document
- Admins can only access their own document (by ID matching their user ID)
- Tokens are stored securely

### 5. Admin Dashboard Setup

1. Log in to the admin dashboard
2. Navigate to the **Google Calendar** tab
3. Click **"Connect Google Calendar"**
4. You will be redirected to Google to authorize the application
5. After authorization, you'll be redirected back and your account will be connected

## How It Works

### Booking Flow

1. **User Books Meeting**: User fills out the booking form and submits
2. **System Finds Admin**: System finds the first available admin with Google Calendar connected
3. **Create Google Meet Event**: 
   - Creates a Google Calendar event with Google Meet link
   - Sets attendees (user email and admin email)
   - Sets event time based on booking date/time
   - Adds reminders (1 day before and 30 minutes before)
4. **Save Booking**: Booking is saved with:
   - `googleEventId`: ID of the Google Calendar event
   - `meetLink`: Google Meet link
   - `calendarLink`: Link to view event in Google Calendar
   - `adminId`: ID of the admin who owns this booking
5. **Send Notifications**: 
   - Email sent to user with Google Meet link
   - Calendar .ics file attached (in production)
   - Calendar invite automatically sent by Google Calendar

### Reschedule Flow

1. Admin reschedules a booking in the admin dashboard
2. System updates the Google Calendar event with new date/time
3. Google Calendar automatically sends updated invites to attendees
4. User receives email notification with updated time and meeting link

### Cancellation Flow

1. Admin or user cancels a booking
2. System deletes the Google Calendar event
3. Google Calendar automatically notifies attendees
4. User receives cancellation notification

## File Structure

```
src/
├── features/
│   ├── booking/
│   │   ├── controllers/
│   │   │   └── BookingController.ts          # Updated to create Google Meet events
│   │   ├── models/
│   │   │   └── Booking.ts                    # Added Google Calendar fields
│   │   ├── services/
│   │   │   ├── GoogleCalendarService.ts      # NEW: Google Calendar API integration
│   │   │   └── BookingNotificationService.ts # Updated with Google Meet links
│   │   └── utils/
│   │       └── icsGenerator.ts               # NEW: ICS file generation
│   └── admin/
│       ├── controllers/
│       │   └── GoogleCalendarController.ts   # NEW: OAuth flow management
│       └── views/
│           ├── AdminDashboardView.vue        # Added Google Calendar tab
│           └── GoogleOAuthCallbackView.vue   # NEW: OAuth callback handler
├── shared/
│   └── services/
│       └── config.ts                         # Added Google Calendar config
└── router/
    └── index.ts                              # Added OAuth callback route
```

## Security Considerations

1. **Token Storage**: Refresh tokens are stored in Firestore `admins` collection, encrypted at rest by Firebase
2. **Access Control**: Only admins can connect their Google Calendar accounts
3. **Token Refresh**: Access tokens are automatically refreshed when expired
4. **OAuth Flow**: Uses secure OAuth 2.0 flow with authorization codes
5. **Firestore Rules**: Strict rules ensure admins can only access their own tokens

## Troubleshooting

### "Google Calendar credentials not initialized"
- Check that environment variables are set correctly
- Restart the development server after adding environment variables

### "Admin has not connected their Google account"
- Admin needs to connect their Google Calendar account in the admin dashboard
- Go to Admin Dashboard > Google Calendar tab > Connect Google Calendar

### "Failed to refresh Google Calendar access token"
- The refresh token may have been revoked
- Admin needs to disconnect and reconnect their Google Calendar account

### OAuth callback not working
- Verify the redirect URI matches exactly in Google Cloud Console
- Check that the redirect URI is added to authorized redirect URIs
- Ensure the route `/auth/google/callback` is accessible

## Testing

1. **Development Testing**:
   - Use `http://localhost:5173/auth/google/callback` as redirect URI
   - Test booking creation with Google Calendar connected
   - Verify Google Meet links are generated
   - Test reschedule and cancellation flows

2. **Production Testing**:
   - Update redirect URI to production domain
   - Test with real Google accounts
   - Verify calendar invites are received
   - Test on different time zones

## Notes

- Multiple admins can connect their own Google Calendar accounts
- The system automatically selects the first available admin with Google Calendar connected
- If no admin has Google Calendar connected, bookings will still work but without Google Meet links
- Google Calendar events are created in the admin's primary calendar
- Meeting duration is set to 30 minutes by default (can be customized)

## Support

For issues or questions:
1. Check the browser console for error messages
2. Check Firestore console for admin document structure
3. Verify Google Cloud Console settings
4. Check that Google Calendar API is enabled

