<template>
  <div class="home-view">
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
    <div class="home-container">
      <!-- Hero Section -->
      <div v-if="!isSectionDisabled('hero')" class="hero-section">
        <h1 class="hero-headline">
          <span class="headline-white">{{ homeContent?.heroHeadlineWhite || 'Like Oxygen For' }}</span>
          <span class="headline-purple">{{ homeContent?.heroHeadlinePurple || 'Your Business' }}</span>
        </h1>
        
        <div class="supporting-text">
          <p v-for="(text, index) in (homeContent?.supportingText || ['Growing a business is hard and chaos', 'We make whole a lot easer', 'More systemized, more predictable, less stressful, more fun'])" :key="index">
            {{ text }}
          </p>
        </div>
      </div>

      <!-- CTA Section -->
      <div v-if="!isSectionDisabled('cta')" class="cta-section">
        <form @submit.prevent="handleSubmit" class="whatsapp-form">
          <input
            v-model="phoneNumber"
            type="tel"
            class="whatsapp-input"
            :placeholder="homeContent?.ctaPlaceholder || 'Enter whatsapp Number and we will send you some magic'"
            :disabled="isLoading"
            required
          />
          <button 
            type="submit" 
            class="cta-button"
            :disabled="isLoading"
          >
            <span>{{ homeContent?.ctaButtonText || 'Do it' }}</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </form>
        
        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
      </div>

      <!-- Social Proof -->
      <div v-if="!isSectionDisabled('social-proof')" class="social-proof">
        <span class="star">⭐</span>
        <span>{{ homeContent?.socialProofText || '4.8 client satisfaction from +20 founders' }}</span>
      </div>
    </div>

    <!-- Second Section -->
    <div v-if="!isSectionDisabled('who-we-are')" class="second-section">
      <div class="section-container">
        <!-- Header -->
        <div class="section-header">
          <h2 class="section-title">{{ homeContent?.whoWeAreTitle || 'Who We Are' }}</h2>
          <p class="section-description">{{ homeContent?.whoWeAreDescription || 'We redesign your marketing system to run it self' }}</p>
        </div>

        <!-- Statistics Cards -->
        <div v-if="!isSectionDisabled('stats')" class="stats-grid">
          <div class="stat-card">
            <h3 class="stat-title">{{ homeContent?.stats?.revenue?.title || 'Revenue generated' }}</h3>
            <div class="stat-value">{{ homeContent?.stats?.revenue?.value || '$4.7M' }}</div>
            <p class="stat-description">{{ homeContent?.stats?.revenue?.description || 'we let our number do talking , $4.7M in reported client revenue and counting' }}</p>
          </div>

          <div class="stat-card">
            <h3 class="stat-title">{{ homeContent?.stats?.leads?.title || 'Leads generated' }}</h3>
            <div class="stat-value">{{ homeContent?.stats?.leads?.value || '1.2M' }}</div>
            <p class="stat-description">{{ homeContent?.stats?.leads?.description || 'More 1.2M leads inquires about our client\'s services' }}</p>
          </div>

          <div class="stat-card">
            <h3 class="stat-title">{{ homeContent?.stats?.reach?.title || 'Our reach' }}</h3>
            <div class="stat-value">{{ homeContent?.stats?.reach?.value || '28' }}</div>
            <p class="stat-description">{{ homeContent?.stats?.reach?.description || 'Serving client over 28 different country' }}</p>
          </div>
        </div>

        <!-- Video Section -->
        <div v-if="homeContent?.videoUrl || homeContent?.videoFileUrl" class="video-section">
          <div class="video-container">
            <!-- Video from Link (YouTube, Vimeo, etc.) -->
            <iframe 
              v-if="homeContent.videoType === 'link' && homeContent.videoUrl"
              :src="getVideoEmbedUrl(homeContent.videoUrl)"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
              class="video-iframe"
            ></iframe>
            
            <!-- Uploaded Video File -->
            <video 
              v-else-if="homeContent.videoType === 'upload' && homeContent.videoFileUrl"
              :src="homeContent.videoFileUrl"
              controls
              class="video-player"
            >
              Your browser does not support the video tag.
            </video>
            
            <!-- Fallback if videoType is not set but URL exists -->
            <iframe 
              v-else-if="homeContent.videoUrl && !homeContent.videoFileUrl"
              :src="getVideoEmbedUrl(homeContent.videoUrl)"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
              class="video-iframe"
            ></iframe>
            
            <video 
              v-else-if="homeContent.videoFileUrl && !homeContent.videoUrl"
              :src="homeContent.videoFileUrl"
              controls
              class="video-player"
            >
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
        <div v-else class="video-section">
          <div class="video-placeholder">
            <span class="video-text">Video</span>
          </div>
        </div>

        <!-- Call to Action -->
        <div class="section-cta">
          <button class="book-meeting-button" @click="handleBookMeeting">
            Book a Meeting
          </button>
          <a href="https://wa.me/your-number" class="whatsapp-link" aria-label="Contact us on WhatsApp">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M11.125 1.33325C5.7171 1.33325 1.33337 5.71698 1.33337 11.1249C1.33337 12.9755 1.84744 14.7087 2.74142 16.1853L1.868 19.1541C1.81785 19.3245 1.81455 19.5054 1.85845 19.6775C1.90234 19.8497 1.99181 20.0069 2.11745 20.1325C2.24309 20.2581 2.40026 20.3476 2.57243 20.3915C2.7446 20.4354 2.92542 20.4321 3.09587 20.382L6.06471 19.5085C7.59097 20.4318 9.34123 20.9189 11.125 20.9166C16.533 20.9166 20.9167 16.5329 20.9167 11.1249C20.9167 5.71698 16.533 1.33325 11.125 1.33325ZM8.91017 13.3408C10.891 15.3206 12.7818 15.5821 13.4496 15.6066C14.465 15.6438 15.4539 14.8683 15.8387 13.9684C15.8869 13.8564 15.9043 13.7335 15.8892 13.6125C15.874 13.4915 15.8269 13.3768 15.7526 13.2801C15.216 12.5946 14.4904 12.1021 13.7815 11.6125C13.6336 11.51 13.4516 11.4688 13.2739 11.4976C13.0962 11.5265 12.9367 11.6231 12.8288 11.7673L12.2413 12.6632C12.2102 12.7112 12.1621 12.7456 12.1067 12.7594C12.0512 12.7732 11.9926 12.7654 11.9426 12.7376C11.5441 12.5095 10.9635 12.1217 10.5464 11.7046C10.1292 11.2875 9.76498 10.7333 9.56033 10.3602C9.53558 10.3127 9.52858 10.2579 9.5406 10.2056C9.55263 10.1534 9.58289 10.1072 9.62594 10.0753L10.5307 9.40354C10.6602 9.29152 10.7438 9.13565 10.7655 8.96581C10.7871 8.79596 10.7454 8.62409 10.6482 8.48313C10.2095 7.84079 9.69839 7.02417 8.95717 6.48269C8.8613 6.41381 8.74928 6.37086 8.63194 6.358C8.5146 6.34513 8.39593 6.36279 8.28742 6.40925C7.38658 6.79504 6.60717 7.784 6.64437 8.80136C6.66885 9.46915 6.93029 11.3599 8.91017 13.3408Z" fill="white"/>
            </svg>
          </a>
        </div>
      </div>
    </div>

    <!-- Third Section -->
    <div v-if="!isSectionDisabled('system')" class="third-section">
      <!-- Vector shapes for this section -->
      <div class="third-section-vector third-section-vector-left"></div>
      
      <div class="third-section-container">
        <!-- Header -->
        <div class="third-section-header">
          <h2 class="third-section-title">The Clear up System™</h2>
          <p class="third-section-description">An exclusive done-for-you marketing infrastructure built for predictable growth.</p>
        </div>

        <!-- System Card -->
        <div class="system-card">
          <h3 class="system-card-title">Done-for-you Clear Up System</h3>
          <p class="system-card-text">We don't sell random services.</p>
          <p class="system-card-text">We install a complete marketing system that works as one engine scalable , predictable , and built</p>
          <p class="system-card-text">to grow with your business.</p>
          <p class="system-card-roi">TURN EVERY $1 INTO $3893 IN REVENUE OUR SYSTEM IS BUILT TO MAXIMIZE ROI , NOT JUST SPEND YOUR BUDGET</p>
        </div>

        <!-- Our Services -->
        <div v-if="!isSectionDisabled('services')" class="services-section">
          <div class="services-header">
            <h3 class="services-title">Our Services</h3>
            <p class="services-description">Who is Nextcent suitable for?</p>
          </div>
          <div class="services-grid">
            <div class="service-card">
              <div class="service-icon">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11.192 21.258L6.808 18.754C6.56533 18.6207 6.37 18.4273 6.222 18.174C6.074 17.918 6 17.6427 6 17.348V12.342C6 12.0487 6.074 11.7747 6.222 11.52C6.37 11.2653 6.56533 11.072 6.808 10.94L11.192 8.43401C11.432 8.29401 11.6993 8.22401 11.994 8.22401C12.2873 8.22401 12.5587 8.29401 12.808 8.43401L17.192 10.94C17.4347 11.0733 17.63 11.2673 17.778 11.522C17.926 11.7767 18 12.05 18 12.342V17.35C18 17.6433 17.926 17.9173 17.778 18.172C17.63 18.4267 17.4347 18.6207 17.192 18.754L12.808 21.258C12.568 21.3993 12.3007 21.47 12.006 21.47C11.7127 21.47 11.4413 21.3993 11.192 21.258ZM32.54 27V19.554L36.386 21.812C36.898 22.1053 37.2953 22.492 37.578 22.972C37.8607 23.452 38.002 23.9847 38.002 24.57V33.738C38.002 34.3247 37.8607 34.858 37.578 35.338C37.2953 35.818 36.898 36.204 36.386 36.496L28.618 41.032C28.1047 41.3213 27.564 41.466 26.996 41.466C26.428 41.466 25.8913 41.3213 25.386 41.032L17.618 36.496C17.106 36.2027 16.7087 35.816 16.426 35.336C16.1433 34.856 16.0013 34.324 16 33.74V24.572C16 23.9853 16.1413 23.452 16.424 22.972C16.7067 22.492 17.104 22.1053 17.616 21.812L21.462 19.556V27C21.462 28.5507 21.9973 29.8613 23.068 30.932C24.14 32.0027 25.452 32.538 27.004 32.538C28.556 32.538 29.866 32.0027 30.934 30.932C32.002 29.8613 32.5367 28.5507 32.538 27M28 16V27C28 27.284 27.904 27.5213 27.712 27.712C27.52 27.9027 27.282 27.9987 26.998 28C26.714 28.0013 26.4767 27.9053 26.286 27.712C26.0953 27.5187 26 27.2813 26 27V7.61601C26 7.15868 26.1547 6.77468 26.464 6.46401C26.7733 6.15334 27.1573 5.99868 27.616 6.00001H38.982C39.6153 6.00001 40.09 6.28601 40.406 6.85801C40.7233 7.43001 40.6993 7.98534 40.334 8.52401L39.288 10.092C39.1067 10.3653 39.016 10.6653 39.016 10.992C39.016 11.3187 39.1067 11.624 39.288 11.908L40.334 13.478C40.698 14.0153 40.722 14.57 40.406 15.142C40.09 15.714 39.6153 16 38.982 16H28Z" fill="#43186F"/>
                </svg>
              </div>
              <h4 class="service-name">Strategic marketing system</h4>
              <p class="service-desc">A full-funnel marketing system built to consistently generate leads and convert them into sales.</p>
            </div>

            <div class="service-card">
              <div class="service-icon">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M26 16H42C43.2 16 44 15.2 44 14C44 12.8 43.2 12 42 12H26C24.8 12 24 12.8 24 14C24 15.2 24.8 16 26 16ZM42 20H26C24.8 20 24 20.8 24 22C24 23.2 24.8 24 26 24H42C43.2 24 44 23.2 44 22C44 20.8 43.2 20 42 20ZM6 24H18C19.2 24 20 23.2 20 22V10C20 8.8 19.2 8 18 8H6C4.8 8 4 8.8 4 10V22C4 23.2 4.8 24 6 24ZM42 28H6C4.8 28 4 28.8 4 30C4 31.2 4.8 32 6 32H42C43.2 32 44 31.2 44 30C44 28.8 43.2 28 42 28ZM26 36H6C4.8 36 4 36.8 4 38C4 39.2 4.8 40 6 40H26C27.2 40 28 39.2 28 38C28 36.8 27.2 36 26 36Z" fill="#43186F"/>
                </svg>
              </div>
              <h4 class="service-name">Content Marketing System</h4>
              <p class="service-desc">A done-for-you content system that reflects your brand voice and makes your business unforgettable.</p>
            </div>

            <div class="service-card">
              <div class="service-icon">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clip-path="url(#clip0)">
                    <path d="M15 7.5C15 9.48912 14.2098 11.3968 12.8033 12.8033C11.3968 14.2098 9.48912 15 7.5 15C5.51088 15 3.60322 14.2098 2.1967 12.8033C0.790176 11.3968 0 9.48912 0 7.5C0 5.51088 0.790176 3.60322 2.1967 2.1967C3.60322 0.790176 5.51088 0 7.5 0C9.48912 0 11.3968 0.790176 12.8033 2.1967C14.2098 3.60322 15 5.51088 15 7.5Z" fill="#43186F"/>
                    <path d="M22.5 15C20.5109 15 18.6032 14.2098 17.1967 12.8033C15.7902 11.3968 15 9.48912 15 7.5C15 5.51088 15.7902 3.60322 17.1967 2.1967C18.6032 0.790176 20.5109 0 22.5 0C24.4891 0 26.3968 0.790176 27.8033 2.1967C29.2098 3.60322 30 5.51088 30 7.5C30 9.48912 29.2098 11.3968 27.8033 12.8033C26.3968 14.2098 24.4891 15 22.5 15Z" fill="#43186F"/>
                    <path d="M22.5 15H23.75C24.9627 14.9999 26.1342 15.4405 27.0462 16.2398C27.9582 17.0392 28.5486 18.1427 28.7075 19.345L36.4825 15.89C36.8631 15.7204 37.28 15.6487 37.6953 15.6812C38.1107 15.7138 38.5113 15.8496 38.8608 16.0764C39.2103 16.3032 39.4976 16.6137 39.6966 16.9798C39.8955 17.3459 39.9998 17.7559 40 18.1725V36.8275C39.9996 37.2438 39.8953 37.6534 39.6965 38.0192C39.4977 38.385 39.2107 38.6953 38.8615 38.922C38.5124 39.1488 38.1121 39.2847 37.6971 39.3175C37.2821 39.3504 36.8655 39.279 36.485 39.11L28.7075 35.655C28.5486 36.8573 27.9582 37.9608 27.0462 38.7602C26.1342 39.5595 24.9627 40.0001 23.75 40H5C3.67392 40 2.40215 39.4732 1.46447 38.5355C0.526784 37.5979 0 36.3261 0 35V20C0 18.6739 0.526784 17.4021 1.46447 16.4645C2.40215 15.5268 3.67392 15 5 15H22.5Z" fill="#43186F"/>
                  </g>
                  <defs>
                    <clipPath id="clip0">
                      <rect width="40" height="40" fill="white"/>
                    </clipPath>
                  </defs>
                </svg>
              </div>
              <h4 class="service-name">Reel Creator System</h4>
              <p class="service-desc">High-impact reel creation designed to boost brand influence and reach your ideal audience</p>
            </div>

            <div class="service-card">
              <div class="service-icon">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M42 20.126V8C42 7.46957 41.7893 6.96086 41.4142 6.58579C41.0391 6.21071 40.5304 6 40 6H38C34.042 9.958 26.606 12.174 22 13.226V34.774C26.606 35.826 34.042 38.042 38 42H40C40.5304 42 41.0391 41.7893 41.4142 41.4142C41.7893 41.0391 42 40.5304 42 40V27.874C42.8595 27.653 43.6211 27.1524 44.165 26.4511C44.7088 25.7498 45.0039 24.8875 45.0039 24C45.0039 23.1125 44.7088 22.2502 44.165 21.5489C43.6211 20.8476 42.8595 20.347 42 20.126ZM10 14C8.93913 14 7.92172 14.4214 7.17157 15.1716C6.42143 15.9217 6 16.9391 6 18V30C6 31.0609 6.42143 32.0783 7.17157 32.8284C7.92172 33.5786 8.93913 34 10 34H12L14 44H18V14H10Z" fill="#43186F"/>
                </svg>
              </div>
              <h4 class="service-name">Advertising system</h4>
              <p class="service-desc">Done-for-you advertising across major platforms to reach billions of active users and drive results.</p>
            </div>

            <div class="service-card">
              <div class="service-icon">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clip-path="url(#clip1)">
                    <path d="M46.66 25.3V27.3C46.6694 27.7679 46.5145 28.2243 46.2221 28.5897C45.9298 28.9552 45.5186 29.2065 45.06 29.3L42.58 29.8C42.1077 31.7904 41.3104 33.6892 40.22 35.42L41.64 37.54C41.8814 37.9176 41.989 38.3654 41.9455 38.8115C41.902 39.2576 41.7099 39.6762 41.4 40L38.66 42.74C38.3321 43.0645 37.9021 43.2657 37.4428 43.3094C36.9835 43.3532 36.5233 43.2368 36.14 42.98L34 41.54C32.2819 42.6634 30.3896 43.4946 28.4 44L28 46.38C27.9065 46.8386 27.6552 47.2498 27.2897 47.5421C26.9243 47.8345 26.4679 47.9894 26 47.98H22C21.5321 47.9894 21.0757 47.8345 20.7103 47.5421C20.3448 47.2498 20.0935 46.8386 20 46.38L19.6 44C17.6104 43.4946 15.7181 42.6634 14 41.54L11.88 42.96C11.4967 43.2168 11.0365 43.3332 10.5772 43.2894C10.1179 43.2457 9.68791 43.0445 9.36 42.72L6.6 40C6.27549 39.6721 6.07432 39.2421 6.03058 38.7828C5.98684 38.3235 6.10322 37.8633 6.36 37.48L7.78 35.36C6.68964 33.6292 5.89227 31.7304 5.42 29.74L2.94 29.24C2.48145 29.1465 2.07021 28.8952 1.77786 28.5297C1.48551 28.1643 1.33056 27.7079 1.34 27.24V25.24H14.46C14.46 27.7702 15.4651 30.1967 17.2542 31.9858C19.0433 33.7749 21.4698 34.78 24 34.78C26.5302 34.78 28.9567 33.7749 30.7458 31.9858C32.5349 30.1967 33.54 27.7702 33.54 25.24L46.66 25.3ZM34.34 7.62C34.34 8.8506 34.8289 10.0308 35.699 10.901C36.5692 11.7711 37.7494 12.26 38.98 12.26C40.2106 12.26 41.3908 11.7711 42.261 10.901C43.1311 10.0308 43.62 8.8506 43.62 7.62C43.62 6.3894 43.1311 5.20919 42.261 4.33902C41.3908 3.46886 40.2106 2.98 38.98 2.98C37.7494 2.98 36.5692 3.46886 35.699 4.33902C34.8289 5.20919 34.34 6.3894 34.34 7.62ZM4.4 7.62C4.4 8.8506 4.88886 10.0308 5.75902 10.901C6.62919 11.7711 7.8094 12.26 9.04 12.26C10.2706 12.26 11.4508 11.7711 12.321 10.901C13.1911 10.0308 13.68 8.8506 13.68 7.62C13.68 6.3894 13.1911 5.20919 12.321 4.33902C11.4508 3.46886 10.2706 2.98 9.04 2.98C7.8094 2.98 6.62919 3.46886 5.75902 4.33902C4.88886 5.20919 4.4 6.3894 4.4 7.62ZM13.6 17.6C12.8824 17.1437 12.1095 16.7807 11.3 16.52C9.15578 15.9174 6.87056 16.0601 4.81795 16.9248C2.76535 17.7894 1.0668 19.3248 0 21.28H11.46C12.0527 19.987 12.7694 18.7546 13.6 17.6ZM36.36 21.34H48C46.9386 19.3734 45.2394 17.8266 43.182 16.9542C41.1246 16.0818 38.8315 15.9357 36.68 16.54C35.8557 16.8039 35.0691 17.1736 34.34 17.64C35.1252 18.8089 35.8013 20.0474 36.36 21.34ZM34.14 21.34C33.3415 19.2665 31.9583 17.4692 30.1584 16.1664C28.3585 14.8635 26.2192 14.1109 24 14C21.7625 14.0986 19.6022 14.8472 17.7835 16.1544C15.9648 17.4616 14.5666 19.2706 13.76 21.36L34.14 21.34ZM17.98 5.82C17.98 7.36356 18.5932 8.8439 19.6846 9.93536C20.7761 11.0268 22.2564 11.64 23.8 11.64C25.3436 11.64 26.8239 11.0268 27.9154 9.93536C29.0068 8.8439 29.62 7.36356 29.62 5.82C29.62 4.27644 29.0068 2.7961 27.9154 1.70464C26.8239 0.613177 25.3436 0 23.8 0C22.2564 0 20.7761 0.613177 19.6846 1.70464C18.5932 2.7961 17.98 4.27644 17.98 5.82Z" fill="#43186F"/>
                  </g>
                  <defs>
                    <clipPath id="clip1">
                      <rect width="48" height="48" fill="white"/>
                    </clipPath>
                  </defs>
                </svg>
              </div>
              <h4 class="service-name">Community Management System</h4>
              <p class="service-desc">An omnichannel system that helps you connect with customers through WhatsApp, SMS, email, and more.</p>
            </div>

            <div class="service-card">
              <div class="service-icon">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M6 12C6 10.4087 6.63214 8.88258 7.75736 7.75736C8.88258 6.63214 10.4087 6 12 6H36C37.5913 6 39.1174 6.63214 40.2426 7.75736C41.3679 8.88258 42 10.4087 42 12V36C42 37.5913 41.3679 39.1174 40.2426 40.2426C39.1174 41.3679 37.5913 42 36 42H12C10.4087 42 8.88258 41.3679 7.75736 40.2426C6.63214 39.1174 6 37.5913 6 36V12ZM26 16C26 15.4696 25.7893 14.9609 25.4142 14.5858C25.0391 14.2107 24.5304 14 24 14C23.4696 14 22.9609 14.2107 22.5858 14.5858C22.2107 14.9609 22 15.4696 22 16V32C22 32.5304 22.2107 33.0391 22.5858 33.4142C22.9609 33.7893 23.4696 34 24 34C24.5304 34 25.0391 33.7893 25.4142 33.4142C25.7893 33.0391 26 32.5304 26 32V16ZM18 22C18 21.4696 17.7893 20.9609 17.4142 20.5858C17.0391 20.2107 16.5304 20 16 20C15.4696 20 14.9609 20.2107 14.5858 20.5858C14.2107 20.9609 14 21.4696 14 22V32C14 32.5304 14.2107 33.0391 14.5858 33.4142C14.9609 33.7893 15.4696 34 16 34C16.5304 34 17.0391 33.7893 17.4142 33.4142C17.7893 33.0391 18 32.5304 18 32V22ZM34 28C34 27.4696 33.7893 26.9609 33.4142 26.5858C33.0391 26.2107 32.5304 26 32 26C31.4696 26 30.9609 26.2107 30.5858 26.5858C30.2107 26.9609 30 27.4696 30 28V32C30 32.5304 30.2107 33.0391 30.5858 33.4142C30.9609 33.7893 31.4696 34 32 34C32.5304 34 33.0391 33.7893 33.4142 33.4142C33.7893 33.0391 34 32.5304 34 32V28Z" fill="#43186F"/>
                </svg>
              </div>
              <h4 class="service-name">Data Analytics System</h4>
              <p class="service-desc">Custom dashboards that turn marketing and sales data into clear, actionable insights.</p>
            </div>
          </div>
        </div>

        <!-- What We Do -->
        <div v-if="!isSectionDisabled('what-we-do')" class="what-we-do-section">
          <h3 class="what-we-do-title">What We Do</h3>
          <div class="steps-grid">
            <div class="step-card">
              <div class="step-card-header">
                <div class="step-header">Step 1</div>
              </div>
              <div class="step-card-body">
                <div class="step-content">Identify and lock in your most profitable market</div>
              </div>
            </div>
            <div class="step-card">
              <div class="step-card-header">
                <div class="step-header">Step 2</div>
              </div>
              <div class="step-card-body">
                <div class="step-content">Craft a message that makes buyers say :"This is exactly for me"</div>
              </div>
            </div>
            <div class="step-card">
              <div class="step-card-header">
                <div class="step-header">Step 3</div>
              </div>
              <div class="step-card-body">
                <div class="step-content">Choose only ROI-driven channels (no wasted platforms)</div>
              </div>
            </div>
            <div class="step-card">
              <div class="step-card-header">
                <div class="step-header">Step 4</div>
              </div>
              <div class="step-card-body">
                <div class="step-content">Build an always-on lead pipeline</div>
              </div>
            </div>
            <div class="step-card">
              <div class="step-card-header">
                <div class="step-header">Step 5</div>
              </div>
              <div class="step-card-body">
                <div class="step-content">Engineer the journey from visitor > buyer > loyal fan</div>
              </div>
            </div>
            <div class="step-card">
              <div class="step-card-header">
                <div class="step-header">Step 6</div>
              </div>
              <div class="step-card-body">
                <div class="step-content">Ausales, follow-ups, retention, and referrals</div>
              </div>
            </div>
            <div class="step-card">
              <div class="step-card-header">
                <div class="step-header">Step 7</div>
              </div>
              <div class="step-card-body">
                <div class="step-content">Analysis and reporting</div>
              </div>
            </div>
          </div>
        </div>

        <!-- What You Get -->
        <div v-if="!isSectionDisabled('what-you-get')" class="what-you-get-section">
          <h3 class="what-you-get-title">What You Get</h3>
          <div class="benefits-grid">
            <div class="benefit-item">
              <div class="benefit-check">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M21.546 5.11101C21.8272 5.3923 21.9852 5.77376 21.9852 6.17151C21.9852 6.56925 21.8272 6.95071 21.546 7.23201L10.303 18.475C10.1544 18.6236 9.97805 18.7415 9.7839 18.8219C9.58976 18.9024 9.38167 18.9438 9.17153 18.9438C8.96138 18.9438 8.75329 18.9024 8.55915 18.8219C8.365 18.7415 8.1886 18.6236 8.04003 18.475L2.45403 12.89C2.31076 12.7516 2.19649 12.5861 2.11787 12.4031C2.03926 12.2201 1.99788 12.0233 1.99615 11.8241C1.99442 11.6249 2.03237 11.4274 2.10779 11.2431C2.18322 11.0587 2.29459 10.8913 2.43543 10.7504C2.57627 10.6096 2.74375 10.4982 2.92809 10.4228C3.11244 10.3474 3.30996 10.3094 3.50913 10.3111C3.7083 10.3129 3.90513 10.3542 4.08813 10.4329C4.27114 10.5115 4.43666 10.6257 4.57503 10.769L9.17103 15.365L19.424 5.11101C19.5633 4.97162 19.7287 4.86104 19.9108 4.7856C20.0928 4.71016 20.288 4.67133 20.485 4.67133C20.6821 4.67133 20.8772 4.71016 21.0593 4.7856C21.2413 4.86104 21.4067 4.97162 21.546 5.11101Z" fill="white"/>
                </svg>
              </div>
              <span class="benefit-text">Predictable leads</span>
            </div>
            <div class="benefit-item">
              <div class="benefit-check">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M21.546 5.11101C21.8272 5.3923 21.9852 5.77376 21.9852 6.17151C21.9852 6.56925 21.8272 6.95071 21.546 7.23201L10.303 18.475C10.1544 18.6236 9.97805 18.7415 9.7839 18.8219C9.58976 18.9024 9.38167 18.9438 9.17153 18.9438C8.96138 18.9438 8.75329 18.9024 8.55915 18.8219C8.365 18.7415 8.1886 18.6236 8.04003 18.475L2.45403 12.89C2.31076 12.7516 2.19649 12.5861 2.11787 12.4031C2.03926 12.2201 1.99788 12.0233 1.99615 11.8241C1.99442 11.6249 2.03237 11.4274 2.10779 11.2431C2.18322 11.0587 2.29459 10.8913 2.43543 10.7504C2.57627 10.6096 2.74375 10.4982 2.92809 10.4228C3.11244 10.3474 3.30996 10.3094 3.50913 10.3111C3.7083 10.3129 3.90513 10.3542 4.08813 10.4329C4.27114 10.5115 4.43666 10.6257 4.57503 10.769L9.17103 15.365L19.424 5.11101C19.5633 4.97162 19.7287 4.86104 19.9108 4.7856C20.0928 4.71016 20.288 4.67133 20.485 4.67133C20.6821 4.67133 20.8772 4.71016 21.0593 4.7856C21.2413 4.86104 21.4067 4.97162 21.546 5.11101Z" fill="white"/>
                </svg>
              </div>
              <span class="benefit-text">Shorter sales cycles</span>
            </div>
            <div class="benefit-item">
              <div class="benefit-check">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M21.546 5.11101C21.8272 5.3923 21.9852 5.77376 21.9852 6.17151C21.9852 6.56925 21.8272 6.95071 21.546 7.23201L10.303 18.475C10.1544 18.6236 9.97805 18.7415 9.7839 18.8219C9.58976 18.9024 9.38167 18.9438 9.17153 18.9438C8.96138 18.9438 8.75329 18.9024 8.55915 18.8219C8.365 18.7415 8.1886 18.6236 8.04003 18.475L2.45403 12.89C2.31076 12.7516 2.19649 12.5861 2.11787 12.4031C2.03926 12.2201 1.99788 12.0233 1.99615 11.8241C1.99442 11.6249 2.03237 11.4274 2.10779 11.2431C2.18322 11.0587 2.29459 10.8913 2.43543 10.7504C2.57627 10.6096 2.74375 10.4982 2.92809 10.4228C3.11244 10.3474 3.30996 10.3094 3.50913 10.3111C3.7083 10.3129 3.90513 10.3542 4.08813 10.4329C4.27114 10.5115 4.43666 10.6257 4.57503 10.769L9.17103 15.365L19.424 5.11101C19.5633 4.97162 19.7287 4.86104 19.9108 4.7856C20.0928 4.71016 20.288 4.67133 20.485 4.67133C20.6821 4.67133 20.8772 4.71016 21.0593 4.7856C21.2413 4.86104 21.4067 4.97162 21.546 5.11101Z" fill="white"/>
                </svg>
              </div>
              <span class="benefit-text">Higher customer lifetime value</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bonuses Included Section -->
    <div v-if="!isSectionDisabled('bonuses')" class="bonuses-section">
      <div class="bonuses-container">
        <h2 class="bonuses-title">Bonuses Included</h2>
        <div class="bonuses-list">
          <div class="bonus-item">
            <div class="bonus-icon">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="8" y="6" width="32" height="36" rx="2" stroke="white" stroke-width="2" fill="none"/>
                <rect x="12" y="10" width="12" height="14" rx="1" stroke="white" stroke-width="2" fill="none"/>
                <line x1="12" y1="28" x2="36" y2="28" stroke="white" stroke-width="2" stroke-linecap="round"/>
                <line x1="12" y1="32" x2="28" y2="32" stroke="white" stroke-width="2" stroke-linecap="round"/>
                <line x1="12" y1="36" x2="32" y2="36" stroke="white" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </div>
            <p class="bonus-text">Full access to personal brand system</p>
          </div>
          <div class="bonus-item">
            <div class="bonus-icon">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="10" y="28" width="28" height="12" rx="2" stroke="white" stroke-width="2" fill="none"/>
                <circle cx="24" cy="20" r="6" stroke="white" stroke-width="2" fill="none"/>
                <path d="M12 34L8 38M36 34L40 38" stroke="white" stroke-width="2" stroke-linecap="round"/>
                <line x1="18" y1="20" x2="18" y2="12" stroke="white" stroke-width="2" stroke-linecap="round"/>
                <line x1="30" y1="20" x2="30" y2="12" stroke="white" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </div>
            <p class="bonus-text">Full access to leadership workshops</p>
          </div>
          <div class="bonus-item">
            <div class="bonus-icon">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="8" y="6" width="32" height="36" rx="2" stroke="white" stroke-width="2" fill="none"/>
                <line x1="14" y1="14" x2="34" y2="14" stroke="white" stroke-width="2" stroke-linecap="round"/>
                <line x1="14" y1="20" x2="34" y2="20" stroke="white" stroke-width="2" stroke-linecap="round"/>
                <line x1="14" y1="26" x2="28" y2="26" stroke="white" stroke-width="2" stroke-linecap="round"/>
                <line x1="14" y1="32" x2="30" y2="32" stroke="white" stroke-width="2" stroke-linecap="round"/>
                <line x1="14" y1="38" x2="26" y2="38" stroke="white" stroke-width="2" stroke-linecap="round"/>
                <line x1="12" y1="10" x2="12" y2="38" stroke="white" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </div>
            <p class="bonus-text">Full access to business coaching</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Our Clients Section -->
    <div v-if="!isSectionDisabled('clients')" class="clients-section">
      <div class="clients-container">
        <h2 class="clients-title">Our Clients</h2>
        <p class="clients-subtitle">We have been working with some Fortune +30 clients</p>
        <div class="clients-slider-wrapper">
          <div class="clients-slider-track">
            <!-- First set of logos -->
            <div class="client-logo">
              <img src="/images/logos/clients1.png" alt="Client 1" />
            </div>
            <div class="client-logo">
              <img src="/images/logos/clients2.png" alt="Client 2" />
            </div>
            <div class="client-logo">
              <img src="/images/logos/clients3.png" alt="Client 3" />
            </div>
            <div class="client-logo">
              <img src="/images/logos/clients4.png" alt="Client 4" />
            </div>
            <div class="client-logo">
              <img src="/images/logos/clients5.png" alt="Client 5" />
            </div>
            <div class="client-logo">
              <img src="/images/logos/clients6.png" alt="Client 6" />
            </div>
            <!-- Duplicate set for seamless loop -->
            <div class="client-logo">
              <img src="/images/logos/clients1.png" alt="Client 1" />
            </div>
            <div class="client-logo">
              <img src="/images/logos/clients2.png" alt="Client 2" />
            </div>
            <div class="client-logo">
              <img src="/images/logos/clients3.png" alt="Client 3" />
            </div>
            <div class="client-logo">
              <img src="/images/logos/clients4.png" alt="Client 4" />
            </div>
            <div class="client-logo">
              <img src="/images/logos/clients5.png" alt="Client 5" />
            </div>
            <div class="client-logo">
              <img src="/images/logos/clients6.png" alt="Client 6" />
            </div>
            <!-- Third set for ultra-smooth infinite scroll -->
            <div class="client-logo">
              <img src="/images/logos/clients1.png" alt="Client 1" />
            </div>
            <div class="client-logo">
              <img src="/images/logos/clients2.png" alt="Client 2" />
            </div>
            <div class="client-logo">
              <img src="/images/logos/clients3.png" alt="Client 3" />
            </div>
            <div class="client-logo">
              <img src="/images/logos/clients4.png" alt="Client 4" />
            </div>
            <div class="client-logo">
              <img src="/images/logos/clients5.png" alt="Client 5" />
            </div>
            <div class="client-logo">
              <img src="/images/logos/clients6.png" alt="Client 6" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Real Results, Real Impact Section -->
    <div v-if="!isSectionDisabled('real-results')" class="real-results-section">
      <div class="real-results-container">
        <!-- Section Header (Title and Subtitle) -->
        <div class="real-results-header">
          <h2 class="real-results-title">{{ homeContent?.realResultsTitle || 'Real Results, Real Impact.' }}</h2>
          <p class="real-results-subtitle">{{ homeContent?.realResultsSubtitle || 'We focus on measurable outcomes that help brands grow, scale, and stand out.' }}</p>
        </div>

        <!-- Multiple Real Results Cases/Containers -->
        <div v-if="homeContent?.realResultsCases && homeContent.realResultsCases.length > 0" class="real-results-cases">
          <div 
            v-for="(resultCase, caseIndex) in homeContent.realResultsCases" 
            :key="resultCase.id || caseIndex"
            class="real-results-case-container"
            @mouseenter="handleHeadlineHover(resultCase.id)"
            @mouseleave="handleHeadlineLeave"
          >
            <!-- Company Logo - Top Right -->
            <div v-if="resultCase.companyLogo || resultCase.companyLogoFileUrl" class="real-results-company-logo">
              <img 
                :src="resultCase.companyLogoFileUrl || resultCase.companyLogo" 
                alt="Company Logo"
                class="company-logo-img"
                @error="handleImageError"
              />
            </div>

            <!-- Main Heading - Centered -->
            <div v-if="resultCase.headline" class="real-results-headline-wrapper">
              <h2 class="real-results-headline">{{ resultCase.headline }}</h2>
            </div>

            <!-- Small Cards Grid - Inside Container -->
            <div v-if="resultCase.cards && resultCase.cards.length > 0" class="real-results-cards">
              <div 
                v-for="card in resultCase.cards" 
                :key="card.id" 
                class="real-results-card"
              >
                <div class="card-content">
                  <h3 class="card-title">{{ card.title }}</h3>
                  <div class="card-metric">{{ card.metric }}</div>
                  <p class="card-subtitle">{{ card.subtitle }}</p>
                </div>
              </div>
            </div>

            <!-- Action Button - Bottom Center -->
            <div v-if="resultCase.ctaText" class="real-results-cta">
              <a href="#" class="cta-link">
                {{ resultCase.ctaText }}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </a>
            </div>

            <!-- Company Images on Hover -->
            <div 
              v-if="resultCase.companyImages && resultCase.companyImages.length > 0" 
              class="headline-hover-images"
              :class="{ 'show': hoveredCaseId === resultCase.id }"
            >
              <div class="company-images-grid">
                <div 
                  v-for="(img, imgIndex) in resultCase.companyImages" 
                  :key="img.id || imgIndex"
                  class="company-image-item"
                >
                  <img 
                    v-if="img.imageFileUrl || img.imageUrl"
                    :src="img.imageFileUrl || img.imageUrl" 
                    :alt="`Company Image ${imgIndex + 1}`"
                    class="company-img"
                  />
                </div>
              </div>
            </div>
            <div 
              v-else
              class="headline-hover-placeholder"
              :class="{ 'show': hoveredCaseId === resultCase.id }"
            >
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 19V5C21 4.46957 20.7893 3.96086 20.4142 3.58579C20.0391 3.21071 19.5304 3 19 3H5C4.46957 3 3.96086 3.21071 3.58579 3.58579C3.21071 3.96086 3 4.46957 3 5V19C3 19.5304 3.21071 20.0391 3.58579 20.4142C3.96086 20.7893 4.46957 21 5 21H19C19.5304 21 20.0391 20.7893 20.4142 20.4142C20.7893 20.0391 21 19.5304 21 19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M8.5 10C9.32843 10 10 9.32843 10 8.5C10 7.67157 9.32843 7 8.5 7C7.67157 7 7 7.67157 7 8.5C7 9.32843 7.67157 10 8.5 10Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M21 15L16 10L5 21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <p>No images set</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- What Our Clients Say Section -->
    <div v-if="!isSectionDisabled('testimonials')" class="testimonials-section">
      <div class="testimonials-container">
        <div class="testimonials-header">
          <h2 class="testimonials-title">What Our Clients Say</h2>
          <p class="testimonials-subtitle">Real feedback from brands we've worked with.</p>
        </div>
        
        <div v-if="homeContent?.testimonials && homeContent.testimonials.length > 0" class="testimonials-grid">
          <div v-for="testimonial in homeContent.testimonials" :key="testimonial.id" class="testimonial-card">
            <div class="testimonial-header">
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
                  <span v-for="i in testimonial.stars" :key="i">⭐</span>
                  <span v-if="testimonial.stars < 5" class="star-empty" v-for="i in (5 - testimonial.stars)" :key="`empty-${i}`">☆</span>
                </div>
              </div>
            </div>
            <p class="testimonial-text">"{{ testimonial.review }}"</p>
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
                <div class="play-button">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 5V19L19 12L8 5Z" fill="white"/>
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

    <!-- Footer/Bottom Section -->
    <div v-if="!isSectionDisabled('footer')" class="footer-section">
      <div class="footer-container">
        <div class="footer-content">
          <div class="footer-brand">
            <div class="footer-logo">
              <svg width="120" height="32" viewBox="0 0 120 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <text x="0" y="24" font-family="Roboto, sans-serif" font-size="24" font-weight="700" fill="white">CLEAR UP</text>
                <path d="M100 8L112 16L100 24" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <p class="footer-tagline">Your creative digital partner for high-impact video ads and marketing content.</p>
            <div class="footer-social">
              <a href="#" class="social-icon" aria-label="Instagram">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2.163C8.678 2.163 8.25 2.175 7.05 2.225C5.85 2.275 4.95 2.475 4.15 2.775C3.35 3.075 2.65 3.475 2.05 4.075C1.45 4.675 1.05 5.375 0.75 6.175C0.45 6.975 0.25 7.875 0.2 9.075C0.15 10.275 0.138 10.703 0.138 14.025C0.138 17.347 0.15 17.775 0.2 18.975C0.25 20.175 0.45 21.075 0.75 21.875C1.05 22.675 1.45 23.375 2.05 23.975C2.65 24.575 3.35 24.975 4.15 25.275C4.95 25.575 5.85 25.775 7.05 25.825C8.25 25.875 8.678 25.887 12 25.887C15.322 25.887 15.75 25.875 16.95 25.825C18.15 25.775 19.05 25.575 19.85 25.275C20.65 24.975 21.35 24.575 21.95 23.975C22.55 23.375 22.95 22.675 23.25 21.875C23.55 21.075 23.75 20.175 23.8 18.975C23.85 17.775 23.862 17.347 23.862 14.025C23.862 10.703 23.85 10.275 23.8 9.075C23.75 7.875 23.55 6.975 23.25 6.175C22.95 5.375 22.55 4.675 21.95 4.075C21.35 3.475 20.65 3.075 19.85 2.775C19.05 2.475 18.15 2.275 16.95 2.225C15.75 2.175 15.322 2.163 12 2.163ZM12 4.163C15.25 4.163 15.638 4.175 16.813 4.225C17.988 4.275 18.638 4.475 19.063 4.65C19.638 4.9 20.05 5.175 20.5 5.625C20.95 6.075 21.225 6.487 21.475 7.062C21.65 7.487 21.85 8.137 21.9 9.312C21.95 10.487 21.962 10.875 21.962 14.125C21.962 17.375 21.95 17.763 21.9 18.938C21.85 20.113 21.65 20.763 21.475 21.188C21.225 21.763 20.95 22.175 20.5 22.625C20.05 23.075 19.638 23.35 19.063 23.6C18.638 23.775 17.988 23.975 16.813 24.025C15.638 24.075 15.25 24.087 12 24.087C8.75 24.087 8.362 24.075 7.187 24.025C6.012 23.975 5.362 23.775 4.937 23.6C4.362 23.35 3.95 23.075 3.5 22.625C3.05 22.175 2.775 21.763 2.525 21.188C2.35 20.763 2.15 20.113 2.1 18.938C2.05 17.763 2.038 17.375 2.038 14.125C2.038 10.875 2.05 10.487 2.1 9.312C2.15 8.137 2.35 7.487 2.525 7.062C2.775 6.487 3.05 6.075 3.5 5.625C3.95 5.175 4.362 4.9 4.937 4.65C5.362 4.475 6.012 4.275 7.187 4.225C8.362 4.175 8.75 4.163 12 4.163ZM12 7.163C9.239 7.163 7 9.402 7 12.163C7 14.924 9.239 17.163 12 17.163C14.761 17.163 17 14.924 17 12.163C17 9.402 14.761 7.163 12 7.163ZM12 15.163C10.343 15.163 9 13.82 9 12.163C9 10.506 10.343 9.163 12 9.163C13.657 9.163 15 10.506 15 12.163C15 13.82 13.657 15.163 12 15.163ZM17.5 6.663C17.5 7.215 17.052 7.663 16.5 7.663C15.948 7.663 15.5 7.215 15.5 6.663C15.5 6.111 15.948 5.663 16.5 5.663C17.052 5.663 17.5 6.111 17.5 6.663Z" fill="white"/>
                </svg>
              </a>
              <a href="#" class="social-icon" aria-label="LinkedIn">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20.447 20.452H16.893V14.883C16.893 13.555 16.866 11.843 15.041 11.843C13.188 11.843 12.905 13.269 12.905 14.785V20.452H9.351V9H12.765V10.561H12.811C13.161 9.809 14.084 9.008 15.48 9.008C18.376 9.008 19.084 11.183 19.084 14.167V20.452H20.447ZM5.337 7.433C4.193 7.433 3.274 6.507 3.274 5.367C3.274 4.224 4.194 3.305 5.337 3.305C6.477 3.305 7.401 4.224 7.401 5.367C7.401 6.507 6.476 7.433 5.337 7.433ZM7.119 20.452H3.555V9H7.119V20.452ZM22.225 0H1.771C0.792 0 0 0.774 0 1.729V22.271C0 23.227 0.792 24 1.771 24H22.222C23.2 24 24 23.227 24 22.271V1.729C24 0.774 23.2 0 22.222 0H22.225Z" fill="white"/>
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
          <p class="footer-copyright">Copyright © 2025 Trusted Valley LLC. All rights reserved</p>
          <div class="footer-policies">
            <a href="#privacy">Privacy Policy</a>
            <span class="footer-divider">|</span>
            <a href="#terms">Terms of Service</a>
            <span class="footer-divider">|</span>
            <a href="#cookies">Cookie Policy</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { HomeViewController } from '../controllers/HomeViewController'
