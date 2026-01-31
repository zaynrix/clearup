<script setup lang="ts">
defineProps<{
  sectionTitle?: string
  sectionDescription?: string
  cardTitle?: string
  cardText?: string[]
  roiText?: string
  ctaText?: string
  showCta?: boolean
}>()

const emit = defineEmits<{
  (e: 'cta-click'): void
}>()

const handleCtaClick = () => {
  emit('cta-click')
}
</script>

<template>
  <div class="clearup-system-section">
    <div class="clearup-system-container">
      <div class="clearup-system-vector clearup-system-vector-left"></div>
      <div class="clearup-system-vector clearup-system-vector-right"></div>
      
      <div class="third-section-container">
        <!-- Header -->
        <div class="third-section-header">
          <h2 class="third-section-title">{{ sectionTitle || 'The Clear up System™' }}</h2>
          <p class="third-section-description">{{ sectionDescription || 'An exclusive done-for-you marketing infrastructure built for predictable growth.' }}</p>
        </div>

        <!-- System Card Container -->
        <div class="system-card-container">
          <div class="system-card">
            <h3 class="system-card-title">{{ cardTitle || 'Done-for-you Clear Up System' }}</h3>
            <template v-if="cardText && cardText.length">
              <p v-for="(text, index) in cardText" :key="index" class="system-card-text">{{ text }}</p>
            </template>
            <template v-else>
              <p class="system-card-text">We don't sell random services.</p>
              <p class="system-card-text">We install a complete marketing system that works as one engine scalable , predictable , and built</p>
              <p class="system-card-text">to grow with your business.</p>
            </template>
            <p class="system-card-roi">{{ roiText || 'TURN EVERY $1 INTO $3893 IN REVENUE OUR SYSTEM IS BUILT TO MAXIMIZE ROI , NOT JUST SPEND YOUR BUDGET' }}</p>
            
            <!-- CTA Button -->
            <div v-if="showCta !== false" class="system-card-cta">
              <button class="system-cta-button" @click="handleCtaClick">
                {{ ctaText || 'Get Started' }}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Slot for additional content (like services grid) -->
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Third Section */
.clearup-system-section {
  position: relative;
  width: 100%;
  padding: 0;
  margin-top: 80px;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: visible;
}

/* Clear Up System Container with Vector */
.clearup-system-container {
  position: relative;
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  padding: 80px 60px 100px;
  min-height: auto;
  overflow: visible;
  background: #14141B;
  box-sizing: border-box;
  isolation: isolate;
  /* Organic curved cutouts at top and bottom - smooth flowing curves */
  clip-path: polygon(
    /* Top left corner - starts slightly down from top */
    0% 3.9%,
    /* Top edge with curves and indentations matching SVG */
    1.9% 3.1%,
    9.2% 3.1%,
    17.8% 3.1%,
    24.5% 0.3%,
    26% 0%,
    36.7% 0%,
    51.7% 0%,
    64.2% 0%,
    74.3% 0%,
    81.1% 2.8%,
    82.6% 3.1%,
    92% 3.1%,
    98.1% 3.1%,
    /* Top right corner */
    100% 3.9%,
    /* Right edge */
    100% 96.1%,
    /* Bottom right corner - starting from right side */
    100% 99.2%,
    /* Bottom edge - matching SVG path, going from right to left */
    98.1% 100%,
    58.6% 100%,
    57.2% 99.7%,
    52.3% 97.7%,
    50.9% 97.5%,
    1.9% 97.5%,
    /* Bottom left corner */
    0% 96.7%
  );
  /* Rounded corners */
  border-radius: 50px;
}

/* Responsive adjustments for clip-path */
@media (max-width: 1024px) {
  .clearup-system-container {
    padding: 60px 40px 80px;
    min-height: auto;
    overflow: visible;
    /* Remove clip-path for responsive - use normal container */
    clip-path: none;
  }
}

@media (max-width: 900px) {
  .clearup-system-container {
    padding: 50px 30px 70px;
    min-height: auto;
    overflow: visible;
    /* Remove clip-path for responsive - use normal container */
    clip-path: none;
  }
}

@media (max-width: 768px) {
  .clearup-system-container {
    padding: 40px 20px 60px;
    border-radius: 20px;
    min-height: auto;
    overflow: visible;
    /* Remove clip-path for responsive - use normal container */
    clip-path: none;
  }
}

