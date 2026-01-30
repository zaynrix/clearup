<template>
  <nav class="navigation-bar">
    <div class="nav-container">
      <div class="nav-logo" @click="handleLogoClick">
        <img 
          v-if="!logoError"
          src="/images/logos/logo-main.png" 
          alt="ClearUp Logo" 
          class="logo-image"
          @error="handleLogoError"
        />
        <div v-else class="logo-placeholder">
          ClearUp
        </div>
      </div>
      
      <div class="nav-actions">
        <button 
          class="menu-button"
          :class="{ 'menu-open': isMenuOpen }"
          @click="handleMenuClick"
          :aria-label="isMenuOpen ? 'Close menu' : 'Open menu'"
        >
          <span class="menu-text">Menu</span>
        </button>
        <button 
          class="plus-button"
          @click="handleMenuClick"
          :aria-label="isMenuOpen ? 'Close menu' : 'Open menu'"
        >
          <svg 
            class="plus-icon"
            :class="{ 'rotated': isMenuOpen }"
            width="20" 
            height="20" 
            viewBox="0 0 20 20" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              d="M10 3V17M3 10H17" 
              stroke="#F5F7FA" 
              stroke-width="2" 
              stroke-linecap="round" 
              stroke-linejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>

    <!-- Menu Overlay -->
    <Transition name="menu-fade">
      <div v-if="isMenuOpen" class="menu-overlay" @click.self="handleMenuClick">
        <div class="menu-container">
          <!-- Menu Header -->
          <div class="menu-header">
            <div class="menu-logo" @click="handleLogoClick">
              <img 
                v-if="!logoError"
                src="/images/logos/logo-main.png" 
                alt="ClearUp Logo" 
                class="menu-logo-image"
                @error="handleLogoError"
              />
              <div v-else class="menu-logo-placeholder">
                CLEAR UP
              </div>
            </div>
            <button 
              class="menu-close-button"
              @click="handleMenuClick"
              aria-label="Close menu"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>

          <!-- Menu Content -->
          <div class="menu-content">
            <!-- Menu Items (Left Side) -->
            <div class="menu-items">
              <a 
                v-for="item in menuItems" 
                :key="item.id"
                :href="item.href"
                @click.prevent="handleMenuItemClick(item)"
                class="menu-item"
              >
                <span class="menu-item-number">{{ item.number }}</span>
                <span class="menu-item-text">{{ item.label }}</span>
              </a>
            </div>

            <!-- Contact Us Section (Right Side) -->
            <div class="menu-contact">
              <h3 class="contact-title">Contact Us</h3>
              <div class="social-icons">
                <a 
                  v-for="social in socialLinks" 
                  :key="social.name"
                  :href="social.url" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  class="social-icon"
                  :aria-label="social.name"
                >
                  <component :is="social.icon" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </nav>
</template>

<script setup lang="ts">
import { ref, h } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const isMenuOpen = ref(false)
const logoError = ref(false)

const menuItems = [
  { id: 'home', number: '01', label: 'HOME', href: '/', scrollTo: 'top', route: 'home' },
  { id: 'about', number: '02', label: 'ABOUT', href: '/about', scrollTo: 'top', route: 'about' },
  { id: 'services', number: '03', label: 'SERVICES', href: '/services', scrollTo: 'top', route: 'services' },
  { id: 'works', number: '04', label: 'WORKS', href: '#', scrollTo: 'real-results-section' },
  { id: 'contact', number: '05', label: 'CONTACT', href: '#', scrollTo: 'footer-section' }
]

