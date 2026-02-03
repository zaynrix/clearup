<template>
  <div class="work-detail-view">
    <!-- Background overlay -->
    <div class="background-overlay"></div>

    <div v-if="loading" class="loading-state">
      <p>Loading...</p>
    </div>

    <div v-else-if="work" class="work-detail-container">
      <!-- Hero Image Section -->
      <section v-if="work.heroImage && (work.heroImage.imageUrl || work.heroImage.imageFileUrl)" class="hero-image-section" data-section-id="hero-image">
        <div class="hero-image-wrapper">
          <div v-if="imageLoadingStates.hero" class="image-loader">
            <div class="spinner"></div>
            <p>Loading image...</p>
          </div>
          <img
            :src="work.heroImage.imageFileUrl || work.heroImage.imageUrl"
            alt="Work Hero"
            class="hero-image"
            :class="{ 'loaded': !imageLoadingStates.hero }"
            @load="imageLoadingStates.hero = false"
            @error="handleImageError"
          />
        </div>
      </section>

      <!-- Image Gallery Section -->
      <section v-if="work.imageGallerySection && work.imageGallerySection.images && work.imageGallerySection.images.length > 0" class="image-gallery-section" data-section-id="image-gallery">
        <div class="image-gallery-container">
          <div class="image-gallery-grid">
            <div
              v-for="(imageItem, index) in work.imageGallerySection.images"
              :key="imageItem.id"
              class="gallery-item"
              :data-card-id="`gallery-item-${index}`"
            >
              <div class="gallery-texts">
                <h1 class="gallery-title">{{ imageItem.title }}</h1>
                <h3 class="gallery-subtitle">{{ imageItem.subtitle }}</h3>
              </div>
              <div class="gallery-image-wrapper">
                <div v-if="imageLoadingStates[`gallery-${imageItem.id}`]" class="image-loader">
                  <div class="spinner"></div>
                  <p>Loading...</p>
                </div>
                <img
                  :src="imageItem.imageFileUrl || imageItem.imageUrl"
                  :alt="imageItem.title"
                  class="gallery-image"
                  :class="{ 'loaded': !imageLoadingStates[`gallery-${imageItem.id}`] }"
                  @load="imageLoadingStates[`gallery-${imageItem.id}`] = false"
                  @error="handleImageError"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Before/After Section -->
      <section v-if="work.beforeAfterSection" class="before-after-section" data-section-id="before-after">
        <div class="before-after-container">
          <h2 class="section-title" data-card-id="section-title-ba">Successful Advertising Campaigns</h2>
          <div class="before-after-stack">
            <!-- After Campaign - Front Image (Full Screen) -->
            <div v-if="work.beforeAfterSection.afterImageUrl || work.beforeAfterSection.afterImageFileUrl" class="before-after-item after-campaign-item" data-card-id="after-campaign">
              <h3 class="before-after-title">After Campaign</h3>
              <div class="image-wrapper">
                <div v-if="imageLoadingStates.after" class="image-loader">
                  <div class="spinner"></div>
                  <p>Loading...</p>
                </div>
                <img
                  :src="work.beforeAfterSection.afterImageFileUrl || work.beforeAfterSection.afterImageUrl"
                  alt="After Campaign"
                  class="before-after-image"
                  :class="{ 'loaded': !imageLoadingStates.after }"
                  @load="imageLoadingStates.after = false"
                  @error="handleImageError"
                />
              </div>
              <p v-if="work.beforeAfterSection.afterCaption" class="caption">{{ work.beforeAfterSection.afterCaption }}</p>
              <p v-else class="caption">Limited reach • Low conversion</p>
            </div>
            <!-- Before Campaign - Background Image (Below) -->
            <div v-if="work.beforeAfterSection.beforeImageUrl || work.beforeAfterSection.beforeImageFileUrl" class="before-after-item before-campaign-item" data-card-id="before-campaign">
              <h3 class="before-after-title">Before Campaign</h3>
              <div class="image-wrapper">
                <div v-if="imageLoadingStates.before" class="image-loader">
                  <div class="spinner"></div>
                  <p>Loading...</p>
                </div>
                <img
                  :src="work.beforeAfterSection.beforeImageFileUrl || work.beforeAfterSection.beforeImageUrl"
                  alt="Before Campaign"
                  class="before-after-image"
                  :class="{ 'loaded': !imageLoadingStates.before }"
                  @load="imageLoadingStates.before = false"
                  @error="handleImageError"
                />
              </div>
              <p v-if="work.beforeAfterSection.beforeCaption" class="caption">{{ work.beforeAfterSection.beforeCaption }}</p>
              <p v-else class="caption">Limited reach • Low conversion</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Our Approach Section -->
      <section v-if="work.ourApproach && work.ourApproach.steps && work.ourApproach.steps.length > 0" class="our-approach-section" data-section-id="our-approach">
        <div class="our-approach-container">
          <h2 class="section-title" data-card-id="section-title-approach">{{ work.ourApproach.title || 'Our Approach' }}</h2>
          <div class="approach-steps">
            <div
              v-for="(step, index) in work.ourApproach.steps"
              :key="step.id"
              class="approach-step"
              :data-card-id="`approach-step-${index}`"
            >
              <div class="step-icon">
                <svg v-if="step.icon === 'magnifying-glass'" width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="11" cy="11" r="8" stroke="#5B2096" stroke-width="2"/>
                  <path d="m21 21-4.35-4.35" stroke="#5B2096" stroke-width="2" stroke-linecap="round"/>
                </svg>
                <svg v-else-if="step.icon === 'target'" width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="#5B2096" stroke-width="2"/>
                  <circle cx="12" cy="12" r="6" stroke="#5B2096" stroke-width="2"/>
                  <circle cx="12" cy="12" r="2" stroke="#5B2096" stroke-width="2"/>
                </svg>
                <svg v-else-if="step.icon === 'lightbulb'" width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 21h6M12 3a6 6 0 0 0-6 6c0 2.5 1.5 4.5 3 6a3 3 0 0 1 3 3 3 3 0 0 1 3-3c1.5-1.5 3-3.5 3-6a6 6 0 0 0-6-6Z" stroke="#5B2096" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <svg v-else width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" stroke="#5B2096" stroke-width="2"/>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1Z" stroke="#5B2096" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <h3 class="step-title">{{ step.title }}</h3>
              <p class="step-description">{{ step.description }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Other Thinking Section -->
      <section v-if="otherWorks && otherWorks.length > 0" class="other-thinking-section" data-section-id="other-thinking">
        <div class="other-thinking-container">
          <div class="other-thinking-header" data-card-id="other-thinking-header">
            <h2 class="other-thinking-title">Other Thinking</h2>
            <p class="other-thinking-subtitle">We focus on measurable outcomes that help brands grow, scale, and stand out.</p>
          </div>

          <div class="other-works-list">
            <div
              v-for="otherWork in displayedOtherWorks"
              :key="otherWork.id"
              class="other-work-case-container"
              :data-card-id="`other-work-${otherWork.id}`"
              @mouseenter="handleHeadlineHover(otherWork.id)"
              @mouseleave="handleHeadlineLeave"
              @click="navigateToWork(otherWork.id)"
            >
              <!-- Company Logo - Top Center -->
              <div v-if="otherWork.companyLogo || otherWork.companyLogoFileUrl" class="other-work-company-logo">
                <div v-if="imageLoadingStates[`logo-${otherWork.id}`]" class="image-loader">
                  <div class="spinner"></div>
                </div>
                <img
                  :src="otherWork.companyLogoFileUrl || otherWork.companyLogo"
                  alt="Company Logo"
                  class="company-logo-img"
                  :class="{ 'loaded': !imageLoadingStates[`logo-${otherWork.id}`] }"
                  @load="imageLoadingStates[`logo-${otherWork.id}`] = false"
                  @error="handleImageError"
                />
              </div>

              <!-- Main Heading - Centered -->
              <div v-if="otherWork.headline" class="other-work-headline-wrapper">
                <h2 class="other-work-headline">{{ otherWork.headline }}</h2>
              </div>

              <!-- Small Cards Grid - Inside Container -->
              <div v-if="otherWork.cards && otherWork.cards.length > 0" class="other-work-cards">
                <div
                  v-for="card in otherWork.cards"
                  :key="card.id"
                  class="other-work-card"
                >
                  <div class="card-content">
                    <h3 class="card-title">{{ card.title }}</h3>
                    <div class="card-metric">{{ card.metric }}</div>
                    <p class="card-subtitle">{{ card.subtitle }}</p>
                  </div>
                </div>
              </div>

              <!-- Action Button - Bottom Center -->
              <div v-if="otherWork.ctaText" class="other-work-cta">
                <a href="#" class="cta-link" @click.stop.prevent="navigateToWork(otherWork.id)">
                  {{ otherWork.ctaText }}
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </a>
              </div>

              <!-- Company Images on Hover -->
              <div
                v-if="otherWork.companyImages && otherWork.companyImages.length > 0"
                class="headline-hover-images"
                :class="{ 'show': hoveredCaseId === otherWork.id }"
              >
                <div class="company-images-grid">
                  <div
                    v-for="(img, imgIndex) in otherWork.companyImages"
                    :key="img.id || imgIndex"
                    class="company-image-item"
                  >
                    <div v-if="imageLoadingStates[`company-img-${otherWork.id}-${imgIndex}`]" class="image-loader">
                      <div class="spinner"></div>
                    </div>
                    <img
                      v-if="img.imageFileUrl || img.imageUrl"
                      :src="img.imageFileUrl || img.imageUrl"
                      :alt="`Company Image ${imgIndex + 1}`"
                      class="company-img"
                      :class="{ 'loaded': !imageLoadingStates[`company-img-${otherWork.id}-${imgIndex}`] }"
                      @load="imageLoadingStates[`company-img-${otherWork.id}-${imgIndex}`] = false"
                      @error="handleImageError"
                    />
                  </div>
                </div>
              </div>
              <div
                v-else
                class="headline-hover-placeholder"
                :class="{ 'show': hoveredCaseId === otherWork.id }"
              >
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 19V5C21 4.46957 20.7893 3.96086 20.4142 3.58579C20.0391 3.21071 19.5304 3 19 3H5C4.46957 3 3.96086 3.21071 3.58579 3.58579C3.21071 3.96086 3 4.46957 3 5V19C3 19.5304 3.21071 20.0391 3.58579 20.4142C3.96086 20.7893 4.46957 21 5 21H19C19.5304 21 20.0391 20.7893 20.4142 20.4142C20.7893 20.0391 21 19.5304 21 19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M8.5 10C9.32843 10 10 9.32843 10 8.5C10 7.67157 9.32843 7 8.5 7C7.67157 7 7 7.67157 7 8.5C7 9.32843 7.67157 10 8.5 10Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M21 15L16 10L5 21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <p>No images set</p>
              </div>
            </div>
          </div>
          <button
            v-if="otherWorks.length > 3 && !showAllOtherWorks"
            class="see-more-button"
            @click="showAllOtherWorks = true"
          >
            See More
          </button>
        </div>
      </section>
    </div>

    <div v-else class="error-state">
      <p>Work not found</p>
    </div>

    <!-- Footer -->
    <FooterSection />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { WorkDetailController } from '../controllers/WorkDetailController'
import FooterSection from '@/shared/components/FooterSection.vue'
import type { WorkDetail } from '../models/WorkDetail'

const route = useRoute()
const router = useRouter()
const workDetailController = new WorkDetailController()

const work = ref<WorkDetail | null>(null)
const otherWorks = ref<WorkDetail[]>([])
const loading = ref(true)
const showAllOtherWorks = ref(false)
const hoveredCaseId = ref<string | null>(null)

// Image loading states
const imageLoadingStates = ref<Record<string, boolean>>({})

// Initialize image loading states
const initializeImageLoadingStates = () => {
  imageLoadingStates.value = {}
  
  if (work.value?.heroImage) {
    imageLoadingStates.value.hero = true
  }
  
  if (work.value?.beforeAfterSection) {
    if (work.value.beforeAfterSection.afterImageUrl || work.value.beforeAfterSection.afterImageFileUrl) {
      imageLoadingStates.value.after = true
    }
    if (work.value.beforeAfterSection.beforeImageUrl || work.value.beforeAfterSection.beforeImageFileUrl) {
      imageLoadingStates.value.before = true
    }
  }
  
  if (work.value?.imageGallerySection?.images) {
    work.value.imageGallerySection.images.forEach((img) => {
      imageLoadingStates.value[`gallery-${img.id}`] = true
    })
  }
  
  if (otherWorks.value.length > 0) {
    otherWorks.value.forEach((otherWork) => {
      if (otherWork.companyLogo || otherWork.companyLogoFileUrl) {
        imageLoadingStates.value[`logo-${otherWork.id}`] = true
      }
      if (otherWork.companyImages) {
        otherWork.companyImages.forEach((img, imgIndex) => {
          imageLoadingStates.value[`company-img-${otherWork.id}-${imgIndex}`] = true
        })
      }
    })
  }
}

const displayedOtherWorks = computed(() => {
  if (showAllOtherWorks.value) {
    return otherWorks.value
  }
  return otherWorks.value.slice(0, 3)
})

const handleHeadlineHover = (caseId: string) => {
  hoveredCaseId.value = caseId
}

const handleHeadlineLeave = () => {
  hoveredCaseId.value = null
}

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  target.style.display = 'none'
}