@media (max-width: 640px) {
  .clearup-system-container {
    padding: 35px 18px 55px;
    border-radius: 18px;
    min-height: auto;
    overflow: visible;
    /* Remove clip-path for responsive - use normal container */
    clip-path: none;
  }
}

@media (max-width: 480px) {
  .clearup-system-container {
    padding: 30px 15px 50px;
    border-radius: 15px;
    min-height: auto;
    overflow: visible;
    /* Remove clip-path for responsive - use normal container */
    clip-path: none;
  }
}

@media (max-width: 360px) {
  .clearup-system-container {
    padding: 25px 12px 45px;
    border-radius: 12px;
    min-height: auto;
    overflow: visible;
    /* Remove clip-path for responsive - use normal container */
    clip-path: none;
  }
}

.clearup-system-vector {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 400px;
  height: 100%;
  min-height: 1200px;
  background-image: url('/images/backgrounds/vector1.svg');
  background-repeat: no-repeat;
  background-size: contain;
  opacity: 0.7;
  z-index: 0;
  pointer-events: none;
  border-radius: 30px 30px 0 0;
  overflow: hidden;
}

.clearup-system-vector-left {
  left: 0;
  background-position: left center;
}

.clearup-system-vector-right {
  right: 0;
  background-position: right center;
  transform: scaleX(-1);
}

/* Responsive vector adjustments */
@media (max-width: 1024px) {
  .clearup-system-vector {
    width: 300px;
    border-radius: 30px 30px 0 0;
  }
}

@media (max-width: 900px) {
  .clearup-system-vector {
    width: 250px;
    border-radius: 25px 25px 0 0;
  }
}

@media (max-width: 768px) {
  .clearup-system-vector {
    width: 200px;
    opacity: 0.5;
    border-radius: 20px 20px 0 0;
  }
}

@media (max-width: 640px) {
  .clearup-system-vector {
    width: 180px;
    opacity: 0.45;
    border-radius: 18px 18px 0 0;
  }
}

@media (max-width: 480px) {
  .clearup-system-vector {
    width: 150px;
    opacity: 0.4;
    border-radius: 15px 15px 0 0;
  }
}

@media (max-width: 360px) {
  .clearup-system-vector {
    width: 120px;
    opacity: 0.35;
    border-radius: 12px 12px 0 0;
  }
}

.clearup-system-container .third-section-container {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 1304px;
}

.third-section-container {
  max-width: 1304px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 48px;
  position: relative;
  z-index: 1;
}

/* Responsive third-section-container adjustments */
@media (max-width: 1024px) {
  .third-section-container {
    gap: 40px;
  }
}

@media (max-width: 768px) {
  .third-section-container {
    gap: 32px;
  }
}

@media (max-width: 640px) {
  .third-section-container {
    gap: 28px;
  }
}

@media (max-width: 480px) {
  .third-section-container {
    gap: 24px;
  }
}

@media (max-width: 360px) {
  .third-section-container {
    gap: 20px;
  }
}

/* Third Section Header */
.third-section-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  width: 100%;
  max-width: 679px;
}

.third-section-title {
  color: #F5F7FA;
  text-align: center;
  font-family: 'Roboto', sans-serif;
  font-size: 36px;
  font-weight: 600;
  line-height: normal;
  margin: 0;
}

.third-section-description {
  color: #ABBED1;
  text-align: center;
  font-family: 'Roboto', sans-serif;
  font-size: 18px;
  font-weight: 400;
  line-height: normal;
  margin: 0;
}

/* System Card Container */
.system-card-container {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  position: relative;
  overflow: visible;
}

/* System Card */
.system-card {
  width: 100%;
  max-width: 1138px;
  min-height: auto;
  height: auto;
  border-radius: 50px;
  background: #14141B;
  border: 2px solid #5B2096;
  box-shadow: 0 4px 4px 0 rgba(91, 32, 150, 0.3) inset, 0 4px 4px 0 rgba(91, 32, 150, 0.3);
  padding: 74px 59px 60px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  position: relative;
  overflow: visible;
}

.system-card-title {
  color: #F5F7FA;
  font-family: 'Roboto', sans-serif;
  font-size: 36px;
  font-weight: 600;
  line-height: normal;
  margin: 0;
}

.system-card-text {
  color: #F5F7FA;
  font-family: 'Roboto', sans-serif;
  font-size: 20px;
  font-weight: 600;
  line-height: normal;
  margin: 0;
}

