<template>
  <footer class="footer-section">
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
          <p class="footer-tagline">{{ tagline }}</p>
          <div class="footer-social">
            <a href="https://instagram.com/clear-up00" target="_blank" rel="noopener noreferrer" class="social-icon" aria-label="Instagram">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2.163C8.678 2.163 8.25 2.175 7.05 2.225C5.85 2.275 4.95 2.475 4.15 2.775C3.35 3.075 2.65 3.475 2.05 4.075C1.45 4.675 1.05 5.375 0.75 6.175C0.45 6.975 0.25 7.875 0.2 9.075C0.15 10.275 0.138 10.703 0.138 14.025C0.138 17.347 0.15 17.775 0.2 18.975C0.25 20.175 0.45 21.075 0.75 21.875C1.05 22.675 1.45 23.375 2.05 23.975C2.65 24.575 3.35 24.975 4.15 25.275C4.95 25.575 5.85 25.775 7.05 25.825C8.25 25.875 8.678 25.887 12 25.887C15.322 25.887 15.75 25.875 16.95 25.825C18.15 25.775 19.05 25.575 19.85 25.275C20.65 24.975 21.35 24.575 21.95 23.975C22.55 23.375 22.95 22.675 23.25 21.875C23.55 21.075 23.75 20.175 23.8 18.975C23.85 17.775 23.862 17.347 23.862 14.025C23.862 10.703 23.85 10.275 23.8 9.075C23.75 7.875 23.55 6.975 23.25 6.175C22.95 5.375 22.55 4.675 21.95 4.075C21.35 3.475 20.65 3.075 19.85 2.775C19.05 2.475 18.15 2.275 16.95 2.225C15.75 2.175 15.322 2.163 12 2.163ZM12 4.163C15.25 4.163 15.638 4.175 16.813 4.225C17.988 4.275 18.638 4.475 19.063 4.65C19.638 4.9 20.05 5.175 20.5 5.625C20.95 6.075 21.225 6.487 21.475 7.062C21.65 7.487 21.85 8.137 21.9 9.312C21.95 10.487 21.962 10.875 21.962 14.125C21.962 17.375 21.95 17.763 21.9 18.938C21.85 20.113 21.65 20.763 21.475 21.188C21.225 21.763 20.95 22.175 20.5 22.625C20.05 23.075 19.638 23.35 19.063 23.6C18.638 23.775 17.988 23.975 16.813 24.025C15.638 24.075 15.25 24.087 12 24.087C8.75 24.087 8.362 24.075 7.187 24.025C6.012 23.975 5.362 23.775 4.937 23.6C4.362 23.35 3.95 23.075 3.5 22.625C3.05 22.175 2.775 21.763 2.525 21.188C2.35 20.763 2.15 20.113 2.1 18.938C2.05 17.763 2.038 17.375 2.038 14.125C2.038 10.875 2.05 10.487 2.1 9.312C2.15 8.137 2.35 7.487 2.525 7.062C2.775 6.487 3.05 6.075 3.5 5.625C3.95 5.175 4.362 4.9 4.937 4.65C5.362 4.475 6.012 4.275 7.187 4.225C8.362 4.175 8.75 4.163 12 4.163ZM12 7.163C9.239 7.163 7 9.402 7 12.163C7 14.924 9.239 17.163 12 17.163C14.761 17.163 17 14.924 17 12.163C17 9.402 14.761 7.163 12 7.163ZM12 15.163C10.343 15.163 9 13.82 9 12.163C9 10.506 10.343 9.163 12 9.163C13.657 9.163 15 10.506 15 12.163C15 13.82 13.657 15.163 12 15.163ZM17.5 6.663C17.5 7.215 17.052 7.663 16.5 7.663C15.948 7.663 15.5 7.215 15.5 6.663C15.5 6.111 15.948 5.663 16.5 5.663C17.052 5.663 17.5 6.111 17.5 6.663Z" fill="white"/>
              </svg>
            </a>
            <a href="https://linkedin.com/company/clearup" target="_blank" rel="noopener noreferrer" class="social-icon" aria-label="LinkedIn">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.447 20.452H16.893V14.883C16.893 13.555 16.866 11.843 15.041 11.843C13.188 11.843 12.905 13.269 12.905 14.785V20.452H9.351V9H12.765V10.561H12.811C13.161 9.809 14.084 9.008 15.48 9.008C18.376 9.008 19.084 11.183 19.084 14.167V20.452H20.447ZM5.337 7.433C4.193 7.433 3.274 6.507 3.274 5.367C3.274 4.224 4.194 3.305 5.337 3.305C6.477 3.305 7.401 4.224 7.401 5.367C7.401 6.507 6.476 7.433 5.337 7.433ZM7.119 20.452H3.555V9H7.119V20.452ZM22.225 0H1.771C0.792 0 0 0.774 0 1.729V22.271C0 23.227 0.792 24 1.771 24H22.222C23.2 24 24 23.227 24 22.271V1.729C24 0.774 23.2 0 22.222 0H22.225Z" fill="white"/>
              </svg>
            </a>
            <a href="mailto:info@ClearUP.com" class="social-icon" aria-label="Email">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z" fill="white"/>
              </svg>
            </a>
            <a href="https://wa.me/9708888888" target="_blank" rel="noopener noreferrer" class="social-icon" aria-label="WhatsApp">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M11.125 1.33325C5.7171 1.33325 1.33337 5.71698 1.33337 11.1249C1.33337 12.9755 1.84744 14.7087 2.74142 16.1853L1.868 19.1541C1.81785 19.3245 1.81455 19.5054 1.85845 19.6775C1.90234 19.8497 1.99181 20.0069 2.11745 20.1325C2.24309 20.2581 2.40026 20.3476 2.57243 20.3915C2.7446 20.4354 2.92542 20.4321 3.09587 20.382L6.06471 19.5085C7.59097 20.4318 9.34123 20.9189 11.125 20.9166C16.533 20.9166 20.9167 16.5329 20.9167 11.1249C20.9167 5.71698 16.533 1.33325 11.125 1.33325ZM8.91017 13.3408C10.891 15.3206 12.7818 15.5821 13.4496 15.6066C14.465 15.6438 15.4539 14.8683 15.8387 13.9684C15.8869 13.8564 15.9043 13.7335 15.8892 13.6125C15.874 13.4915 15.8269 13.3768 15.7526 13.2801C15.216 12.5946 14.4904 12.1021 13.7815 11.6125C13.6336 11.51 13.4516 11.4688 13.2739 11.4976C13.0962 11.5265 12.9367 11.6231 12.8288 11.7673L12.2413 12.6632C12.2102 12.7112 12.1621 12.7456 12.1067 12.7594C12.0512 12.7732 11.9926 12.7654 11.9426 12.7376C11.5441 12.5095 10.9635 12.1217 10.5464 11.7046C10.1292 11.2875 9.76498 10.7333 9.56033 10.3602C9.53558 10.3127 9.52858 10.2579 9.5406 10.2056C9.55263 10.1534 9.58289 10.1072 9.62594 10.0753L10.5307 9.40354C10.6602 9.29152 10.7438 9.13565 10.7655 8.96581C10.7871 8.79596 10.7454 8.62409 10.6482 8.48313C10.2095 7.84079 9.69839 7.02417 8.95717 6.48269C8.8613 6.41381 8.74928 6.37086 8.63194 6.358C8.5146 6.34513 8.39593 6.36279 8.28742 6.40925C7.38658 6.79504 6.60717 7.784 6.64437 8.80136C6.66885 9.46915 6.93029 11.3599 8.91017 13.3408Z" fill="white"/>
              </svg>
            </a>
          </div>
        </div>
        
        <div class="footer-links">
          <h3 class="footer-links-title">Quick Links</h3>
          <ul class="footer-links-list">
            <li><router-link to="/about">About Us</router-link></li>
            <li><router-link to="/services">Our Service</router-link></li>
            <li><router-link to="/#real-results-section">Our Work</router-link></li>
            <li><router-link to="/contact">Contact Us</router-link></li>
          </ul>
        </div>
      </div>
      
      <div class="footer-bottom">
        <p class="footer-copyright">{{ copyright }}</p>
        <div class="footer-policies">
          <router-link to="/privacy-policy">Privacy Policy</router-link>
          <span class="footer-divider">|</span>
          <router-link to="/terms-of-service">Terms of Service</router-link>
          <span class="footer-divider">|</span>
          <router-link to="/cookie-policy">Cookie Policy</router-link>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { HomeContentController } from '@/features/home/controllers/HomeContentController'