const navigateToWork = (workId: string) => {
  router.push(`/works/${workId}`)
}

const loadWorkData = async (workId: string) => {
  if (!workId) {
    loading.value = false
    return
  }

  loading.value = true
  try {
    // Load work detail
    const workResult = await workDetailController.getWorkDetail(workId)
    if (workResult.success && workResult.data) {
      work.value = workResult.data
    } else {
      work.value = null
    }

    // Load other works
    const otherWorksResult = await workDetailController.getOtherWorks(workId)
    if (otherWorksResult.success && otherWorksResult.data) {
      otherWorks.value = otherWorksResult.data
    } else {
      otherWorks.value = []
    }

    // Reset show all state when loading new work
    showAllOtherWorks.value = false
    
    // Initialize image loading states after data is loaded
    await nextTick()
    initializeImageLoadingStates()
    
    // Setup scroll animations
    await nextTick()
    setupScrollAnimations()
  } catch (error) {
    console.error('Failed to load work detail:', error)
    work.value = null
    otherWorks.value = []
  } finally {
    loading.value = false
  }
}

// Setup scroll animations
const setupScrollAnimations = () => {
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.05
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target as HTMLElement
        target.classList.add('animate-in')
        observer.unobserve(target)
      }
    })
  }, observerOptions)

  nextTick(() => {
    setTimeout(() => {
      const sections = document.querySelectorAll('[data-section-id]')
      const cards = document.querySelectorAll('[data-card-id]')
      
      sections.forEach(section => {
        const rect = section.getBoundingClientRect()
        const isVisible = rect.top < window.innerHeight + 100 && rect.bottom > -100
        if (isVisible) {
          section.classList.add('animate-in')
        } else {
          section.classList.add('below-viewport')
          observer.observe(section)
        }
      })
      
      cards.forEach(card => {
        const rect = card.getBoundingClientRect()
        const isVisible = rect.top < window.innerHeight + 100 && rect.bottom > -100
        if (isVisible) {
          card.classList.add('animate-in')
        } else {
          card.classList.add('below-viewport')
          observer.observe(card)
        }
      })
    }, 300)
  })
}

