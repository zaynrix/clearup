import { BaseController } from '@/shared/BaseController'
import { analyticsService } from '../services/AnalyticsService'
import type { AnalyticsVisitData } from '../models/AnalyticsVisit'

/**
 * Analytics Controller - Presentation Logic Layer
 * Handles user interactions and coordinates between view and service
 */
export class AnalyticsController extends BaseController {
  private analyticsService = analyticsService

  /**
   * Track a page visit
   */
  async trackVisit(data: Partial<AnalyticsVisitData>): Promise<void> {
    try {
      await this.analyticsService.trackVisit(data)
    } catch (error) {
      console.error('Error tracking visit:', error)
    }
  }

  /**
   * Get analytics statistics
   */
  async getStatistics() {
    try {
      const [totalVisits, uniqueVisitors, todayVisits, thisMonthVisits, thisYearVisits] = await Promise.all([
        this.analyticsService.getTotalVisits(),
        this.analyticsService.getUniqueVisitors(),
        this.analyticsService.getTodayVisits(),
        this.analyticsService.getThisMonthVisits(),
        this.analyticsService.getThisYearVisits()
      ])

      return {
        totalVisits,
        uniqueVisitors,
        todayVisits,
        thisMonthVisits,
        thisYearVisits
      }
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Get daily statistics
   */
  async getDailyStatistics(days: number = 30) {
    try {
      return await this.analyticsService.getDailyStatistics(days)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Get monthly statistics
   */
  async getMonthlyStatistics(year?: string) {
    try {
      return await this.analyticsService.getMonthlyStatistics(year)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Get yearly statistics
   */
  async getYearlyStatistics() {
    try {
      return await this.analyticsService.getYearlyStatistics()
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Get country statistics
   */
  async getCountryStatistics(startDate?: string, endDate?: string) {
    try {
      return await this.analyticsService.getCountryStatistics(startDate, endDate)
    } catch (error) {
      throw this.handleError(error)
    }
  }
}

export const analyticsController = new AnalyticsController()

