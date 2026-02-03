import { BaseService } from '@/shared/BaseService'
import { AnalyticsRepository } from '@/shared/repositories/AnalyticsRepository'
import { AnalyticsVisit, type AnalyticsVisitData } from '../models/AnalyticsVisit'

/**
 * Analytics Service - Business Logic Layer
 * Contains business logic for analytics operations
 */
export class AnalyticsService extends BaseService {
  private analyticsRepository: AnalyticsRepository

  constructor() {
    super()
    this.analyticsRepository = new AnalyticsRepository()
  }

  /**
   * Track a page visit
   */
  async trackVisit(data: Partial<AnalyticsVisitData>): Promise<void> {
    try {
      const visit = new AnalyticsVisit({
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      })

      // Generate a unique ID based on timestamp and session
      const visitId = `${visit.sessionId}_${visit.timestamp.getTime()}`
      await this.analyticsRepository.create({ ...visit, id: visitId } as any)
    } catch (error) {
      // Don't throw error for tracking failures - just log to console
      console.error('Failed to track visit:', error)
    }
  }

  /**
   * Get total visits count
   */
  async getTotalVisits(): Promise<number> {
    try {
      const visits = await this.analyticsRepository.findAll()
      return visits.length
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Get unique visitors count
   */
  async getUniqueVisitors(): Promise<number> {
    try {
      const visits = await this.analyticsRepository.findAll()
      const uniqueSessions = new Set(visits.map(v => v.sessionId))
      return uniqueSessions.size
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Get visits by date range
   */
  async getVisitsByDateRange(startDate: string, endDate: string): Promise<AnalyticsVisit[]> {
    if (!this.validate(startDate) || !this.validate(endDate)) {
      throw new Error('Start date and end date are required')
    }

    try {
      return await this.analyticsRepository.getVisitsByDateRange(startDate, endDate)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Get daily statistics
   */
  async getDailyStatistics(days: number = 30): Promise<{ date: string; count: number }[]> {
    try {
      const endDate = new Date()
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)

      const startDateStr = startDate.toISOString().split('T')[0]!
      const endDateStr = endDate.toISOString().split('T')[0]!

      const dailyCounts = await this.analyticsRepository.getDailyVisitCounts(startDateStr, endDateStr)
      
      // Fill in missing dates with 0
      const result: { date: string; count: number }[] = []
      const currentDate = new Date(startDate)
      
      while (currentDate <= endDate) {
        const dateStr = currentDate.toISOString().split('T')[0]!
        result.push({
          date: dateStr,
          count: dailyCounts.get(dateStr) || 0
        })
        currentDate.setDate(currentDate.getDate() + 1)
      }

      return result
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Get monthly statistics
   */
  async getMonthlyStatistics(year?: string): Promise<{ month: string; count: number }[]> {
    try {
      const targetYear = year || new Date().getFullYear().toString()
      const monthlyCounts = await this.analyticsRepository.getMonthlyVisitCounts(targetYear)
      
      // Fill in missing months with 0
      const result: { month: string; count: number }[] = []
      for (let month = 1; month <= 12; month++) {
        const monthStr = `${targetYear}-${String(month).padStart(2, '0')}`
        result.push({
          month: monthStr,
          count: monthlyCounts.get(monthStr) || 0
        })
      }

      return result
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Get yearly statistics
   */
  async getYearlyStatistics(): Promise<{ year: string; count: number }[]> {
    try {
      const yearlyCounts = await this.analyticsRepository.getYearlyVisitCounts()
      
      // Convert to array and sort
      const result = Array.from(yearlyCounts.entries())
        .map(([year, count]) => ({ year, count }))
        .sort((a, b) => a.year.localeCompare(b.year))

      return result
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Get country statistics
   */
  async getCountryStatistics(startDate?: string, endDate?: string): Promise<{ country: string; count: number }[]> {
    try {
      const countryMap = await this.analyticsRepository.getVisitsByCountry(startDate, endDate)
      
      // Convert to array and sort by count (descending)
      const result = Array.from(countryMap.entries())
        .map(([country, count]) => ({ country, count }))
        .sort((a, b) => b.count - a.count)

      return result
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Get today's visits
   */
  async getTodayVisits(): Promise<number> {
    try {
      const today = new Date().toISOString().split('T')[0]!
      const visits = await this.analyticsRepository.getVisitsByDate(today)
      return visits.length
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Get this month's visits
   */
  async getThisMonthVisits(): Promise<number> {
    try {
      const now = new Date()
      const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
      const visits = await this.analyticsRepository.getVisitsByMonth(month)
      return visits.length
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Get this year's visits
   */
  async getThisYearVisits(): Promise<number> {
    try {
      const year = new Date().getFullYear().toString()
      const visits = await this.analyticsRepository.getVisitsByYear(year)
      return visits.length
    } catch (error) {
      throw this.handleError(error)
    }
  }
}

export const analyticsService = new AnalyticsService()