import type { HomeContent } from '@/features/home/models/HomeContent'

interface Props {
  tagline?: string
  copyright?: string
}

const props = withDefaults(defineProps<Props>(), {
  tagline: '',
  copyright: ''
})

const homeContentController = new HomeContentController()
const homeContent = ref<HomeContent | null>(null)

// Computed values that prioritize props, then homeContent, then defaults
const tagline = computed(() => {
  if (props.tagline) return props.tagline
  if (homeContent.value?.footerTagline) return homeContent.value.footerTagline
  return 'Your creative digital partner for high-impact video ads and marketing content.'
})

const copyright = computed(() => {
  if (props.copyright) return props.copyright
  if (homeContent.value?.footerAddress) return homeContent.value.footerAddress
  return 'Copyright © 2025 Trusted Valley LLC. All rights reserved'
})

onMounted(async () => {
  try {
    const result = await homeContentController.getHomeContent()
    if (result.success && result.data) {
      homeContent.value = result.data
    }
  } catch (error) {
    console.error('Failed to load footer content:', error)
  }
})
</script>

<style scoped>
/* Footer/Bottom Section */
.footer-section {
  position: relative;
  width: 100%;
  z-index: 3;
  background: #5B2096;
  padding: 80px 20px 40px;
}

.footer-container {
  max-width: 1304px;
  width: 100%;
  margin: 0 auto;
}

