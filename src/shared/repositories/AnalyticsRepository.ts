import { BaseRepository } from './BaseRepository'
import { AnalyticsVisit } from '@/features/analytics/models/AnalyticsVisit'
import { where, orderBy } from 'firebase/firestore'

/**
 * Analytics Repository - Data Access Layer
 * Handles all Firestore operations for analytics data
 */
export class AnalyticsRepository extends BaseRepository<AnalyticsVisit> {
  constructor() {
    super('analytics_visits', AnalyticsVisit)
  }

  /**
   * Get visits by date range
   */
  async getVisitsByDateRange(startDate: string, endDate: string): Promise<AnalyticsVisit[]> {
    return await this.query(
      where('date', '>=', startDate),
      where('date', '<=', endDate),
      orderBy('date', 'desc'),
      orderBy('timestamp', 'desc')
    )
  }

  /**
   * Get visits by date
   */
  async getVisitsByDate(date: string): Promise<AnalyticsVisit[]> {
    return await this.query(
      where('date', '==', date),
      orderBy('timestamp', 'desc')
    )
  }

  /**
   * Get visits by month
   */
  async getVisitsByMonth(month: string): Promise<AnalyticsVisit[]> {
    return await this.query(
      where('month', '==', month),
      orderBy('timestamp', 'desc')
    )
  }

  /**
   * Get visits by year
   */
  async getVisitsByYear(year: string): Promise<AnalyticsVisit[]> {
    return await this.query(
      where('year', '==', year),
      orderBy('timestamp', 'desc')
    )
  }

  /**
   * Get unique visitors count by date range
   */
  async getUniqueVisitorsByDateRange(startDate: string, endDate: string): Promise<number> {
    const visits = await this.getVisitsByDateRange(startDate, endDate)
    const uniqueSessions = new Set(visits.map(v => v.sessionId))
    return uniqueSessions.size
  }

  /**
   * Get visits grouped by country
   */
  async getVisitsByCountry(startDate?: string, endDate?: string): Promise<Map<string, number>> {
    let visits: AnalyticsVisit[]
    
    if (startDate && endDate) {
      visits = await this.getVisitsByDateRange(startDate, endDate)
    } else {
      visits = await this.findAll()
    }

    const countryMap = new Map<string, number>()
    visits.forEach(visit => {
      if (visit.country) {
        const country = visit.countryName || visit.country
        countryMap.set(country, (countryMap.get(country) || 0) + 1)
      } else {
        countryMap.set('Unknown', (countryMap.get('Unknown') || 0) + 1)
      }
    })

    return countryMap
  }

  /**
   * Get daily visit counts
   */
  async getDailyVisitCounts(startDate: string, endDate: string): Promise<Map<string, number>> {
    const visits = await this.getVisitsByDateRange(startDate, endDate)
    const dailyCounts = new Map<string, number>()

    visits.forEach(visit => {
      dailyCounts.set(visit.date, (dailyCounts.get(visit.date) || 0) + 1)
    })

    return dailyCounts
  }

  /**
   * Get monthly visit counts
   */
  async getMonthlyVisitCounts(year: string): Promise<Map<string, number>> {
    const visits = await this.getVisitsByYear(year)
    const monthlyCounts = new Map<string, number>()

    visits.forEach(visit => {
      monthlyCounts.set(visit.month, (monthlyCounts.get(visit.month) || 0) + 1)
    })

    return monthlyCounts
  }

  /**
   * Get yearly visit counts
   */
  async getYearlyVisitCounts(): Promise<Map<string, number>> {
    const visits = await this.findAll()
    const yearlyCounts = new Map<string, number>()

    visits.forEach(visit => {
      yearlyCounts.set(visit.year, (yearlyCounts.get(visit.year) || 0) + 1)
    })

    return yearlyCounts
  }

  /**
   * Get most visited pages
   */
  async getMostVisitedPages(limitCount: number = 10, startDate?: string, endDate?: string): Promise<Map<string, number>> {
    let visits: AnalyticsVisit[]
    
    if (startDate && endDate) {
      visits = await this.getVisitsByDateRange(startDate, endDate)
    } else {
      visits = await this.findAll()
    }

    const pageCounts = new Map<string, number>()
    visits.forEach(visit => {
      pageCounts.set(visit.page, (pageCounts.get(visit.page) || 0) + 1)
    })

    // Sort and limit
    const sorted = Array.from(pageCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limitCount)

    return new Map(sorted)
  }
}

