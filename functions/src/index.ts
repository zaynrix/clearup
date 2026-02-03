import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import { google } from 'googleapis'
import * as nodemailer from 'nodemailer'

admin.initializeApp()

interface CreateMeetEventData {
  adminId: string
  summary: string
  description?: string
  startDateTime: string
  endDateTime: string
  timezone: string
  userEmail: string
  userName: string
  adminEmail: string
  notes?: string
}

interface CreateMeetEventResult {
  success: boolean
  meetLink?: string
  googleEventId?: string
  calendarLink?: string
  error?: string
}

/**
 * Cloud Function to create Google Meet events
 * This runs server-side with admin privileges, so it can access admin tokens
 */
export const createGoogleMeetEvent = functions.https.onCall(
  async (data: CreateMeetEventData, context): Promise<CreateMeetEventResult> => {
    try {
      const {
        adminId,
        summary,
        description,
        startDateTime,
        endDateTime,
        timezone,
        userEmail,
        userName,
        adminEmail,
        notes
      } = data

      // Validate input
      if (!adminId || !startDateTime || !endDateTime || !userEmail || !adminEmail) {
        throw new functions.https.HttpsError(
          'invalid-argument',
          'Missing required fields: adminId, startDateTime, endDateTime, userEmail, adminEmail'
        )
      }

      // Get admin credentials from Firestore (bypasses security rules on server)
      const adminDoc = await admin.firestore()
        .collection('admins')
        .doc(adminId)
        .get()

      if (!adminDoc.exists) {
        throw new functions.https.HttpsError('not-found', 'Admin not found')
      }

      const adminData = adminDoc.data()

      if (!adminData?.googleAccessToken || !adminData?.googleRefreshToken) {
        throw new functions.https.HttpsError(
          'failed-precondition',
          'Google Calendar not connected for this admin'
        )
      }

      // Get OAuth credentials from environment config
      // These should be set via: firebase functions:config:set google.client_id="..." google.client_secret="..."
      const config = functions.config()
      const clientId = config.google?.client_id || process.env.GOOGLE_CLIENT_ID
      const clientSecret = config.google?.client_secret || process.env.GOOGLE_CLIENT_SECRET

      if (!clientId || !clientSecret) {
        throw new functions.https.HttpsError(
          'failed-precondition',
          'Google OAuth not configured. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in Firebase Functions config.'
        )
      }

      // Initialize OAuth2 client
      const oauth2Client = new google.auth.OAuth2(
        clientId,
        clientSecret
      )

      oauth2Client.setCredentials({
        access_token: adminData.googleAccessToken,
        refresh_token: adminData.googleRefreshToken,
        expiry_date: adminData.googleTokenExpiryDate
      })

      // Refresh access token if needed
      try {
        const tokenInfo = await oauth2Client.getAccessToken()
        
        // If token was refreshed, update stored token
        if (tokenInfo.token && tokenInfo.token !== adminData.googleAccessToken) {
          await admin.firestore()
            .collection('admins')
            .doc(adminId)
            .update({
              googleAccessToken: tokenInfo.token,
              googleTokenExpiryDate: tokenInfo.res?.data?.expiry_date || Date.now() + 3600000
            })
          
          oauth2Client.setCredentials({
            access_token: tokenInfo.token,
            refresh_token: adminData.googleRefreshToken,
            expiry_date: tokenInfo.res?.data?.expiry_date
          })
        }
      } catch (refreshError: any) {
        console.error('Token refresh failed:', refreshError)
        throw new functions.https.HttpsError(
          'unauthenticated',
          'Failed to refresh Google Calendar token. Please reconnect your Google account.'
        )
      }

      // Create Google Calendar event
      const calendar = google.calendar({ version: 'v3', auth: oauth2Client })

      // Generate unique request ID for conference
      const requestId = `meet-${Date.now()}-${Math.random().toString(36).substring(7)}`

      const event = {
        summary: summary,
        description: description || notes || `Meeting with ${userName}`,
        start: {
          dateTime: startDateTime,
          timeZone: timezone
        },
        end: {
          dateTime: endDateTime,
          timeZone: timezone
        },
        attendees: [
          { email: userEmail },
          { email: adminEmail }
        ],
        conferenceData: {
          createRequest: {
            requestId: requestId,
            conferenceSolutionKey: { type: 'hangoutsMeet' }
          }
        }
      }

      const response = await calendar.events.insert({
        calendarId: 'primary',
        requestBody: event,
        conferenceDataVersion: 1,
        sendUpdates: 'none' // Disable automatic Google Calendar emails - we send custom email instead
      })

      const eventData = response.data

      if (!eventData.hangoutLink && !eventData.conferenceData?.entryPoints?.[0]?.uri) {
        throw new functions.https.HttpsError(
          'internal',
          'Google Meet link not generated'
        )
      }

      const meetLink = eventData.hangoutLink || eventData.conferenceData?.entryPoints?.[0]?.uri || ''
      const googleEventId = eventData.id || ''
      const calendarLink = eventData.htmlLink || ''

      console.log('Google Meet event created:', {
        eventId: googleEventId,
        meetLink: meetLink,
        adminId: adminId
      })

      return {
        success: true,
        meetLink: meetLink,
        googleEventId: googleEventId,
        calendarLink: calendarLink
      }
    } catch (error: any) {
      console.error('Error creating Google Meet event:', error)
      
      // Return user-friendly error
      if (error instanceof functions.https.HttpsError) {
        throw error
      }
      
      throw new functions.https.HttpsError(
        'internal',
        error.message || 'Failed to create Google Meet event'
      )
    }
  }
)

