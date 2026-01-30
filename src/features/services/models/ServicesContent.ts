export interface WhyChooseFeature {
  id?: string
  title: string
  description: string
  icon?: 'target' | 'star' | 'device' | 'chart' // Icon type
  order?: number
}

export interface ServicesContent {
  // Why Choose Clear Up Section
  whyChooseTitle: string
  whyChooseSubtitle: string
  whyChooseFeatures: WhyChooseFeature[]
}