const socialLinks = [
  {
    name: 'Instagram',
    url: 'https://instagram.com',
    icon: () => h('svg', { width: '24', height: '24', viewBox: '0 0 24 24', fill: 'none', xmlns: 'http://www.w3.org/2000/svg' }, [
      h('rect', { x: '2', y: '2', width: '20', height: '20', rx: '5', stroke: 'currentColor', 'stroke-width': '2' }),
      h('path', { d: 'M16 11.37C16.1234 12.2022 15.9813 13.0522 15.5938 13.799C15.2063 14.5458 14.5932 15.1514 13.8416 15.5297C13.0901 15.908 12.2385 16.0396 11.4078 15.9059C10.5771 15.7723 9.80976 15.3801 9.21484 14.7852C8.61991 14.1903 8.22774 13.4229 8.09408 12.5922C7.96042 11.7615 8.09202 10.9099 8.47032 10.1584C8.84862 9.40685 9.45419 8.79374 10.201 8.40624C10.9478 8.01874 11.7978 7.87665 12.63 8C13.4789 8.12588 14.2649 8.52146 14.8717 9.1283C15.4785 9.73514 15.8741 10.5211 16 11.37Z', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }),
      h('line', { x1: '17.5', y1: '6.5', x2: '17.51', y2: '6.5', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' })
    ])
  },
  {
    name: 'LinkedIn',
    url: 'https://linkedin.com',
    icon: () => h('svg', { width: '24', height: '24', viewBox: '0 0 24 24', fill: 'none', xmlns: 'http://www.w3.org/2000/svg' }, [
      h('path', { d: 'M16 8C17.5913 8 19.1174 8.63214 20.2426 9.75736C21.3679 10.8826 22 12.4087 22 14V21H18V14C18 13.4696 17.7893 12.9609 17.4142 12.5858C17.0391 12.2107 16.5304 12 16 12C15.4696 12 14.9609 12.2107 14.5858 12.5858C14.2107 12.9609 14 13.4696 14 14V21H10V14C10 12.4087 10.6321 10.8826 11.7574 9.75736C12.8826 8.63214 14.4087 8 16 8Z', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }),
      h('path', { d: 'M6 9H2V21H6V9Z', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }),
      h('circle', { cx: '4', cy: '4', r: '2', stroke: 'currentColor', 'stroke-width': '2' })
    ])
  },
  {
    name: 'Email',
    url: 'mailto:contact@clearup.com',
    icon: () => h('svg', { width: '24', height: '24', viewBox: '0 0 24 24', fill: 'none', xmlns: 'http://www.w3.org/2000/svg' }, [
      h('path', { d: 'M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }),
      h('polyline', { points: '22,6 12,13 2,6', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' })
    ])
  },
  {
    name: 'WhatsApp',
    url: 'https://wa.me/your-number',
    icon: () => h('svg', { width: '24', height: '24', viewBox: '0 0 24 24', fill: 'none', xmlns: 'http://www.w3.org/2000/svg' }, [
      h('path', { 
        'fill-rule': 'evenodd', 
        'clip-rule': 'evenodd', 
        d: 'M11.125 1.33325C5.7171 1.33325 1.33337 5.71698 1.33337 11.1249C1.33337 12.9755 1.84744 14.7087 2.74142 16.1853L1.868 19.1541C1.81785 19.3245 1.81455 19.5054 1.85845 19.6775C1.90234 19.8497 1.99181 20.0069 2.11745 20.1325C2.24309 20.2581 2.40026 20.3476 2.57243 20.3915C2.7446 20.4354 2.92542 20.4321 3.09587 20.382L6.06471 19.5085C7.59097 20.4318 9.34123 20.9189 11.125 20.9166C16.533 20.9166 20.9167 16.5329 20.9167 11.1249C20.9167 5.71698 16.533 1.33325 11.125 1.33325ZM8.91017 13.3408C10.891 15.3206 12.7818 15.5821 13.4496 15.6066C14.465 15.6438 15.4539 14.8683 15.8387 13.9684C15.8869 13.8564 15.9043 13.7335 15.8892 13.6125C15.874 13.4915 15.8269 13.3768 15.7526 13.2801C15.216 12.5946 14.4904 12.1021 13.7815 11.6125C13.6336 11.51 13.4516 11.4688 13.2739 11.4976C13.0962 11.5265 12.9367 11.6231 12.8288 11.7673L12.2413 12.6632C12.2102 12.7112 12.1621 12.7456 12.1067 12.7594C12.0512 12.7732 11.9926 12.7654 11.9426 12.7376C11.5441 12.5095 10.9635 12.1217 10.5464 11.7046C10.1292 11.2875 9.76498 10.7333 9.56033 10.3602C9.53558 10.3127 9.52858 10.2579 9.5406 10.2056C9.55263 10.1534 9.58289 10.1072 9.62594 10.0753L10.5307 9.40354C10.6602 9.29152 10.7438 9.13565 10.7655 8.96581C10.7871 8.79596 10.7454 8.62409 10.6482 8.48313C10.2095 7.84079 9.69839 7.02417 8.95717 6.48269C8.8613 6.41381 8.74928 6.37086 8.63194 6.358C8.5146 6.34513 8.39593 6.36279 8.28742 6.40925C7.38658 6.79504 6.60717 7.784 6.64437 8.80136C6.66885 9.46915 6.93029 11.3599 8.91017 13.3408Z', 
        fill: 'currentColor' 
      })
    ])
  }
]

const handleMenuClick = () => {
  isMenuOpen.value = !isMenuOpen.value
  // Prevent body scroll when menu is open
  if (isMenuOpen.value) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
}

const handleMenuItemClick = (item: typeof menuItems[0]) => {
  // Close menu first
  handleMenuClick()
  
  // If item has a route, navigate to it
  if ('route' in item && item.route) {
    router.push(item.href).then(() => {
      if (item.scrollTo && item.scrollTo !== 'top') {
        setTimeout(() => {
          scrollToSection(item.scrollTo)
        }, 300)
      }
    })
  } else if (route.name !== 'home') {
    // Navigate to home if not already there
    router.push('/').then(() => {
      setTimeout(() => {
        scrollToSection(item.scrollTo)
      }, 300)
    })
  } else {
    scrollToSection(item.scrollTo)
  }
}

const scrollToSection = (sectionId: string) => {
  if (sectionId === 'top') {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    return
  }

  // Wait a bit for page to be ready
  setTimeout(() => {
    // Try multiple selectors to find the section
    const element = document.querySelector(`[data-section-id="${sectionId}"]`) || 
                   document.querySelector(`#${sectionId}`) ||
                   document.querySelector(`.${sectionId}`) ||
                   document.querySelector(`[class*="${sectionId}"]`)
    
    if (element) {
      const headerOffset = 120 // Account for sticky navbar
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }, 150)
}

const handleLogoError = () => {
  logoError.value = true
}

const handleLogoClick = () => {
  if (isMenuOpen.value) {
    handleMenuClick()
  }
  router.push('/')
}
</script>

<style scoped>
:root {
  --naturel-black: #0B0B0F;
  --naturel-silver: #F5F7FA;
  --purple-dark: #5B2096;
  --purple-light: #C19DE6;
  --border-color: rgba(67, 24, 111, 0.70);
}

.navigation-bar {
  width: 100%;
  background: var(--naturel-black);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.nav-container {
  max-width: 1440px;
  margin: 0 auto;
  padding: 17px 49px 18px 63px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 120px;
  gap: 2rem;
}

.nav-logo {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.nav-logo:hover {
  opacity: 0.8;
}

.logo-image {
  width: 274px;
  height: 85px;
  object-fit: contain;
  display: block;
}

.logo-placeholder {
  color: var(--naturel-silver);
  font-size: 24px;
  font-weight: 600;
  font-family: 'Roboto', sans-serif;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 6px;
}

.menu-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 20px;
  border-radius: 4px;
  background: linear-gradient(90deg, #5B2096 0%, #C19DE6 100%);
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  height: 39px;
  min-width: 81px;
  box-shadow: none;
  position: relative;
}

.menu-button:hover {
  background: linear-gradient(90deg, #6B2FA6 0%, #D1ADF6 100%);
  transform: scale(1.02);
}

.menu-button:active {
  transform: scale(0.98);
  background: linear-gradient(90deg, #4B1086 0%, #B18DD6 100%);
}

.menu-button:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(193, 157, 230, 0.4);
}

.menu-button.menu-open {
  background: linear-gradient(90deg, #C19DE6 0%, #5B2096 100%);
}

.menu-text {
  color: #F5F7FA;
  text-align: center;
  font-family: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 1.2;
  letter-spacing: 0.01em;
}

.plus-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: opacity 0.2s ease;
  width: auto;
  height: auto;
}

.plus-button:hover {
  opacity: 0.8;
}

.plus-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  transition: transform 0.3s ease;
  display: block;
}

.plus-icon.rotated {
  transform: rotate(45deg);
}

/* Menu Overlay */
.menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: #0B0B0F;
  z-index: 9999;
  overflow-y: auto;
}

.menu-container {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Menu Header */
.menu-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 17px 49px 18px 63px;
  border-bottom: 1px solid rgba(91, 32, 150, 0.3);
}

.menu-logo {
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.menu-logo:hover {
  opacity: 0.8;
}

.menu-logo-image {
  width: 274px;
  height: 85px;
  object-fit: contain;
  display: block;
}

.menu-logo-placeholder {
  color: #F5F7FA;
  font-size: 24px;
  font-weight: 600;
  font-family: 'Roboto', sans-serif;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.menu-close-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: transparent;
  border: none;
  cursor: pointer;
  color: #F5F7FA;
  transition: opacity 0.2s ease;
  padding: 0;
}

.menu-close-button:hover {
  opacity: 0.7;
}

.menu-close-button svg {
  width: 24px;
  height: 24px;
}

/* Menu Content */
.menu-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  padding: 4rem 63px;
  flex: 1;
  align-items: start;
}

/* Menu Items */
.menu-items {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  text-decoration: none;
  color: #F5F7FA;
  transition: all 0.3s ease;
  cursor: pointer;
}

.menu-item:hover {
  transform: translateX(10px);
}

.menu-item:hover .menu-item-number {
  background: rgba(91, 32, 150, 0.3);
  border-color: #5B2096;
}

.menu-item-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  border: 1px solid rgba(245, 247, 250, 0.3);
  border-radius: 50%;
  font-size: 16px;
  font-weight: 500;
  color: #F5F7FA;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.menu-item-text {
  font-size: 48px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-family: 'Roboto', sans-serif;
  line-height: 1.2;
}

/* Contact Section */
.menu-contact {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  align-items: flex-start;
}

.contact-title {
  font-size: 24px;
  font-weight: 500;
  color: #F5F7FA;
  margin: 0;
  font-family: 'Roboto', sans-serif;
}

.social-icons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.social-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: rgba(245, 247, 250, 0.1);
  border-radius: 50%;
  color: #F5F7FA;
  text-decoration: none;
  transition: all 0.3s ease;
  cursor: pointer;
}

.social-icon:hover {
  background: rgba(91, 32, 150, 0.3);
  transform: scale(1.1);
  color: #C19DE6;
}

.social-icon svg {
  width: 24px;
  height: 24px;
}

/* Menu Transitions */
.menu-fade-enter-active,
.menu-fade-leave-active {
  transition: opacity 0.3s ease;
}

.menu-fade-enter-from,
.menu-fade-leave-to {
  opacity: 0;
}

.menu-fade-enter-active .menu-container,
.menu-fade-leave-active .menu-container {
  transition: transform 0.3s ease;
}

.menu-fade-enter-from .menu-container {
  transform: translateY(-20px);
}

.menu-fade-leave-to .menu-container {
  transform: translateY(-20px);
}

/* Responsive Design */
@media (max-width: 1024px) {
  .nav-container {
    padding: 17px 30px 18px 40px;
  }
  
  .logo-image {
    width: 200px;
    height: auto;
  }

  .menu-content {
    grid-template-columns: 1fr;
    gap: 3rem;
    padding: 3rem 40px;
  }

  .menu-header {
    padding: 17px 30px 18px 40px;
  }

  .menu-item-text {
    font-size: 36px;
  }
}

@media (max-width: 768px) {
  .nav-container {
    padding: 15px 20px 16px 24px;
    min-height: 80px;
  }
  
  .logo-image {
    width: 150px;
    height: auto;
  }
  
  .menu-text {
    font-size: 14px;
  }
  
  .plus-icon {
    width: 18px;
    height: 18px;
  }
  
  .menu-button {
    padding: 10px 18px;
    height: 39px;
    min-width: 75px;
  }
  
  .nav-actions {
    gap: 5px;
  }

  .menu-header {
    padding: 15px 20px 16px 24px;
  }

  .menu-logo-image {
    width: 150px;
    height: auto;
  }

  .menu-content {
    padding: 2rem 24px;
    gap: 2rem;
  }

  .menu-item-text {
    font-size: 28px;
  }

  .menu-item-number {
    width: 40px;
    height: 40px;
    font-size: 14px;
  }

  .contact-title {
    font-size: 20px;
  }

  .social-icon {
    width: 40px;
    height: 40px;
  }

  .social-icon svg {
    width: 20px;
    height: 20px;
  }
}

@media (max-width: 480px) {
  .nav-container {
    padding: 12px 16px 14px 20px;
    min-height: 70px;
  }
  
  .logo-image {
    width: 120px;
  }
  
  .menu-text {
    display: none;
  }
  
  .menu-button {
    padding: 10px 16px;
    height: 39px;
    min-width: 60px;
  }
  
  .nav-actions {
    gap: 4px;
  }
  
  .plus-icon {
    width: 16px;
    height: 16px;
  }

  .menu-header {
    padding: 12px 16px 14px 20px;
  }

  .menu-logo-image {
    width: 120px;
    height: auto;
  }

  .menu-content {
    padding: 1.5rem 20px;
    gap: 1.5rem;
  }

  .menu-item {
    gap: 1rem;
  }

  .menu-item-text {
    font-size: 24px;
  }

  .menu-item-number {
    width: 36px;
    height: 36px;
    font-size: 12px;
  }

  .contact-title {
    font-size: 18px;
  }

  .social-icon {
    width: 36px;
    height: 36px;
  }

  .social-icon svg {
    width: 18px;
    height: 18px;
  }
}

@media (max-width: 360px) {
  .nav-container {
    padding: 10px 12px 12px 16px;
    min-height: 60px;
  }
  
  .logo-image {
    width: 100px;
  }
  
  .menu-button {
    padding: 8px 12px;
    height: 36px;
    min-width: 50px;
  }
  
  .nav-actions {
    gap: 4px;
  }
  
  .plus-icon {
    width: 14px;
    height: 14px;
  }

  .menu-header {
    padding: 10px 12px 12px 16px;
  }

  .menu-logo-image {
    width: 100px;
    height: auto;
  }

  .menu-content {
    padding: 1rem 16px;
  }

  .menu-item-text {
    font-size: 20px;
  }

  .menu-item-number {
    width: 32px;
    height: 32px;
    font-size: 11px;
  }
}
</style>

