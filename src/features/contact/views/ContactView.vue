<template>
  <div class="contact-page">
    <!-- Main Content -->
      <main class="contact-main">
      <!-- Loading State -->
      <div v-if="isLoading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>Loading content...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-state">
        <p>{{ error }}</p>
        <button @click="loadContactContent" class="retry-button">Retry</button>
      </div>

      <!-- Content -->
      <template v-else>
        <!-- Header Section -->
        <section class="contact-header">
          <h1 class="header-title">{{ headerTitle }}</h1>
          <p class="header-subtitle">{{ headerSubtitle }}</p>
        </section>

        <!-- Contact Content -->
        <section class="contact-content">
          <!-- Contact Form -->
          <div class="form-card">
            <h2 class="form-title">{{ formTitle }}</h2>
            
            <!-- Success Message -->
            <div v-if="submitSuccess" class="success-message">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <polyline points="22 4 12 14.01 9 11.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span>Message sent successfully! We'll get back to you soon.</span>
            </div>

            <!-- Error Message -->
            <div v-if="submitError" class="error-message">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
              <span>{{ submitError }}</span>
            </div>
            
            <form @submit.prevent="handleSubmit" class="contact-form">
              <div class="form-group">
                <label for="name" class="form-label">Name</label>
                <input 
                  type="text" 
                  id="name" 
                  v-model="form.name"
                  placeholder="Your full name"
                  class="form-input"
                  required
                />
              </div>

              <div class="form-group">
                <label for="email" class="form-label">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  v-model="form.email"
                  placeholder="your@email.com"
                  class="form-input"
                  required
                />
              </div>

              <div class="form-group">
                <label for="subject" class="form-label">Subject</label>
                <input 
                  type="text" 
                  id="subject" 
                  v-model="form.subject"
                  placeholder="What is this about?"
                  class="form-input"
                  required
                />
              </div>

              <div class="form-group">
                <label for="message" class="form-label">Message</label>
                <textarea 
                  id="message" 
                  v-model="form.message"
                  placeholder="Tell us more about your inquiry"
                  class="form-textarea"
                  rows="5"
                  required
                ></textarea>
              </div>

              <button type="submit" class="submit-button" :disabled="isSubmitting">
                <span>{{ isSubmitting ? 'Sending...' : 'Send Message' }}</span>
                <svg 
                  v-if="!isSubmitting"
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" 
                    stroke="currentColor" 
                    stroke-width="2" 
                    stroke-linecap="round" 
                    stroke-linejoin="round"
                  />
                </svg>
              </button>
            </form>
          </div>

          <!-- Contact Information -->
          <div class="info-card">
            <h2 class="info-title">{{ infoTitle }}</h2>
            
            <div class="info-list">
              <!-- Instagram -->
              <a 
                v-if="showInstagramInContactPage"
                :href="contactInfo.instagramUrl" 
                target="_blank" 
                rel="noopener noreferrer" 
                class="info-item"
              >
                <div class="info-icon instagram">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" stroke-width="2"/>
                    <path d="M16 11.37C16.1234 12.2022 15.9813 13.0522 15.5938 13.799C15.2063 14.5458 14.5932 15.1514 13.8416 15.5297C13.0901 15.908 12.2385 16.0396 11.4078 15.9059C10.5771 15.7723 9.80976 15.3801 9.21484 14.7852C8.61991 14.1903 8.22774 13.4229 8.09408 12.5922C7.96042 11.7615 8.09202 10.9099 8.47032 10.1584C8.84862 9.40685 9.45419 8.79374 10.201 8.40624C10.9478 8.01874 11.7978 7.87665 12.63 8C13.4789 8.12588 14.2649 8.52146 14.8717 9.1283C15.4785 9.73514 15.8741 10.5211 16 11.37Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
                <div class="info-text">
                  <span class="info-label">Instagram</span>
                  <span class="info-value">{{ contactInfo.instagram }}</span>
                </div>
              </a>

              <!-- Email -->
              <a 
                v-if="showEmailInContactPage"
                :href="'mailto:' + contactInfo.email" 
                class="info-item"
              >
                <div class="info-icon email">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <polyline points="22,6 12,13 2,6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
                <div class="info-text">
                  <span class="info-label">Email Address</span>
                  <span class="info-value">{{ contactInfo.email }}</span>
                </div>
              </a>

              <!-- LinkedIn -->
              <a 
                v-if="showLinkedInInContactPage"
                :href="contactInfo.linkedinUrl" 
                target="_blank" 
                rel="noopener noreferrer" 
                class="info-item"
              >
                <div class="info-icon linkedin">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 8C17.5913 8 19.1174 8.63214 20.2426 9.75736C21.3679 10.8826 22 12.4087 22 14V21H18V14C18 13.4696 17.7893 12.9609 17.4142 12.5858C17.0391 12.2107 16.5304 12 16 12C15.4696 12 14.9609 12.2107 14.5858 12.5858C14.2107 12.9609 14 13.4696 14 14V21H10V14C10 12.4087 10.6321 10.8826 11.7574 9.75736C12.8826 8.63214 14.4087 8 16 8Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M6 9H2V21H6V9Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <circle cx="4" cy="4" r="2" stroke="currentColor" stroke-width="2"/>
                  </svg>
                </div>
                <div class="info-text">
                  <span class="info-label">LinkedIn</span>
                  <span class="info-value">{{ contactInfo.linkedin }}</span>
                </div>
              </a>

              <!-- WhatsApp -->
              <a 
                v-if="showWhatsAppInContactPage"
                :href="contactInfo.whatsappUrl" 
                target="_blank" 
                rel="noopener noreferrer" 
                class="info-item"
              >
                <div class="info-icon whatsapp">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.477 2 12C2 13.89 2.525 15.66 3.438 17.168L2.546 20.2C2.49 20.386 2.486 20.583 2.536 20.771C2.586 20.959 2.687 21.13 2.828 21.265C2.969 21.4 3.145 21.494 3.336 21.536C3.527 21.578 3.725 21.567 3.912 21.504L6.944 20.612C8.502 21.555 10.303 22.06 12.138 22.038C17.605 21.963 22 17.523 22 12C22 6.477 17.523 2 12 2ZM9.738 14.263C11.889 16.413 13.938 16.697 14.664 16.724C15.767 16.765 16.843 15.922 17.261 14.943C17.313 14.822 17.332 14.689 17.316 14.558C17.299 14.427 17.248 14.303 17.168 14.198C16.586 13.454 15.798 12.919 15.028 12.387C14.867 12.276 14.67 12.232 14.477 12.263C14.284 12.295 14.111 12.4 13.994 12.556L13.358 13.53C13.324 13.582 13.272 13.62 13.212 13.635C13.152 13.65 13.088 13.642 13.034 13.612C12.601 13.364 11.97 12.943 11.516 12.489C11.062 12.035 10.665 11.432 10.442 11.026C10.415 10.974 10.408 10.914 10.421 10.857C10.434 10.8 10.468 10.75 10.515 10.715L11.498 9.965C11.64 9.841 11.732 9.67 11.756 9.484C11.78 9.298 11.734 9.11 11.628 8.958C11.151 8.26 10.596 7.372 9.79 6.785C9.686 6.712 9.563 6.666 9.435 6.652C9.307 6.638 9.177 6.657 9.06 6.708C8.08 7.126 7.233 8.202 7.273 9.305C7.3 10.031 7.584 12.11 9.738 14.263Z" fill="currentColor"/>
                  </svg>
                </div>
                <div class="info-text">
                  <span class="info-label">WhatsApp</span>
                  <span class="info-value">{{ contactInfo.whatsapp }}</span>
                </div>
              </a>
            </div>
          </div>
        </section>
      </template>
      </main>

      <!-- Footer -->
      <FooterSection />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import FooterSection from '@/shared/components/FooterSection.vue'