.footer-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 80px;
  margin-bottom: 48px;
}

.footer-brand {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.footer-logo {
  display: flex;
  align-items: center;
}

.footer-logo-image {
  height: auto;
  max-width: 180px;
  width: auto;
}

.footer-tagline {
  color: rgba(245, 247, 250, 0.9);
  font-family: 'Roboto', sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 1.6;
  margin: 0;
  max-width: 500px;
}

.footer-social {
  display: flex;
  gap: 16px;
  margin-top: 8px;
}

.social-icon {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.social-icon:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
  border-color: rgba(255, 255, 255, 0.4);
}

.social-icon svg {
  width: 20px;
  height: 20px;
}

.footer-links {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.footer-links-title {
  color: #F5F7FA;
  font-family: 'Roboto', sans-serif;
  font-size: 20px;
  font-weight: 600;
  line-height: normal;
  margin: 0;
}

.footer-links-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.footer-links-list li {
  margin: 0;
}

.footer-links-list a {
  color: rgba(245, 247, 250, 0.8);
  font-family: 'Roboto', sans-serif;
  font-size: 16px;
  font-weight: 400;
  text-decoration: none;
  transition: color 0.3s ease;
  cursor: pointer;
}

.footer-links-list a:hover {
  color: #F5F7FA;
}

.footer-bottom {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding-top: 32px;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.footer-copyright {
  color: rgba(245, 247, 250, 0.8);
  font-family: 'Roboto', sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: normal;
  margin: 0;
  text-align: center;
}

.footer-policies {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
}

.footer-policies a {
  color: rgba(245, 247, 250, 0.8);
  font-family: 'Roboto', sans-serif;
  font-size: 14px;
  font-weight: 400;
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-policies a:hover {
  color: #F5F7FA;
}

.footer-divider {
  color: rgba(245, 247, 250, 0.5);
  font-size: 14px;
}

/* Responsive Design */

/* Large Tablets and Small Desktops (1024px and below) */
@media (max-width: 1024px) {
  .footer-section {
    padding: 70px 20px 35px;
  }
  
  .footer-content {
    gap: 70px;
    margin-bottom: 40px;
  }
  
  .footer-tagline {
    font-size: 15px;
  }
}

/* Tablets (900px and below) */
@media (max-width: 900px) {
  .footer-section {
    padding: 60px 20px 30px;
  }
  
  .footer-content {
    gap: 60px;
    margin-bottom: 36px;
  }
  
  .footer-tagline {
    font-size: 15px;
  }
}

/* Small Tablets / Large Mobile (768px and below) */
@media (max-width: 768px) {
  .footer-section {
    padding: 60px 20px 30px;
  }
  
  .footer-content {
    grid-template-columns: 1fr;
    gap: 40px;
    margin-bottom: 32px;
  }
  
  .footer-tagline {
    font-size: 14px;
  }

  .footer-links-title {
    font-size: 18px;
  }

  .footer-links-list {
    gap: 14px;
  }

  .footer-links-list a {
    font-size: 15px;
  }
}

/* Mobile (640px and below) */
@media (max-width: 640px) {
  .footer-section {
    padding: 60px 20px 30px;
  }
  
  .footer-content {
    grid-template-columns: 1fr;
    gap: 40px;
  }
  
  .footer-social {
    flex-wrap: wrap;
  }
}

/* Small Mobile (480px and below) */
@media (max-width: 480px) {
  .footer-section {
    padding: 40px 15px 20px;
  }
  
  .footer-container {
    max-width: 100%;
  }
  
  .footer-content {
    grid-template-columns: 1fr;
    gap: 32px;
    margin-bottom: 28px;
  }
  
  .footer-brand {
    gap: 20px;
  }
  
  .footer-tagline {
    font-size: 14px;
    max-width: 100%;
  }
  
  .footer-social {
    flex-wrap: wrap;
    gap: 12px;
  }
  
  .social-icon {
    width: 40px;
    height: 40px;
  }
  
  .social-icon svg {
    width: 18px;
    height: 18px;
  }
  
  .footer-links {
    gap: 20px;
  }
  
  .footer-links-title {
    font-size: 18px;
  }
  
  .footer-links-list {
    gap: 14px;
  }
  
  .footer-links-list a {
    font-size: 14px;
  }
  
  .footer-bottom {
    gap: 14px;
    padding-top: 28px;
  }
  
  .footer-copyright {
    font-size: 12px;
  }
  
  .footer-policies {
    gap: 8px;
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .footer-policies a {
    font-size: 12px;
  }
  
  .footer-divider {
    font-size: 12px;
  }
}

/* Extra Small Mobile (360px and below) */
@media (max-width: 360px) {
  .footer-section {
    padding: 35px 12px 18px;
  }
  
  .footer-content {
    gap: 28px;
    margin-bottom: 28px;
  }
  
  .footer-brand {
    gap: 18px;
  }
  
  .footer-tagline {
    font-size: 13px;
  }
  
  .footer-social {
    gap: 10px;
  }
  
  .social-icon {
    width: 38px;
    height: 38px;
  }
  
  .social-icon svg {
    width: 16px;
    height: 16px;
  }
  
  .footer-links {
    gap: 18px;
  }
  
  .footer-links-title {
    font-size: 17px;
  }
  
  .footer-links-list {
    gap: 12px;
  }
  
  .footer-links-list a {
    font-size: 13px;
  }
  
  .footer-bottom {
    gap: 12px;
    padding-top: 24px;
  }
  
  .footer-copyright {
    font-size: 11px;
  }
  
  .footer-policies {
    gap: 6px;
  }
  
  .footer-policies a {
    font-size: 11px;
  }
  
  .footer-divider {
    font-size: 11px;
  }
}
</style>
