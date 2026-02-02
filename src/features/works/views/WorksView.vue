<template>
  <div class="works-view">
    <!-- Background overlay -->
    <div class="background-overlay"></div>

    <div class="works-container">
      <!-- Header Section -->
      <div class="works-header">
        <h1 class="works-title">{{ homeContent?.realResultsTitle || 'Real Results, Real Impact.' }}</h1>
        <p class="works-subtitle">{{ homeContent?.realResultsSubtitle || 'We focus on measurable outcomes that help brands grow, scale, and stand out.' }}</p>
      </div>

      <!-- Works List -->
      <div v-if="works && works.length > 0" class="works-list">
        <div
          v-for="(work, index) in works"
          :key="work.id || index"
          class="work-item"
          @mouseenter="handleWorkHover(work.id)"
          @mouseleave="handleWorkLeave"
        >
          <!-- Company Logo -->
          <div v-if="work.companyLogo || work.companyLogoFileUrl" class="work-company-logo">
            <img
              :src="work.companyLogoFileUrl || work.companyLogo"
              alt="Company Logo"
              class="company-logo-img"
              @error="handleImageError"
            />
          </div>

          <!-- Main Heading -->
          <div v-if="work.headline" class="work-headline-wrapper">
            <h2 class="work-headline">{{ work.headline }}</h2>
          </div>

          <!-- Cards Grid -->
          <div v-if="work.cards && work.cards.length > 0" class="work-cards">
            <div
              v-for="card in work.cards"
              :key="card.id"
              class="work-card"
            >
              <div class="card-content">
                <h3 class="card-title">{{ card.title }}</h3>
                <div class="card-metric">{{ card.metric }}</div>
                <p class="card-subtitle">{{ card.subtitle }}</p>
              </div>
            </div>
          </div>

          <!-- Action Button -->
          <div v-if="work.ctaText" class="work-cta">
            <a href="#" class="cta-link">
              {{ work.ctaText }}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </a>
          </div>

          <!-- Company Images on Hover -->
          <div
            v-if="work.companyImages && work.companyImages.length > 0"
            class="work-company-images"
            :class="{ 'show': hoveredWorkId === work.id }"
          >
            <div class="images-grid">
              <div
                v-for="image in work.companyImages"
                :key="image.id"
                class="image-item"
              >
                <img
                  :src="image.imageFileUrl || image.imageUrl"
                  alt="Company work"
                  @error="handleImageError"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="works-empty">
        <p class="empty-message">No works available at the moment.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { WorksController } from '../controllers/WorksController'
import type { HomeContent } from '@/features/home/models/HomeContent'

const worksController = new WorksController()
const homeContent = ref<HomeContent | null>(null)
const works = computed(() => homeContent.value?.realResultsCases || [])
const hoveredWorkId = ref<string | null>(null)

const handleWorkHover = (workId: string) => {
  hoveredWorkId.value = workId
}

const handleWorkLeave = () => {
  hoveredWorkId.value = null
}

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  target.style.display = 'none'
}

onMounted(async () => {
  try {
    const result = await worksController.getWorks()
    if (result.success && result.data) {
      homeContent.value = result.data
    }
  } catch (error) {
    console.error('Failed to load works:', error)
  }
})
</script>

<style scoped>
.works-view {
  position: relative;
  width: 100%;
  min-height: 100vh;
  background: #0A0A0F;
  padding: 120px 20px 80px;
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

.works-container {
  position: relative;
  z-index: 1;
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 4rem;
}

/* Header Section */
.works-header {
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
}

.works-title {
  color: #F5F7FA;
  font-family: 'Roboto', sans-serif;
  font-size: 48px;
  font-weight: 700;
  line-height: 1.2;
  margin: 0 0 1rem 0;
}

.works-subtitle {
  color: #ABBED1;
  font-family: 'Roboto', sans-serif;
  font-size: 18px;
  font-weight: 400;
  line-height: 1.6;
  margin: 0;
}

/* Works List */
.works-list {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 4rem;
}

/* Work Item */
.work-item {
  position: relative;
  width: 100%;
  padding: 3rem;
  background: rgba(91, 32, 150, 0.05);
  border: 1px solid rgba(91, 32, 150, 0.2);
  border-radius: 16px;
  transition: all 0.4s ease;
  overflow: hidden;
}

.work-item:hover {
  border-color: rgba(91, 32, 150, 0.5);
  background: rgba(91, 32, 150, 0.1);
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(91, 32, 150, 0.3);
}

/* Company Logo */
.work-company-logo {
  position: absolute;
  top: 2rem;
  right: 2rem;
  width: 120px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
}

.company-logo-img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  filter: brightness(0) invert(1);
}

