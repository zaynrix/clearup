<template>
  <div v-if="!disabled" class="testimonials-section" data-section-id="testimonials-section">
    <div class="testimonials-container">
      <div class="testimonials-header" data-section-id="testimonials-header">
        <h2 class="testimonials-title">What Our Clients Say</h2>
        <p class="testimonials-subtitle">Real feedback from brands we've worked with.</p>
      </div>
      
      <div v-if="testimonials && testimonials.length > 0" class="testimonials-grid">
        <div v-for="(testimonial, index) in testimonials" :key="testimonial.id" class="testimonial-card" :data-card-id="`testimonial-${index}`">
          <div class="testimonial-profile">
            <div class="testimonial-avatar">
              <img 
                v-if="testimonial.photoFileUrl || testimonial.photoUrl" 
                :src="testimonial.photoFileUrl || testimonial.photoUrl" 
                :alt="testimonial.name"
                @error="handleImageError"
              />
              <span class="avatar-initial">{{ getInitials(testimonial.name) }}</span>
            </div>
            <div class="testimonial-info">
              <h4 class="testimonial-name">{{ testimonial.name }}</h4>
              <div class="testimonial-stars">
                <svg v-for="i in 5" :key="i" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" :fill="i <= (testimonial.stars || 5) ? '#FFD700' : 'rgba(255, 255, 255, 0.2)'"/>
                </svg>
              </div>
              <p v-if="testimonial.subtitle || testimonial.title || testimonial.position || testimonial.company" class="testimonial-job-title">
                {{ getTestimonialRole(testimonial) }}
              </p>
            </div>
          </div>
          <div v-if="testimonial.videoUrl || testimonial.videoFileUrl" class="testimonial-video">
            <div class="video-thumbnail" @click="openVideoModal(testimonial)">
              <img 
                v-if="testimonial.videoThumbnailFileUrl || testimonial.videoThumbnailUrl"
                :src="testimonial.videoThumbnailFileUrl || testimonial.videoThumbnailUrl" 
                :alt="`${testimonial.name} Testimonial Video`" 
                class="video-thumbnail-img" 
              />
              <div v-else class="video-thumbnail-placeholder">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 5V19L19 12L8 5Z" fill="white"/>
                </svg>
              </div>
              <div class="play-button-overlay">
                <svg width="70" height="70" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="35" cy="35" r="35" fill="rgba(0, 0, 0, 0.6)"/>
                  <path d="M28 22L48 35L28 48V22Z" fill="white"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="testimonials-empty">
        <p>No testimonials available yet.</p>
      </div>
    </div>

    <!-- Video Modal -->
    <div v-if="selectedVideo" class="video-modal-overlay" @click="closeVideoModal">
      <div class="video-modal-content" @click.stop>
        <button class="video-modal-close" @click="closeVideoModal">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
        <div class="video-modal-player">
          <iframe 
            v-if="selectedVideo.videoType === 'link' && selectedVideo.videoUrl"
            :src="getVideoEmbedUrl(selectedVideo.videoUrl)"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
          <video 
            v-else-if="selectedVideo.videoType === 'upload' && selectedVideo.videoFileUrl"
            :src="selectedVideo.videoFileUrl"
            controls
            autoplay
          >
            Your browser does not support the video tag.
          </video>
          <iframe 
            v-else-if="selectedVideo.videoUrl && !selectedVideo.videoFileUrl"
            :src="getVideoEmbedUrl(selectedVideo.videoUrl)"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
          <video 
            v-else-if="selectedVideo.videoFileUrl && !selectedVideo.videoUrl"
            :src="selectedVideo.videoFileUrl"
            controls
            autoplay
          >
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Testimonial {
  id?: string
  name: string
  subtitle?: string
  title?: string
  position?: string
  company?: string
  stars?: number
  photoUrl?: string
  photoFileUrl?: string
  videoUrl?: string
  videoFileUrl?: string
  videoType?: 'link' | 'upload' | 'none'
  videoThumbnailUrl?: string
  videoThumbnailFileUrl?: string
}

interface Props {
  testimonials?: Testimonial[]
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  testimonials: () => [],
  disabled: false
})

const selectedVideo = ref<Testimonial | null>(null)

