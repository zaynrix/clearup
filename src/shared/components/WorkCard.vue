<template>
  <div
    class="work-card-container"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @click="handleClick"
  >
    <!-- Company Logo - Top Center -->
    <div v-if="work.companyLogo || work.companyLogoFileUrl" class="work-card-company-logo">
      <img
        :src="work.companyLogoFileUrl || work.companyLogo"
        alt="Company Logo"
        class="work-card-logo-img"
        @error="handleImageError"
      />
    </div>

    <!-- Main Heading - Centered -->
    <div v-if="work.headline" class="work-card-headline-wrapper">
      <h2 class="work-card-headline">{{ work.headline }}</h2>
    </div>

    <!-- Small Cards Grid - Inside Container -->
    <div v-if="work.cards && work.cards.length > 0" class="work-card-cards">
      <div
        v-for="card in work.cards"
        :key="card.id"
        class="work-card-item"
      >
        <div class="work-card-content">
          <h3 class="work-card-title">{{ card.title }}</h3>
          <div class="work-card-metric">{{ card.metric }}</div>
          <p class="work-card-subtitle">{{ card.subtitle }}</p>
        </div>
      </div>
    </div>

    <!-- Action Button - Bottom Center -->
    <div v-if="work.ctaText" class="work-card-cta">
      <a href="#" class="work-card-cta-link" @click.prevent="handleClick">
        {{ work.ctaText }}
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </a>
    </div>

    <!-- Company Images on Hover -->
    <div
      v-if="work.companyImages && work.companyImages.length > 0"
      class="work-card-hover-images"
      :class="{ 'show': isHovered }"
      @click.stop
    >
      <div class="work-card-images-grid">
        <div
          v-for="image in work.companyImages"
          :key="image.id"
          class="work-card-image-item"
        >
          <img
            :src="image.imageFileUrl || image.imageUrl"
            alt="Company work"
            class="work-card-image"
            @error="handleImageError"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { HomeContent } from '@/features/home/models/HomeContent'

type WorkCase = HomeContent['realResultsCases'][0]

interface Props {
  work: WorkCase
}

interface Emits {
  (e: 'click', workId: string | undefined): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const isHovered = ref(false)

const handleMouseEnter = () => {
  isHovered.value = true
}

const handleMouseLeave = () => {
  isHovered.value = false
}

const handleClick = () => {
  emit('click', props.work.id)
}

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  target.style.display = 'none'
}
</script>

<style scoped>
.work-card-container {
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
  transition: all 0.4s ease;
  display: flex;
  flex-direction: column;
}

.work-card-container:hover {
  border-color: rgba(91, 32, 150, 0.7);
  box-shadow: 0 8px 24px rgba(91, 32, 150, 0.5);
  background: rgba(91, 32, 150, 0.2);
}

/* Company Logo - Top Center */
.work-card-company-logo {
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 3;
  margin-bottom: 3rem;
}

.work-card-logo-img {
  max-width: 200px;
  max-height: 120px;
  width: auto;
  height: auto;
  object-fit: contain;
}

/* Main Heading - Centered */
.work-card-headline-wrapper {
  position: relative;
  z-index: 2;
  width: 100%;
  text-align: center;
  margin-bottom: 4rem;
  transition: opacity 0.4s ease, visibility 0.4s ease;
}

.work-card-container:hover .work-card-headline-wrapper {
  opacity: 0;
  visibility: hidden;
}

.work-card-headline {
  color: #5B2096; /* Fallback color for browsers that don't support background-clip */
  background: linear-gradient(135deg, #5B2096 0%, #8B5CF6 50%, #A78BFA 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-family: 'Roboto', sans-serif;
  font-size: 64px;
  font-weight: 700;
  text-align: center;
  line-height: 1.2;
  margin: 0;
  display: inline-block; /* Required for background-clip to work properly */
}

/* Small Cards - Inside Container */
.work-card-cards {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  width: 100%;
  margin-bottom: 3rem;
  transition: opacity 0.4s ease, visibility 0.4s ease;
}

.work-card-container:hover .work-card-cards {
  opacity: 0;
  visibility: hidden;
}

@media (min-width: 768px) {
  .work-card-cards {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .work-card-cards {
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
  }
}

.work-card-item {
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

.work-card-item:hover {
  border-color: rgba(91, 32, 150, 0.7);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(91, 32, 150, 0.5);
  background: rgba(91, 32, 150, 0.2);
}

.work-card-content {
  position: relative;
  z-index: 2;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.work-card-title {
  color: #F5F7FA;
  font-family: 'Roboto', sans-serif;
  font-size: 14px;
  font-weight: 500;
  margin: 0 0 1rem 0;
  line-height: 1.4;
  text-align: center;
}

.work-card-metric {
  color: #5B2096;
  font-family: 'Roboto', sans-serif;
  font-size: 40px;
  font-weight: 700;
  line-height: 1;
  margin: 0 0 0.5rem 0;
  text-align: center;
}

.work-card-subtitle {
  color: rgba(245, 247, 250, 0.7);
  font-family: 'Roboto', sans-serif;
  font-size: 12px;
  font-weight: 400;
  margin: 0;
  line-height: 1.5;
  text-align: center;
}

/* CTA Button */
.work-card-cta {
  position: relative;
  z-index: 2;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 0;
  transition: opacity 0.4s ease, visibility 0.4s ease;
}

.work-card-container:hover .work-card-cta {
  opacity: 0;
  visibility: hidden;
}

.work-card-cta-link {
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

.work-card-cta-link:hover {
  color: #5B2096;
  gap: 1rem;
}

.work-card-cta-link svg {
  transition: transform 0.2s;
}

.work-card-cta-link:hover svg {
  transform: translateX(4px);
}

/* Company Images on Hover */
.work-card-hover-images {
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
  pointer-events: none;
}

.work-card-hover-images.show {
  opacity: 1;
  visibility: visible;
  pointer-events: none;
}

.work-card-images-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  width: 100%;
  max-width: 1000px;
  align-content: start;
}

.work-card-image-item {
  border-radius: 8px;
  overflow: hidden;
  background: rgba(91, 32, 150, 0.1);
  border: 1px solid rgba(91, 32, 150, 0.2);
  transition: transform 0.2s ease;
}

.work-card-image-item:hover {
  transform: scale(1.02);
  border-color: rgba(91, 32, 150, 0.5);
}

.work-card-image {
  width: 100%;
  height: auto;
  object-fit: cover;
  display: block;
}

/* Responsive Design */
@media (max-width: 768px) {
  .work-card-container {
    padding: 3rem 2rem;
  }

  .work-card-headline {
    font-size: 42px;
  }

  .work-card-company-logo {
    margin-bottom: 2rem;
  }

  .work-card-headline-wrapper {
    margin-bottom: 3rem;
  }

  .work-card-cards {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    margin-bottom: 2rem;
  }

  .work-card-images-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}

@media (max-width: 480px) {
  .work-card-container {
    padding: 2rem 1.5rem;
  }

  .work-card-headline {
    font-size: 32px;
  }

  .work-card-item {
    padding: 1.5rem 1rem;
    min-height: 200px;
  }

  .work-card-metric {
    font-size: 32px;
  }

  .work-card-logo-img {
    max-width: 150px;
  }
}
</style>