onMounted(async () => {
  const workId = route.params.id as string
  await loadWorkData(workId)
})

// Watch for route param changes to reload data when navigating to different work
watch(() => route.params.id, async (newWorkId) => {
  if (newWorkId) {
    await loadWorkData(newWorkId as string)
  }
})
</script>

<style scoped>
.work-detail-view {
  position: relative;
  width: 100%;
  min-height: 100vh;
  background: #0A0A0F;
  overflow-x: hidden;
}

/* Subtle background animation */
@keyframes backgroundPulse {
  0%, 100% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.5;
  }
}

.background-overlay {
  animation: backgroundPulse 8s ease-in-out infinite;
}

.background-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, rgba(11, 11, 15, 0.95) 0%, rgba(11, 11, 15, 0.98) 100%);
  z-index: 0;
  pointer-events: none;
}

.work-detail-container {
  position: relative;
  z-index: 1;
  max-width: 1400px;
  margin: 0 auto;
  padding: 65px 70px 0;
}

/* Hero Image Section */
.hero-image-section {
  width: 100%;
  margin-bottom: 4rem;
}

.hero-image-wrapper {
  width: 100%;
  border-radius: 16px;
  overflow: hidden;
}

.hero-image {
  width: 100%;
  height: auto;
  display: block;
  object-fit: cover;
  opacity: 0;
  transition: opacity 0.5s ease, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  transform: scale(1.05);
}

