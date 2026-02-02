import { analyticsController } from '@/features/analytics/controllers/AnalyticsController'

/**
 * Service to track page visits automatically
 * This should be called on route changes
 */
export class AnalyticsTrackingService {
  private sessionId: string
  private countryCache: { code?: string; name?: string; country?: string; countryName?: string } | null = null

  constructor() {
    // Generate or retrieve session ID
    this.sessionId = this.getOrCreateSessionId()
    this.detectCountry()
  }

  /**
   * Get or create a session ID (stored in sessionStorage)
   */
  private getOrCreateSessionId(): string {
    if (typeof window === 'undefined') return ''

    const stored = sessionStorage.getItem('analytics_session_id')
    if (stored) {
      return stored
    }

    const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    sessionStorage.setItem('analytics_session_id', newSessionId)
    return newSessionId
  }

  /**
   * Detect country using browser's timezone and language
   * Note: This is a simple client-side detection. For accurate country detection,
   * you would need a server-side service or IP geolocation API
   */
  private async detectCountry(): Promise<void> {
    if (typeof window === 'undefined') return

    try {
      // Try to get country from timezone
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
      
      // Map common timezones to countries (simplified)
      const timezoneToCountry: Record<string, { code: string; name: string }> = {
        'America/New_York': { code: 'US', name: 'United States' },
        'America/Los_Angeles': { code: 'US', name: 'United States' },
        'America/Chicago': { code: 'US', name: 'United States' },
        'Europe/London': { code: 'GB', name: 'United Kingdom' },
        'Europe/Paris': { code: 'FR', name: 'France' },
        'Europe/Berlin': { code: 'DE', name: 'Germany' },
        'Europe/Rome': { code: 'IT', name: 'Italy' },
        'Europe/Madrid': { code: 'ES', name: 'Spain' },
        'Asia/Tokyo': { code: 'JP', name: 'Japan' },
        'Asia/Shanghai': { code: 'CN', name: 'China' },
        'Asia/Dubai': { code: 'AE', name: 'United Arab Emirates' },
        'Australia/Sydney': { code: 'AU', name: 'Australia' },
        'America/Toronto': { code: 'CA', name: 'Canada' },
        'America/Mexico_City': { code: 'MX', name: 'Mexico' },
        'America/Sao_Paulo': { code: 'BR', name: 'Brazil' },
        'Asia/Mumbai': { code: 'IN', name: 'India' },
        'Asia/Singapore': { code: 'SG', name: 'Singapore' }
      }

      if (timezoneToCountry[timezone]) {
        const country = timezoneToCountry[timezone]
        this.countryCache = {
          code: country.code,
          name: country.name,
          country: country.code,
          countryName: country.name
        }
        return
      }

      // Fallback: Try to detect from language
      const language = navigator.language || navigator.languages?.[0] || 'en'
      const countryCode = language.split('-')[1]?.toUpperCase()
      
      if (countryCode) {
        // Simple country name mapping
        const countryNames: Record<string, string> = {
          'US': 'United States',
          'GB': 'United Kingdom',
          'CA': 'Canada',
          'AU': 'Australia',
          'DE': 'Germany',
          'FR': 'France',
          'IT': 'Italy',
          'ES': 'Spain',
          'JP': 'Japan',
          'CN': 'China',
          'IN': 'India',
          'BR': 'Brazil',
          'MX': 'Mexico',
          'AE': 'United Arab Emirates',
          'SG': 'Singapore'
        }

        this.countryCache = {
          code: countryCode,
          name: countryNames[countryCode] || countryCode,
          country: countryCode,
          countryName: countryNames[countryCode] || countryCode
        }
      }
    } catch (error) {
      console.warn('Failed to detect country:', error)
    }
  }

  /**
   * Detect device type from user agent
   */
  private detectDeviceType(): 'desktop' | 'mobile' | 'tablet' {
    if (typeof window === 'undefined') return 'desktop'

    const ua = navigator.userAgent.toLowerCase()
    
    if (/tablet|ipad|playbook|silk/i.test(ua)) {
      return 'tablet'
    }
    
    if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(ua)) {
      return 'mobile'
    }
    
    return 'desktop'
  }

  /**
   * Detect browser from user agent
   */
  private detectBrowser(): string {
    if (typeof window === 'undefined') return 'Unknown'

    const ua = navigator.userAgent
    
    if (ua.includes('Chrome') && !ua.includes('Edg')) return 'Chrome'
    if (ua.includes('Firefox')) return 'Firefox'
    if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari'
    if (ua.includes('Edg')) return 'Edge'
    if (ua.includes('Opera') || ua.includes('OPR')) return 'Opera'
    
    return 'Unknown'
  }

  /**
   * Detect OS from user agent
   */
  private detectOS(): string {
    if (typeof window === 'undefined') return 'Unknown'

    const ua = navigator.userAgent
    
    if (ua.includes('Windows')) return 'Windows'
    if (ua.includes('Mac OS')) return 'macOS'
    if (ua.includes('Linux')) return 'Linux'
    if (ua.includes('Android')) return 'Android'
    if (ua.includes('iOS') || /iPhone|iPad|iPod/.test(ua)) return 'iOS'
    
    return 'Unknown'
  }

  /**
   * Track a page visit
   */
  async trackPageVisit(page: string): Promise<void> {
    if (typeof window === 'undefined') return

    try {
      await analyticsController.trackVisit({
        sessionId: this.sessionId,
        page,
        country: this.countryCache?.country || this.countryCache?.code,
        countryName: this.countryCache?.countryName || this.countryCache?.name,
        userAgent: navigator.userAgent,
        referrer: document.referrer || undefined,
        deviceType: this.detectDeviceType(),
        browser: this.detectBrowser(),
        os: this.detectOS(),
        timestamp: new Date()
      })
    } catch (error) {
      console.error('Failed to track page visit:', error)
    }
  }
}

export const analyticsTrackingService = new AnalyticsTrackingService()

