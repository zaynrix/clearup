export interface TeamMember {
  id?: string
  name: string
  role: string
  photoUrl?: string
  photoFileUrl?: string
  photoType?: 'url' | 'upload'
  order?: number
}

export interface FAQ {
  id?: string
  question: string
  answer: string
  order?: number
}

export interface StatCard {
  id?: string
  title: string
  value: string
  description: string
  order?: number
}

export interface AboutContent {
  // Who We Are Section
  whoWeAreTitle: string
  whoWeAreDescription: string
  statCards: StatCard[]
  
  // Video Section
  videoUrl?: string
  videoFileUrl?: string
  videoType?: 'link' | 'upload' | 'none'
  
  // CTA Button
  ctaButtonText: string
  ctaButtonLink?: string
  
  // Our Team Section
  teamTitle: string
  teamSubtitle: string
  teamMembers: TeamMember[]
  
  // FAQ Section
  faqTitle: string
  faqs: FAQ[]
}