const getVideoEmbedUrl = (url: string): string => {
  if (!url) return ''
  
  // YouTube - Add parameters to disable suggestions and related videos
  const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
  const youtubeMatch = url.match(youtubeRegex)
  if (youtubeMatch) {
    // Parameters to disable YouTube suggestions:
    // rel=0 - Don't show related videos from other channels
    // modestbranding=1 - Reduce YouTube branding
    // iv_load_policy=3 - Don't show video annotations
    // cc_load_policy=0 - Don't show captions by default
    // fs=1 - Allow fullscreen
    return `https://www.youtube.com/embed/${youtubeMatch[1]}?rel=0&modestbranding=1&iv_load_policy=3&cc_load_policy=0&fs=1`
  }
  
  // Vimeo
  const vimeoRegex = /(?:vimeo\.com\/)(?:.*\/)?(\d+)/
  const vimeoMatch = url.match(vimeoRegex)
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`
  }
  
  return url
}

const openVideoModal = (testimonial: Testimonial) => {
  selectedVideo.value = testimonial
  document.body.style.overflow = 'hidden' // Prevent background scrolling
}

const closeVideoModal = () => {
  selectedVideo.value = null
  document.body.style.overflow = '' // Restore scrolling
}

const getTestimonialRole = (testimonial: { subtitle?: string; title?: string; position?: string; company?: string }): string => {
  // Prioritize subtitle from Firebase
  if (testimonial.subtitle) {
    return testimonial.subtitle
  }
  
  // Fallback to title/position/company
  const role = testimonial.title || testimonial.position || ''
  const company = testimonial.company || ''
  
  if (role && company) {
    return `${role} - ${company}`
  } else if (role) {
    return role
  } else if (company) {
    return company
  }
  
  return ''
}

const getInitials = (name: string): string => {
  if (!name) return 'U'
  const parts = name.trim().split(' ')
  if (parts.length >= 2) {
    const first = parts[0]?.[0] || ''
    const last = parts[parts.length - 1]?.[0] || ''
    return (first + last).toUpperCase() || 'U'
  }
  return name.substring(0, 2).toUpperCase()
}

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.style.display = 'none'
  const avatar = img.parentElement
  if (avatar) {
    avatar.classList.add('avatar-fallback')
  }
}
</script>

<style scoped>
/* What Our Clients Say Section */
.testimonials-section {
  position: relative;
  width: 100%;
  padding: 100px 20px;
  margin-top: 60px;
  z-index: 3;
  background: #0B0B0F;
}

.testimonials-container {
  max-width: 1304px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 64px;
}

.testimonials-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  text-align: center;
}

.testimonials-title {
  color: #F5F7FA;
  font-family: 'Roboto', sans-serif;
  font-size: 36px;
  font-weight: 600;
  line-height: normal;
  margin: 0;
}

.testimonials-subtitle {
  color: #ABBED1;
  font-family: 'Roboto', sans-serif;
  font-size: 18px;
  font-weight: 400;
  line-height: normal;
  margin: 0;
}

.testimonials-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
}

.testimonial-card {
  background: rgba(42, 42, 42, 0.8);
  border-radius: 16px;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0;
  transition: all 0.3s ease;
  max-width: 450px;
  width: 100%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.testimonial-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
  border-color: rgba(91, 32, 150, 0.3);
}

.testimonial-profile {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 16px;
  padding: 24px;
  padding-bottom: 20px;
}

.testimonial-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  min-width: 0;
}

.testimonial-avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  background: linear-gradient(135deg, #5B2096 0%, #C19DE6 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  border: 2px solid rgba(255, 255, 255, 0.1);
}

.testimonial-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
}

.avatar-initial {
  color: #F5F7FA;
  font-family: 'Roboto', sans-serif;
  font-size: 18px;
  font-weight: 600;
  line-height: 1;
  z-index: 1;
  display: none;
}

.testimonial-avatar.avatar-fallback .avatar-initial {
  display: block;
}

.testimonial-name {
  color: #FFFFFF;
  font-family: 'Roboto', sans-serif;
  font-size: 20px;
  font-weight: 600;
  line-height: 1.3;
  margin: 0;
}

.testimonial-stars {
  display: flex;
  gap: 2px;
  align-items: center;
  margin: 0;
}

.testimonial-job-title {
  color: rgba(255, 255, 255, 0.7);
  font-family: 'Roboto', sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.4;
  margin: 0;
  opacity: 1 !important;
  visibility: visible !important;
  display: block !important;
}

.testimonials-empty {
  text-align: center;
  padding: 4rem 2rem;
  color: rgba(245, 247, 250, 0.5);
  font-size: 1.1rem;
}

.video-thumbnail-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #5B2096 0%, #C19DE6 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Video Modal */
.video-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 2rem;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.video-modal-content {
  position: relative;
  width: 100%;
  max-width: 1200px;
  max-height: 90vh;
  background: #14141B;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    transform: translateY(50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.video-modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 40px;
  height: 40px;
  background: rgba(0, 0, 0, 0.7);
  border: none;
  border-radius: 50%;
  color: #F5F7FA;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10001;
  transition: all 0.2s;
}

.video-modal-close:hover {
  background: rgba(0, 0, 0, 0.9);
  transform: scale(1.1);
}

.video-modal-player {
  width: 100%;
  aspect-ratio: 16 / 9;
  background: #000;
}

.video-modal-player iframe,
.video-modal-player video {
  width: 100%;
  height: 100%;
  border: none;
}

.testimonial-video {
  width: 100%;
  margin-top: 0;
  padding: 0 24px 20px 24px;
}

.video-thumbnail {
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: 12px;
  background: #000000;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
}

.video-thumbnail:hover {
  opacity: 0.95;
}

.video-thumbnail:hover .play-button-overlay {
  transform: translate(-50%, -50%) scale(1.1);
}

.video-thumbnail-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
}

.video-thumbnail::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 1;
}

.play-button-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80px;
  height: 80px;
  z-index: 2;
  transition: all 0.3s ease;
  cursor: pointer;
}

.play-button-overlay svg {
  width: 80px;
  height: 80px;
}

.play-button-overlay circle {
  transition: fill 0.3s ease;
  fill: rgba(0, 0, 0, 0.7);
}

.video-thumbnail:hover .play-button-overlay circle {
  fill: rgba(0, 0, 0, 0.85);
}

/* Responsive Styles */
@media (max-width: 1200px) {
  .testimonials-section {
    padding: 100px 20px;
    margin-top: 70px;
  }
  
  .testimonials-container {
    gap: 56px;
  }
  
  .testimonials-title {
    font-size: 32px;
  }
  
  .testimonials-subtitle {
    font-size: 17px;
  }
  
  .testimonials-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 28px;
  }
  
  .testimonial-card {
    padding: 28px;
    gap: 20px;
  }
}

@media (max-width: 900px) {
  .testimonials-section {
    padding: 80px 20px;
    margin-top: 60px;
  }
  
  .testimonials-container {
    gap: 48px;
  }
  
  .testimonials-title {
    font-size: 30px;
  }
  
  .testimonials-subtitle {
    font-size: 16px;
  }
  
  .testimonials-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }
  
  .testimonial-card {
    padding: 26px;
    gap: 18px;
  }
}

@media (max-width: 768px) {
  .testimonials-section {
    padding: 80px 20px;
    margin-top: 60px;
  }
  
  .testimonials-container {
    gap: 48px;
  }
  
  .testimonials-title {
    font-size: 32px;
  }
  
  .testimonials-subtitle {
    font-size: 16px;
  }
  
  .testimonials-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  
  .testimonial-card {
    padding: 28px;
    gap: 20px;
  }
}

@media (max-width: 480px) {
  .testimonials-section {
    padding: 40px 15px;
    margin-top: 40px;
  }
  
  .testimonials-container {
    gap: 32px;
  }
  
  .testimonials-header {
    gap: 12px;
  }
  
  .testimonials-title {
    font-size: 24px;
  }
  
  .testimonials-subtitle {
    font-size: 14px;
  }
  
  .testimonials-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .testimonial-card {
    padding: 20px;
    gap: 16px;
  }
  
  .testimonial-avatar {
    width: 56px;
    height: 56px;
  }
  
  .avatar-initial {
    font-size: 18px;
  }
  
  .testimonial-name {
    font-size: 18px;
  }
  
  .testimonial-stars svg {
    width: 14px;
    height: 14px;
  }
  
  .testimonial-video {
    margin-top: 20px;
  }
  
  .video-thumbnail {
    aspect-ratio: 16 / 9;
  }
  
  .play-button-overlay {
    width: 60px;
    height: 60px;
  }
  
  .play-button-overlay svg {
    width: 60px;
    height: 60px;
  }
}

@media (max-width: 360px) {
  .testimonials-section {
    padding: 35px 12px;
    margin-top: 35px;
  }
  
  .testimonials-container {
    gap: 28px;
  }
  
  .testimonials-header {
    gap: 10px;
  }
  
  .testimonials-subtitle {
    font-size: 13px;
  }
  
  .testimonial-card {
    padding: 18px;
    gap: 16px;
  }
  
  .testimonial-avatar {
    width: 44px;
    height: 44px;
  }
  
  .avatar-initial {
    font-size: 16px;
  }
  
  .testimonial-name {
    font-size: 16px;
  }
  
  .testimonial-stars svg {
    width: 12px;
    height: 12px;
  }
  
  .testimonial-video {
    margin-top: 16px;
  }
  
  .play-button-overlay {
    width: 50px;
    height: 50px;
  }
  
  .play-button-overlay svg {
    width: 50px;
    height: 50px;
  }
}
</style>

