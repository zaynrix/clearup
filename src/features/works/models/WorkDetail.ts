import type { HomeContent } from '@/features/home/models/HomeContent'

export interface WorkDetail {
  id: string
  companyLogo?: string
  companyLogoFileUrl?: string
  companyLogoType?: 'url' | 'upload'
  headline: string
  cards: Array<{
    id: string
    title: string
    metric: string
    subtitle: string
  }>
  companyImages?: Array<{
    id: string
    imageUrl?: string
    imageFileUrl?: string
    imageType?: 'url' | 'upload'
  }>
  ctaText?: string
  // Detail page fields
  heroImage?: {
    imageUrl?: string
    imageFileUrl?: string
    imageType?: 'url' | 'upload'
  }
  chartSection?: {
    title: string
    chartImageUrl?: string
    chartImageFileUrl?: string
    chartImageType?: 'url' | 'upload'
  }
  beforeAfterSection?: {
    beforeImageUrl?: string
    beforeImageFileUrl?: string
    beforeImageType?: 'url' | 'upload'
    beforeCaption?: string
    afterImageUrl?: string
    afterImageFileUrl?: string
    afterImageType?: 'url' | 'upload'
    afterCaption?: string
  }
  ourApproach?: {
    title?: string
    steps: Array<{
      id: string
      icon: string
      title: string
      description: string
    }>
  }
  imageGallerySection?: {
    images?: Array<{
      id: string
      title: string
      subtitle: string
      imageUrl?: string
      imageFileUrl?: string
      imageType?: 'url' | 'upload'
    }>
  }
}

export type { HomeContent }