import { HomeContentViewController } from '../controllers/HomeContentViewController'
import { siteSettingsController } from '@/layers/business/controllers/SiteSettingsController'
import type { SiteSettings } from '@/layers/business/services/SiteSettingsService'

const viewController = new HomeViewController()
const contentController = new HomeContentViewController()

const siteSettings = ref<SiteSettings>({
  disabledSections: [],
  maintenanceMode: false
})

const isSectionDisabled = (sectionId: string): boolean => {
  return siteSettings.value.disabledSections?.includes(sectionId) || false
}

const phoneNumber = computed({
  get: () => viewController.phoneNumber,
  set: (value: string) => viewController.setWhatsAppNumber(value)
})

const isLoading = computed(() => viewController.isLoading)
const errorMessage = computed(() => viewController.errorMessage)
const homeContent = computed(() => contentController.content)

onMounted(async () => {
  await contentController.loadHomeContent()
  // Load site settings to check for disabled sections
  const settingsResult = await siteSettingsController.getSiteSettings()
  if (settingsResult.success && settingsResult.data) {
    siteSettings.value = settingsResult.data
  }
})

const handleSubmit = async () => {
  const success = await viewController.handleWhatsAppSubmit()
  if (success) {
    // Show success message or redirect
    alert('Thank you! We will send you magic soon!')
    viewController.clearForm()
  }
}

