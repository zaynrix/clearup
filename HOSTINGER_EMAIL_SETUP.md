# Hostinger Email SMTP Setup Guide

This guide explains how to configure and use Hostinger email SMTP for sending booking confirmation emails.

## Prerequisites

- Hostinger email account (e.g., `meetings@yourdomain.com`)
- Hostinger email password
- Backend server or Firebase Functions to handle SMTP (required - cannot send from browser)

## Environment Variables

Add these variables to your `.env` file:

```env
# Hostinger SMTP Configuration
VITE_SMTP_HOST=smtp.hostinger.com
VITE_SMTP_PORT=465
VITE_SMTP_SECURE=true
VITE_SMTP_USER=meetings@yourdomain.com
VITE_SMTP_PASSWORD=your_email_password
VITE_SMTP_FROM_EMAIL=meetings@clearupagency.com
VITE_SMTP_REPLY_TO=info@clearupagency.com

# Email API Endpoint (Firebase Functions or your backend)
VITE_EMAIL_API_ENDPOINT=https://your-project.cloudfunctions.net/sendEmail
```

## Hostinger SMTP Settings

- **SMTP Host**: `smtp.hostinger.com`
- **SMTP Port**: `465` (SSL) or `587` (TLS)
- **Security**: SSL/TLS enabled
- **Authentication**: Required (use your full email and password)

## Backend Implementation

Since this is a frontend application, you need a backend to send emails. Here are two options:

### Option 1: Firebase Functions (Recommended)

Create a Firebase Function to handle email sending:

```javascript
// functions/index.js
const functions = require('firebase-functions');
const nodemailer = require('nodemailer');
const cors = require('cors')({ origin: true });

exports.sendEmail = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const { smtp, from, replyTo, to, subject, html, attachments } = req.body;

    try {
      // Create transporter
      const transporter = nodemailer.createTransport({
        host: smtp.host,
        port: smtp.port,
        secure: smtp.secure, // true for 465, false for other ports
        auth: {
          user: smtp.user,
          pass: smtp.password
        }
      });

      // Send email
      const info = await transporter.sendMail({
        from: `"${from.name}" <${from.email}>`,
        replyTo: replyTo,
        to: to,
        subject: subject,
        html: html,
        attachments: attachments || []
      });

      return res.status(200).json({ 
        success: true, 
        messageId: info.messageId 
      });
    } catch (error) {
      console.error('Error sending email:', error);
      return res.status(500).json({ 
        success: false, 
        error: error.message 
      });
    }
  });
});
```

**Install dependencies:**
```bash
cd functions
npm install nodemailer cors
```

**Deploy:**
```bash
firebase deploy --only functions:sendEmail
```

**Update `.env`:**
```env
VITE_EMAIL_API_ENDPOINT=https://YOUR_REGION-YOUR_PROJECT.cloudfunctions.net/sendEmail
```

### Option 2: Node.js Backend API

Create a simple Express.js API:

```javascript
// server.js
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/send-email', async (req, res) => {
  const { smtp, from, replyTo, to, subject, html, attachments } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      host: smtp.host,
      port: smtp.port,
      secure: smtp.secure,
      auth: {
        user: smtp.user,
        pass: smtp.password
      }
    });

    const info = await transporter.sendMail({
      from: `"${from.name}" <${from.email}>`,
      replyTo: replyTo,
      to: to,
      subject: subject,
      html: html,
      attachments: attachments || []
    });

    res.json({ success: true, messageId: info.messageId });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Email server running on port ${PORT}`);
});
```

**Install dependencies:**
```bash
npm install express nodemailer cors
```

**Update `.env`:**
```env
VITE_EMAIL_API_ENDPOINT=http://localhost:3000/api/send-email
# Or your production URL
VITE_EMAIL_API_ENDPOINT=https://your-api-domain.com/api/send-email
```

## Security Notes

⚠️ **Important**: Never expose SMTP credentials in frontend code!

- SMTP credentials should only be used in backend/Firebase Functions
- The frontend sends email data to your API, which then uses SMTP credentials
- Store sensitive credentials in environment variables or Firebase Functions config

## Testing

1. Set up your backend (Firebase Functions or Node.js API)
2. Configure environment variables
3. Test sending an email through the booking system
4. Check your email inbox and spam folder

## Troubleshooting

### Email not sending
- Verify SMTP credentials are correct
- Check that your Hostinger email account is active
- Ensure backend API is running and accessible
- Check backend logs for errors

### Authentication failed
- Verify email and password are correct
- Make sure you're using the full email address (e.g., `meetings@yourdomain.com`)
- Check if Hostinger requires app-specific passwords

### Port issues
- Try port `587` with `secure: false` if `465` doesn't work
- Ensure firewall allows outbound connections on SMTP ports

## Support

For Hostinger-specific issues, contact Hostinger support or check their documentation:
- [Hostinger Email Setup Guide](https://www.hostinger.com/tutorials/how-to-use-hosting-email)

