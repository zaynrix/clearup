<template>
  <div class="about-view">
    <!-- Background image -->
    <div class="background-image"></div>
    <!-- Background overlay -->
    <div class="background-overlay"></div>
    <!-- Stars animation -->
    <div class="stars"></div>
    <!-- Vector shapes on both sides -->
    <div class="vector-shape vector-left"></div>
    <div class="vector-shape vector-right"></div>
    
    <!-- Main content -->
    <div class="about-container">
      <!-- Loading State -->
      <div v-if="isLoading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>Loading content...</p>
      </div>
      
      <!-- Error State -->
      <div v-else-if="error" class="error-state">
        <p>{{ error }}</p>
        <button @click="loadAboutContent" class="retry-button">Retry</button>
      </div>
      
      <!-- Content -->
      <template v-else>
        <!-- Who We Are Section -->
        <div class="section who-we-are-section" data-section-id="about-who-we-are">
          <div class="section-header">
            <h2 class="section-title">{{ aboutContent?.whoWeAreTitle || 'Who We Are' }}</h2>
            <p class="section-description">{{ aboutContent?.whoWeAreDescription || 'We redesign your marketing system to run it self' }}</p>
          </div>
          
          <!-- Stat Cards -->
          <div v-if="aboutContent?.statCards && aboutContent.statCards.length > 0" class="stat-cards-container">
            <div class="stat-cards-grid">
              <div 
                v-for="statCard in aboutContent.statCards" 
                :key="statCard.id" 
                class="stat-card"
              >
                <h3 class="stat-card-title">{{ statCard.title }}</h3>
                <p class="stat-card-value">{{ statCard.value }}</p>
                <p class="stat-card-description">{{ statCard.description }}</p>
              </div>
            </div>
          </div>
        </div>

      <!-- Video Section -->
      <div v-if="aboutContent?.videoUrl || aboutContent?.videoFileUrl" class="section video-section" data-section-id="about-video">
        <div class="video-container">
          <!-- Prioritize Uploaded Video File -->
          <video 
            v-if="aboutContent.videoFileUrl"
            :src="aboutContent.videoFileUrl"
            controls
            class="video-player"
          >
            Your browser does not support the video tag.
          </video>
          
          <!-- Video from Link -->
          <iframe 
            v-else-if="aboutContent.videoUrl"
            :src="getVideoEmbedUrl(aboutContent.videoUrl)"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
            class="video-iframe"
          ></iframe>
        </div>
      </div>
      <div v-else class="section video-section">
        <div class="video-placeholder">
          <span class="video-text">Video</span>
        </div>
      </div>

      <!-- CTA Button -->
      <div class="section cta-section">
        <div class="cta-buttons-container">
          <button 
            class="book-meeting-button" 
            @click="handleBookMeeting"
            v-if="aboutContent?.ctaButtonText"
          >
            {{ aboutContent.ctaButtonText }}
          </button>
          <a 
            href="https://wa.me/your-number" 
            class="whatsapp-button" 
            aria-label="Contact us on WhatsApp"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M11.125 1.33325C5.7171 1.33325 1.33337 5.71698 1.33337 11.1249C1.33337 12.9755 1.84744 14.7087 2.74142 16.1853L1.868 19.1541C1.81785 19.3245 1.81455 19.5054 1.85845 19.6775C1.90234 19.8497 1.99181 20.0069 2.11745 20.1325C2.24309 20.2581 2.40026 20.3476 2.57243 20.3915C2.7446 20.4354 2.92542 20.4321 3.09587 20.382L6.06471 19.5085C7.59097 20.4318 9.34123 20.9189 11.125 20.9166C16.533 20.9166 20.9167 16.5329 20.9167 11.1249C20.9167 5.71698 16.533 1.33325 11.125 1.33325ZM8.91017 13.3408C10.891 15.3206 12.7818 15.5821 13.4496 15.6066C14.465 15.6438 15.4539 14.8683 15.8387 13.9684C15.8869 13.8564 15.9043 13.7335 15.8892 13.6125C15.874 13.4915 15.8269 13.3768 15.7526 13.2801C15.216 12.5946 14.4904 12.1021 13.7815 11.6125C13.6336 11.51 13.4516 11.4688 13.2739 11.4976C13.0962 11.5265 12.9367 11.6231 12.8288 11.7673L12.2413 12.6632C12.2102 12.7112 12.1621 12.7456 12.1067 12.7594C12.0512 12.7732 11.9926 12.7654 11.9426 12.7376C11.5441 12.5095 10.9635 12.1217 10.5464 11.7046C10.1292 11.2875 9.76498 10.7333 9.56033 10.3602C9.53558 10.3127 9.52858 10.2579 9.5406 10.2056C9.55263 10.1534 9.58289 10.1072 9.62594 10.0753L10.5307 9.40354C10.6602 9.29152 10.7438 9.13565 10.7655 8.96581C10.7871 8.79596 10.7454 8.62409 10.6482 8.48313C10.2095 7.84079 9.69839 7.02417 8.95717 6.48269C8.8613 6.41381 8.74928 6.37086 8.63194 6.358C8.5146 6.34513 8.39593 6.36279 8.28742 6.40925C7.38658 6.79504 6.60717 7.784 6.64437 8.80136C6.66885 9.46915 6.93029 11.3599 8.91017 13.3408Z" fill="white"/>
            </svg>
          </a>
        </div>
      </div>

      <!-- Our Team Section -->
      <div v-if="!isLoading && (teamMembers.length > 0 || aboutContent?.teamTitle)" class="section team-section" data-section-id="about-team">
        <div class="section-header">
          <h2 class="section-title">{{ aboutContent?.teamTitle || 'Our Team' }}</h2>
          <p class="section-description">{{ aboutContent?.teamSubtitle || 'Who is Nextcent suitable for?' }}</p>
        </div>
        
        <div v-if="teamMembers.length === 0" class="empty-team-message">
          <p>No team members added yet.</p>
        </div>
        
        <div class="team-grid">
          <div 
            v-for="member in teamMembers" 
            :key="member.id" 
            class="team-member-card"
          >
            <div class="member-photo">
              <img 
                v-if="member.photoFileUrl || member.photoUrl"
                :src="member.photoFileUrl || member.photoUrl" 
                :alt="member.name"
                @error="handleImageError"
              />
              <div v-else class="member-photo-placeholder">
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
            </div>
            <div class="member-info">
              <h3 class="member-name">{{ member.name }}</h3>
              <p class="member-role">{{ member.role }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- FAQ Section -->
      <div v-if="!isLoading && (faqs.length > 0 || aboutContent?.faqTitle)" class="section faq-section" data-section-id="about-faq">
        <div class="section-header">
          <h2 class="section-title">{{ aboutContent?.faqTitle || 'Frequently Asked Questions' }}</h2>
        </div>
        
        <div v-if="faqs.length === 0" class="empty-faq-message">
          <p>No frequently asked questions added yet.</p>
        </div>
        
        <div class="faq-list">
          <div 
            v-for="(faq, index) in faqs" 
            :key="faq.id || index"
            class="faq-item"
            :class="{ 'faq-open': openFAQIndex === index }"
          >
            <button 
              class="faq-question"
              @click="toggleFAQ(index)"
            >
              <span>{{ faq.question }}</span>
              <svg 
                class="faq-icon"
                :class="{ 'faq-icon-open': openFAQIndex === index }"
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M6 9L12 15L18 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            <div class="faq-answer">
              <p>{{ faq.answer }}</p>
            </div>
          </div>
        </div>
      </div>
      </template>
    </div>

    <!-- Footer Section -->
    <div class="footer-section">
      <div class="footer-container">
        <div class="footer-content">
          <div class="footer-brand">
            <div class="footer-logo">
              <img 
                src="/images/logos/logo-main.png" 
                alt="ClearUp Logo" 
                class="footer-logo-image"
              />
            </div>
            <p class="footer-tagline">Your creative digital partner for high-impact video ads and marketing content.</p>
            <div class="footer-social">
              <a href="#" class="social-icon" aria-label="Instagram">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2.163C8.678 2.163 8.25 2.175 7.05 2.225C5.85 2.275 4.95 2.475 4.15 2.775C3.35 3.075 2.65 3.475 2.05 4.075C1.45 4.675 1.05 5.375 0.75 6.175C0.45 6.975 0.25 7.875 0.2 9.075C0.15 10.275 0.138 10.703 0.138 14.025C0.138 17.347 0.15 17.775 0.2 18.975C0.25 20.175 0.45 21.075 0.75 21.875C1.05 22.675 1.45 23.375 2.05 23.975C2.65 24.575 3.35 24.975 4.15 25.275C4.95 25.575 5.85 25.775 7.05 25.825C8.25 25.875 8.678 25.887 12 25.887C15.322 25.887 15.75 25.875 16.95 25.825C18.15 25.775 19.05 25.575 19.85 25.275C20.65 24.975 21.35 24.575 21.95 23.975C22.55 23.375 22.95 22.675 23.25 21.875C23.55 21.075 23.75 20.175 23.8 18.975C23.85 17.775 23.862 17.347 23.862 14.025C23.862 10.703 23.85 10.275 23.8 9.075C23.75 7.875 23.55 6.975 23.25 6.175C22.95 5.375 22.55 4.675 21.95 4.075C21.35 3.475 20.65 3.075 19.85 2.775C19.05 2.475 18.15 2.275 16.95 2.225C15.75 2.175 15.322 2.163 12 2.163Z" fill="white"/>
                </svg>
              </a>
              <a href="#" class="social-icon" aria-label="LinkedIn">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20.447 20.452H16.893V14.883C16.893 13.555 16.866 11.843 15.041 11.843C13.188 11.843 12.905 13.269 12.905 14.785V20.452H9.351V9H12.765V10.561H12.811C13.161 9.809 14.084 9.008 15.48 9.008C18.376 9.008 19.084 11.183 19.084 14.167V20.452H20.447Z" fill="white"/>
                  <path d="M5.337 7.433C4.193 7.433 3.274 6.507 3.274 5.367C3.274 4.224 4.194 3.305 5.337 3.305C6.477 3.305 7.401 4.224 7.401 5.367C7.401 6.507 6.476 7.433 5.337 7.433Z" fill="white"/>
                  <path d="M7.119 20.452H3.555V9H7.119V20.452Z" fill="white"/>
                </svg>
              </a>
              <a href="#" class="social-icon" aria-label="Email">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z" fill="white"/>
                </svg>
              </a>
              <a href="#" class="social-icon" aria-label="WhatsApp">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M11.125 1.33325C5.7171 1.33325 1.33337 5.71698 1.33337 11.1249C1.33337 12.9755 1.84744 14.7087 2.74142 16.1853L1.868 19.1541C1.81785 19.3245 1.81455 19.5054 1.85845 19.6775C1.90234 19.8497 1.99181 20.0069 2.11745 20.1325C2.24309 20.2581 2.40026 20.3476 2.57243 20.3915C2.7446 20.4354 2.92542 20.4321 3.09587 20.382L6.06471 19.5085C7.59097 20.4318 9.34123 20.9189 11.125 20.9166C16.533 20.9166 20.9167 16.5329 20.9167 11.1249C20.9167 5.71698 16.533 1.33325 11.125 1.33325ZM8.91017 13.3408C10.891 15.3206 12.7818 15.5821 13.4496 15.6066C14.465 15.6438 15.4539 14.8683 15.8387 13.9684C15.8869 13.8564 15.9043 13.7335 15.8892 13.6125C15.874 13.4915 15.8269 13.3768 15.7526 13.2801C15.216 12.5946 14.4904 12.1021 13.7815 11.6125C13.6336 11.51 13.4516 11.4688 13.2739 11.4976C13.0962 11.5265 12.9367 11.6231 12.8288 11.7673L12.2413 12.6632C12.2102 12.7112 12.1621 12.7456 12.1067 12.7594C12.0512 12.7732 11.9926 12.7654 11.9426 12.7376C11.5441 12.5095 10.9635 12.1217 10.5464 11.7046C10.1292 11.2875 9.76498 10.7333 9.56033 10.3602C9.53558 10.3127 9.52858 10.2579 9.5406 10.2056C9.55263 10.1534 9.58289 10.1072 9.62594 10.0753L10.5307 9.40354C10.6602 9.29152 10.7438 9.13565 10.7655 8.96581C10.7871 8.79596 10.7454 8.62409 10.6482 8.48313C10.2095 7.84079 9.69839 7.02417 8.95717 6.48269C8.8613 6.41381 8.74928 6.37086 8.63194 6.358C8.5146 6.34513 8.39593 6.36279 8.28742 6.40925C7.38658 6.79504 6.60717 7.784 6.64437 8.80136C6.66885 9.46915 6.93029 11.3599 8.91017 13.3408Z" fill="white"/>
                </svg>
              </a>
            </div>
          </div>
          
          <div class="footer-links">
            <h3 class="footer-links-title">Quick Links</h3>
            <ul class="footer-links-list">
              <li><a href="#about">About Us</a></li>
              <li><a href="#services">Our Service</a></li>
              <li><a href="#work">Our Work</a></li>
              <li><a href="#contact">Contact Us</a></li>
            </ul>
          </div>
        </div>
        
        <div class="footer-bottom">
          <p class="footer-copyright">Copyright © 2020 Nexcent Itd. All rights reserved</p>
          <div class="footer-policies">
            <a href="#">Privacy Policy</a>
            <span class="footer-divider">|</span>
            <a href="#">Terms of Service</a>
            <span class="footer-divider">|</span>
            <a href="#">Cookie Policy</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { AboutViewController } from '../controllers/AboutViewController'
import type { AboutContent, TeamMember, FAQ } from '../models/AboutContent'

const viewController = new AboutViewController()
const aboutContent = ref<AboutContent | null>(null)
const openFAQIndex = ref<number | null>(null)
const isLoading = ref(false)
const error = ref<string | null>(null)

const teamMembers = computed(() => {
  if (!aboutContent.value) return []
  return aboutContent.value.teamMembers || []
})

const faqs = computed(() => {
  if (!aboutContent.value) return []
  return aboutContent.value.faqs || []
})

const loadAboutContent = async () => {
  isLoading.value = true
  error.value = null
  
  try {
    await viewController.loadAboutContent()
    aboutContent.value = viewController.getAboutContent()
    
    // If no content loaded, use defaults
    if (!aboutContent.value) {
      aboutContent.value = {
        whoWeAreTitle: 'Who We Are',
        whoWeAreDescription: 'We redesign your marketing system to run it self',
        statCards: [],
        videoUrl: '',
        videoFileUrl: '',
        videoType: 'none',
        ctaButtonText: 'Book a Meeting',
        ctaButtonLink: '',
        teamTitle: 'Our Team',
        teamSubtitle: 'Who is Nextcent suitable for?',
        teamMembers: [],
        faqTitle: 'Frequently Asked Questions',
        faqs: []
      }
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load about content'
    console.error('Error loading about content:', err)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadAboutContent()
})

const getVideoEmbedUrl = (url: string): string => {
  if (!url) return ''
  
  // YouTube
  if (url.includes('youtube.com/watch')) {
    const videoId = url.split('v=')[1]?.split('&')[0]
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url
  }
  if (url.includes('youtu.be/')) {
    const videoId = url.split('youtu.be/')[1]?.split('?')[0]
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url
  }
  
  // Vimeo
  if (url.includes('vimeo.com/')) {
    const videoId = url.split('vimeo.com/')[1]?.split('?')[0]
    return videoId ? `https://player.vimeo.com/video/${videoId}` : url
  }
  
  return url
}

const toggleFAQ = (index: number) => {
  openFAQIndex.value = openFAQIndex.value === index ? null : index
}

const handleBookMeeting = () => {
  // Handle book meeting action
  if (aboutContent.value?.ctaButtonLink) {
    window.open(aboutContent.value.ctaButtonLink, '_blank')
  } else {
    // Default action - could open a modal or navigate
    console.log('Book a meeting clicked')
  }
}

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.style.display = 'none'
}
</script>

<style scoped>
/* Import shared styles from HomeView - we'll reuse the same background and base styles */
.about-view {
  min-height: 100vh;
  position: relative;
  background: #0B0B0F;
  color: #F5F7FA;
}

.background-image {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('/images/backgrounds/hero-bg.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  z-index: 0;
}

.background-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(11, 11, 15, 0.85);
  z-index: 1;
}

.stars {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    radial-gradient(2px 2px at 20% 30%, white, transparent),
    radial-gradient(2px 2px at 60% 70%, white, transparent),
    radial-gradient(1px 1px at 50% 50%, white, transparent),
    radial-gradient(1px 1px at 80% 10%, white, transparent),
    radial-gradient(2px 2px at 90% 40%, white, transparent),
    radial-gradient(1px 1px at 33% 60%, white, transparent),
    radial-gradient(1px 1px at 55% 25%, white, transparent);
  background-repeat: repeat;
  background-size: 200% 200%;
  animation: sparkle 20s linear infinite;
  z-index: 1;
  opacity: 0.3;
}

@keyframes sparkle {
  from { background-position: 0% 0%; }
  to { background-position: 100% 100%; }
}

.vector-shape {
  position: fixed;
  width: 300px;
  height: 100%;
  z-index: 1;
  opacity: 0.1;
  pointer-events: none;
}

.vector-left {
  left: 0;
  background: linear-gradient(90deg, rgba(91, 32, 150, 0.3) 0%, transparent 100%);
}

.vector-right {
  right: 0;
  background: linear-gradient(270deg, rgba(91, 32, 150, 0.3) 0%, transparent 100%);
}

.about-container {
  position: relative;
  z-index: 2;
  max-width: 1200px;
  margin: 0 auto;
  padding: 120px 20px 60px;
}

.section {
  margin-bottom: 80px;
}

.section-header {
  text-align: center;
  margin-bottom: 60px;
}

.section-title {
  font-size: 3rem;
  font-weight: 700;
  color: #F5F7FA;
  margin-bottom: 1rem;
  font-family: 'Roboto', sans-serif;
}

.section-description {
  font-size: 1.25rem;
  color: rgba(245, 247, 250, 0.7);
  max-width: 800px;
  margin: 0 auto;
  line-height: 1.6;
}

/* Who We Are Section */
.who-we-are-section {
  padding-top: 40px;
}

.stat-cards-container {
  margin-top: 4rem;
}

.stat-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.stat-card {
  background: transparent;
  border: none;
  padding: 0;
  text-align: center;
}

.stat-card-title {
  font-size: 1rem;
  color: rgba(245, 247, 250, 0.9);
  margin-bottom: 1rem;
  font-weight: 600;
  font-family: 'Roboto', sans-serif;
}

.stat-card-value {
  font-size: 3.5rem;
  font-weight: 700;
  background: linear-gradient(180deg, #C19DE6 0%, #7441A8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1rem;
  line-height: 1.2;
  font-family: 'Roboto', sans-serif;
}

.stat-card-description {
  font-size: 0.95rem;
  color: rgba(245, 247, 250, 0.7);
  line-height: 1.6;
  margin: 0;
  font-family: 'Roboto', sans-serif;
}

/* Video Section */
.video-section {
  margin: 60px 0;
}

.video-container {
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  border-radius: 12px;
  overflow: hidden;
  background: rgba(245, 247, 250, 0.05);
  border: 1px solid rgba(91, 32, 150, 0.2);
}

.video-player,
.video-iframe {
  width: 100%;
  height: 600px;
  display: block;
}

.video-placeholder {
  width: 100%;
  max-width: 1000px;
  height: 600px;
  margin: 0 auto;
  background: rgba(245, 247, 250, 0.1);
  border: 2px dashed rgba(91, 32, 150, 0.3);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.video-text {
  font-size: 3rem;
  font-weight: 700;
  color: rgba(245, 247, 250, 0.3);
  font-family: 'Roboto', sans-serif;
}

/* CTA Section */
.cta-section {
  text-align: center;
  margin: 60px 0;
}

.cta-buttons-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.book-meeting-button {
  padding: 16px 48px;
  background: linear-gradient(103deg, #5B2096 0.52%, #C19DE6 125.79%);
  border: none;
  border-radius: 8px;
  color: #F5F7FA;
  font-size: 1.125rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Roboto', sans-serif;
}

.book-meeting-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(91, 32, 150, 0.4);
}

.whatsapp-button {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: rgba(245, 247, 250, 0.1);
  border: 1px solid rgba(245, 247, 250, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  text-decoration: none;
  cursor: pointer;
}

.whatsapp-button:hover {
  background: rgba(245, 247, 250, 0.15);
  border-color: rgba(245, 247, 250, 0.3);
  transform: scale(1.05);
}

.whatsapp-button svg {
  width: 24px;
  height: 24px;
}

/* Team Section */
.team-section {
  margin-top: 100px;
}

.team-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
}

.team-member-card {
  background: transparent;
  border: none;
  border-radius: 12px;
  padding: 0;
  text-align: center;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
}

.team-member-card:hover {
  transform: translateY(-5px);
}

.member-photo {
  width: 100%;
  aspect-ratio: 3 / 4;
  margin: 0 0 1.5rem 0;
  border-radius: 12px;
  overflow: hidden;
  background: rgba(245, 247, 250, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
}

.member-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.member-photo-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(245, 247, 250, 0.5);
}

.member-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.member-name {
  font-size: 1.125rem;
  font-weight: 600;
  color: #F5F7FA;
  margin: 0 0 0.5rem 0;
  font-family: 'Roboto', sans-serif;
}

.member-role {
  font-size: 0.95rem;
  color: rgba(245, 247, 250, 0.7);
  margin: 0;
  font-family: 'Roboto', sans-serif;
}

/* FAQ Section */
.faq-section {
  margin-top: 100px;
}

.faq-list {
  max-width: 900px;
  margin: 3rem auto 0;
}

.faq-item {
  background: rgba(245, 247, 250, 0.05);
  border: 1px solid rgba(91, 32, 150, 0.2);
  border-radius: 12px;
  margin-bottom: 1rem;
  overflow: hidden;
  transition: all 0.3s ease;
}

.faq-item:hover {
  border-color: rgba(91, 32, 150, 0.4);
}

.faq-item.faq-open {
  border-color: rgba(91, 32, 150, 0.5);
}

.faq-question {
  width: 100%;
  padding: 1.5rem;
  background: transparent;
  border: none;
  color: #F5F7FA;
  font-size: 1.125rem;
  font-weight: 600;
  text-align: left;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: 'Roboto', sans-serif;
  transition: color 0.3s ease;
}

.faq-question:hover {
  color: #C19DE6;
}

.faq-icon {
  width: 24px;
  height: 24px;
  color: #C19DE6;
  transition: transform 0.3s ease;
  flex-shrink: 0;
  margin-left: 1rem;
}

.faq-icon-open {
  transform: rotate(180deg);
}

.faq-answer {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease, padding 0.3s ease;
  padding: 0 1.5rem;
}

.faq-item.faq-open .faq-answer {
  max-height: 500px;
  padding: 0 1.5rem 1.5rem;
}

.faq-answer p {
  color: rgba(245, 247, 250, 0.8);
  line-height: 1.6;
  margin: 0;
  font-family: 'Roboto', sans-serif;
}

/* Footer Section */
.footer-section {
  background: linear-gradient(103deg, #5B2096 0.52%, #C19DE6 125.79%);
  padding: 60px 20px 30px;
  margin-top: 100px;
  position: relative;
  z-index: 2;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
}

.footer-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 4rem;
  margin-bottom: 2rem;
}

.footer-brand {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.footer-logo {
  margin-bottom: 0.5rem;
}

.footer-logo-image {
  height: auto;
  max-width: 180px;
  width: auto;
}

.footer-tagline {
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.95rem;
  line-height: 1.6;
  max-width: 400px;
  margin: 0;
}

.footer-social {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.social-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.social-icon:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
}

.footer-links {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.footer-links-title {
  color: #F5F7FA;
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0 0 0.5rem;
}

.footer-links-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.footer-links-list a {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: color 0.3s ease;
  font-size: 0.95rem;
}

.footer-links-list a:hover {
  color: #F5F7FA;
}

.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  padding-top: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.footer-copyright {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.875rem;
  margin: 0;
}

.footer-policies {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.footer-policies a {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  font-size: 0.875rem;
  transition: color 0.3s ease;
}

.footer-policies a:hover {
  color: #F5F7FA;
}

.footer-divider {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.875rem;
}

/* Loading and Error States */
.loading-state,
.error-state {
  text-align: center;
  padding: 4rem 2rem;
  color: rgba(245, 247, 250, 0.7);
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 4px solid rgba(91, 32, 150, 0.2);
  border-top-color: #5B2096;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.retry-button {
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(103deg, #5B2096 0.52%, #C19DE6 125.79%);
  border: none;
  border-radius: 8px;
  color: #F5F7FA;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.retry-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(91, 32, 150, 0.4);
}

.empty-team-message,
.empty-faq-message {
  text-align: center;
  padding: 3rem 2rem;
  color: rgba(245, 247, 250, 0.5);
  font-size: 1.125rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .about-container {
    padding: 100px 16px 40px;
  }

  .section-title {
    font-size: 2rem;
  }

  .section-description {
    font-size: 1rem;
  }

  .video-player,
  .video-iframe,
  .video-placeholder {
    height: 400px;
  }

  .team-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1.5rem;
  }

  .member-name {
    font-size: 1rem;
  }
  
  .member-role {
    font-size: 0.875rem;
  }

  .stat-cards-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .stat-card-value {
    font-size: 2.5rem;
  }
  
  .stat-card-title {
    font-size: 0.9rem;
  }
  
  .stat-card-description {
    font-size: 0.875rem;
  }

  .cta-buttons-container {
    flex-direction: column;
    gap: 1rem;
  }

  .whatsapp-button {
    width: 48px;
    height: 48px;
  }

  .whatsapp-button svg {
    width: 20px;
    height: 20px;
  }

  .footer-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .footer-bottom {
    flex-direction: column;
    text-align: center;
  }
}
</style>