import { ContactViewController } from '../controllers/ContactViewController'
import type { ContactContent, ContactInfo } from '../models/ContactMessage'

const viewController = new ContactViewController()

// Reactive state
const contactContent = ref<ContactContent | null>(null)
const isLoading = ref(false)
const error = ref<string | null>(null)
const isSubmitting = ref(false)
const submitSuccess = ref(false)
const submitError = ref<string | null>(null)

// Form state
const form = reactive({
  name: '',
  email: '',
  subject: '',
  message: ''
})

// Default contact info
const defaultContactInfo: ContactInfo = {
  instagram: 'clear-up00',
  instagramUrl: 'https://instagram.com/clear-up00',
  email: 'info@ClearUP.com',
  linkedin: 'Clear Up',
  linkedinUrl: 'https://linkedin.com/company/clearup',
  whatsapp: '+9708888888',
  whatsappUrl: 'https://wa.me/9708888888'
}

// Computed properties
const headerTitle = computed(() => contactContent.value?.headerTitle || 'Ready To Elevate Your Brand ?')
const headerSubtitle = computed(() => contactContent.value?.headerSubtitle || 'Contact us today for a free consultation and quote')
const formTitle = computed(() => contactContent.value?.formTitle || 'Send us a Message')
const infoTitle = computed(() => contactContent.value?.infoTitle || 'Contact Information')
const contactInfo = computed(() => contactContent.value?.contactInfo || defaultContactInfo)

