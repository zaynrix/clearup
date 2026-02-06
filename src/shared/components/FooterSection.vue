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
            <a 
              v-if="instagramUrl && showInstagramInFooter" 
              :href="instagramUrl" 
              target="_blank" 
              rel="noopener noreferrer" 
              class="social-icon" 
              aria-label="Instagram"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="2" y="2" width="20" height="20" rx="5" stroke="white" stroke-width="2"/>
                <circle cx="12" cy="12" r="4" stroke="white" stroke-width="2"/>
                <circle cx="17.5" cy="6.5" r="1.5" fill="white"/>
              </svg>
            </a>
            <a 
              v-if="linkedinUrl && showLinkedInInFooter" 
              :href="linkedinUrl" 
              target="_blank" 
              rel="noopener noreferrer" 
              class="social-icon" 
              aria-label="LinkedIn"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.447 20.452H16.893V14.883C16.893 13.555 16.866 11.843 15.041 11.843C13.188 11.843 12.905 13.269 12.905 14.785V20.452H9.351V9H12.765V10.561H12.811C13.161 9.809 14.084 9.008 15.48 9.008C18.376 9.008 19.084 11.183 19.084 14.167V20.452H20.447ZM5.337 7.433C4.193 7.433 3.274 6.507 3.274 5.367C3.274 4.224 4.194 3.305 5.337 3.305C6.477 3.305 7.401 4.224 7.401 5.367C7.401 6.507 6.476 7.433 5.337 7.433ZM7.119 20.452H3.555V9H7.119V20.452ZM22.225 0H1.771C0.792 0 0 0.774 0 1.729V22.271C0 23.227 0.792 24 1.771 24H22.222C23.2 24 24 23.227 24 22.271V1.729C24 0.774 23.2 0 22.222 0H22.225Z" fill="white"/>
              </svg>
            </a>
            <a 
              v-if="emailAddress && showEmailInFooter" 
              :href="`mailto:${emailAddress}`" 
              class="social-icon" 
              aria-label="Email"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z" fill="white"/>
              </svg>
            </a>
            <a 
              v-if="whatsappUrl && showWhatsAppInFooter" 
              :href="whatsappUrl" 
              target="_blank" 
              rel="noopener noreferrer" 
              class="social-icon" 
              aria-label="WhatsApp"
            >
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
            <li><router-link to="/works">Our Work</router-link></li>
            <li><router-link to="/contact">Contact Us</router-link></li>
          </ul>
        </div>

        <div class="footer-address" v-if="address">
          <h3 class="footer-links-title">Address</h3>
          <p class="footer-address-text">{{ address }}</p>
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
import { contactContentController } from '@/features/contact/controllers/ContactContentController'
import type { HomeContent } from '@/features/home/models/HomeContent'
import type { ContactContent } from '@/features/contact/models/ContactMessage'

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
const contactContent = ref<ContactContent | null>(null)

// Computed values that prioritize props, then homeContent, then defaults
const tagline = computed(() => {
  if (props.tagline) return props.tagline
  if (homeContent.value?.footerTagline) return homeContent.value.footerTagline
  return 'Your creative digital partner for high-impact video ads and marketing content.'
})

const copyright = computed(() => {
  if (props.copyright) return props.copyright
  if (homeContent.value?.footerCopyright) return homeContent.value.footerCopyright
  return 'Copyright © 2025 Trusted Valley LLC. All rights reserved'
})

const address = computed(() => {
  const addr = homeContent.value?.footerAddress
  return addr && addr.trim() ? addr.trim() : ''
})

// Social media links from Contact Settings
const instagramUrl = computed(() => {
  return contactContent.value?.contactInfo?.instagramUrl || 'https://instagram.com/clear-up00'
})

const linkedinUrl = computed(() => {
  return contactContent.value?.contactInfo?.linkedinUrl || 'https://linkedin.com/company/clearup'
})

const emailAddress = computed(() => {
  return contactContent.value?.contactInfo?.email || 'info@ClearUP.com'
})

const whatsappUrl = computed(() => {
  return contactContent.value?.contactInfo?.whatsappUrl || 'https://wa.me/9708888888'
})

// Social media visibility computed properties for footer
const showInstagramInFooter = computed(() => {
  return contactContent.value?.socialMediaVisibility?.instagram?.showInFooter !== false
})

const showLinkedInInFooter = computed(() => {
  return contactContent.value?.socialMediaVisibility?.linkedin?.showInFooter !== false
})

const showEmailInFooter = computed(() => {
  return contactContent.value?.socialMediaVisibility?.email?.showInFooter !== false
})

const showWhatsAppInFooter = computed(() => {
  return contactContent.value?.socialMediaVisibility?.whatsapp?.showInFooter !== false
})

onMounted(async () => {
  try {
    // Load home content
    const homeResult = await homeContentController.getHomeContent()
    if (homeResult.success && homeResult.data) {
      homeContent.value = homeResult.data
    }
    
    // Load contact content for social media links
    const contactResult = await contactContentController.getContactContent()
    if (contactResult.success && contactResult.data) {
      contactContent.value = contactResult.data
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
  grid-template-columns: 2fr 1fr 1fr;
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

.footer-address {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.footer-address-text {
  color: rgba(245, 247, 250, 0.8);
  font-family: 'Roboto', sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 1.6;
  margin: 0;
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
    grid-template-columns: 1fr 1fr;
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

  .footer-address {
    gap: 20px;
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
