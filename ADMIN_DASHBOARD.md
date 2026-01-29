# Admin Dashboard Guide

## Overview

The Admin Dashboard allows authenticated administrators to edit all content on the home page through a user-friendly interface. All changes are saved to Firestore and immediately reflected on the website.

## Accessing the Dashboard

1. **Register/Login**: 
   - Go to `/register` to create an admin account
   - Or go to `/login` if you already have an account
   - The dashboard is protected and requires authentication

2. **Navigate to Dashboard**:
   - After logging in, you'll be redirected to `/dashboard`
   - Or manually navigate to `/dashboard` (you'll be redirected to login if not authenticated)

## Dashboard Features

### Sections Available for Editing

1. **Hero Section**
   - Headline (white text)
   - Headline (purple text)
   - Supporting text (multiple lines)

2. **CTA Section**
   - Input placeholder text
   - Button text
   - Social proof text

3. **Who We Are**
   - Section title
   - Section description
   - Statistics (Revenue, Leads, Reach) - each with title, value, and description

4. **System Section**
   - Section title
   - Section description
   - Card title
   - Card text (multiple lines)
   - ROI statement

5. **Services**
   - Section title
   - Section description
   - Services list (add/remove services, each with name and description)

6. **What We Do**
   - Section title
   - Steps (7 steps with content)

7. **What You Get**
   - Section title
   - Benefits list (multiple lines)

8. **Bonuses**
   - Section title
   - Bonuses list (multiple lines)

9. **Clients & Testimonials**
   - Clients section title and subtitle
   - Testimonials section title and subtitle

10. **Footer**
    - Footer tagline
    - Footer address (optional)

## How to Use

1. **Select a Section**: Click on any section in the left sidebar to edit its content

2. **Edit Content**: 
   - Fill in the form fields
   - For multi-line text, enter each line on a new line
   - For lists (services, benefits, bonuses), add or remove items as needed

3. **Save Changes**: 
   - Click "Save Changes" button at the bottom
   - Wait for the success message
   - Changes are immediately saved to Firestore

4. **Preview**: 
   - Click "Preview Homepage" to open the homepage in a new tab
   - Refresh the page to see your changes

5. **Reset to Defaults**: 
   - Click "Reset to Defaults" to restore all content to original values
   - This action cannot be undone

## Firestore Structure

All home content is stored in Firestore:

- **Collection**: `home_content`
- **Document ID**: `main`
- **Structure**: Matches the `HomeContent` interface

## Authentication

- Only authenticated users can access the dashboard
- Router guards automatically redirect unauthenticated users to login
- After logout, users are redirected to the login page

## Troubleshooting

### Can't Access Dashboard
- Make sure you're logged in
- Check browser console for errors
- Verify Firebase Authentication is enabled

### Changes Not Appearing
- Refresh the homepage
- Check Firestore console to verify data was saved
- Check browser console for errors

### Save Failed
- Check your internet connection
- Verify Firestore is enabled and rules allow writes
- Check browser console for specific error messages

## Security Notes

- The dashboard requires authentication
- Only authenticated users can edit content
- Firestore security rules should restrict write access to authenticated users only
- Consider adding role-based access control for production

## Next Steps

1. **Enable Firestore**: Make sure Firestore Database is enabled in Firebase Console
2. **Set Security Rules**: Update Firestore rules to allow authenticated writes
3. **Create Admin Account**: Register your first admin account
4. **Start Editing**: Begin customizing your homepage content!