/* Headline */
.work-headline-wrapper {
  width: 100%;
  text-align: center;
  margin-bottom: 2rem;
  position: relative;
  z-index: 2;
}

.work-headline {
  color: #F5F7FA;
  font-family: 'Roboto', sans-serif;
  font-size: 36px;
  font-weight: 700;
  line-height: 1.2;
  margin: 0;
  transition: color 0.3s ease;
}

.work-item:hover .work-headline {
  color: #C19DE6;
}

/* Cards Grid */
.work-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
  position: relative;
  z-index: 2;
}

.work-card {
  background: rgba(91, 32, 150, 0.15);
  border: 1px solid rgba(91, 32, 150, 0.4);
  border-radius: 12px;
  padding: 2rem 1.5rem;
  min-height: 240px;
  position: relative;
  overflow: hidden;
  transition: all 0.4s ease;
  display: flex;
  flex-direction: column;
}

.work-card:hover {
  border-color: rgba(91, 32, 150, 0.7);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(91, 32, 150, 0.5);
  background: rgba(91, 32, 150, 0.2);
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
}

.card-metric {
  color: #5B2096;
  font-family: 'Roboto', sans-serif;
  font-size: 40px;
  font-weight: 700;
  line-height: 1;
  margin: 0 0 0.5rem 0;
  text-align: center;
}

.card-subtitle {
  color: rgba(245, 247, 250, 0.7);
  font-family: 'Roboto', sans-serif;
  font-size: 12px;
  font-weight: 400;
  margin: 0;
  line-height: 1.5;
  text-align: center;
}

/* CTA Button */
.work-cta {
  position: relative;
  z-index: 2;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1rem;
  transition: opacity 0.4s ease, visibility 0.4s ease;
}

.work-item:hover .work-cta {
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
  transition: all 0.2s;
}

.cta-link:hover {
  color: #5B2096;
  gap: 1rem;
}

.cta-link svg {
  transition: transform 0.2s;
}

.cta-link:hover svg {
  transform: translateX(4px);
}

/* Company Images on Hover */
.work-company-images {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(11, 11, 15, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  visibility: hidden;
  transition: all 0.4s ease;
  z-index: 10;
  border-radius: 16px;
  padding: 2rem;
}

.work-company-images.show {
  opacity: 1;
  visibility: visible;
}

.images-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  width: 100%;
  max-width: 1200px;
}

.image-item {
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid rgba(91, 32, 150, 0.3);
}

.image-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Empty State */
.works-empty {
  text-align: center;
  padding: 4rem 2rem;
}

.empty-message {
  color: rgba(245, 247, 250, 0.6);
  font-family: 'Roboto', sans-serif;
  font-size: 18px;
  font-weight: 400;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .works-title {
    font-size: 40px;
  }

  .work-cards {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .works-view {
    padding: 100px 20px 60px;
  }

  .works-title {
    font-size: 32px;
  }

  .works-subtitle {
    font-size: 16px;
  }

  .work-item {
    padding: 2rem 1.5rem;
  }

  .work-company-logo {
    position: relative;
    top: 0;
    right: 0;
    width: 100px;
    height: 50px;
    margin-bottom: 1.5rem;
  }

  .work-headline {
    font-size: 28px;
  }

  .work-cards {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .work-card {
    min-height: 200px;
    padding: 1.5rem 1rem;
  }

  .card-metric {
    font-size: 32px;
  }

  .images-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .works-view {
    padding: 80px 16px 40px;
  }

  .works-title {
    font-size: 28px;
  }

  .works-subtitle {
    font-size: 14px;
  }

  .work-item {
    padding: 1.5rem 1rem;
  }

  .work-headline {
    font-size: 24px;
  }

  .work-card {
    min-height: 180px;
    padding: 1.25rem 0.75rem;
  }

  .card-metric {
    font-size: 28px;
  }
}
</style>