.hero-image.loaded {
  opacity: 1;
  transform: scale(1);
}

.hero-image-wrapper {
  overflow: hidden;
  border-radius: 16px;
}

.hero-image-wrapper:hover .hero-image {
  transform: scale(1.08);
}

/* Image Loader */
.image-loader {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(20, 20, 27, 0.8);
  border-radius: 12px;
  z-index: 2;
  gap: 1rem;
}

.image-loader p {
  color: rgba(245, 247, 250, 0.7);
  font-size: 14px;
  margin: 0;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(91, 32, 150, 0.3);
  border-top-color: #5B2096;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.hero-image-wrapper,
.gallery-image-wrapper,
.image-wrapper {
  position: relative;
}

/* Before/After Section */
.before-after-section {
  width: 100%;
  margin-bottom: 4rem;
  padding: 4rem 0;
}

.before-after-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.section-title {
  color: #F5F7FA;
  font-family: 'Roboto', sans-serif;
  font-size: clamp(20px, 3.5vw, 32px);
  font-weight: 700;
  line-height: 1.2;
  margin: 0 0 3rem 0;
  text-align: center;
  position: relative;
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%) scaleX(0);
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, #5B2096, #8E5FBE, #C19DE6);
  border-radius: 2px;
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

[data-card-id="section-title-ba"].animate-in.section-title::after,
[data-card-id="section-title-approach"].animate-in.section-title::after {
  transform: translateX(-50%) scaleX(1);
}

.before-after-stack {
  display: flex;
  flex-direction: column;
  gap: 3rem;
  width: 100%;
}

.before-after-item {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  padding: 2rem;
  border-radius: 16px;
  border: 2px dashed rgba(91, 32, 150, 0.5);
  background: rgba(20, 20, 27, 0.3);
  position: relative;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  overflow: hidden;
}

.before-after-item::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(193, 157, 230, 0.1) 0%, transparent 70%);
  transform: translate(-50%, -50%);
  transition: width 0.6s ease, height 0.6s ease;
}

.before-after-item:hover::after {
  width: 300px;
  height: 300px;
}

.before-after-item:hover {
  border-color: rgba(142, 95, 190, 0.7);
  background: rgba(20, 20, 27, 0.5);
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(91, 32, 150, 0.4);
}

.before-after-item:hover .before-after-image {
  transform: scale(1.03);
}

.after-campaign-item {
  width: 100%;
  order: 1;
}

.before-campaign-item {
  width: 100%;
  order: 2;
}

.before-after-title {
  color: #5B2096;
  font-family: 'Roboto', sans-serif;
  font-size: clamp(16px, 2.5vw, 22px);
  font-weight: 700;
  line-height: 1.2;
  margin: 0 0 1rem 0;
  text-align: center;
  transition: color 0.4s ease, transform 0.4s ease;
}

.before-after-item:hover .before-after-title {
  color: #8E5FBE;
  transform: translateY(-2px);
}

.image-wrapper {
  width: 100%;
  max-width: 1130px;
  aspect-ratio: 1130 / 242;
  border-radius: 12px;
  overflow: hidden;
  background: rgba(91, 32, 150, 0.05);
  border: 1px solid rgba(91, 32, 150, 0.2);
  position: relative;
  margin: 0 auto;
}

.before-after-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  opacity: 0;
  transition: opacity 0.5s ease, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  transform: scale(1);
}

.before-after-image.loaded {
  opacity: 1;
}

.image-wrapper {
  overflow: hidden;
}

