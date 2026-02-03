import { BaseService } from '@/shared/BaseService'
import { firestoreService } from '@/shared/services'
import { googleCalendarConfig } from '@/shared/services/config'

const ADMINS_COLLECTION = 'admins'
const CALENDAR_STATUS_COLLECTION = 'calendar_status'
const GOOGLE_CALENDAR_API_BASE = 'https://www.googleapis.com/calendar/v3'
const GOOGLE_OAUTH_BASE = 'https://accounts.google.com/o/oauth2/v2/auth'
const GOOGLE_TOKEN_BASE = 'https://oauth2.googleapis.com/token'

export interface GoogleCalendarCredentials {
  clientId: string
  clientSecret: string
  redirectUri: string
}

export interface GoogleMeetEventData {
  summary: string
  description?: string
  startDateTime: string // ISO format
  endDateTime: string // ISO format
  timezone: string
  userEmail: string
  adminEmail: string
  notes?: string
}

export interface GoogleMeetEventResult {
  googleEventId: string
  meetLink: string
  calendarLink: string
  hangoutLink?: string
}

export interface AdminGoogleTokens {
  accessToken: string
  refreshToken: string
  expiryDate?: number
  tokenType?: string
  scope?: string
}

/**
 * Google Calendar Service
 * Handles Google Calendar API integration for creating Google Meet events
 * Uses REST API directly (works in browser)
 */
export class GoogleCalendarService extends BaseService {
  private credentials: GoogleCalendarCredentials | null = null

  /**
   * Initialize Google Calendar credentials
   */
  initializeCredentials(credentials: GoogleCalendarCredentials): void {
    this.credentials = credentials
  }

  /**
   * Get admin's Google tokens from Firebase
   */
  private async getAdminGoogleTokens(adminId: string): Promise<AdminGoogleTokens | null> {
    try {
      const admin = await firestoreService.getDocument<any>(ADMINS_COLLECTION, adminId)
      if (!admin || !admin.googleAccessToken || !admin.googleRefreshToken) {
        return null
      }
      return {
        accessToken: admin.googleAccessToken,
        refreshToken: admin.googleRefreshToken,
        expiryDate: admin.googleTokenExpiryDate,
        tokenType: admin.googleTokenType,
        scope: admin.googleTokenScope
      }
    } catch (error: any) {
      // Silently fail for permission errors (guests cannot read admins collection)
      if (error?.code === 'permission-denied' || error?.message?.includes('permission')) {
        return null
      }
      // Log other errors
      this.handleError(error)
      return null
    }
  }

  /**
   * Refresh access token if expired
   */
  private async refreshAccessTokenIfNeeded(adminId: string, tokens: AdminGoogleTokens): Promise<AdminGoogleTokens> {
    if (!this.credentials) {
      throw new Error('Google Calendar credentials not initialized')
    }

    // Check if token is expired (with 5 minute buffer)
    if (tokens.expiryDate && tokens.expiryDate < Date.now() + 5 * 60 * 1000) {
      try {
        const response = await fetch(GOOGLE_TOKEN_BASE, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            client_id: this.credentials.clientId,
            client_secret: this.credentials.clientSecret,
            refresh_token: tokens.refreshToken,
            grant_type: 'refresh_token',
          }),
        })

        if (!response.ok) {
          throw new Error('Failed to refresh access token')
        }

        const data = await response.json()
        const newTokens: AdminGoogleTokens = {
          accessToken: data.access_token || tokens.accessToken,
          refreshToken: tokens.refreshToken, // Refresh token doesn't change
          expiryDate: data.expires_in ? Date.now() + data.expires_in * 1000 : tokens.expiryDate,
          tokenType: data.token_type || tokens.tokenType,
          scope: data.scope || tokens.scope
        }