.system-card-roi {
  color: #5B2096;
  font-family: 'Roboto', sans-serif;
  font-size: 28px;
  font-weight: 700;
  line-height: 1.3;
  margin: 0;
  margin-top: 16px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* System Card CTA */
.system-card-cta {
  margin-top: 32px;
  display: flex;
  justify-content: center;
}

.system-cta-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 16px 40px;
  background: linear-gradient(275deg, #C19DE6 -48.8%, #5B2096 96.84%);
  border: none;
  border-radius: 50px;
  color: #F5F7FA;
  font-family: 'Roboto', sans-serif;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 4px 20px rgba(91, 32, 150, 0.3);
}

.system-cta-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 30px rgba(91, 32, 150, 0.4);
}

.system-cta-button:active {
  transform: translateY(-1px);
}

.system-cta-button svg {
  transition: transform 0.3s ease;
}

.system-cta-button:hover svg {
  transform: translateX(4px);
}

/* Responsive System Card */
@media (max-width: 1024px) {
  .system-card {
    padding: 50px 40px;
    min-height: auto;
    border-radius: 40px;
  }
  
  .system-card-title {
    font-size: 32px;
  }
  
  .system-card-text {
    font-size: 18px;
  }
  
  .system-card-roi {
    font-size: 24px;
  }
  
  .system-card-cta {
    margin-top: 28px;
  }
  
  .system-cta-button {
    padding: 14px 36px;
    font-size: 17px;
  }
  
  .third-section-title {
    font-size: 32px;
  }
  
  .third-section-description {
    font-size: 16px;
  }
}

@media (max-width: 900px) {
  .system-card {
    padding: 50px 35px;
    border-radius: 35px;
  }
}

@media (max-width: 768px) {
  .system-card {
    padding: 40px 28px;
    min-height: auto;
    border-radius: 30px;
    gap: 14px;
  }
  
  .system-card-title {
    font-size: 28px;
  }
  
  .system-card-text {
    font-size: 16px;
  }
  
  .system-card-roi {
    font-size: 20px;
    margin-top: 12px;
  }
  
  .system-card-cta {
    margin-top: 24px;
  }
  
  .system-cta-button {
    padding: 12px 32px;
    font-size: 16px;
  }
  
  .third-section-title {
    font-size: 28px;
  }
  
  .third-section-description {
    font-size: 15px;
  }
}

@media (max-width: 640px) {
  .system-card {
    padding: 35px 24px;
    border-radius: 26px;
    gap: 12px;
  }
  
  .system-card-title {
    font-size: 24px;
  }
  
  .system-card-text {
    font-size: 15px;
  }
  
  .system-card-roi {
    font-size: 18px;
    margin-top: 10px;
  }
  
  .system-card-cta {
    margin-top: 20px;
  }
  
  .system-cta-button {
    padding: 11px 28px;
    font-size: 15px;
    gap: 10px;
  }
  
  .third-section-title {
    font-size: 26px;
  }
  
  .third-section-description {
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .clearup-system-section {
    margin-top: 60px;
  }
  
  .system-card {
    padding: 32px 20px;
    min-height: auto;
    border-radius: 24px;
    gap: 12px;
  }
  
  .system-card-title {
    font-size: 22px;
  }
  
  .system-card-text {
    font-size: 14px;
    line-height: 1.5;
  }
  
  .system-card-roi {
    font-size: 16px;
    margin-top: 10px;
    line-height: 1.4;
  }
  
  .system-card-cta {
    margin-top: 20px;
  }
  
  .system-cta-button {
    padding: 10px 24px;
    font-size: 14px;
    gap: 8px;
  }
  
  .system-cta-button svg {
    width: 18px;
    height: 18px;
  }
  
  .third-section-title {
    font-size: 24px;
  }
  
  .third-section-description {
    font-size: 14px;
  }
}

@media (max-width: 360px) {
  .clearup-system-section {
    margin-top: 50px;
  }
  
  .system-card {
    padding: 28px 16px;
    border-radius: 20px;
    gap: 10px;
  }
  
  .system-card-title {
    font-size: 20px;
  }
  
  .system-card-text {
    font-size: 13px;
  }
  
  .system-card-roi {
    font-size: 14px;
    margin-top: 8px;
  }
  
  .system-card-cta {
    margin-top: 16px;
  }
  
  .system-cta-button {
    padding: 9px 20px;
    font-size: 13px;
    gap: 6px;
  }
  
  .system-cta-button svg {
    width: 16px;
    height: 16px;
  }
  
  .third-section-title {
    font-size: 22px;
  }
  
  .third-section-description {
    font-size: 13px;
  }
}
</style>