// Social media visibility computed properties
const showInstagramInContactPage = computed(() => {
  return contactContent.value?.socialMediaVisibility?.instagram?.showInContactPage !== false
})

const showLinkedInInContactPage = computed(() => {
  return contactContent.value?.socialMediaVisibility?.linkedin?.showInContactPage !== false
})

const showEmailInContactPage = computed(() => {
  return contactContent.value?.socialMediaVisibility?.email?.showInContactPage !== false
})

const showWhatsAppInContactPage = computed(() => {
  return contactContent.value?.socialMediaVisibility?.whatsapp?.showInContactPage !== false
})

// Load contact content
const loadContactContent = async () => {
  isLoading.value = true
  error.value = null

  try {
    await viewController.loadContactContent()
    contactContent.value = viewController.getContactContent()
    
    if (!contactContent.value) {
      // Use defaults if no content
      contactContent.value = {
        headerTitle: 'Ready To Elevate Your Brand ?',
        headerSubtitle: 'Contact us today for a free consultation and quote',
        formTitle: 'Send us a Message',
        infoTitle: 'Contact Information',
        contactInfo: defaultContactInfo
      }
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load contact content'
  } finally {
    isLoading.value = false
  }
}

// Handle form submission
const handleSubmit = async () => {
  isSubmitting.value = true
  submitSuccess.value = false
  submitError.value = null
  
  try {
    const result = await viewController.submitContactForm({
      name: form.name,
      email: form.email,
      subject: form.subject,
      message: form.message
    })
    
    if (result.success) {
      submitSuccess.value = true
      // Reset form
      form.name = ''
      form.email = ''
      form.subject = ''
      form.message = ''
      
      // Auto-hide success message after 5 seconds
      setTimeout(() => {
        submitSuccess.value = false
      }, 5000)
    } else {
      submitError.value = result.error || 'Failed to send message'
    }
  } catch (err) {
    submitError.value = err instanceof Error ? err.message : 'An unexpected error occurred'
  } finally {
    isSubmitting.value = false
  }
}

// Load content on mount
onMounted(async () => {
  window.scrollTo(0, 0)
  loadContactContent()
})
</script>

<style scoped>
.contact-page {
  min-height: 100vh;
  background: #0B0B0F;
  color: #F5F7FA;
}

.contact-main {
  max-width: 1440px;
  margin: 0 auto;
  padding: 60px 63px 100px;
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

/* Success and Error Messages */
.success-message,
.error-message {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 24px;
  font-size: 14px;
}

.success-message {
  background: rgba(34, 197, 94, 0.15);
  border: 1px solid rgba(34, 197, 94, 0.3);
  color: #22c55e;
}

.error-message {
  background: rgba(239, 68, 68, 0.15);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #ef4444;
}

.success-message svg,
.error-message svg {
  flex-shrink: 0;
}

/* Header Section */
.contact-header {
  text-align: center;
  margin-bottom: 60px;
}

.header-title {
  font-family: 'Roboto', sans-serif;
  font-size: 48px;
  font-weight: 700;
  color: #F5F7FA;
  margin: 0 0 16px;
  letter-spacing: -0.02em;
}

.header-subtitle {
  font-family: 'Roboto', sans-serif;
  font-size: 18px;
  font-weight: 400;
  color: rgba(245, 247, 250, 0.7);
  margin: 0;
}

/* Contact Content */
.contact-content {
  display: flex;
  justify-content: center;
  gap: 90px;
  align-items: stretch;
  flex-wrap: wrap;
}

/* Form Card */
.form-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(91, 32, 150, 0.3);
  border-radius: 16px;
  padding: 40px;
  width: 661px;
  min-height: 675px;
  max-width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.form-title {
  font-family: 'Roboto', sans-serif;
  font-size: 24px;
  font-weight: 600;
  color: #F5F7FA;
  margin: 0 0 32px;
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
  flex: 1;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-family: 'Roboto', sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #F5F7FA;
}

.form-input,
.form-textarea {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(91, 32, 150, 0.4);
  border-radius: 8px;
  padding: 14px 16px;
  font-family: 'Roboto', sans-serif;
  font-size: 14px;
  color: #F5F7FA;
  transition: all 0.3s ease;
  outline: none;
}

.form-input::placeholder,
.form-textarea::placeholder {
  color: rgba(245, 247, 250, 0.4);
}

.form-input:focus,
.form-textarea:focus {
  border-color: #5B2096;
  background: rgba(91, 32, 150, 0.1);
  box-shadow: 0 0 0 3px rgba(91, 32, 150, 0.15);
}

.form-textarea {
  resize: vertical;
  min-height: 120px;
  flex: 1;
}

.form-group:has(.form-textarea) {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.form-group:has(.form-textarea) .form-textarea {
  flex: 1;
}

.submit-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 16px 32px;
  background: linear-gradient(90deg, #5B2096 0%, #C19DE6 100%);
  border: none;
  border-radius: 8px;
  font-family: 'Roboto', sans-serif;
  font-size: 16px;
  font-weight: 500;
  color: #F5F7FA;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 8px;
}

.submit-button:hover:not(:disabled) {
  background: linear-gradient(90deg, #6B2FA6 0%, #D1ADF6 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(91, 32, 150, 0.3);
}

.submit-button:active:not(:disabled) {
  transform: translateY(0);
}

.submit-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Info Card */
.info-card {
  background: #14141B;
  border: 1px solid rgba(91, 32, 150, 0.3);
  border-radius: 16px;
  padding: 40px;
  width: 445px;
  min-height: 675px;
  max-width: 100%;
  box-sizing: border-box;
}

.info-title {
  font-family: 'Roboto', sans-serif;
  font-size: 24px;
  font-weight: 600;
  color: #F5F7FA;
  margin: 0 0 32px;
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 16px;
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;
  padding: 8px;
  margin: -8px;
  border-radius: 12px;
}

.info-item:hover {
  background: rgba(91, 32, 150, 0.15);
  transform: translateX(4px);
}

.info-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  color: #F5F7FA;
  flex-shrink: 0;
}

.info-icon.instagram {
  background: linear-gradient(135deg, #833AB4 0%, #FD1D1D 50%, #F77737 100%);
}

.info-icon.email {
  background: linear-gradient(135deg, #5B2096 0%, #C19DE6 100%);
}

.info-icon.linkedin {
  background: #0A66C2;
}

.info-icon.whatsapp {
  background: linear-gradient(135deg, #25D366 0%, #128C7E 100%);
}

.info-icon svg {
  width: 24px;
  height: 24px;
}

.info-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-label {
  font-family: 'Roboto', sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: #F5F7FA;
}

.info-value {
  font-family: 'Roboto', sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: rgba(245, 247, 250, 0.7);
}

/* Responsive Design */
@media (max-width: 1200px) {
  .contact-content {
    gap: 60px;
  }

  .form-card {
    width: 580px;
    min-height: 650px;
  }

  .info-card {
    width: 400px;
    min-height: 650px;
  }
}

@media (max-width: 1024px) {
  .contact-main {
    padding: 50px 40px 80px;
  }

  .header-title {
    font-size: 40px;
  }

  .contact-content {
    gap: 40px;
  }

  .form-card {
    width: 500px;
    min-height: 620px;
    padding: 32px;
  }

  .info-card {
    width: 360px;
    min-height: 620px;
    padding: 32px;
  }
}

@media (max-width: 900px) {
  .contact-content {
    flex-direction: column;
    align-items: center;
    gap: 24px;
  }

  .form-card {
    width: 100%;
    max-width: 661px;
    min-height: auto;
  }

  .info-card {
    width: 100%;
    max-width: 661px;
    min-height: auto;
  }
}

@media (max-width: 768px) {
  .contact-main {
    padding: 40px 24px 60px;
  }

  .header-title {
    font-size: 32px;
  }

  .header-subtitle {
    font-size: 16px;
  }

  .contact-header {
    margin-bottom: 40px;
  }

  .form-card,
  .info-card {
    padding: 24px;
  }

  .form-title,
  .info-title {
    font-size: 20px;
    margin-bottom: 24px;
  }

  .contact-form {
    gap: 20px;
  }
}

@media (max-width: 480px) {
  .contact-main {
    padding: 32px 20px 50px;
  }

  .header-title {
    font-size: 26px;
  }

  .header-subtitle {
    font-size: 14px;
  }

  .form-card,
  .info-card {
    padding: 20px;
  }

  .form-title,
  .info-title {
    font-size: 18px;
  }

  .info-icon {
    width: 40px;
    height: 40px;
  }

  .info-icon svg {
    width: 20px;
    height: 20px;
  }

  .submit-button {
    padding: 14px 24px;
    font-size: 14px;
  }
}
</style>