        // Update tokens in Firebase
        await this.updateAdminGoogleTokens(adminId, newTokens)
        return newTokens
      } catch (error) {
        throw new Error('Failed to refresh Google Calendar access token. Please reconnect your Google account.')
      }
    }

    return tokens
  }

  /**
   * Get valid access token (refresh if needed)
   * Note: This requires admin authentication. For guest bookings, use a Cloud Function.
   */
  private async getValidAccessToken(adminId: string): Promise<string> {
    const admin = await this.getAdminGoogleTokens(adminId)
    if (!admin) {
      // Check if this is a permission error (guest trying to access)
      const error = new Error(`Cannot access Google Calendar tokens. This operation requires server-side authentication. Please contact support or use a Cloud Function for guest bookings.`)
      ;(error as any).code = 'permission-denied'
      throw error
    }

    const tokens = await this.refreshAccessTokenIfNeeded(adminId, admin)
    return tokens.accessToken
  }

  /**
   * Update admin's Google tokens in Firebase
   */
  async updateAdminGoogleTokens(adminId: string, tokens: AdminGoogleTokens): Promise<void> {
    try {
      // Check if document exists first
      const existingDoc = await firestoreService.getDocument<any>(ADMINS_COLLECTION, adminId)
      
      const tokenData = {
        googleAccessToken: tokens.accessToken,
        googleRefreshToken: tokens.refreshToken,
        googleTokenExpiryDate: tokens.expiryDate,
        googleTokenType: tokens.tokenType,
        googleTokenScope: tokens.scope,
        googleConnected: true,
        googleConnectedAt: new Date(),
        updatedAt: new Date()
      }

      if (existingDoc) {
        // Document exists, update it
        await firestoreService.updateDocument(ADMINS_COLLECTION, adminId, tokenData)
      } else {
        // Document doesn't exist, create it with the adminId as document ID
        await firestoreService.createDocument(ADMINS_COLLECTION, adminId, {
          id: adminId,
          ...tokenData,
          createdAt: new Date()
        })
      }

      // Get admin email from users collection (admin is authenticated, so this works)
      let adminEmail = 'admin@clearup.com'
      try {
        const adminUser = await firestoreService.getDocument<any>('users', adminId)
        adminEmail = adminUser?.email || adminEmail
      } catch (error) {
        console.warn('Could not get admin email from users collection:', error)
      }

      // Update public calendar status (safe, non-sensitive data only)
      // Store admin email here so guests can access it
      const statusData = {
        adminId: adminId,
        adminEmail: adminEmail,
        isConnected: true,
        lastSynced: new Date(),
        updatedAt: new Date()
      }

      const existingStatus = await firestoreService.getDocument<any>(CALENDAR_STATUS_COLLECTION, adminId)
      if (existingStatus) {
        await firestoreService.updateDocument(CALENDAR_STATUS_COLLECTION, adminId, statusData)
      } else {
        await firestoreService.createDocument(CALENDAR_STATUS_COLLECTION, adminId, {
          id: adminId,
          ...statusData,
          createdAt: new Date()
        })
      }
    } catch (error) {
      this.handleError(error)
      throw error
    }
  }

  /**
   * Get Google OAuth authorization URL
   */
  getAuthorizationUrl(adminId: string): string {
    if (!this.credentials) {
      throw new Error('Google Calendar credentials not initialized')
    }

    const params = new URLSearchParams({
      client_id: this.credentials.clientId,
      redirect_uri: this.credentials.redirectUri,
      response_type: 'code',
      scope: 'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events',
      access_type: 'offline',
      prompt: 'consent', // Force consent to get refresh token
      state: adminId // Pass admin ID in state for callback
    })

    return `${GOOGLE_OAUTH_BASE}?${params.toString()}`
  }

  /**
   * Exchange authorization code for tokens
   */
  async exchangeCodeForTokens(code: string): Promise<AdminGoogleTokens> {
    if (!this.credentials) {
      throw new Error('Google Calendar credentials not initialized')
    }

    const response = await fetch(GOOGLE_TOKEN_BASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: this.credentials.clientId,
        client_secret: this.credentials.clientSecret,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: this.credentials.redirectUri,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error_description || 'Failed to exchange code for tokens')
    }

    const data = await response.json()
    
    if (!data.access_token || !data.refresh_token) {
      throw new Error('Failed to get access token and refresh token from Google')
    }

    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiryDate: data.expires_in ? Date.now() + data.expires_in * 1000 : undefined,
      tokenType: data.token_type,
      scope: data.scope
    }
  }

  /**
   * Disconnect admin's Google account
   */
  async disconnectGoogleAccount(adminId: string): Promise<void> {
    try {
      await firestoreService.updateDocument(ADMINS_COLLECTION, adminId, {
        googleAccessToken: null,
        googleRefreshToken: null,
        googleTokenExpiryDate: null,
        googleTokenType: null,
        googleTokenScope: null,
        googleConnected: false,
        googleDisconnectedAt: new Date(),
        updatedAt: new Date()
      })

      // Update public calendar status
      const existingStatus = await firestoreService.getDocument<any>(CALENDAR_STATUS_COLLECTION, adminId)
      if (existingStatus) {
        await firestoreService.updateDocument(CALENDAR_STATUS_COLLECTION, adminId, {
          isConnected: false,
          lastSynced: new Date(),
          updatedAt: new Date()
        })
      }
    } catch (error) {
      this.handleError(error)
      throw error
    }
  }

  /**
   * Check if admin has connected Google account
   * Uses public calendar_status collection so guests can check connection status
   */
  async isGoogleConnected(adminId: string): Promise<boolean> {
    try {
      // First try to read from public calendar_status (works for guests)
      const status = await firestoreService.getDocument<any>(CALENDAR_STATUS_COLLECTION, adminId)
      if (status?.isConnected === true) {
        return true
      }
      
      // Fallback: try to read from admins collection (only works for authenticated admins)
      try {
        const admin = await firestoreService.getDocument<any>(ADMINS_COLLECTION, adminId)
        return admin?.googleConnected === true && !!admin?.googleAccessToken && !!admin?.googleRefreshToken
      } catch (adminError: any) {
        // Permission denied is expected for guests - use calendar_status result
        if (adminError?.code === 'permission-denied' || adminError?.message?.includes('permission')) {
          return status?.isConnected === true
        }
        return false
      }
    } catch (error: any) {
      // Silently fail for permission errors (guests cannot read admins collection)
      // This is expected behavior - return false to continue without Google Calendar
      if (error?.code === 'permission-denied' || error?.message?.includes('permission')) {
        return false
      }
      // For other errors, also return false
      return false
    }
  }

  /**
   * Create Google Meet event
   */
  async createGoogleMeetEvent(
    adminId: string,
    eventData: GoogleMeetEventData
  ): Promise<GoogleMeetEventResult> {
    try {
      const accessToken = await this.getValidAccessToken(adminId)

      // Generate unique request ID for conference
      const requestId = `meet-${Date.now()}-${Math.random().toString(36).substring(7)}`

      const event = {
        summary: eventData.summary,
        description: eventData.description || eventData.notes || '',
        start: {
          dateTime: eventData.startDateTime,
          timeZone: eventData.timezone
        },
        end: {
          dateTime: eventData.endDateTime,
          timeZone: eventData.timezone
        },
        attendees: [
          { email: eventData.userEmail },
          { email: eventData.adminEmail }
        ],
        conferenceData: {
          createRequest: {
            requestId: requestId,
            conferenceSolutionKey: { type: 'hangoutsMeet' }
          }
        },
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 24 * 60 }, // 1 day before
            { method: 'popup', minutes: 30 } // 30 min before
          ]
        }
      }

      const response = await fetch(`${GOOGLE_CALENDAR_API_BASE}/calendars/primary/events?conferenceDataVersion=1&sendUpdates=all`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error?.message || 'Failed to create Google Calendar event')
      }

      const data = await response.json()

      if (!data.id) {
        throw new Error('Failed to create Google Calendar event')
      }

      const meetLink = data.hangoutLink || data.conferenceData?.entryPoints?.[0]?.uri || ''
      if (!meetLink) {
        throw new Error('Failed to get Google Meet link from event')
      }

      return {
        googleEventId: data.id,
        meetLink: meetLink,
        calendarLink: data.htmlLink || '',
        hangoutLink: data.hangoutLink
      }
    } catch (error) {
      this.handleError(error)
      throw error
    }
  }

  /**
   * Update Google Meet event
   */
  async updateGoogleMeetEvent(
    adminId: string,
    googleEventId: string,
    updates: {
      startDateTime?: string
      endDateTime?: string
      summary?: string
      description?: string
    }
  ): Promise<GoogleMeetEventResult> {
    try {
      const accessToken = await this.getValidAccessToken(adminId)

      // Get existing event first
      const getResponse = await fetch(`${GOOGLE_CALENDAR_API_BASE}/calendars/primary/events/${googleEventId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      })

      if (!getResponse.ok) {
        throw new Error('Google Calendar event not found')
      }

      const existingEvent = await getResponse.json()

      const updateData: any = {}
      if (updates.startDateTime) {
        updateData.start = {
          dateTime: updates.startDateTime,
          timeZone: existingEvent.start?.timeZone || 'UTC'
        }
      }
      if (updates.endDateTime) {
        updateData.end = {
          dateTime: updates.endDateTime,
          timeZone: existingEvent.end?.timeZone || 'UTC'
        }
      }
      if (updates.summary) {
        updateData.summary = updates.summary
      }
      if (updates.description !== undefined) {
        updateData.description = updates.description
      }

      const response = await fetch(`${GOOGLE_CALENDAR_API_BASE}/calendars/primary/events/${googleEventId}?sendUpdates=all`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error?.message || 'Failed to update Google Calendar event')
      }

      const data = await response.json()
      const meetLink = data.hangoutLink || data.conferenceData?.entryPoints?.[0]?.uri || ''

      return {
        googleEventId: data.id || googleEventId,
        meetLink: meetLink,
        calendarLink: data.htmlLink || '',
        hangoutLink: data.hangoutLink
      }
    } catch (error) {
      this.handleError(error)
      throw error
    }
  }

  /**
   * Delete Google Meet event
   */
  async deleteGoogleMeetEvent(adminId: string, googleEventId: string): Promise<void> {
    try {
      const accessToken = await this.getValidAccessToken(adminId)

      const response = await fetch(`${GOOGLE_CALENDAR_API_BASE}/calendars/primary/events/${googleEventId}?sendUpdates=all`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error?.message || 'Failed to delete Google Calendar event')
      }
    } catch (error) {
      this.handleError(error)
      throw error
    }
  }
}

export const googleCalendarService = new GoogleCalendarService()