.caption {
  color: rgba(245, 247, 250, 0.6);
  font-family: 'Roboto', sans-serif;
  font-size: clamp(12px, 1.8vw, 14px);
  font-weight: 400;
  text-align: center;
  margin: 0.5rem 0 0 0;
  transition: color 0.4s ease, transform 0.4s ease;
}

.before-after-item:hover .caption {
  color: rgba(245, 247, 250, 0.8);
  transform: translateY(-2px);
}

/* Image Gallery Section */
.image-gallery-section {
  width: 100%;
  margin-bottom: 4rem;
  padding: 4rem 0;
}

.image-gallery-container {
  width: 100%;
}

.image-gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.gallery-item {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: rgba(91, 32, 150, 0.05);
  border: 1px solid rgba(91, 32, 150, 0.2);
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
  overflow: hidden;
}

.gallery-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(193, 157, 230, 0.1), transparent);
  transition: left 0.6s ease;
}

.gallery-item:hover::before {
  left: 100%;
}

.gallery-item:hover {
  border-color: rgba(91, 32, 150, 0.5);
  background: rgba(91, 32, 150, 0.15);
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 12px 32px rgba(91, 32, 150, 0.3);
}

.gallery-item:hover .gallery-image {
  transform: scale(1.05);
}

.gallery-texts {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.gallery-item:hover .gallery-texts {
  transform: translateX(4px);
}

.gallery-title {
  color: #5B2096; /* Fallback color for browsers that don't support background-clip */
  background: linear-gradient(90deg, #5B2096 0%, #8E5FBE 50%, #C19DE6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-family: 'Roboto', sans-serif;
  font-size: clamp(24px, 4vw, 52px);
  font-weight: 700;
  line-height: 1.2;
  margin: 0;
  display: inline-block; /* Required for background-clip to work properly */
}

.gallery-subtitle {
  color: rgba(245, 247, 250, 0.8);
  font-family: 'Roboto', sans-serif;
  font-size: clamp(14px, 2vw, 1.17em);
  font-weight: 400;
  line-height: 1.5;
  margin: 0;
  transition: color 0.4s ease;
}

.gallery-item:hover .gallery-subtitle {
  color: rgba(245, 247, 250, 1);
}

.gallery-image-wrapper {
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  background: rgba(91, 32, 150, 0.1);
  border: 1px solid rgba(91, 32, 150, 0.3);
}

.gallery-image {
  width: 100%;
  height: auto;
  display: block;
  opacity: 0;
  transition: opacity 0.5s ease, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  transform: scale(1);
}

.gallery-image.loaded {
  opacity: 1;
}

.gallery-image-wrapper {
  overflow: hidden;
  border-radius: 8px;
}

/* Our Approach Section */
.our-approach-section {
  width: 100%;
  margin-bottom: 4rem;
  padding: 4rem 0;
}

.our-approach-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.approach-steps {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.approach-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1.5rem;
  padding: 2rem;
  background: rgba(91, 32, 150, 0.1);
  border: 1px solid rgba(91, 32, 150, 0.3);
  border-radius: 12px;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
  overflow: hidden;
}

.approach-step::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(193, 157, 230, 0.15) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.4s ease;
}

.approach-step:hover::before {
  opacity: 1;
}

.approach-step:hover {
  border-color: rgba(142, 95, 190, 0.7);
  background: rgba(91, 32, 150, 0.2);
  transform: translateY(-8px) scale(1.03);
  box-shadow: 0 12px 32px rgba(91, 32, 150, 0.4);
}

.approach-step:hover .step-icon {
  transform: scale(1.1) rotate(5deg);
  animation: iconPulse 1.5s ease-in-out infinite;
}

.step-icon {
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(91, 32, 150, 0.2);
  border-radius: 50%;
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
}

.step-icon::after {
  content: '';
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  border: 2px solid rgba(193, 157, 230, 0.3);
  opacity: 0;
  transition: opacity 0.4s ease, transform 0.4s ease;
  transform: scale(0.8);
}

.approach-step:hover .step-icon::after {
  opacity: 1;
  transform: scale(1.1);
}

@keyframes iconPulse {
  0%, 100% {
    transform: scale(1.1) rotate(5deg);
  }
  50% {
    transform: scale(1.15) rotate(-5deg);
  }
}

.step-title {
  color: #F5F7FA;
  font-family: 'Roboto', sans-serif;
  font-size: clamp(14px, 2vw, 18px);
  font-weight: 600;
  margin: 0;
}

.step-description {
  color: rgba(245, 247, 250, 0.7);
  font-family: 'Roboto', sans-serif;
  font-size: clamp(13px, 1.8vw, 14px);
  font-weight: 400;
  line-height: 1.6;
  margin: 0;
  transition: color 0.4s ease, transform 0.4s ease;
}

.approach-step:hover .step-description {
  color: rgba(245, 247, 250, 0.9);
  transform: translateY(-2px);
}

/* Other Thinking Section */
.other-thinking-section {
  width: 100%;
  margin-bottom: 4rem;
  padding: 80px 20px;
  background: #0A0A0F;
  position: relative;
  z-index: 2;
}

.other-thinking-container {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3rem;
}

.other-thinking-header {
  text-align: center;
  max-width: 800px;
}

.other-thinking-title {
  color: #F5F7FA;
  font-family: 'Roboto', sans-serif;
  font-size: clamp(24px, 4vw, 40px);
  font-weight: 700;
  line-height: 1.2;
  margin: 0 0 1rem 0;
}

.other-thinking-subtitle {
  color: #ABBED1;
  font-family: 'Roboto', sans-serif;
  font-size: clamp(14px, 2vw, 18px);
  font-weight: 400;
  line-height: 1.6;
  margin: 0;
}

/* Other Works Cases Container */
.other-works-list {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 4rem;
  margin-top: 3rem;
}

.other-work-case-container {
  position: relative;
  width: 100%;
  max-width: 1300px;
  margin: 0 auto;
  padding: 4rem 4rem;
  background: rgba(91, 32, 150, 0.15);
  border: 1px solid rgba(91, 32, 150, 0.4);
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  flex-direction: column;
}

.other-work-case-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(193, 157, 230, 0.1) 0%, transparent 50%);
  opacity: 0;
  transition: opacity 0.5s ease;
}