const handleBookMeeting = () => {
  // TODO: Implement booking meeting functionality
  // This could open a calendar booking widget or navigate to a booking page
  console.log('Book a meeting clicked')
}

const getVideoEmbedUrl = (url: string): string => {
  if (!url) return ''
  
  // YouTube
  const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
  const youtubeMatch = url.match(youtubeRegex)
  if (youtubeMatch) {
    return `https://www.youtube.com/embed/${youtubeMatch[1]}`
  }
  
  // Vimeo
  const vimeoRegex = /(?:vimeo\.com\/)(?:.*\/)?(\d+)/
  const vimeoMatch = url.match(vimeoRegex)
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`
  }
  
  // Direct video URL (MP4, WebM, etc.)
  if (url.match(/\.(mp4|webm|ogg|mov)(\?.*)?$/i)) {
    return url
  }
  
  return url
}

const selectedVideo = ref<any>(null)

const openVideoModal = (testimonial: any) => {
  selectedVideo.value = testimonial
  document.body.style.overflow = 'hidden' // Prevent background scrolling
}

const closeVideoModal = () => {
  selectedVideo.value = null
  document.body.style.overflow = '' // Restore scrolling
}

const getInitials = (name: string): string => {
  if (!name) return 'U'
  const parts = name.trim().split(' ')
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
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

const hoveredCaseId = ref<string | null>(null)

const handleHeadlineHover = (caseId: string) => {
  hoveredCaseId.value = caseId
}

const handleHeadlineLeave = () => {
  hoveredCaseId.value = null
}
</script>

<style scoped>
.home-view {
  position: relative;
  min-height: calc(100vh - 120px);
  padding: 60px 20px 40px;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  box-sizing: border-box;
}

/* Background Image */
.background-image {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background-image: url('/images/backgrounds/background.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  z-index: 0;
  opacity: 0.3;
}

/* Background Overlay - Simple and Performance-Friendly */
.background-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background: 
    radial-gradient(circle at 20% 30%, rgba(91, 32, 150, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, rgba(193, 157, 230, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 50% 50%, rgba(67, 24, 111, 0.08) 0%, transparent 70%),
    linear-gradient(180deg, #0B0B0F 0%, #14141B 100%);
  z-index: 1;
  pointer-events: none;
}

/* Stars Animation - Subtle Floating Animation */
.stars {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  pointer-events: none;
  overflow: hidden;
}

.stars::before,
.stars::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    radial-gradient(2px 2px at 8% 12%, rgba(255, 255, 255, 1), transparent),
    radial-gradient(1.5px 1.5px at 15% 28%, rgba(255, 255, 255, 0.95), transparent),
    radial-gradient(2.5px 2.5px at 22% 45%, rgba(255, 255, 255, 1), transparent),
    radial-gradient(2px 2px at 28% 62%, rgba(255, 255, 255, 1), transparent),
    radial-gradient(1.5px 1.5px at 35% 18%, rgba(255, 255, 255, 0.95), transparent),
    radial-gradient(2.5px 2.5px at 42% 35%, rgba(255, 255, 255, 1), transparent),
    radial-gradient(2px 2px at 48% 52%, rgba(255, 255, 255, 1), transparent),
    radial-gradient(1.5px 1.5px at 55% 78%, rgba(255, 255, 255, 0.95), transparent),
    radial-gradient(2.5px 2.5px at 62% 25%, rgba(255, 255, 255, 1), transparent),
    radial-gradient(2px 2px at 68% 42%, rgba(255, 255, 255, 1), transparent),
    radial-gradient(1.5px 1.5px at 75% 58%, rgba(255, 255, 255, 0.95), transparent),
    radial-gradient(2.5px 2.5px at 82% 15%, rgba(255, 255, 255, 1), transparent),
    radial-gradient(2px 2px at 88% 32%, rgba(255, 255, 255, 1), transparent),
    radial-gradient(1.5px 1.5px at 12% 68%, rgba(255, 255, 255, 0.95), transparent),
    radial-gradient(2.5px 2.5px at 18% 85%, rgba(255, 255, 255, 1), transparent),
    radial-gradient(2px 2px at 25% 22%, rgba(255, 255, 255, 1), transparent),
    radial-gradient(1.5px 1.5px at 32% 38%, rgba(255, 255, 255, 0.95), transparent),
    radial-gradient(2.5px 2.5px at 38% 55%, rgba(255, 255, 255, 1), transparent),
    radial-gradient(2px 2px at 45% 72%, rgba(255, 255, 255, 1), transparent),
    radial-gradient(1.5px 1.5px at 52% 8%, rgba(255, 255, 255, 0.95), transparent),
    radial-gradient(2.5px 2.5px at 58% 48%, rgba(255, 255, 255, 1), transparent),
    radial-gradient(2px 2px at 65% 65%, rgba(255, 255, 255, 1), transparent),
    radial-gradient(1.5px 1.5px at 72% 82%, rgba(255, 255, 255, 0.95), transparent),
    radial-gradient(2.5px 2.5px at 78% 28%, rgba(255, 255, 255, 1), transparent),
    radial-gradient(2px 2px at 85% 45%, rgba(255, 255, 255, 1), transparent),
    radial-gradient(1.5px 1.5px at 92% 62%, rgba(255, 255, 255, 0.95), transparent),
    radial-gradient(2.5px 2.5px at 5% 38%, rgba(255, 255, 255, 1), transparent),
    radial-gradient(2px 2px at 95% 78%, rgba(255, 255, 255, 1), transparent);
  background-size: 100% 100%;
  background-repeat: no-repeat;
  animation: 
    floatStars 50s cubic-bezier(0.4, 0, 0.2, 1) infinite,
    twinkleStars 8s ease-in-out infinite;
  will-change: transform, opacity;
  opacity: 0.9;
}

.stars::after {
  background-image: 
    radial-gradient(2px 2px at 11% 24%, rgba(193, 157, 230, 0.85), transparent),
    radial-gradient(1.5px 1.5px at 17% 41%, rgba(193, 157, 230, 0.75), transparent),
    radial-gradient(2.5px 2.5px at 23% 58%, rgba(193, 157, 230, 0.9), transparent),
    radial-gradient(2px 2px at 29% 75%, rgba(193, 157, 230, 0.85), transparent),
    radial-gradient(1.5px 1.5px at 36% 14%, rgba(193, 157, 230, 0.75), transparent),
    radial-gradient(2.5px 2.5px at 42% 31%, rgba(193, 157, 230, 0.9), transparent),
    radial-gradient(2px 2px at 48% 48%, rgba(193, 157, 230, 0.85), transparent),
    radial-gradient(1.5px 1.5px at 54% 65%, rgba(193, 157, 230, 0.75), transparent),
    radial-gradient(2.5px 2.5px at 61% 82%, rgba(193, 157, 230, 0.9), transparent),
    radial-gradient(2px 2px at 67% 19%, rgba(193, 157, 230, 0.85), transparent),
    radial-gradient(1.5px 1.5px at 73% 36%, rgba(193, 157, 230, 0.75), transparent),
    radial-gradient(2.5px 2.5px at 79% 53%, rgba(193, 157, 230, 0.9), transparent),
    radial-gradient(2px 2px at 85% 70%, rgba(193, 157, 230, 0.85), transparent),
    radial-gradient(1.5px 1.5px at 91% 87%, rgba(193, 157, 230, 0.75), transparent),
    radial-gradient(2.5px 2.5px at 14% 51%, rgba(193, 157, 230, 0.9), transparent),
    radial-gradient(2px 2px at 20% 68%, rgba(193, 157, 230, 0.85), transparent),
    radial-gradient(1.5px 1.5px at 26% 85%, rgba(193, 157, 230, 0.75), transparent),
    radial-gradient(2.5px 2.5px at 33% 22%, rgba(193, 157, 230, 0.9), transparent),
    radial-gradient(2px 2px at 39% 39%, rgba(193, 157, 230, 0.85), transparent),
    radial-gradient(1.5px 1.5px at 46% 56%, rgba(193, 157, 230, 0.75), transparent),
    radial-gradient(2.5px 2.5px at 52% 73%, rgba(193, 157, 230, 0.9), transparent),
    radial-gradient(2px 2px at 59% 9%, rgba(193, 157, 230, 0.85), transparent),
    radial-gradient(1.5px 1.5px at 65% 26%, rgba(193, 157, 230, 0.75), transparent),
    radial-gradient(2.5px 2.5px at 71% 43%, rgba(193, 157, 230, 0.9), transparent),
    radial-gradient(2px 2px at 77% 60%, rgba(193, 157, 230, 0.85), transparent),
    radial-gradient(1.5px 1.5px at 83% 77%, rgba(193, 157, 230, 0.75), transparent),
    radial-gradient(2.5px 2.5px at 89% 94%, rgba(193, 157, 230, 0.9), transparent),
    radial-gradient(2px 2px at 7% 33%, rgba(193, 157, 230, 0.85), transparent),
    radial-gradient(1.5px 1.5px at 96% 61%, rgba(193, 157, 230, 0.75), transparent);
  animation: 
    floatStars 55s cubic-bezier(0.4, 0, 0.2, 1) infinite reverse,
    twinkleStarsPurple 12s ease-in-out infinite;
  animation-delay: -12s, 0s;
  opacity: 0.85;
}

@keyframes floatStars {
  0% {
    transform: translate3d(0, 0, 0) scale(1);
  }
  25% {
    transform: translate3d(4px, -8px, 0) scale(1.008);
  }
  50% {
    transform: translate3d(-3px, -12px, 0) scale(1);
  }
  75% {
    transform: translate3d(-4px, -6px, 0) scale(0.992);
  }
  100% {
    transform: translate3d(0, 0, 0) scale(1);
  }
}

@keyframes twinkleStars {
  0%, 100% {
    opacity: 0.9;
  }
  25% {
    opacity: 0.95;
  }
  50% {
    opacity: 0.85;
  }
  75% {
    opacity: 0.92;
  }
}

@keyframes twinkleStarsPurple {
  0%, 100% {
    opacity: 0.85;
  }
  30% {
    opacity: 0.9;
  }
  60% {
    opacity: 0.8;
  }
  80% {
    opacity: 0.88;
  }
}


/* Vector Shapes on Both Sides */
.vector-shape {
  position: fixed;
  top: 0;
  bottom: 0;
  height: 100vh;
  z-index: 2;
  opacity: 0.6;
  pointer-events: none;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}

.vector-left {
  left: 0;
  width: 100%;
  max-width: 400px;
  min-width: 288px;
  background-image: url('/images/backgrounds/vector1.svg');
  background-position: left center;
  background-size: cover;
}

.vector-right {
  right: 0;
  width: 100%;
  max-width: 400px;
  min-width: 288px;
  background-image: url('/images/backgrounds/vector1.svg');
  background-position: right center;
  transform: scaleX(-1); /* Flip horizontally for right side */
  background-size: cover;
}

.home-container {
  position: relative;
  z-index: 3;
  max-width: 900px;
  width: 100%;
  text-align: center;
  padding: 0 20px;
  box-sizing: border-box;
}

/* Hero Section */
.hero-section {
  margin-bottom: 5rem;
}

.hero-headline {
  font-size: 4.5rem;
  font-weight: 600;
  line-height: 1.1;
  margin-bottom: 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-family: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.headline-white {
  color: #F5F7FA;
}

.headline-purple {
  background: linear-gradient(103deg, #5B2096 0.52%, #C19DE6 125.79%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 700;
}

.supporting-text {
  font-size: 1.25rem;
  color: rgba(245, 247, 250, 0.9);
  line-height: 1.8;
  font-family: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-weight: 400;
}

.supporting-text p {
  margin: 0.5rem 0;
}

/* CTA Section */
.cta-section {
  margin-bottom: 5rem;
}

.whatsapp-form {
  display: flex;
  gap: 1rem;
  max-width: 700px;
  margin: 0 auto 1rem;
  align-items: stretch;
}

.whatsapp-input {
  flex: 1;
  padding: 1rem 1.5rem;
  background-color: rgba(245, 247, 250, 0.1);
  border: 1px solid rgba(91, 32, 150, 0.5);
  border-radius: 8px;
  color: #F5F7FA;
  font-size: 1rem;
  font-family: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-weight: 400;
  transition: all 0.2s ease;
}

.whatsapp-input::placeholder {
  color: rgba(245, 247, 250, 0.5);
}

.whatsapp-input:focus {
  outline: none;
  border-color: #5B2096;
  background-color: rgba(245, 247, 250, 0.15);
  box-shadow: 0 0 0 3px rgba(91, 32, 150, 0.3);
}

.whatsapp-input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.cta-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background: linear-gradient(103deg, #5B2096 0.52%, #C19DE6 125.79%);
  color: #F5F7FA;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  font-family: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  cursor: pointer;
  transition: transform 0.2s ease, opacity 0.2s ease;
  white-space: nowrap;
}

.cta-button:hover:not(:disabled) {
  opacity: 0.9;
  transform: translateY(-2px);
}

.cta-button:active:not(:disabled) {
  transform: translateY(0);
}

.cta-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-message {
  padding: 0.75rem 1rem;
  background-color: rgba(204, 51, 51, 0.2);
  color: #ff6b6b;
  border-radius: 6px;
  font-size: 0.9rem;
  max-width: 700px;
  margin: 0 auto;
}

/* Social Proof */
.social-proof {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: rgba(245, 247, 250, 0.9);
  font-size: 1rem;
  font-family: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-weight: 400;
}

.star {
  font-size: 1.2rem;
}

/* Second Section */
.second-section {
  position: relative;
  width: 100%;
  min-height: 100vh;
  padding: 120px 20px 80px;
  margin-top: 80px;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: center;
}

.section-container {
  max-width: 1152px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 48px;
}

/* Section Header */
.section-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  width: 100%;
}

.section-title {
  color: #F5F7FA;
  text-align: center;
  font-family: 'Roboto', sans-serif;
  font-size: 36px;
  font-weight: 600;
  line-height: 1.2;
  margin: 0;
  letter-spacing: -0.5px;
}

.section-description {
  color: #ABBED1;
  text-align: center;
  font-family: 'Roboto', sans-serif;
  font-size: 18px;
  font-weight: 400;
  line-height: 1.6;
  margin: 0;
  max-width: 600px;
}

/* Statistics Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  width: 100%;
  padding: 0 40px;
  gap: 2rem;
  align-items: flex-start;
}

.stat-card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 16px;
  width: 100%;
  max-width: 369px;
  margin: 0 auto;
}

.stat-title {
  color: #FFF;
  text-align: center;
  font-family: 'Roboto', sans-serif;
  font-size: 36px;
  font-weight: 600;
  line-height: normal;
  margin: 0;
}

.stat-value {
  text-align: center;
  font-family: 'Roboto', sans-serif;
  font-size: 50px;
  font-weight: 700;
  line-height: normal;
  background: linear-gradient(180deg, #C19DE6 0%, #5B2096 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-description {
  width: 250px;
  color: #ABBED1;
  text-align: center;
  font-family: 'Roboto', sans-serif;
  font-size: 18px;
  font-weight: 400;
  line-height: normal;
  margin: 0;
}

/* Video Section */
.video-section {
  width: 100%;
  max-width: 1280px;
  aspect-ratio: 79 / 59;
  margin: 0 auto;
}

.video-container {
  width: 100%;
  height: 100%;
  border-radius: 25px;
  overflow: hidden;
  background: #000;
  box-shadow: 0 2px 4px 0 rgba(171, 190, 209, 0.20);
}

.video-iframe {
  width: 100%;
  height: 100%;
  border: none;
}

.video-player {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.video-placeholder {
  width: 100%;
  height: 100%;
  border-radius: 25px;
  background: #FFF;
  box-shadow: 0 2px 4px 0 rgba(171, 190, 209, 0.20);
  display: flex;
  align-items: center;
  justify-content: center;
}

.video-text {
  color: #000;
  font-family: 'Roboto', sans-serif;
  font-size: 48px;
  font-weight: 600;
}

/* Section CTA */
.section-cta {
  display: flex;
  align-items: flex-start;
  gap: 24px;
}

.book-meeting-button {
  display: flex;
  padding: 14px 32px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 4px;
  background: linear-gradient(275deg, #C19DE6 -48.8%, #5B2096 96.84%);
  border: none;
  color: #F5F7FA;
  text-align: center;
  font-family: 'Roboto', sans-serif;
  font-size: 16px;
  font-weight: 500;
  line-height: normal;
  cursor: pointer;
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.book-meeting-button:hover {
  opacity: 0.9;
  transform: translateY(-2px);
}

.book-meeting-button:active {
  transform: translateY(0);
}

.whatsapp-link {
  width: 47px;
  height: 47px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  transition: background 0.2s ease, transform 0.2s ease;
}

.whatsapp-link:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
}

/* Third Section */
.third-section {
  position: relative;
  width: 100%;
  padding: 120px 20px;
  margin-top: 80px;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

/* Vector shapes for third section */
.third-section-vector {
  position: absolute;
  top: 0;
  bottom: 0;
  height: 100%;
  width: 100%;
  max-width: 400px;
  min-width: 288px;
  background-image: url('/images/backgrounds/vector1.svg');
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  opacity: 0.6;
  z-index: 1;
  pointer-events: none;
}

/* Hide vector behind services section */
.third-section:has(.services-section) .third-section-vector {
  opacity: 0;
  visibility: hidden;
}

.third-section-vector-left {
  left: 0;
  transform: scaleX(1);
  background-position: left center;
}

.third-section-vector-right {
  right: 0;
  transform: scaleX(-1);
  background-position: right center;
}

/* Hide vector behind services section */
.third-section:has(.services-section) .third-section-vector {
  opacity: 0;
  visibility: hidden;
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
  z-index: 2;
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

/* System Card */
.system-card {
  width: 100%;
  max-width: 1138px;
  min-height: 409px;
  height: auto;
  border-radius: 50px;
  background: #14141B;
  border: 2px solid #5B2096;
  box-shadow: 0 4px 4px 0 rgba(91, 32, 150, 0.3) inset, 0 4px 4px 0 rgba(91, 32, 150, 0.3);
  padding: 74px 59px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  position: relative;
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

/* Services Section */
.services-section {
  width: 100%;
  max-width: 1127px;
  display: flex;
  flex-direction: column;
  gap: 32px;
  position: relative;
  z-index: 3;
  background: transparent;
}

.services-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.services-title {
  color: #F5F7FA;
  text-align: center;
  font-family: 'Roboto', sans-serif;
  font-size: 36px;
  font-weight: 600;
  line-height: normal;
  margin: 0;
}

.services-description {
  color: #ABBED1;
  text-align: center;
  font-family: 'Roboto', sans-serif;
  font-size: 18px;
  font-weight: 400;
  line-height: normal;
  margin: 0;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  width: 100%;
}

.service-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
  width: 100%;
  max-width: 309px;
  margin: 0 auto;
  padding: 0;
}

.service-icon {
  width: 72px;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
  flex-shrink: 0;
}

.service-icon svg path {
  fill: #5B2096;
}

.service-name {
  color: #F5F7FA;
  font-family: 'Roboto', sans-serif;
  font-size: 20px;
  font-weight: 600;
  line-height: 1.4;
  margin: 0;
  width: 100%;
  letter-spacing: -0.2px;
}

.service-desc {
  width: 100%;
  max-width: 251px;
  color: #ABBED1;
  font-family: 'Roboto', sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 1.6;
  margin: 0;
}

/* What We Do Section */
.what-we-do-section {
  width: 100%;
  max-width: 1148px;
  display: flex;
  flex-direction: column;
  gap: 48px;
  padding: 40px 20px;
}

.what-we-do-title {
  color: #FFF;
  text-align: center;
  font-family: 'Roboto', sans-serif;
  font-size: 36px;
  font-weight: 600;
  line-height: normal;
  margin: 0;
}

.steps-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  justify-items: center;
  width: 100%;
  justify-content: center;
}

/* All cards span 1 column by default - first 4 will fill row 1 */
.steps-grid .step-card {
  grid-column: span 1;
}

/* Center the last row when it has an odd number of cards (3 cards) */
/* For 7 steps: first 4 fill row 1, last 3 are centered in row 2 */
.steps-grid .step-card:nth-child(5) {
  grid-column: 2 / 3;
  grid-row: 2;
}

.steps-grid .step-card:nth-child(6) {
  grid-column: 3 / 4;
  grid-row: 2;
}

.steps-grid .step-card:nth-child(7) {
  grid-column: 4 / 5;
  grid-row: 2;
}

.step-card {
  width: 100%;
  max-width: 275px;
  min-height: 210px;
  border-radius: 50px;
  background: #14141B;
  border: 2px solid #5B2096;
  box-shadow: 0 4px 4px 0 rgba(91, 32, 150, 0.3) inset;
  filter: drop-shadow(0 4px 4px rgba(91, 32, 150, 0.3));
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.step-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 12px 0 rgba(91, 32, 150, 0.5) inset;
}

/* Step Card Header */
.step-card-header {
  width: 100%;
  height: 53px;
  border-radius: 50px 50px 0 0;
  background: linear-gradient(180deg, rgba(91, 32, 150, 0.3) 0%, #14141B 100%);
  box-shadow: 0 4px 4px 0 rgba(91, 32, 150, 0.50);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 2;
  border-bottom: 2px solid rgba(91, 32, 150, 0.4);
}

.step-header {
  color: #FFF;
  text-align: center;
  font-family: 'Roboto', sans-serif;
  font-size: 20px;
  font-weight: 600;
  line-height: normal;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

/* Step Card Body */
.step-card-body {
  flex: 1;
  width: 100%;
  padding: 24px 33px 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 2;
  background: rgba(20, 20, 27, 0.95);
  border-radius: 0 0 50px 50px;
}

.step-content {
  width: 100%;
  color: #FFF;
  text-align: center;
  font-family: 'Roboto', sans-serif;
  font-size: 20px;
  font-weight: 600;
  line-height: 1.4;
  margin: 0;
}

/* What You Get Section */
.what-you-get-section {
  width: 100%;
  max-width: 1148px;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.what-you-get-title {
  color: #FFF;
  text-align: center;
  font-family: 'Roboto', sans-serif;
  font-size: 36px;
  font-weight: 600;
  line-height: normal;
  margin: 0;
}

.benefits-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 32px;
  padding: 0 64px;
  width: 100%;
}

.benefit-item {
  display: flex;
  align-items: center;
  gap: 14px;
  min-height: 62px;
  height: auto;
}

.benefit-check {
  width: 40px;
  height: 40px;
  background: #5B2096;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.benefit-check svg path {
  fill: #F5F7FA;
}

.benefit-text {
  color: #F5F7FA;
  font-family: 'Roboto', sans-serif;
  font-size: 20px;
  font-weight: 600;
  line-height: normal;
}

/* Bonuses Included Section */
.bonuses-section {
  position: relative;
  width: 100%;
  padding: 80px 20px;
  margin-top: 60px;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bonuses-container {
  width: 100%;
  max-width: 1148px;
  display: flex;
  flex-direction: column;
  gap: 48px;
}

.bonuses-title {
  color: #FFF;
  text-align: center;
  font-family: 'Roboto', sans-serif;
  font-size: 36px;
  font-weight: 600;
  line-height: normal;
  margin: 0;
}

.bonuses-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.bonus-item {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 24px 32px;
  border-radius: 16px;
  background: #14141B;
  border: 1px solid rgba(91, 32, 150, 0.5);
  transition: all 0.3s ease;
}

.bonus-item:hover {
  border-color: rgba(91, 32, 150, 0.8);
  box-shadow: 0 4px 12px rgba(91, 32, 150, 0.3);
  transform: translateX(4px);
}

.bonus-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.bonus-icon svg {
  width: 100%;
  height: 100%;
}

.bonus-icon svg rect,
.bonus-icon svg line,
.bonus-icon svg path,
.bonus-icon svg circle {
  stroke: #5B2096;
}

.bonus-text {
  color: #F5F7FA;
  font-family: 'Roboto', sans-serif;
  font-size: 20px;
  font-weight: 600;
  line-height: normal;
  margin: 0;
}

/* Our Clients Section */
.clients-section {
  position: relative;
  width: 100%;
  padding: 100px 0 120px;
  margin-top: 80px;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, #0B0B0F 0%, #0B0B0F 60%, rgba(91, 32, 150, 0.3) 100%);
  overflow: hidden;
}

.clients-container {
  width: 100%;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 48px;
  padding: 0 60px;
}

.clients-title {
  color: #FFF;
  text-align: center;
  font-family: 'Roboto', sans-serif;
  font-size: 36px;
  font-weight: 600;
  line-height: normal;
  margin: 0;
}

.clients-subtitle {
  color: #ABBED1;
  text-align: center;
  font-family: 'Roboto', sans-serif;
  font-size: 18px;
  font-weight: 400;
  line-height: normal;
  margin: 0;
}

.clients-slider-wrapper {
  width: 100%;
  overflow: hidden;
  position: relative;
  padding: 40px 0;
  mask-image: linear-gradient(
    to right,
    transparent 0%,
    black 5%,
    black 95%,
    transparent 100%
  );
  -webkit-mask-image: linear-gradient(
    to right,
    transparent 0%,
    black 5%,
    black 95%,
    transparent 100%
  );
}

.clients-slider-track {
  display: flex;
  align-items: center;
  gap: 80px;
  animation: slideRightToLeft 40s linear infinite;
  will-change: transform;
  width: fit-content;
}

.clients-slider-track:hover {
  animation-play-state: paused;
}

.client-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  opacity: 0.7;
  transition: opacity 0.3s ease, transform 0.3s ease;
  padding: 0 20px;
}

.client-logo:hover {
  opacity: 1;
  transform: scale(1.05);
}

.client-logo img {
  max-width: 140px;
  max-height: 100px;
  height: 90px;
  width: auto;
  object-fit: contain;
  filter: brightness(0) invert(1);
  transition: filter 0.3s ease;
}

.client-logo:hover img {
  filter: brightness(0) invert(1) brightness(1.2);
}

@keyframes slideRightToLeft {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(calc(-33.333% - 27px));
  }
}

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
  background: #14141B;
  border-radius: 16px;
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  border: 1px solid rgba(91, 32, 150, 0.3);
  transition: all 0.3s ease;
}

.testimonial-card:hover {
  border-color: rgba(91, 32, 150, 0.6);
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(91, 32, 150, 0.3);
}

.testimonial-header {
  display: flex;
  align-items: center;
  gap: 16px;
}

.testimonial-avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  background: linear-gradient(135deg, #5B2096 0%, #C19DE6 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
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

.testimonial-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.testimonial-name {
  color: #F5F7FA;
  font-family: 'Roboto', sans-serif;
  font-size: 18px;
  font-weight: 600;
  line-height: normal;
  margin: 0;
}

.testimonial-stars {
  display: flex;
  gap: 4px;
}

.star-empty {
  opacity: 0.3;
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

/* Real Results Section */
.real-results-section {
  width: 100%;
  padding: 80px 20px;
  background: #0A0A0F;
  position: relative;
  z-index: 2;
}

.real-results-container {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3rem;
}

.real-results-header {
  text-align: center;
  max-width: 800px;
}

.real-results-title {
  color: #F5F7FA;
  font-family: 'Roboto', sans-serif;
  font-size: 48px;
  font-weight: 700;
  line-height: 1.2;
  margin: 0 0 1rem 0;
}

.real-results-subtitle {
  color: #ABBED1;
  font-family: 'Roboto', sans-serif;
  font-size: 18px;
  font-weight: 400;
  line-height: 1.6;
  margin: 0;
}

/* Real Results Cases Container */
.real-results-cases {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 4rem;
  margin-top: 3rem;
}

.real-results-case-container {
  position: relative;
  width: 100%;
  max-width: 1300px;
  margin: 0 auto;
  padding: 4rem 4rem;
  background: rgba(91, 32, 150, 0.15);
  border: 1px solid rgba(91, 32, 150, 0.4);
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.4s ease;
  display: flex;
  flex-direction: column;
}

.real-results-case-container:hover {
  border-color: rgba(91, 32, 150, 0.7);
  box-shadow: 0 8px 24px rgba(91, 32, 150, 0.5);
  background: rgba(91, 32, 150, 0.2);
}

/* Company Logo - Top Center */
.real-results-company-logo {
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 3;
  margin-bottom: 3rem;
}

.company-logo-img {
  max-width: 200px;
  max-height: 120px;
  width: auto;
  height: auto;
  object-fit: contain;
}

/* Main Heading - Centered */
.real-results-headline-wrapper {
  position: relative;
  z-index: 2;
  width: 100%;
  text-align: center;
  margin-bottom: 4rem;
  transition: opacity 0.4s ease, visibility 0.4s ease;
}

.real-results-case-container:hover .real-results-headline-wrapper {
  opacity: 0;
  visibility: hidden;
}

.real-results-headline {
  color: #5B2096; /* Fallback color for browsers that don't support background-clip */
  background: linear-gradient(135deg, #5B2096 0%, #8B5CF6 50%, #A78BFA 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-family: 'Roboto', sans-serif;
  font-size: 64px;
  font-weight: 700;
  text-align: center;
  line-height: 1.2;
  margin: 0;
  display: inline-block; /* Required for background-clip to work properly */
}

/* Company Images on Hover - Overlay entire container */
.headline-hover-images,
.headline-hover-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.4s ease, visibility 0.4s ease;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(20, 20, 27, 0.98);
  border-radius: 16px;
  padding: 4rem;
  overflow-y: auto;
  overflow-x: hidden;
}

.headline-hover-images.show,
.headline-hover-placeholder.show {
  opacity: 1;
  visibility: visible;
}

.company-images-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  width: 100%;
  max-width: 1000px;
  align-content: start;
}

.company-image-item {
  border-radius: 8px;
  overflow: hidden;
  background: rgba(91, 32, 150, 0.1);
  border: 1px solid rgba(91, 32, 150, 0.2);
  transition: transform 0.2s ease;
}

.company-image-item:hover {
  transform: scale(1.02);
  border-color: rgba(91, 32, 150, 0.5);
}

.company-img {
  width: 100%;
  height: auto;
  object-fit: cover;
  display: block;
}

.headline-hover-placeholder {
  flex-direction: column;
  gap: 1rem;
  color: rgba(245, 247, 250, 0.5);
}

.headline-hover-placeholder svg {
  color: rgba(91, 32, 150, 0.5);
}

.headline-hover-placeholder p {
  margin: 0;
  font-size: 14px;
}

/* Small Cards - Inside Container */
.real-results-cards {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  width: 100%;
  margin-bottom: 3rem;
  transition: opacity 0.4s ease, visibility 0.4s ease;
}

.real-results-case-container:hover .real-results-cards {
  opacity: 0;
  visibility: hidden;
}

@media (min-width: 768px) {
  .real-results-cards {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .real-results-cards {
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
  }
}

.real-results-card {
  background: rgba(91, 32, 150, 0.15);
  border: 1px solid rgba(91, 32, 150, 0.4);
  border-radius: 12px;
  padding: 2rem 1.5rem;
  min-height: 240px;
  position: relative;
  overflow: hidden;
  transition: all 0.4s ease;
  display: flex;
  flex-direction: column;
}

.real-results-card:hover {
  border-color: rgba(91, 32, 150, 0.7);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(91, 32, 150, 0.5);
  background: rgba(91, 32, 150, 0.2);
}

.card-content {
  position: relative;
  z-index: 2;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.card-title {
  color: #F5F7FA;
  font-family: 'Roboto', sans-serif;
  font-size: 14px;
  font-weight: 500;
  margin: 0 0 1rem 0;
  line-height: 1.4;
  text-align: center;
}

.card-metric {
  color: #5B2096;
  font-family: 'Roboto', sans-serif;
  font-size: 40px;
  font-weight: 700;
  line-height: 1;
  margin: 0 0 0.5rem 0;
  text-align: center;
}

.card-subtitle {
  color: rgba(245, 247, 250, 0.7);
  font-family: 'Roboto', sans-serif;
  font-size: 12px;
  font-weight: 400;
  margin: 0;
  line-height: 1.5;
  text-align: center;
}

/* Action Button - Bottom Center */
.real-results-cta {
  position: relative;
  z-index: 2;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 0;
  transition: opacity 0.4s ease, visibility 0.4s ease;
}

.real-results-case-container:hover .real-results-cta {
  opacity: 0;
  visibility: hidden;
}

.cta-link {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  color: #F5F7FA;
  font-family: 'Roboto', sans-serif;
  font-size: 18px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s;
}

.cta-link:hover {
  color: #5B2096;
  gap: 1rem;
}

.cta-link svg {
  transition: transform 0.2s;
}

.cta-link:hover svg {
  transform: translateX(4px);
}

/* Real Results Section Responsive */
@media (max-width: 768px) {
  .real-results-section {
    padding: 60px 15px;
  }

  .real-results-title {
    font-size: 36px;
  }

  .real-results-subtitle {
    font-size: 16px;
  }

  .real-results-headline {
    font-size: 42px;
  }

  .real-results-case-container {
    padding: 3rem 2rem;
  }

  .real-results-company-logo {
    margin-bottom: 2rem;
  }

  .real-results-headline-wrapper {
    margin-bottom: 3rem;
  }

  .real-results-cards {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    margin-bottom: 2rem;
  }

  .company-images-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .headline-hover-images,
  .headline-hover-placeholder {
    padding: 2rem;
  }
}

@media (max-width: 480px) {
  .real-results-section {
    padding: 40px 10px;
  }

  .real-results-title {
    font-size: 28px;
  }

  .real-results-headline {
    font-size: 32px;
  }

  .real-results-case-container {
    padding: 2rem 1.5rem;
  }

  .real-results-card {
    padding: 1.5rem 1rem;
    min-height: 200px;
  }

  .card-metric {
    font-size: 32px;
  }

  .company-logo-img {
    max-width: 150px;
    max-height: 90px;
  }

  .headline-hover-images,
  .headline-hover-placeholder {
    padding: 1.5rem;
  }
}

.testimonial-stars span {
  font-size: 16px;
  line-height: 1;
}

.testimonial-text {
  color: #ABBED1;
  font-family: 'Roboto', sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 1.6;
  margin: 0;
}

.testimonial-video {
  width: 100%;
  margin-top: auto;
}

.video-thumbnail {
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(91, 32, 150, 0.3) 0%, rgba(193, 157, 230, 0.2) 100%);
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
}

.video-thumbnail:hover {
  transform: scale(1.02);
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

.play-button {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 64px;
  height: 64px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.play-button:hover {
  background: white;
  transform: translate(-50%, -50%) scale(1.1);
}

.play-button svg {
  margin-left: 4px;
}

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

.footer-logo svg text {
  font-family: 'Roboto', sans-serif;
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

/* Responsive Design - Comprehensive Breakpoints */

/* Large Tablets and Small Desktops (1024px and below) */
@media (max-width: 1024px) {
  .home-view {
    padding: 50px 20px 35px;
  }
  
  .home-container {
    padding: 0 15px;
    max-width: 100%;
  }
  
  .hero-headline {
    font-size: 3.5rem;
    line-height: 1.1;
  }
  
  .supporting-text {
    font-size: 1.1rem;
    padding: 0 10px;
  }
  
  .whatsapp-form {
    max-width: 100%;
    padding: 0 10px;
  }
  
  .vector-shape {
    width: 100%;
    max-width: 350px;
    opacity: 0.55;
  }
  
  /* Hide right vector on tablets and below - show only left */
  .vector-right {
    display: none;
  }
  
  .vector-left {
    width: 100%;
    max-width: 350px;
    min-width: 250px;
    opacity: 0.55;
    background-size: cover;
    background-position: left center;
    height: 100vh;
    background-repeat: no-repeat;
  }
  
  .second-section {
    padding: 80px 30px 50px;
    min-height: auto;
  }
  
  .section-container {
    gap: 40px;
  }
  
  .stats-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
    padding: 0 20px;
  }
  
  .stat-card {
    max-width: 100%;
  }
  
  .stat-title {
    font-size: 28px;
  }
  
  .stat-value {
    font-size: 44px;
  }
  
  .stat-description {
    width: 100%;
    max-width: 280px;
    font-size: 16px;
  }
  
  .video-section {
    width: 100%;
  }
  
  .video-text {
    font-size: 40px;
  }
  
  .section-cta {
    gap: 20px;
  }
  
  .third-section {
    padding: 80px 30px;
    min-height: auto;
  }
  
  .third-section-vector {
    max-width: 350px;
    min-width: 250px;
    opacity: 0.6;
    background-size: contain;
  }
  
  .third-section-vector-right {
    display: none;
  }
  
  .third-section-vector-left {
    max-width: 350px;
    min-width: 250px;
    opacity: 0.6;
    background-size: contain;
    background-position: left center;
    display: block;
  }
  
  .third-section-container {
    gap: 40px;
  }
  
  .third-section-header {
    margin-bottom: 1.5rem;
  }
  
  .third-section-title {
    font-size: 32px;
  }
  
  .third-section-description {
    font-size: 17px;
  }
  
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
  
  .services-section {
    gap: 32px;
    max-width: 100%;
  }
  
  .services-header {
    margin-bottom: 0.5rem;
  }
  
  .services-title {
    font-size: 32px;
  }
  
  .services-description {
    font-size: 17px;
  }
  
  .services-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 28px;
    width: 100%;
  }
  
  .service-card {
    max-width: 100%;
    align-items: flex-start;
  }
  
  .service-icon {
    width: 64px;
    height: 64px;
  }
  
  .service-name {
    font-size: 18px;
  }
  
  .service-desc {
    max-width: 100%;
    font-size: 15px;
  }
  
  .what-you-get-section {
    gap: 32px;
    max-width: 100%;
  }
  
  .what-you-get-title {
    font-size: 32px;
  }
  
  .benefits-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 28px;
    padding: 0 40px;
  }
  
  .benefit-item {
    min-height: 58px;
  }
  
  .benefit-check {
    width: 36px;
    height: 36px;
  }
  
  .benefit-text {
    font-size: 18px;
  }
  
  .bonuses-section {
    padding: 70px 20px;
    margin-top: 70px;
  }
  
  .bonuses-container {
    gap: 40px;
  }
  
  .bonuses-title {
    font-size: 32px;
  }
  
  .bonuses-list {
    gap: 20px;
  }
  
  .bonus-item {
    padding: 22px 28px;
    gap: 20px;
  }
  
  .bonus-icon {
    width: 44px;
    height: 44px;
  }
  
  .bonus-text {
    font-size: 18px;
  }
  
  .clients-section {
    padding: 80px 0 100px;
    margin-top: 70px;
  }
  
  .clients-container {
    gap: 40px;
    padding: 0 40px;
  }
  
  .clients-title {
    font-size: 32px;
  }
  
  .clients-subtitle {
    font-size: 17px;
  }
  
  .clients-slider-wrapper {
    padding: 35px 0;
  }
  
  .clients-slider-track {
    gap: 70px;
  }
  
  .client-logo img {
    max-width: 120px;
    max-height: 90px;
    height: 80px;
  }
  
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
  
  .clients-container {
    padding: 0 40px;
  }
}

/* Medium Tablets (900px and below) */
@media (max-width: 900px) {
  .hero-headline {
    font-size: 3rem;
  }
  
  .supporting-text {
    font-size: 1rem;
  }
  
  .whatsapp-form {
    flex-direction: column;
    gap: 12px;
  }
  
  .whatsapp-input {
    width: 100%;
  }
  
  .cta-button {
    width: 100%;
    justify-content: center;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }
  
  .stat-card {
    max-width: 100%;
  }
  
  .services-section {
    gap: 28px;
  }
  
  .services-title {
    font-size: 30px;
  }
  
  .services-description {
    font-size: 16px;
  }
  
  .services-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }
  
  .service-card {
    max-width: 100%;
    align-items: flex-start;
  }
  
  .service-icon {
    width: 60px;
    height: 60px;
  }
  
  .service-name {
    font-size: 18px;
  }
  
  .service-desc {
    max-width: 100%;
    font-size: 15px;
  }
  
  .system-card {
    padding: 50px 35px;
    border-radius: 35px;
  }
  
  .what-we-do-section {
    gap: 32px;
    padding: 40px 20px;
  }
  
  .what-we-do-title {
    font-size: 30px;
  }
  
  .steps-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
  
  /* Reset grid positioning for 2-column layout */
  .steps-grid .step-card:nth-child(1),
  .steps-grid .step-card:nth-child(2),
  .steps-grid .step-card:nth-child(3),
  .steps-grid .step-card:nth-child(4),
  .steps-grid .step-card:nth-child(5),
  .steps-grid .step-card:nth-child(6),
  .steps-grid .step-card:nth-child(7) {
    grid-column: span 1;
  }
  
  .step-card {
    max-width: 100%;
    min-height: 190px;
    border-radius: 40px;
  }
  
  .step-card-header {
    height: 48px;
    border-radius: 40px 40px 0 0;
  }
  
  .step-header {
    font-size: 18px;
  }
  
  .step-card-body {
    padding: 20px 24px 22px;
    border-radius: 0 0 40px 40px;
  }
  
  .step-content {
    font-size: 17px;
  }
  
  .what-you-get-section {
    gap: 28px;
  }
  
  .what-you-get-title {
    font-size: 30px;
  }
  
  .benefits-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
    padding: 0 30px;
  }
  
  .benefit-item {
    min-height: 56px;
  }
  
  .benefit-check {
    width: 36px;
    height: 36px;
  }
  
  .benefit-text {
    font-size: 17px;
  }
  
  .bonuses-section {
    padding: 60px 20px;
    margin-top: 60px;
  }
  
  .bonuses-container {
    gap: 36px;
  }
  
  .bonuses-title {
    font-size: 30px;
  }
  
  .bonuses-list {
    gap: 18px;
  }
  
  .bonus-item {
    padding: 20px 24px;
    gap: 18px;
  }
  
  .bonus-icon {
    width: 40px;
    height: 40px;
  }
  
  .bonus-text {
    font-size: 17px;
  }
  
  .clients-section {
    padding: 70px 0 90px;
    margin-top: 60px;
  }
  
  .clients-container {
    gap: 36px;
    padding: 0 30px;
  }
  
  .clients-title {
    font-size: 30px;
  }
  
  .clients-subtitle {
    font-size: 16px;
  }
  
  .clients-slider-wrapper {
    padding: 30px 0;
  }
  
  .clients-slider-track {
    gap: 60px;
    animation-duration: 35s;
  }
  
  .client-logo {
    padding: 0 15px;
  }
  
  .client-logo img {
    max-width: 100px;
    max-height: 80px;
    height: 70px;
  }
  
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

/* Tablets (768px and below) */
@media (max-width: 768px) {
  .home-view {
    padding: 40px 15px 30px;
    min-height: calc(100vh - 100px);
  }
  
  .home-container {
    padding: 0 10px;
    max-width: 100%;
  }
  
  .hero-section {
    margin-bottom: 3.5rem;
  }
  
  .hero-headline {
    font-size: 2.5rem;
    line-height: 1.15;
    margin-bottom: 1.5rem;
  }
  
  .supporting-text {
    font-size: 1rem;
    line-height: 1.6;
    padding: 0 5px;
  }
  
  .supporting-text p {
    margin-bottom: 0.5rem;
  }
  
  .vector-shape {
    width: 100%;
    max-width: 300px;
    opacity: 0.5;
  }
  
  /* Hide right vector on tablets and below */
  .vector-right {
    display: none;
  }
  
  .vector-left {
    width: 100%;
    max-width: 300px;
    min-width: 200px;
    opacity: 0.5;
    background-size: cover;
    background-position: left center;
    height: 100vh;
    background-repeat: no-repeat;
  }
  
  /* Ensure stars remain visible on tablets */
  .stars::before,
  .stars::after {
    opacity: 0.85;
  }
  
  .cta-section {
    margin-bottom: 3.5rem;
  }
  
  .whatsapp-form {
    flex-direction: column;
    gap: 12px;
    max-width: 100%;
    padding: 0;
  }
  
  .whatsapp-input {
    width: 100%;
    font-size: 0.95rem;
    padding: 0.9rem 1.2rem;
  }
  
  .whatsapp-input::placeholder {
    font-size: 0.9rem;
  }
  
  .cta-button {
    width: 100%;
    justify-content: center;
    padding: 0.9rem 1.5rem;
  }
  
  .social-proof {
    font-size: 0.9rem;
    padding: 0 10px;
    text-align: center;
  }
  
  .second-section {
    padding: 60px 20px 50px;
    margin-top: 60px;
    min-height: auto;
  }
  
  .section-container {
    gap: 40px;
  }
  
  .section-header {
    margin-bottom: 2rem;
  }
  
  .section-title {
    font-size: 28px;
  }
  
  .section-description {
    font-size: 16px;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 32px;
    padding: 0 20px;
  }
  
  .stat-card {
    padding: 24px 20px;
    max-width: 100%;
  }
  
  .stat-title {
    font-size: 24px;
  }
  
  .stat-value {
    font-size: 42px;
  }
  
  .stat-description {
    width: 100%;
    max-width: 300px;
    font-size: 16px;
  }
  
  .video-section {
    margin: 2rem 0;
    width: 100%;
  }
  
  .video-placeholder {
    border-radius: 16px;
  }
  
  .video-text {
    font-size: 36px;
  }
  
  .section-cta {
    width: 100%;
    justify-content: center;
    gap: 20px;
  }
  
  .book-meeting-button {
    padding: 12px 28px;
    font-size: 15px;
  }
  
  .third-section {
    padding: 60px 20px;
    margin-top: 50px;
    min-height: auto;
  }
  
  .third-section-vector {
    max-width: 300px;
    min-width: 200px;
    opacity: 0.6;
    background-size: contain;
  }
  
  .third-section-vector-right {
    display: none;
  }
  
  .third-section-vector-left {
    max-width: 300px;
    min-width: 200px;
    opacity: 0.6;
    background-size: contain;
    background-position: left center;
    display: block;
  }
  
  .third-section-container {
    gap: 32px;
  }
  
  .third-section-header {
    margin-bottom: 1.5rem;
  }
  
  .third-section-title {
    font-size: 28px;
  }
  
  .third-section-description {
    font-size: 16px;
  }
  
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
  
  .services-section {
    gap: 28px;
    max-width: 100%;
  }
  
  .services-header {
    margin-bottom: 1rem;
  }
  
  .services-title {
    font-size: 28px;
  }
  
  .services-description {
    font-size: 16px;
  }
  
  .services-grid {
    grid-template-columns: 1fr;
    gap: 32px;
    width: 100%;
  }
  
  .service-card {
    max-width: 100%;
    align-items: center;
    text-align: center;
    gap: 18px;
  }
  
  .service-icon {
    width: 64px;
    height: 64px;
  }
  
  .service-name {
    text-align: center;
    font-size: 18px;
  }
  
  .service-desc {
    text-align: center;
    width: 100%;
    max-width: 100%;
    font-size: 15px;
  }
  
  .what-we-do-section {
    gap: 32px;
    padding: 40px 20px;
  }
  
  .what-we-do-title {
    font-size: 28px;
    margin-bottom: 1.5rem;
  }
  
  .steps-grid {
    grid-template-columns: 1fr;
    gap: 24px;
    width: 100%;
  }
  
  /* Reset grid positioning for 1-column layout */
  .steps-grid .step-card:nth-child(1),
  .steps-grid .step-card:nth-child(2),
  .steps-grid .step-card:nth-child(3),
  .steps-grid .step-card:nth-child(4),
  .steps-grid .step-card:nth-child(5),
  .steps-grid .step-card:nth-child(6),
  .steps-grid .step-card:nth-child(7) {
    grid-column: span 1;
  }
  
  .step-card {
    width: 100%;
    max-width: 100%;
    min-height: 180px;
    border-radius: 35px;
  }
  
  .step-card-header {
    height: 45px;
    border-radius: 35px 35px 0 0;
  }
  
  .step-header {
    font-size: 18px;
  }
  
  .step-card-body {
    padding: 20px 24px 22px;
    border-radius: 0 0 35px 35px;
  }
  
  .step-content {
    font-size: 17px;
    line-height: 1.5;
  }
  
  .what-you-get-section {
    gap: 28px;
    padding: 40px 20px;
  }
  
  .what-you-get-title {
    font-size: 28px;
  }
  
  .benefits-grid {
    grid-template-columns: 1fr;
    gap: 20px;
    padding: 0 20px;
  }
  
  .benefit-item {
    min-height: 54px;
    gap: 12px;
  }
  
  .benefit-check {
    width: 36px;
    height: 36px;
  }
  
  .benefit-text {
    font-size: 17px;
  }
  
  .bonuses-section {
    padding: 60px 20px;
    margin-top: 50px;
  }
  
  .bonuses-container {
    gap: 32px;
  }
  
  .bonuses-title {
    font-size: 28px;
    margin-bottom: 1.5rem;
  }
  
  .bonuses-list {
    gap: 16px;
  }
  
  .bonus-item {
    padding: 20px 24px;
    gap: 16px;
  }
  
  .bonus-icon {
    width: 40px;
    height: 40px;
  }
  
  .bonus-text {
    font-size: 18px;
  }
  
  .clients-section {
    padding: 60px 20px 80px;
    margin-top: 50px;
  }
  
  .clients-container {
    gap: 32px;
    padding: 0 20px;
  }
  
  .clients-title {
    font-size: 28px;
  }
  
  .clients-subtitle {
    font-size: 16px;
  }
  
  .clients-slider-wrapper {
    padding: 30px 0;
  }
  
  .clients-slider-track {
    gap: 60px;
    animation-duration: 35s;
  }
  
  .client-logo {
    padding: 0 15px;
  }
  
  .client-logo img {
    max-width: 100px;
    max-height: 80px;
    height: 70px;
  }
  
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
  
  .bonuses-section {
    padding: 60px 20px;
    margin-top: 50px;
  }
  
  .bonuses-title {
    font-size: 28px;
    margin-bottom: 2rem;
  }
  
  .bonuses-grid {
    gap: 16px;
  }
  
  .bonus-item {
    padding: 20px 24px;
    gap: 20px;
  }
  
  .bonus-icon {
    width: 40px;
    height: 40px;
  }
  
  .bonus-text {
    font-size: 18px;
  }
  
  .clients-section {
    padding: 60px 20px 80px;
    margin-top: 50px;
  }
  
  .clients-container {
    padding: 0 20px;
    gap: 32px;
  }
  
  .clients-title {
    font-size: 28px;
  }
  
  .clients-subtitle {
    font-size: 16px;
  }
  
  .clients-slider-track {
    gap: 60px;
    animation-duration: 35s;
  }
  
  .client-logo {
    padding: 0 15px;
  }
  
  .client-logo img {
    max-width: 100px;
    max-height: 80px;
    height: 70px;
  }
  
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
  }
  
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

/* Mobile Devices (480px and below) */
@media (max-width: 480px) {
  .home-view {
    padding: 30px 10px 25px;
    min-height: calc(100vh - 80px);
  }
  
  .home-container {
    padding: 0 5px;
    max-width: 100%;
  }
  
  .hero-section {
    margin-bottom: 2.5rem;
  }
  
  .hero-headline {
    font-size: 2rem;
    line-height: 1.2;
    margin-bottom: 1.25rem;
  }
  
  .headline-white,
  .headline-purple {
    display: block;
  }
  
  .supporting-text {
    font-size: 0.9rem;
    line-height: 1.5;
    padding: 0;
  }
  
  .supporting-text p {
    margin-bottom: 0.4rem;
  }
  
  .vector-shape {
    width: 100%;
    max-width: 250px;
    opacity: 0.45;
  }
  
  /* Hide right vector on mobile - show only left */
  .vector-right {
    display: none;
  }
  
  .vector-left {
    width: 100%;
    max-width: 250px;
    min-width: 180px;
    opacity: 0.45;
    background-size: cover;
    background-position: left center;
    height: 100vh;
    background-repeat: no-repeat;
  }
  
  /* Ensure stars remain visible on mobile */
  .stars::before {
    opacity: 0.8;
  }
  
  .stars::after {
    opacity: 0.75;
  }
  
  .cta-section {
    margin-bottom: 2rem;
  }
  
  .whatsapp-form {
    padding: 0;
  }
  
  .whatsapp-input {
    font-size: 0.9rem;
    padding: 0.875rem 1.25rem;
  }
  
  .whatsapp-input::placeholder {
    font-size: 0.85rem;
  }
  
  .cta-button {
    padding: 0.875rem 1.5rem;
    font-size: 0.9rem;
  }
  
  .social-proof {
    font-size: 0.85rem;
    padding: 0 5px;
    text-align: center;
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .second-section {
    padding: 50px 15px 40px;
    margin-top: 40px;
    min-height: auto;
  }
  
  .section-container {
    gap: 32px;
  }
  
  .section-header {
    margin-bottom: 1.5rem;
  }
  
  .section-title {
    font-size: 24px;
  }
  
  .section-description {
    font-size: 14px;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 24px;
    padding: 0 10px;
  }
  
  .stat-card {
    padding: 20px 16px;
    max-width: 100%;
  }
  
  .stat-title {
    font-size: 20px;
  }
  
  .stat-value {
    font-size: 36px;
  }
  
  .stat-description {
    font-size: 14px;
    width: 100%;
    max-width: 280px;
  }
  
  .video-section {
    margin: 1.5rem 0;
    width: 100%;
  }
  
  .video-placeholder {
    padding: 50px 15px;
    border-radius: 12px;
  }
  
  .video-text {
    font-size: 28px;
  }
  
  .section-cta {
    flex-direction: row;
    gap: 16px;
    margin-top: 1.5rem;
    width: 100%;
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .book-meeting-button {
    flex: 1;
    min-width: 200px;
    padding: 12px 24px;
    font-size: 14px;
  }
  
  .whatsapp-link {
    flex-shrink: 0;
  }
  
  .third-section {
    padding: 40px 15px;
    margin-top: 40px;
    min-height: auto;
  }
  
  .third-section-vector {
    max-width: 250px;
    min-width: 180px;
    opacity: 0.6;
    background-size: contain;
  }
  
  .third-section-vector-right {
    display: none;
  }
  
  .third-section-vector-left {
    max-width: 250px;
    min-width: 180px;
    opacity: 0.6;
    background-size: contain;
    background-position: left center;
    display: block;
  }
  
  .third-section-container {
    gap: 28px;
  }
  
  .third-section-header {
    margin-bottom: 1.25rem;
  }
  
  .third-section-title {
    font-size: 24px;
  }
  
  .third-section-description {
    font-size: 14px;
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
  
  .services-section {
    gap: 24px;
    max-width: 100%;
  }
  
  .services-header {
    margin-bottom: 0.75rem;
  }
  
  .services-title {
    font-size: 24px;
  }
  
  .services-description {
    font-size: 14px;
  }
  
  .services-grid {
    grid-template-columns: 1fr;
    gap: 28px;
    width: 100%;
  }
  
  .service-card {
    max-width: 100%;
    align-items: center;
    text-align: center;
    gap: 16px;
    padding: 0;
  }
  
  .service-icon {
    width: 56px;
    height: 56px;
    padding: 10px;
  }
  
  .service-name {
    font-size: 18px;
    text-align: center;
    line-height: 1.4;
  }
  
  .service-desc {
    font-size: 14px;
    text-align: center;
    width: 100%;
    max-width: 100%;
    line-height: 1.5;
  }
  
  .what-we-do-section {
    gap: 28px;
    padding: 40px 15px;
  }
  
  .what-we-do-title {
    font-size: 24px;
    margin-bottom: 1.25rem;
  }
  
  .steps-grid {
    grid-template-columns: 1fr;
    gap: 20px;
    width: 100%;
  }
  
  /* Reset grid positioning for mobile */
  .steps-grid .step-card:nth-child(1),
  .steps-grid .step-card:nth-child(2),
  .steps-grid .step-card:nth-child(3),
  .steps-grid .step-card:nth-child(4),
  .steps-grid .step-card:nth-child(5),
  .steps-grid .step-card:nth-child(6),
  .steps-grid .step-card:nth-child(7) {
    grid-column: span 1;
  }
  
  .step-card {
    width: 100%;
    max-width: 100%;
    min-height: 170px;
    border-radius: 30px;
  }
  
  .step-card-header {
    height: 42px;
    border-radius: 30px 30px 0 0;
  }
  
  .step-header {
    font-size: 17px;
  }
  
  .step-card-body {
    padding: 18px 20px 20px;
    border-radius: 0 0 30px 30px;
  }
  
  .step-content {
    font-size: 16px;
    line-height: 1.5;
  }
  
  .what-you-get-section {
    gap: 24px;
    padding: 40px 15px;
  }
  
  .what-you-get-title {
    font-size: 24px;
    margin-bottom: 1.25rem;
  }
  
  .benefits-grid {
    grid-template-columns: 1fr;
    padding: 0;
    gap: 16px;
  }
  
  .benefit-item {
    min-height: 50px;
    gap: 12px;
    padding: 0;
  }
  
  .benefit-check {
    width: 32px;
    height: 32px;
  }
  
  .benefit-check svg {
    width: 18px;
    height: 18px;
  }
  
  .benefit-text {
    font-size: 16px;
  }
  
  .bonuses-section {
    padding: 40px 15px;
    margin-top: 40px;
  }
  
  .bonuses-container {
    gap: 28px;
  }
  
  .bonuses-title {
    font-size: 24px;
    margin-bottom: 1.25rem;
  }
  
  .bonuses-list {
    gap: 16px;
  }
  
  .bonus-item {
    padding: 18px 20px;
    gap: 16px;
    flex-direction: row;
    align-items: center;
  }
  
  .bonus-icon {
    width: 40px;
    height: 40px;
    flex-shrink: 0;
  }
  
  .bonus-text {
    font-size: 16px;
  }
  
  .clients-section {
    padding: 40px 10px 60px;
    margin-top: 40px;
  }
  
  .clients-container {
    padding: 0 10px;
    gap: 24px;
  }
  
  .clients-title {
    font-size: 24px;
  }
  
  .clients-subtitle {
    font-size: 14px;
  }
  
  .clients-slider-wrapper {
    padding: 25px 0;
  }
  
  .clients-slider-track {
    gap: 40px;
    animation-duration: 30s;
  }
  
  .client-logo {
    padding: 0 10px;
  }
  
  .client-logo img {
    max-width: 80px;
    max-height: 60px;
    height: 50px;
  }
  
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
    gap: 18px;
  }
  
  .testimonial-header {
    gap: 12px;
  }
  
  .testimonial-avatar {
    width: 48px;
    height: 48px;
  }
  
  .avatar-initial {
    font-size: 16px;
  }
  
  .testimonial-name {
    font-size: 16px;
  }
  
  .testimonial-stars span {
    font-size: 14px;
  }
  
  .testimonial-text {
    font-size: 14px;
    line-height: 1.5;
  }
  
  .play-button {
    width: 56px;
    height: 56px;
  }
  
  .play-button svg {
    width: 20px;
    height: 20px;
  }
  
  .footer-section {
    padding: 40px 15px 20px;
  }
  
  .footer-container {
    max-width: 100%;
  }
  
  .footer-content {
    grid-template-columns: 1fr;
    gap: 32px;
    margin-bottom: 32px;
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

/* Extra Small Mobile Devices (360px and below) */
@media (max-width: 360px) {
  .home-view {
    padding: 25px 8px 20px;
  }
  
  .hero-headline {
    font-size: 1.75rem;
  }
  
  .supporting-text {
    font-size: 0.85rem;
  }
  
  .whatsapp-input {
    font-size: 0.85rem;
    padding: 0.8rem 1rem;
  }
  
  .cta-button {
    padding: 0.8rem 1.2rem;
    font-size: 0.85rem;
  }
  
  .section-title,
  .third-section-title,
  .services-title,
  .what-we-do-title,
  .what-you-get-title,
  .bonuses-title,
  .clients-title,
  .testimonials-title {
    font-size: 22px;
  }
  
  .vector-shape {
    width: 100%;
    max-width: 220px;
    opacity: 0.4;
  }
  
  /* Hide right vector on extra small mobile - show only left */
  .vector-right {
    display: none;
  }
  
  .vector-left {
    width: 100%;
    max-width: 220px;
    min-width: 160px;
    opacity: 0.4;
    background-size: cover;
    background-position: left center;
    height: 100vh;
    background-repeat: no-repeat;
  }
  
  .third-section-vector {
    max-width: 220px;
    min-width: 160px;
    opacity: 0.4;
  }
  
  .third-section-vector-right {
    display: none;
  }
  
  .third-section-vector-left {
    max-width: 220px;
    min-width: 160px;
    opacity: 0.4;
  }
  
  .stat-value {
    font-size: 28px;
  }
  
  .what-you-get-section {
    padding: 35px 12px;
    gap: 20px;
  }
  
  .benefits-grid {
    gap: 14px;
  }
  
  .benefit-item {
    min-height: 48px;
    gap: 10px;
  }
  
  .benefit-check {
    width: 30px;
    height: 30px;
  }
  
  .benefit-check svg {
    width: 16px;
    height: 16px;
  }
  
  .benefit-text {
    font-size: 15px;
  }
  
  .bonuses-section {
    padding: 35px 12px;
    margin-top: 35px;
  }
  
  .bonuses-container {
    gap: 24px;
  }
  
  .bonuses-title {
    margin-bottom: 1rem;
  }
  
  .bonuses-list {
    gap: 14px;
  }
  
  .bonus-item {
    padding: 16px 18px;
    gap: 14px;
  }
  
  .bonus-icon {
    width: 36px;
    height: 36px;
  }
  
  .bonus-text {
    font-size: 15px;
  }
  
  .clients-section {
    padding: 35px 8px 50px;
    margin-top: 35px;
  }
  
  .clients-container {
    padding: 0 8px;
    gap: 20px;
  }
  
  .clients-subtitle {
    font-size: 13px;
  }
  
  .clients-slider-wrapper {
    padding: 20px 0;
  }
  
  .clients-slider-track {
    gap: 30px;
    animation-duration: 25s;
  }
  
  .client-logo {
    padding: 0 8px;
  }
  
  .client-logo img {
    max-width: 70px;
    max-height: 50px;
    height: 45px;
  }
  
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
  
  .testimonials-grid {
    gap: 18px;
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
    font-size: 15px;
  }
  
  .testimonial-name {
    font-size: 15px;
  }
  
  .testimonial-stars span {
    font-size: 13px;
  }
  
  .testimonial-text {
    font-size: 13px;
  }
  
  .play-button {
    width: 52px;
    height: 52px;
  }
  
  .play-button svg {
    width: 18px;
    height: 18px;
  }
  
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

/* Large Desktops (1440px and above) */
@media (min-width: 1440px) {
  .home-container {
    max-width: 1200px;
  }
  
  .hero-headline {
    font-size: 5rem;
  }
  
  .vector-shape {
    width: 350px;
  }
}
</style>
