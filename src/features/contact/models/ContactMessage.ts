export interface ContactMessage {
  id?: string
  name: string
  email: string
  subject: string
  message: string
  createdAt?: Date
  status?: 'pending' | 'read' | 'replied'
}

export interface ContactInfo {
  instagram: string
  instagramUrl: string
  email: string
  linkedin: string
  linkedinUrl: string
  whatsapp: string
  whatsappUrl: string
}

export interface SocialMediaVisibility {
  instagram: {
    showInContactPage: boolean
    showInFooter: boolean
  }
  linkedin: {
    showInContactPage: boolean
    showInFooter: boolean
  }
  email: {
    showInContactPage: boolean
    showInFooter: boolean
  }
  whatsapp: {
    showInContactPage: boolean
    showInFooter: boolean
  }
}

export interface ContactContent {
  // Header Section
  headerTitle: string
  headerSubtitle: string
  
  // Form Section
  formTitle: string
  
  // Contact Info Section
  infoTitle: string
  contactInfo: ContactInfo
  
  // Social Media Visibility Settings
  socialMediaVisibility?: SocialMediaVisibility
}