.other-work-case-container:hover::before {
  opacity: 1;
}

.other-work-case-container:hover {
  border-color: rgba(142, 95, 190, 0.8);
  box-shadow: 0 16px 48px rgba(91, 32, 150, 0.6);
  background: rgba(91, 32, 150, 0.25);
  transform: translateY(-4px) scale(1.01);
}

/* Company Logo - Top Center */
.other-work-company-logo {
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 3;
  margin-bottom: 3rem;
}

.company-logo-img {
  max-width: 200px;
  max-height: 120px;
  width: auto;
  height: auto;
  object-fit: contain;
}

/* Main Heading - Centered */
.other-work-headline-wrapper {
  position: relative;
  z-index: 2;
  width: 100%;
  text-align: center;
  margin-bottom: 4rem;
  transition: opacity 0.4s ease, visibility 0.4s ease;
}

.other-work-case-container:hover .other-work-headline-wrapper {
  opacity: 0;
  visibility: hidden;
}

.other-work-headline {
  color: #5B2096; /* Fallback color for browsers that don't support background-clip */
  background: linear-gradient(90deg, #5B2096 0%, #8E5FBE 50%, #C19DE6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-family: 'Roboto', sans-serif;
  font-size: clamp(28px, 5vw, 52px);
  font-weight: 700;
  text-align: center;
  line-height: 1.2;
  margin: 0;
  display: inline-block; /* Required for background-clip to work properly */
}

/* Company Images on Hover - Overlay entire container */
.headline-hover-images,
.headline-hover-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.4s ease, visibility 0.4s ease;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(20, 20, 27, 0.98);
  border-radius: 16px;
  padding: 4rem;
  overflow-y: auto;
  overflow-x: hidden;
}

.headline-hover-images.show,
.headline-hover-placeholder.show {
  opacity: 1;
  visibility: visible;
}

.company-images-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  width: 100%;
  max-width: 1000px;
  align-content: start;
}

.company-image-item {
  border-radius: 8px;
  overflow: hidden;
  background: rgba(91, 32, 150, 0.1);
  border: 1px solid rgba(91, 32, 150, 0.2);
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), 
              box-shadow 0.4s ease,
              border-color 0.4s ease;
}

.company-image-item:hover {
  transform: scale(1.08) rotate(1deg);
  border-color: rgba(142, 95, 190, 0.6);
  box-shadow: 0 8px 24px rgba(91, 32, 150, 0.4);
}

.company-image-item:hover .company-img {
  transform: scale(1.1);
}

.company-img {
  width: 100%;
  height: auto;
  object-fit: cover;
  display: block;
  opacity: 0;
  transition: opacity 0.5s ease, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  transform: scale(1);
}

.company-img.loaded {
  opacity: 1;
}

.company-image-item {
  position: relative;
}

.company-logo-img {
  opacity: 0;
  transition: opacity 0.5s ease;
}

.company-logo-img.loaded {
  opacity: 1;
}

.other-work-company-logo {
  position: relative;
}

.headline-hover-placeholder {
  flex-direction: column;
  gap: 1rem;
  color: rgba(245, 247, 250, 0.5);
}

.headline-hover-placeholder svg {
  color: rgba(91, 32, 150, 0.5);
}

.headline-hover-placeholder p {
  margin: 0;
  font-size: 14px;
}

/* Small Cards - Inside Container */
.other-work-cards {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  width: 100%;
  margin-bottom: 3rem;
  transition: opacity 0.4s ease, visibility 0.4s ease;
}

.other-work-case-container:hover .other-work-cards {
  opacity: 0;
  visibility: hidden;
}

@media (min-width: 768px) {
  .other-work-cards {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .other-work-cards {
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
  }
}

.other-work-card {
  background: rgba(91, 32, 150, 0.15);
  border: 1px solid rgba(91, 32, 150, 0.4);
  border-radius: 12px;
  padding: 2rem 1.5rem;
  min-height: 240px;
  position: relative;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  flex-direction: column;
}

.other-work-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(193, 157, 230, 0.2), transparent);
  transition: left 0.6s ease;
}

.other-work-card:hover::before {
  left: 100%;
}

