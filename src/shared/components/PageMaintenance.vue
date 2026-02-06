<template>
  <div class="page-maintenance-view">
    <!-- Background effects matching home screen -->
    <div class="background-image"></div>
    <div class="background-overlay"></div>
    <div class="stars"></div>
    
    <!-- Floating particles -->
    <div class="floating-particles">
      <div class="particle particle-1"></div>
      <div class="particle particle-2"></div>
      <div class="particle particle-3"></div>
      <div class="particle particle-4"></div>
    </div>
    
    <!-- Vector shapes -->
    <div class="vector-shape vector-left"></div>
    <div class="vector-shape vector-right"></div>
    
    <!-- Ambient glow -->
    <div class="ambient-glow"></div>
    
    <!-- Main content -->
    <div class="maintenance-container">
      <div class="maintenance-icon">
        <div class="icon-wrapper">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="maintenance-svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <div class="icon-glow"></div>
        </div>
      </div>
      
      <h1 class="maintenance-title">
        <span class="title-line">Page Under</span>
        <span class="title-line gradient-text">Maintenance</span>
      </h1>
      
      <p class="maintenance-message">
        {{ message || 'This page is currently unavailable. Please check back later.' }}
      </p>
      
      <div class="maintenance-footer">
        <div class="footer-icon">✨</div>
        <p>Thank you for your patience.</p>
        <div class="legal-links">
          <router-link to="/terms-of-service" class="legal-link">Terms of Service</router-link>
          <span class="link-divider">•</span>
          <router-link to="/privacy-policy" class="legal-link">Privacy Policy</router-link>
          <span class="link-divider">•</span>
          <router-link to="/cookie-policy" class="legal-link">Cookie Policy</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  message?: string
}>()
</script>

<style scoped>
.page-maintenance-view {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  padding: 2rem;
  background: #0B0B0F;
}

/* Background effects matching home screen */
.background-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('/images/backgrounds/home-bg.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  opacity: 0.3;
  z-index: 0;
}

.background-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, rgba(11, 11, 15, 0.8) 0%, rgba(11, 11, 15, 0.95) 100%);
  z-index: 1;
}

.stars {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    radial-gradient(2px 2px at 20% 30%, #C19DE6, transparent),
    radial-gradient(2px 2px at 60% 70%, #5B2096, transparent),
    radial-gradient(1px 1px at 50% 50%, #8B4CC4, transparent),
    radial-gradient(1px 1px at 80% 10%, #C19DE6, transparent),
    radial-gradient(2px 2px at 90% 60%, #5B2096, transparent);
  background-size: 200% 200%;
  background-position: 0% 0%;
  animation: stars-animation 20s linear infinite;
  z-index: 2;
  opacity: 0.6;
}

@keyframes stars-animation {
  0% { background-position: 0% 0%; }
  100% { background-position: 100% 100%; }
}

/* Floating particles */
.floating-particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  pointer-events: none;
}

.particle {
  position: absolute;
  border-radius: 50%;
  background: rgba(193, 157, 230, 0.3);
  animation: float 15s infinite ease-in-out;
}

.particle-1 {
  width: 4px;
  height: 4px;
  top: 20%;
  left: 10%;
  animation-delay: 0s;
}

.particle-2 {
  width: 6px;
  height: 6px;
  top: 60%;
  left: 80%;
  animation-delay: 2s;
}

.particle-3 {
  width: 3px;
  height: 3px;
  top: 80%;
  left: 30%;
  animation-delay: 4s;
}

.particle-4 {
  width: 5px;
  height: 5px;
  top: 40%;
  left: 70%;
  animation-delay: 6s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) translateX(0);
    opacity: 0.3;
  }
  25% {
    transform: translateY(-30px) translateX(20px);
    opacity: 0.6;
  }
  50% {
    transform: translateY(-60px) translateX(-10px);
    opacity: 0.4;
  }
  75% {
    transform: translateY(-30px) translateX(-20px);
    opacity: 0.5;
  }
}

/* Vector shapes */
.vector-shape {
  position: absolute;
  width: 300px;
  height: 300px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  opacity: 0.15;
  z-index: 2;
  pointer-events: none;
}

.vector-left {
  left: -150px;
  top: 20%;
  background-image: url('/images/vectors/vector-left.svg');
}

.vector-right {
  right: -150px;
  bottom: 20%;
  background-image: url('/images/vectors/vector-right.svg');
}

/* Ambient glow */
.ambient-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(91, 32, 150, 0.2) 0%, transparent 70%);
  border-radius: 50%;
  z-index: 2;
  pointer-events: none;
  animation: glow-pulse 4s ease-in-out infinite;
}