interface SendEmailData {
  recipientEmail: string
  recipientName: string
  meetingDate: string
  meetingTime: string
  meetingLink: string
  meetingReason?: string
}

interface SendEmailResult {
  success: boolean
  messageId?: string
  recipient?: string
  error?: string
}

/**
 * Cloud Function to send booking confirmation emails via Hostinger SMTP
 * Uses secrets for SMTP credentials
 */
export const sendBookingConfirmationEmail = functions
  .runWith({
    secrets: ['SMTP_USER', 'SMTP_PASSWORD'],
    timeoutSeconds: 30,
    memory: '256MB'
  })
  .https.onCall(
    async (data: SendEmailData, context): Promise<SendEmailResult> => {
      try {
        const {
          recipientEmail,
          recipientName,
          meetingDate,
          meetingTime,
          meetingLink,
          meetingReason
        } = data

        // Validate input
        if (!recipientEmail || !recipientName || !meetingDate || !meetingTime || !meetingLink) {
          throw new functions.https.HttpsError(
            'invalid-argument',
            'Missing required email fields: recipientEmail, recipientName, meetingDate, meetingTime, meetingLink'
          )
        }

        // Get secrets from environment (secrets are automatically available as env vars)
        // When using secrets in runWith, they're available as process.env.SECRET_NAME
        const smtpUser = process.env.SMTP_USER
        const smtpPassword = process.env.SMTP_PASSWORD

        console.log('SMTP User configured:', smtpUser ? 'Yes' : 'No')
        console.log('SMTP Password configured:', smtpPassword ? 'Yes' : 'No')

        if (!smtpUser || !smtpPassword) {
          console.error('SMTP credentials missing:', {
            hasUser: !!smtpUser,
            hasPassword: !!smtpPassword,
            envKeys: Object.keys(process.env).filter(k => k.includes('SMTP'))
          })
          throw new functions.https.HttpsError(
            'failed-precondition',
            'SMTP credentials not configured. Please set SMTP_USER and SMTP_PASSWORD secrets and redeploy functions.'
          )
        }

        // Setup Nodemailer with Hostinger SMTP
        const transporter = nodemailer.createTransport({
          host: 'smtp.hostinger.com',
          port: 465,
          secure: true, // Use SSL for port 465
          auth: {
            user: smtpUser, // meetings@clearupagency.com
            pass: smtpPassword
          },
          tls: {
            rejectUnauthorized: false // Allow self-signed certificates
          }
        })

        // Verify SMTP connection
        try {
          await transporter.verify()
          console.log('✅ SMTP connection verified')
        } catch (verifyError: any) {
          console.error('❌ SMTP verification failed:', {
            message: verifyError?.message,
            code: verifyError?.code,
            command: verifyError?.command,
            response: verifyError?.response,
            responseCode: verifyError?.responseCode
          })
          
          // Provide more helpful error message
          let errorMessage = 'SMTP connection failed. '
          if (verifyError?.code === 'EAUTH') {
            errorMessage += 'Authentication failed. Please check SMTP_USER and SMTP_PASSWORD secrets are set and function has access.'
          } else if (verifyError?.code === 'ECONNECTION') {
            errorMessage += 'Connection failed. Please check SMTP host (smtp.hostinger.com) and port (465) settings.'
          } else {
            errorMessage += verifyError?.message || 'Please check credentials and SMTP settings.'
          }
          
          throw new functions.https.HttpsError(
            'failed-precondition',
            errorMessage
          )
        }

        // Format date for display
        const formattedDate = new Date(meetingDate).toLocaleDateString('ar-SA', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })

          // Email content (Arabic/English)
          const mailOptions = {
            from: {
              name: 'ClearUP Agency',
              address: 'info@clearupagency.com'
            },
            to: recipientEmail,
            replyTo: 'info@clearupagency.com',
          subject: `تأكيد الحجز - ${formattedDate} في ${meetingTime} | Booking Confirmation - ${formattedDate} at ${meetingTime}`,
          html: `
            <!DOCTYPE html>
            <html dir="rtl" lang="ar">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; direction: rtl;">
              <div style="background-color: #5B2096; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
                <h1 style="color: white; margin: 0;">ClearUP Agency</h1>
              </div>
              
              <div style="padding: 30px; background-color: #f9f9f9; border-radius: 0 0 8px 8px;">
                <h2 style="color: #5B2096; margin-top: 0;">تأكيد حجز الاجتماع | Booking Confirmation</h2>
                <p style="font-size: 16px;">مرحباً ${recipientName}،</p>
                <p style="font-size: 16px;">Hello ${recipientName},</p>
                <p style="font-size: 16px;">تم تأكيد حجز اجتماعك بنجاح! | Your meeting booking has been confirmed!</p>
                
                <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #5B2096;">
                  <h3 style="margin-top: 0; color: #5B2096;">📋 تفاصيل الاجتماع | Meeting Details</h3>
                  <p style="font-size: 16px; margin: 10px 0;"><strong>📅 التاريخ | Date:</strong> ${formattedDate}</p>
                  <p style="font-size: 16px; margin: 10px 0;"><strong>🕐 الوقت | Time:</strong> ${meetingTime}</p>
                  <p style="font-size: 16px; margin: 10px 0;"><strong>📍 المكان | Location:</strong> اجتماع أونلاين (Google Meet) | Online Meeting (Google Meet)</p>
                  ${meetingReason ? `<p style="font-size: 16px; margin: 10px 0;"><strong>📝 الموضوع | Subject:</strong> ${meetingReason}</p>` : ''}
                </div>
                
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${meetingLink}" 
                     style="display: inline-block; background-color: #5B2096; color: white; padding: 15px 40px; 
                            text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 18px;">
                    🎥 انضم للاجتماع الآن | Join Meeting Now
                  </a>
                </div>
                
                <div style="background: #e8f4f8; padding: 15px; border-radius: 5px; margin: 20px 0;">
                  <p style="margin: 0; font-size: 14px; color: #333;">
                    <strong>🔗 أو انسخ الرابط | Or copy the link:</strong><br>
                    <a href="${meetingLink}" style="color: #5B2096; word-break: break-all;">${meetingLink}</a>
                  </p>
                </div>
                
                <div style="background: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #ffc107;">
                  <p style="margin: 0; font-size: 14px;">
                    💡 <strong>نصيحة | Tip:</strong> يُنصح بالانضمام قبل 5 دقائق من موعد الاجتماع لاختبار الصوت والفيديو.<br>
                    We recommend joining 5 minutes before the meeting time to test audio and video.
                  </p>
                </div>
                
                <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
                
                <p style="font-size: 14px; color: #666;">
                  إذا كنت بحاجة لإعادة الجدولة أو الإلغاء، يرجى التواصل معنا على:<br>
                  If you need to reschedule or cancel, please contact us at:<br>
                  📧 <a href="mailto:info@clearupagency.com" style="color: #5B2096;">info@clearupagency.com</a>
                </p>
                
                <p style="font-size: 14px; margin-top: 30px;">
                  مع أطيب التحيات،<br>
                  Best regards,<br>
                  <strong>فريق ClearUP Agency | ClearUP Agency Team</strong>
                </p>
              </div>
            </body>
            </html>
          `
        }

        // Send email
        const info = await transporter.sendMail(mailOptions)

        console.log('✅ Email sent successfully to:', recipientEmail)
        console.log('📧 Message ID:', info.messageId)

        return {
          success: true,
          messageId: info.messageId,
          recipient: recipientEmail
        }
      } catch (error: any) {
        console.error('❌ Error sending email:', error)

        if (error instanceof functions.https.HttpsError) {
          throw error
        }

        throw new functions.https.HttpsError(
          'internal',
          `Failed to send email: ${error.message}`
        )
      }
    }
  )