.other-work-card:hover {
  border-color: rgba(142, 95, 190, 0.8);
  transform: translateY(-6px) scale(1.02);
  box-shadow: 0 12px 32px rgba(91, 32, 150, 0.6);
  background: rgba(91, 32, 150, 0.25);
}

.other-work-card:hover .card-metric {
  transform: scale(1.1);
  color: #8E5FBE;
}

.card-content {
  position: relative;
  z-index: 2;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.card-title {
  color: #F5F7FA;
  font-family: 'Roboto', sans-serif;
  font-size: 14px;
  font-weight: 500;
  margin: 0 0 1rem 0;
  line-height: 1.4;
  text-align: center;
  transition: color 0.4s ease, transform 0.4s ease;
}

.other-work-card:hover .card-title {
  color: rgba(193, 157, 230, 0.9);
  transform: translateY(-2px);
}

.card-metric {
  color: #5B2096;
  font-family: 'Roboto', sans-serif;
  font-size: clamp(28px, 4vw, 40px);
  font-weight: 700;
  line-height: 1;
  margin: 0 0 0.5rem 0;
  text-align: center;
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), color 0.4s ease;
}

.card-subtitle {
  color: rgba(245, 247, 250, 0.7);
  font-family: 'Roboto', sans-serif;
  font-size: 12px;
  font-weight: 400;
  margin: 0;
  line-height: 1.5;
  text-align: center;
  transition: color 0.4s ease;
}

.other-work-card:hover .card-subtitle {
  color: rgba(245, 247, 250, 0.85);
}

/* Action Button - Bottom Center */
.other-work-cta {
  position: relative;
  z-index: 2;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 0;
  transition: opacity 0.4s ease, visibility 0.4s ease;
}

.other-work-case-container:hover .other-work-cta {
  opacity: 0;
  visibility: hidden;
}

.cta-link {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  color: #F5F7FA;
  font-family: 'Roboto', sans-serif;
  font-size: 18px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
}

.cta-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, #5B2096, #8E5FBE, #C19DE6);
  transition: width 0.4s ease;
}

.cta-link:hover::after {
  width: 100%;
}

.cta-link:hover {
  color: #8E5FBE;
  gap: 1rem;
  transform: translateX(4px);
}

.cta-link svg {
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.cta-link:hover svg {
  transform: translateX(8px) scale(1.1);
}

.see-more-button {
  padding: 1rem 2rem;
  background: rgba(91, 32, 150, 0.2);
  border: 1px solid rgba(91, 32, 150, 0.5);
  border-radius: 8px;
  color: #F5F7FA;
  font-family: 'Roboto', sans-serif;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
  overflow: hidden;
}

.see-more-button::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(193, 157, 230, 0.3);
  transform: translate(-50%, -50%);
  transition: width 0.6s ease, height 0.6s ease;
}

.see-more-button:hover::before {
  width: 300px;
  height: 300px;
}

.see-more-button:hover {
  background: rgba(91, 32, 150, 0.35);
  border-color: rgba(142, 95, 190, 0.8);
  transform: translateY(-4px) scale(1.05);
  box-shadow: 0 8px 24px rgba(91, 32, 150, 0.5);
}

.see-more-button:active {
  transform: translateY(-2px) scale(1.02);
}

/* Loading and Error States */
.loading-state,
.error-state {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  color: rgba(245, 247, 250, 0.6);
  font-family: 'Roboto', sans-serif;
  font-size: 18px;
}

/* Scroll Animation Styles */
[data-section-id],
[data-card-id] {
  transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), 
              transform 0.8s cubic-bezier(0.16, 1, 0.3, 1),
              filter 0.8s ease;
}

[data-section-id].below-viewport:not(.animate-in),
[data-card-id].below-viewport:not(.animate-in) {
  opacity: 0;
  transform: translateY(50px) scale(0.95);
  filter: blur(4px);
}

[data-section-id]:not(.below-viewport),
[data-card-id]:not(.below-viewport),
[data-section-id].animate-in,
[data-card-id].animate-in {
  opacity: 1;
  transform: translateY(0) scale(1);
  filter: blur(0);
}

/* Fade in animation for sections */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(50px) scale(0.95);
    filter: blur(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
    filter: blur(0);
  }
}

