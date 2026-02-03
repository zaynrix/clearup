import { BaseController } from '@/shared/BaseController'
import { googleCalendarService } from '@/features/booking/services/GoogleCalendarService'
import { googleCalendarConfig } from '@/shared/services/config'
import { authService } from '@/features/auth/services/AuthService'

/**
 * Google Calendar Controller
 * Handles Google Calendar OAuth and connection management
 */
export class GoogleCalendarController extends BaseController {
  /**
   * Initialize Google Calendar service with credentials
   */
  initializeService(): void {
    if (!googleCalendarConfig.clientId || !googleCalendarConfig.clientSecret) {
      console.warn('Google Calendar credentials not configured. Please set VITE_GOOGLE_CLIENT_ID and VITE_GOOGLE_CLIENT_SECRET in .env')
      return
    }
    googleCalendarService.initializeCredentials({
      clientId: googleCalendarConfig.clientId,
      clientSecret: googleCalendarConfig.clientSecret,
      redirectUri: googleCalendarConfig.redirectUri
    })
  }

  /**
   * Get Google OAuth authorization URL
   */
  getAuthorizationUrl(): { success: boolean; data?: string; error?: string } {
    try {
      const user = authService.getCurrentUser()
      if (!user || !user.uid) {
        return { success: false, error: 'User not authenticated' }
      }

      this.initializeService()
      const url = googleCalendarService.getAuthorizationUrl(user.uid)
      return this.success(url)
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Handle OAuth callback and store tokens
   */
  async handleOAuthCallback(code: string, state: string): Promise<{ success: boolean; error?: string }> {
    try {
      const adminId = state // Admin ID is passed in state parameter
      if (!adminId) {
        return { success: false, error: 'Invalid OAuth callback: missing admin ID' }
      }

      this.initializeService()
      const tokens = await googleCalendarService.exchangeCodeForTokens(code)
      await googleCalendarService.updateAdminGoogleTokens(adminId, tokens)

      return { success: true }
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Check if current admin has Google Calendar connected
   */
  async isGoogleConnected(): Promise<{ success: boolean; data?: boolean; error?: string }> {
    try {
      const user = authService.getCurrentUser()
      if (!user || !user.uid) {
        return { success: false, error: 'User not authenticated' }
      }

      const isConnected = await googleCalendarService.isGoogleConnected(user.uid)
      return this.success(isConnected)
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Disconnect Google Calendar
   */
  async disconnectGoogleCalendar(): Promise<{ success: boolean; error?: string }> {
    try {
      const user = authService.getCurrentUser()
      if (!user || !user.uid) {
        return { success: false, error: 'User not authenticated' }
      }

      await googleCalendarService.disconnectGoogleAccount(user.uid)
      return { success: true }
    } catch (error) {
      return this.handleError(error)
    }
  }
}

export const googleCalendarController = new GoogleCalendarController()

