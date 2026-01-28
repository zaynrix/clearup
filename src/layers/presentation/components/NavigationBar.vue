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
          @click="handleMenuClick"
          :aria-label="isMenuOpen ? 'Close menu' : 'Open menu'"
        >
          <span class="menu-text">Menu</span>
          <svg 
            class="plus-icon"
            :class="{ 'rotated': isMenuOpen }"
            width="32" 
            height="32" 
            viewBox="0 0 32 32" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              fill-rule="evenodd" 
              clip-rule="evenodd" 
              d="M16 3.5C16.3978 3.5 16.7794 3.65804 17.0607 3.93934C17.342 4.22064 17.5 4.60218 17.5 5V14.5H27C27.3978 14.5 27.7794 14.658 28.0607 14.9393C28.342 15.2206 28.5 15.6022 28.5 16C28.5 16.3978 28.342 16.7794 28.0607 17.0607C27.7794 17.342 27.3978 17.5 27 17.5H17.5V27C17.5 27.3978 17.342 27.7794 17.0607 28.0607C16.7794 28.342 16.3978 28.5 16 28.5C15.6022 28.5 15.2206 28.342 14.9393 28.0607C14.658 27.7794 14.5 27.3978 14.5 27V17.5H5C4.60218 17.5 4.22064 17.342 3.93934 17.0607C3.65804 16.7794 3.5 16.3978 3.5 16C3.5 15.6022 3.65804 15.2206 3.93934 14.9393C4.22064 14.658 4.60218 14.5 5 14.5H14.5V5C14.5 4.60218 14.658 4.22064 14.9393 3.93934C15.2206 3.65804 15.6022 3.5 16 3.5Z" 
              fill="#F5F7FA"
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
  gap: 14px;
}

.menu-button {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 10px 20px;
  border-radius: 6px;
  background: linear-gradient(103deg, var(--purple-dark) 0.52%, var(--purple-light) 125.79%);
  border: none;
  cursor: pointer;
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.menu-button:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.menu-button:active {
  transform: translateY(0);
}

.menu-text {
  color: var(--naturel-silver);
  text-align: center;
  font-family: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
}

.plus-icon {
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  transition: transform 0.3s ease;
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
    width: 24px;
    height: 24px;
  }
  
  .menu-button {
    padding: 8px 16px;
    gap: 10px;
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
    padding: 10px;
    gap: 0;
  }
}
</style>

