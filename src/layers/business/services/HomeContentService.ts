import { BaseService } from './BaseService'
import { firestoreService } from '@/services/firebase'
import { activityLogService } from './ActivityLogService'
import { userService } from './UserService'

export interface HomeContent {
  // Hero Section
  heroHeadlineWhite: string
  heroHeadlinePurple: string
  supportingText: string[]
  
  // CTA Section
  ctaPlaceholder: string
  ctaButtonText: string
  socialProofText: string
  
  // Who We Are Section
  whoWeAreTitle: string
  whoWeAreDescription: string
  videoUrl?: string // Video link (YouTube, Vimeo, etc.)
  videoFileUrl?: string // Uploaded video file URL
  videoType?: 'link' | 'upload' // Type of video source
  stats: {
    revenue: { title: string; value: string; description: string }
    leads: { title: string; value: string; description: string }
    reach: { title: string; value: string; description: string }
  }
  
  // System Section
  systemTitle: string
  systemDescription: string
  systemCardTitle: string
  systemCardText: string[]
  systemCardROI: string
  
  // Services Section
  servicesTitle: string
  servicesDescription: string
  services: Array<{
    name: string
    description: string
  }>
  
  // What We Do Section
  whatWeDoTitle: string
  steps: Array<{
    number: number
    content: string
  }>
  
  // What You Get Section
  whatYouGetTitle: string
  benefits: string[]
  
  // Bonuses Section
  bonusesTitle: string
  bonuses: string[]
  
  // Clients Section
  clientsTitle: string
  clientsSubtitle: string
  
  // Real Results Section
  realResultsTitle: string
  realResultsSubtitle: string
  realResultsCases: Array<{
    id: string
    companyLogo?: string // Company logo URL
    companyLogoFileUrl?: string // Uploaded company logo file URL
    companyLogoType?: 'url' | 'upload' // Type of logo source
    headline: string
    cards: Array<{
      id: string
      title: string
      metric: string
      subtitle: string
    }>
    companyImages?: Array<{
      id: string
      imageUrl?: string // Image URL
      imageFileUrl?: string // Uploaded image file URL
      imageType?: 'url' | 'upload' // Type of image source
    }>
    ctaText?: string
  }>
  
  // Testimonials Section
  testimonialsTitle: string
  testimonialsSubtitle: string
  testimonials: Array<{
    id: string
    name: string
    stars: number // 1-5 rating
    review: string
    photoUrl?: string // Profile photo URL (uploaded or external link)
    photoFileUrl?: string // Uploaded profile photo file URL
    photoType?: 'url' | 'upload' // Type of profile photo source
    videoThumbnailUrl?: string // Video thumbnail image URL (uploaded or external link)
    videoThumbnailFileUrl?: string // Uploaded video thumbnail file URL
    videoThumbnailType?: 'url' | 'upload' // Type of video thumbnail source
    videoUrl?: string // Video link (YouTube, Vimeo, etc.)
    videoFileUrl?: string // Uploaded video file URL
    videoType?: 'link' | 'upload' | 'none' // Type of video source
  }>
  
  // Footer
  footerTagline: string
  footerAddress?: string
}

const DEFAULT_HOME_CONTENT: HomeContent = {
  heroHeadlineWhite: 'Like Oxygen For',
  heroHeadlinePurple: 'Your Business',
  supportingText: [
    'Grow your business to new heights',
    'We make it easy for you.',
    'More customers, more profitable, more freedom, more life.'
  ],
  ctaPlaceholder: 'Enter your email address to get started',
  ctaButtonText: 'Get Started',
  socialProofText: '5-star rating with 200+ reviews',
  whoWeAreTitle: 'Who We Are',
  whoWeAreDescription: 'We are your marketing growth partner.',
  videoUrl: '',
  videoFileUrl: '',
  videoType: 'link',
  stats: {
    revenue: {
      title: 'Revenue generated',
      value: '$4.7M',
      description: 'we let our number do talking , $4.7M in reported client revenue and counting'
    },
    leads: {
      title: 'Leads generated',
      value: '1.2M',
      description: 'More 1.2M leads inquires about our client\'s services'
    },
    reach: {
      title: 'Our reach',
      value: '28',
      description: 'Serving client over 28 different country'
    }
  },
  systemTitle: 'The Clear up System™',
  systemDescription: 'A done-for-you marketing system built for predictable growth.',
  systemCardTitle: 'Done-for-you Clear Up System',
  systemCardText: [
    'We don\'t sell random services.',
    'We install a complete marketing system that works as one engine scalable , predictable , and built',
    'to grow with your business.'
  ],
  systemCardROI: 'TURN EVERY $1 INTO $833 IN REVENUE OUR SYSTEM IS BUILT TO MAXIMIZE ROI, NOT JUST SPEND YOUR BUDGET.',
  servicesTitle: 'Our Services',
  servicesDescription: 'We provide a wide range of services.',
  services: [
    { name: 'Strategic marketing system', description: 'A full-funnel marketing system built to consistently generate leads and convert them into sales.' },
    { name: 'Content Marketing System', description: 'A done-for-you content system that reflects your brand voice and makes your business unforgettable.' },
    { name: 'Paid media system', description: 'High-impact paid media designed to boost brand influence and reach your ideal audience' },
    { name: 'Advertising system', description: 'Done-for-you advertising across major platforms to reach billions of active users and drive results.' },
    { name: 'Community management system', description: 'An omnichannel system that helps you connect with customers through WhatsApp, SMS, email, and more.' },
    { name: 'Data analytics system', description: 'Custom dashboards that turn marketing and sales data into clear, actionable insights.' }
  ],
  whatWeDoTitle: 'What We Do',
  steps: [
    { number: 1, content: 'Identify methods in your niche market' },
    { number: 2, content: 'Craft a unique value proposition' },
    { number: 3, content: 'Choose relevant distribution channels' },
    { number: 4, content: 'Build a sales funnel' },
    { number: 5, content: 'Optimize the customer journey' },
    { number: 6, content: 'Automate, follow-up, retention' },
    { number: 7, content: 'Analyze and reporting' }
  ],
  whatYouGetTitle: 'What You Get',
  benefits: [
    'Predictable leads',
    'Scalable system',
    'Higher customer lifetime value',
    'Increased conversions, sales'
  ],
  bonusesTitle: 'Bonuses Included',
  bonuses: [
    'Full access to personal brand course',
    'Full access to social media course',
    'Full access to business coaching'
  ],
  clientsTitle: 'Our Clients',
  clientsSubtitle: 'We work with leading brands and businesses.',
  realResultsTitle: 'Real Results, Real Impact.',
  realResultsSubtitle: 'We focus on measurable outcomes that help brands grow, scale, and stand out.',
  realResultsCases: [],
  testimonialsTitle: 'What Our Clients Say',
  testimonialsSubtitle: 'Read testimonials from clients who worked with us.',
  testimonials: [],
  footerTagline: 'Your creative digital partner for high-impact video ads and marketing content.'
}

