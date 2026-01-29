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