@keyframes glow-pulse {
  0%, 100% {
    opacity: 0.5;
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    opacity: 0.8;
    transform: translate(-50%, -50%) scale(1.1);
  }
}

.maintenance-container {
  max-width: 700px;
  width: 100%;
  position: relative;
  z-index: 10;
  text-align: center;
  padding: 4rem 3rem;
  background: rgba(11, 11, 15, 0.7);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(193, 157, 230, 0.2);
  border-radius: 24px;
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.5),
    0 0 40px rgba(91, 32, 150, 0.3);
}

.maintenance-icon {
  margin-bottom: 3rem;
  display: flex;
  justify-content: center;
}

.icon-wrapper {
  position: relative;
  display: inline-block;
}

.maintenance-svg {
  width: 100px;
  height: 100px;
  color: #C19DE6;
  filter: drop-shadow(0 0 20px rgba(193, 157, 230, 0.5));
  animation: icon-pulse 3s ease-in-out infinite;
}

.icon-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 120px;
  height: 120px;
  background: radial-gradient(circle, rgba(193, 157, 230, 0.3) 0%, transparent 70%);
  border-radius: 50%;
  animation: glow-pulse 3s ease-in-out infinite;
}

@keyframes icon-pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.05);
  }
}

.maintenance-title {
  font-size: 3.5rem;
  font-weight: 700;
  color: #F5F7FA;
  margin-bottom: 1.5rem;
  font-family: 'Roboto', sans-serif;
  line-height: 1.2;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.title-line {
  display: block;
}

.gradient-text {
  background: linear-gradient(103deg, #5B2096 0%, #8B4CC4 50%, #C19DE6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: shimmer 4s ease-in-out infinite;
  background-size: 200% 100%;
}

@keyframes shimmer {
  0% {
    background-position: 200% center;
  }
  100% {
    background-position: -200% center;
  }
}

.maintenance-message {
  font-size: 1.25rem;
  color: rgba(245, 247, 250, 0.8);
  line-height: 1.8;
  margin-bottom: 3rem;
  font-family: 'Roboto', sans-serif;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

.maintenance-footer {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(193, 157, 230, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.footer-icon {
  font-size: 1.5rem;
  animation: sparkle 2s ease-in-out infinite;
}

@keyframes sparkle {
  0%, 100% {
    opacity: 0.6;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
}

.maintenance-footer p {
  color: rgba(245, 247, 250, 0.7);
  font-size: 1rem;
  font-family: 'Roboto', sans-serif;
  font-weight: 400;
}

.legal-links {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(193, 157, 230, 0.15);
}

.legal-link {
  color: rgba(193, 157, 230, 0.8);
  text-decoration: none;
  font-size: 0.9rem;
  font-family: 'Roboto', sans-serif;
  font-weight: 400;
  transition: all 0.3s ease;
  position: relative;
}

.legal-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 1px;
  background: linear-gradient(90deg, #5B2096 0%, #C19DE6 100%);
  transition: width 0.3s ease;
}

.legal-link:hover {
  color: #C19DE6;
  transform: translateY(-1px);
}

.legal-link:hover::after {
  width: 100%;
}

.link-divider {
  color: rgba(193, 157, 230, 0.4);
  font-size: 0.8rem;
  margin: 0 0.25rem;
}

/* Large Desktops (1440px and above) */
@media (min-width: 1440px) {
  .maintenance-container {
    max-width: 800px;
    padding: 5rem 4rem;
  }

  .maintenance-title {
    font-size: 4rem;
  }

  .maintenance-message {
    font-size: 1.4rem;
  }

  .maintenance-svg {
    width: 120px;
    height: 120px;
  }

  .icon-glow {
    width: 140px;
    height: 140px;
  }
}

/* Tablets and smaller desktops (1024px - 1439px) */
@media (max-width: 1439px) and (min-width: 1024px) {
  .maintenance-container {
    max-width: 700px;
    padding: 4rem 3rem;
  }
}

/* Tablets (768px - 1023px) */
@media (max-width: 1023px) and (min-width: 768px) {
  .page-maintenance-view {
    padding: 2rem 1.5rem;
  }

  .maintenance-container {
    max-width: 600px;
    padding: 3.5rem 2.5rem;
    border-radius: 20px;
  }

  .maintenance-svg {
    width: 90px;
    height: 90px;
  }

  .icon-glow {
    width: 110px;
    height: 110px;
  }

  .maintenance-title {
    font-size: 3rem;
  }

  .maintenance-message {
    font-size: 1.15rem;
  }

  .vector-shape {
    width: 250px;
    height: 250px;
  }

  .vector-left {
    left: -120px;
  }

  .vector-right {
    right: -120px;
  }

  .ambient-glow {
    width: 500px;
    height: 500px;
  }
}

/* Mobile landscape and small tablets (640px - 767px) */
@media (max-width: 767px) and (min-width: 640px) {
  .page-maintenance-view {
    padding: 1.5rem;
  }

  .maintenance-container {
    padding: 3rem 2rem;
    border-radius: 20px;
  }

  .maintenance-svg {
    width: 80px;
    height: 80px;
  }

  .icon-glow {
    width: 100px;
    height: 100px;
  }

  .maintenance-title {
    font-size: 2.5rem;
  }

  .maintenance-message {
    font-size: 1.1rem;
  }

  .vector-shape {
    width: 200px;
    height: 200px;
    opacity: 0.1;
  }

  .vector-left {
    left: -100px;
  }

  .vector-right {
    right: -100px;
  }

  .ambient-glow {
    width: 400px;
    height: 400px;
  }

  .floating-particles {
    opacity: 0.7;
  }
}

/* Mobile portrait (480px - 639px) */
@media (max-width: 639px) and (min-width: 481px) {
  .page-maintenance-view {
    padding: 1.25rem;
  }

  .maintenance-container {
    padding: 2.5rem 1.75rem;
    border-radius: 18px;
  }

  .maintenance-svg {
    width: 70px;
    height: 70px;
  }

  .icon-glow {
    width: 90px;
    height: 90px;
  }

  .maintenance-title {
    font-size: 2.25rem;
    gap: 0.4rem;
  }

  .maintenance-message {
    font-size: 1.05rem;
    line-height: 1.7;
    margin-bottom: 2.5rem;
  }

  .maintenance-footer {
    margin-top: 2.5rem;
    padding-top: 1.5rem;
  }

  .vector-shape {
    width: 150px;
    height: 150px;
    opacity: 0.08;
  }

  .vector-left {
    left: -80px;
  }

  .vector-right {
    right: -80px;
  }

  .ambient-glow {
    width: 350px;
    height: 350px;
  }

  .stars {
    opacity: 0.4;
  }
}

/* Small mobile (360px - 480px) */
@media (max-width: 480px) and (min-width: 361px) {
  .page-maintenance-view {
    padding: 1rem;
  }

  .maintenance-container {
    padding: 2.5rem 1.5rem;
    border-radius: 16px;
  }

  .maintenance-svg {
    width: 60px;
    height: 60px;
  }

  .icon-glow {
    width: 80px;
    height: 80px;
  }

  .maintenance-title {
    font-size: 2rem;
    gap: 0.3rem;
    margin-bottom: 1.25rem;
  }

  .maintenance-message {
    font-size: 1rem;
    line-height: 1.6;
    margin-bottom: 2rem;
  }

  .maintenance-footer {
    margin-top: 2rem;
    padding-top: 1.5rem;
    gap: 0.5rem;
  }

  .footer-icon {
    font-size: 1.25rem;
  }

  .maintenance-footer p {
    font-size: 0.9rem;
  }

  .legal-links {
    gap: 0.5rem;
    margin-top: 1.25rem;
    padding-top: 1.25rem;
  }

  .legal-link {
    font-size: 0.85rem;
  }

  .link-divider {
    font-size: 0.7rem;
    margin: 0 0.2rem;
  }

  .vector-shape {
    width: 120px;
    height: 120px;
    opacity: 0.06;
  }

  .vector-left {
    left: -60px;
  }

  .vector-right {
    right: -60px;
  }

  .ambient-glow {
    width: 300px;
    height: 300px;
  }

  .stars {
    opacity: 0.3;
  }

  .floating-particles {
    opacity: 0.5;
  }
}

/* Extra small mobile (320px - 360px) */
@media (max-width: 360px) {
  .page-maintenance-view {
    padding: 0.75rem;
  }

  .maintenance-container {
    padding: 2rem 1.25rem;
    border-radius: 14px;
  }

  .maintenance-svg {
    width: 50px;
    height: 50px;
  }

  .icon-glow {
    width: 70px;
    height: 70px;
  }

  .maintenance-title {
    font-size: 1.75rem;
    gap: 0.25rem;
    margin-bottom: 1rem;
  }

  .maintenance-message {
    font-size: 0.95rem;
    line-height: 1.5;
    margin-bottom: 1.75rem;
  }

  .maintenance-footer {
    margin-top: 1.75rem;
    padding-top: 1.25rem;
    gap: 0.5rem;
  }

  .footer-icon {
    font-size: 1.1rem;
  }

  .maintenance-footer p {
    font-size: 0.85rem;
  }

  .legal-links {
    gap: 0.4rem;
    margin-top: 1rem;
    padding-top: 1rem;
  }

  .legal-link {
    font-size: 0.8rem;
  }

  .link-divider {
    font-size: 0.65rem;
    margin: 0 0.15rem;
  }

  .vector-shape {
    display: none;
  }

  .ambient-glow {
    width: 250px;
    height: 250px;
  }

  .stars {
    opacity: 0.25;
  }

  .floating-particles {
    opacity: 0.4;
  }

  .particle {
    width: 2px !important;
    height: 2px !important;
  }
}

/* Landscape orientation adjustments */
@media (max-height: 600px) and (orientation: landscape) {
  .page-maintenance-view {
    padding: 1rem;
    min-height: 100vh;
  }

  .maintenance-container {
    padding: 2rem 2.5rem;
  }

  .maintenance-icon {
    margin-bottom: 1.5rem;
  }

  .maintenance-svg {
    width: 60px;
    height: 60px;
  }

  .icon-glow {
    width: 80px;
    height: 80px;
  }

  .maintenance-title {
    font-size: 2rem;
    margin-bottom: 1rem;
  }

  .maintenance-message {
    font-size: 1rem;
    margin-bottom: 1.5rem;
  }

  .maintenance-footer {
    margin-top: 1.5rem;
    padding-top: 1rem;
  }

  .legal-links {
    gap: 0.5rem;
    margin-top: 1rem;
    padding-top: 1rem;
  }

  .legal-link {
    font-size: 0.85rem;
  }

  .link-divider {
    font-size: 0.7rem;
  }
}
</style>