[data-section-id].animate-in {
  animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

[data-card-id].animate-in {
  animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

/* Staggered animations */
[data-card-id="section-title-ba"] { transition-delay: 0.1s; }
[data-card-id="after-campaign"] { transition-delay: 0.2s; }
[data-card-id="before-campaign"] { transition-delay: 0.3s; }
[data-card-id="section-title-approach"] { transition-delay: 0.1s; }
[data-card-id="approach-step-0"] { transition-delay: 0.2s; }
[data-card-id="approach-step-1"] { transition-delay: 0.3s; }
[data-card-id="approach-step-2"] { transition-delay: 0.4s; }
[data-card-id="approach-step-3"] { transition-delay: 0.5s; }
[data-card-id="approach-step-4"] { transition-delay: 0.6s; }
[data-card-id="approach-step-5"] { transition-delay: 0.7s; }
[data-card-id="other-thinking-header"] { transition-delay: 0.1s; }
[data-card-id="gallery-item-0"] { transition-delay: 0.1s; }
[data-card-id="gallery-item-1"] { transition-delay: 0.2s; }
[data-card-id="gallery-item-2"] { transition-delay: 0.3s; }
[data-card-id="gallery-item-3"] { transition-delay: 0.4s; }
[data-card-id="gallery-item-4"] { transition-delay: 0.5s; }
[data-card-id="gallery-item-5"] { transition-delay: 0.6s; }

/* Responsive Design */
@media (max-width: 1024px) {
  .work-detail-container {
    padding: 60px 40px 0;
  }

  .hero-image-section {
    margin-bottom: 3rem;
  }

  .image-gallery-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }

  .gallery-title {
    font-size: 42px;
  }

  .approach-steps {
    grid-template-columns: repeat(2, 1fr);
  }

  .other-work-headline {
    font-size: 42px;
  }

  .other-work-case-container {
    padding: 3.5rem 3rem;
  }

  .image-wrapper {
    aspect-ratio: 16 / 9;
  }
}

@media (max-width: 768px) {
  .work-detail-container {
    padding: 70px 20px 0;
  }

  .hero-image-section {
    margin-bottom: 3rem;
  }

  .before-after-section {
    padding: 2rem 0;
    margin-bottom: 3rem;
  }

  .before-after-container {
    gap: 2rem;
  }

  .before-after-item {
    padding: 1.5rem;
  }

  .section-title {
    font-size: 24px;
    margin-bottom: 2rem;
  }

  .before-after-title {
    font-size: 18px;
  }

  .image-wrapper {
    aspect-ratio: 16 / 9;
  }

  .image-gallery-section {
    padding: 2rem 0;
    margin-bottom: 3rem;
  }

  .image-gallery-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .gallery-item {
    padding: 1.25rem;
  }

  .gallery-title {
    font-size: 32px;
  }

  .gallery-subtitle {
    font-size: 16px;
  }

  .our-approach-section {
    padding: 2rem 0;
    margin-bottom: 3rem;
  }

  .our-approach-container {
    gap: 2rem;
  }

  .approach-steps {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .approach-step {
    padding: 1.5rem;
  }

  .step-title {
    font-size: 14px;
  }

  .step-description {
    font-size: 14px;
  }

  .other-thinking-section {
    padding: 60px 15px;
  }

  .other-thinking-title {
    font-size: 32px;
  }

  .other-thinking-subtitle {
    font-size: 16px;
  }

  .other-work-headline {
    font-size: 36px;
  }

  .other-work-case-container {
    padding: 3rem 2rem;
  }

  .other-work-company-logo {
    margin-bottom: 2rem;
  }

  .company-logo-img {
    max-width: 180px;
    max-height: 100px;
  }

  .other-work-headline-wrapper {
    margin-bottom: 3rem;
  }

  .other-work-cards {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    margin-bottom: 2rem;
  }

  .company-images-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .headline-hover-images,
  .headline-hover-placeholder {
    padding: 2rem;
  }
}

@media (max-width: 480px) {
  .work-detail-container {
    padding: 60px 15px 0;
  }

  .hero-image-section {
    margin-bottom: 2rem;
  }

  .before-after-section {
    padding: 1.5rem 0;
    margin-bottom: 2rem;
  }

  .before-after-item {
    padding: 1.25rem;
  }

  .section-title {
    font-size: 20px;
    margin-bottom: 1.5rem;
  }

  .before-after-title {
    font-size: 16px;
  }

  .image-gallery-section {
    padding: 1.5rem 0;
    margin-bottom: 2rem;
  }

  .gallery-item {
    padding: 1rem;
  }

  .gallery-title {
    font-size: 24px;
  }

  .gallery-subtitle {
    font-size: 14px;
  }

  .our-approach-section {
    padding: 1.5rem 0;
    margin-bottom: 2rem;
  }

  .approach-step {
    padding: 1.25rem;
  }

  .step-icon {
    width: 56px;
    height: 56px;
  }

  .step-title {
    font-size: 16px;
  }

  .step-description {
    font-size: 13px;
  }

  .other-thinking-section {
    padding: 40px 10px;
  }

  .other-thinking-title {
    font-size: 24px;
  }

  .other-thinking-subtitle {
    font-size: 14px;
  }

  .other-work-headline {
    font-size: 28px;
  }

  .other-work-case-container {
    padding: 2rem 1.5rem;
  }

  .other-work-company-logo {
    margin-bottom: 1.5rem;
  }

  .company-logo-img {
    max-width: 150px;
    max-height: 90px;
  }

  .other-work-headline-wrapper {
    margin-bottom: 2rem;
  }

  .other-work-cards {
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .other-work-card {
    padding: 1.5rem 1rem;
    min-height: 200px;
  }

  .card-title {
    font-size: 13px;
  }

  .card-metric {
    font-size: 32px;
  }

  .card-subtitle {
    font-size: 11px;
  }

  .company-images-grid {
    gap: 0.75rem;
  }

  .headline-hover-images,
  .headline-hover-placeholder {
    padding: 1.5rem;
  }

  .image-loader {
    padding: 1rem;
  }

  .spinner {
    width: 32px;
    height: 32px;
  }

  .image-loader p {
    font-size: 12px;
  }
}
</style>
