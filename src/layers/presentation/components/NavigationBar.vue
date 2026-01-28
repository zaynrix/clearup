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
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isMenuOpen = ref(false)
const logoError = ref(false)

const handleMenuClick = () => {
  isMenuOpen.value = !isMenuOpen.value
  // Additional menu logic can be added here
  // For example: emit('menu-toggle', isMenuOpen.value)
}

const handleLogoError = () => {
  logoError.value = true
}

const handleLogoClick = () => {
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
  border-bottom: 1px solid var(--border-color);
  position: sticky;
  top: 0;
  z-index: 1000;
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

/* Responsive Design */
@media (max-width: 1024px) {
  .nav-container {
    padding: 17px 30px 18px 40px;
  }
  
  .logo-image {
    width: 200px;
    height: auto;
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
}
</style>

