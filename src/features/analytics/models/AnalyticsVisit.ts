import { Model, type BaseModel } from '@/shared/BaseModel'

export interface AnalyticsVisitData extends BaseModel {
  sessionId: string // Unique session identifier
  userId?: string // User ID if logged in
  page: string // Page path (e.g., '/', '/about', '/services')
  country?: string // Country code (e.g., 'US', 'GB', 'DE')
  countryName?: string // Full country name
  city?: string
  region?: string
  ipAddress?: string // Hashed or anonymized IP
  userAgent?: string
  referrer?: string
  deviceType?: 'desktop' | 'mobile' | 'tablet'
  browser?: string
  os?: string
  timestamp: Date
  date: string // YYYY-MM-DD format for easy querying
  month: string // YYYY-MM format
  year: string // YYYY format
}

export class AnalyticsVisit extends Model implements AnalyticsVisitData {
  sessionId: string
  userId?: string
  page: string
  country?: string
  countryName?: string
  city?: string
  region?: string
  ipAddress?: string
  userAgent?: string
  referrer?: string
  deviceType?: 'desktop' | 'mobile' | 'tablet'
  browser?: string
  os?: string
  timestamp: Date
  date: string
  month: string
  year: string

  constructor(data: Partial<AnalyticsVisitData> = {}) {
    super(data)
    this.sessionId = data.sessionId || ''
    this.userId = data.userId
    this.page = data.page || ''
    this.country = data.country
    this.countryName = data.countryName
    this.city = data.city
    this.region = data.region
    this.ipAddress = data.ipAddress
    this.userAgent = data.userAgent
    this.referrer = data.referrer
    this.deviceType = data.deviceType
    this.browser = data.browser
    this.os = data.os
    
    const now = data.timestamp || new Date()
    this.timestamp = now
    this.date = this.formatDate(now)
    this.month = this.formatMonth(now)
    this.year = this.formatYear(now)
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0] // YYYY-MM-DD
  }

  private formatMonth(date: Date): string {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    return `${year}-${month}`
  }

  private formatYear(date: Date): string {
    return String(date.getFullYear())
  }

  /**
   * Create AnalyticsVisit instance from Firestore data
   */
  static fromFirestore(data: any): AnalyticsVisit {
    return new AnalyticsVisit({
      ...data,
      timestamp: data.timestamp ? (data.timestamp.toDate ? data.timestamp.toDate() : new Date(data.timestamp)) : new Date(),
      createdAt: data.createdAt ? (data.createdAt.toDate ? data.createdAt.toDate() : new Date(data.createdAt)) : undefined,
      updatedAt: data.updatedAt ? (data.updatedAt.toDate ? data.updatedAt.toDate() : new Date(data.updatedAt)) : undefined
    })
  }
}