const COLLECTION_NAME = 'home_content'
const DOCUMENT_ID = 'main'

/**
 * Home Content Service - Business Logic Layer (Model in MVC)
 * Manages home page content stored in Firestore
 */
export class HomeContentService extends BaseService {
  /**
   * Get home content from Firestore or return defaults
   */
  async getHomeContent(): Promise<HomeContent> {
    try {
      const content = await firestoreService.getDocument<HomeContent>(
        COLLECTION_NAME,
        DOCUMENT_ID
      )
      
      if (content) {
        // Merge with defaults to ensure all fields exist
        return { ...DEFAULT_HOME_CONTENT, ...content }
      }
      
      return DEFAULT_HOME_CONTENT
    } catch (error) {
      console.error('Error fetching home content:', error)
      return DEFAULT_HOME_CONTENT
    }
  }

  /**
   * Update home content in Firestore
   */
  async updateHomeContent(content: Partial<HomeContent>, userId?: string): Promise<void> {
    try {
      // Check if document exists
      const existingDoc = await firestoreService.getDocument<HomeContent>(COLLECTION_NAME, DOCUMENT_ID)
      const existingContent = existingDoc || DEFAULT_HOME_CONTENT
      const updatedContent = { ...existingContent, ...content, updatedAt: new Date().toISOString() }
      
      // Determine changed fields
      const changes: Record<string, any> = {}
      Object.keys(content).forEach(key => {
        const typedKey = key as keyof HomeContent
        if (JSON.stringify(existingContent[typedKey]) !== JSON.stringify(content[typedKey])) {
          changes[key] = {
            before: existingContent[typedKey],
            after: content[typedKey]
          }
        }
      })
      
      // If document doesn't exist, create it; otherwise update it
      if (!existingDoc) {
        // Document doesn't exist, create it with defaults merged with new content
        const newContent = { 
          ...DEFAULT_HOME_CONTENT, 
          ...content, 
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        await firestoreService.createDocument(COLLECTION_NAME, DOCUMENT_ID, newContent)
      } else {
        // Document exists, update it
        await firestoreService.updateDocument(COLLECTION_NAME, DOCUMENT_ID, updatedContent)
      }

      // Log activity if userId is provided (log even if no changes detected, as content was saved)
      if (userId) {
        try {
          const user = await userService.getUserById(userId)
          await activityLogService.logActivity({
            userId,
            userEmail: user?.email || '',
            userName: user?.displayName,
            action: Object.keys(changes).length > 0 ? 'update_home_content' : 'save_home_content',
            resource: 'home_content',
            resourceId: DOCUMENT_ID,
            changes: Object.keys(changes).length > 0 ? changes : { saved: true }
          })
        } catch (logError) {
          // Don't fail the update if logging fails
          console.error('Failed to log activity:', logError)
        }
      }
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Reset home content to defaults
   */
  async resetToDefaults(userId?: string): Promise<void> {
    try {
      // Check if document exists
      const existingDoc = await firestoreService.getDocument<HomeContent>(COLLECTION_NAME, DOCUMENT_ID)
      const existingContent = existingDoc || DEFAULT_HOME_CONTENT
      const resetContent = { ...DEFAULT_HOME_CONTENT, resetAt: new Date().toISOString() }
      
      // If document doesn't exist, create it; otherwise update it
      if (!existingDoc) {
        const newContent = { 
          ...DEFAULT_HOME_CONTENT, 
          createdAt: new Date().toISOString(), 
          resetAt: new Date().toISOString() 
        }
        await firestoreService.createDocument(COLLECTION_NAME, DOCUMENT_ID, newContent)
      } else {
        await firestoreService.updateDocument(COLLECTION_NAME, DOCUMENT_ID, resetContent)
      }

      // Log activity if userId is provided
      if (userId) {
        try {
          const user = await userService.getUserById(userId)
          await activityLogService.logActivity({
            userId,
            userEmail: user?.email || '',
            userName: user?.displayName,
            action: 'reset_home_content',
            resource: 'home_content',
            resourceId: DOCUMENT_ID,
            changes: {
              reset: true,
              previousContent: existingContent
            }
          })
        } catch (logError) {
          // Don't fail the reset if logging fails
          console.error('Failed to log activity:', logError)
        }
      }
    } catch (error) {
      throw this.handleError(error)
    }
  }
}

export const homeContentService = new HomeContentService()

