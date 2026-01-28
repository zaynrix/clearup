


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
      <div class="hero-section">
        <h1 class="hero-headline">
          <span class="headline-white">Like Oxygen For</span>
          <span class="headline-purple">Your Business</span>
        </h1>
        
        <div class="supporting-text">
          <p>Growing a business is hard and chaos</p>
          <p>We make whole a lot easer</p>
          <p>More systemized, more predictable, less stressful, more fun</p>
        </div>
      </div>

      <!-- CTA Section -->
      <div class="cta-section">
        <form @submit.prevent="handleSubmit" class="whatsapp-form">
          <input
            v-model="phoneNumber"
            type="tel"
            class="whatsapp-input"
            placeholder="Enter whatsapp Number and we will send you some magic"
            :disabled="isLoading"
            required
          />
          <button 
            type="submit" 
            class="cta-button"
            :disabled="isLoading"
          >
            <span>Do it</span>
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
      <div class="social-proof">
        <span class="star">⭐</span>
        <span>4.8 client satisfaction from +20 founders</span>
      </div>
    </div>

    <!-- Second Section -->
    <div class="second-section">
      <div class="section-container">
        <!-- Header -->
        <div class="section-header">
          <h2 class="section-title">Who We Are</h2>
          <p class="section-description">We redesign your marketing system to run it self</p>
        </div>

        <!-- Statistics Cards -->
        <div class="stats-grid">
          <div class="stat-card">
            <h3 class="stat-title">Revenue generated</h3>
            <div class="stat-value">$4.7M</div>
            <p class="stat-description">we let our number do talking , $4.7M in reported client revenue and counting</p>
          </div>

          <div class="stat-card">
            <h3 class="stat-title">Leads generated</h3>
            <div class="stat-value">1.2M</div>
            <p class="stat-description">More 1.2M leads inquires about our client's services</p>
          </div>

          <div class="stat-card">
            <h3 class="stat-title">Our reach</h3>
            <div class="stat-value">28</div>
            <p class="stat-description">Serving client over 28 different country</p>
          </div>
        </div>

        <!-- Video Section -->
        <div class="video-section">
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
    <div class="third-section">
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
        <div class="services-section">
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
        <div class="what-we-do-section">
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
        <div class="what-you-get-section">
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
    <div class="bonuses-section">
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
    <div class="clients-section">
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
          </div>
        </div>
      </div>
    </div>

    <!-- Footer/Bottom Section -->
    <div class="footer-section">
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { HomeViewController } from '../controllers/HomeViewController'

const viewController = new HomeViewController()

const phoneNumber = computed({
  get: () => viewController.phoneNumber,
  set: (value: string) => viewController.setWhatsAppNumber(value)
})

const isLoading = computed(() => viewController.isLoading)
const errorMessage = computed(() => viewController.errorMessage)

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
</script>

<style scoped>
.home-view {
  position: relative;
  min-height: calc(100vh - 120px);
  padding: 60px 0 40px 20px;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
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

/* Stars Animation - Lightweight and Performance-Friendly */
.stars {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
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
    radial-gradient(2px 2px at 20% 30%, rgba(255, 255, 255, 0.8), transparent),
    radial-gradient(1px 1px at 60% 70%, rgba(255, 255, 255, 0.6), transparent),
    radial-gradient(1.5px 1.5px at 50% 50%, rgba(255, 255, 255, 0.7), transparent),
    radial-gradient(1px 1px at 80% 10%, rgba(255, 255, 255, 0.5), transparent),
    radial-gradient(2px 2px at 90% 40%, rgba(255, 255, 255, 0.8), transparent),
    radial-gradient(1px 1px at 33% 60%, rgba(255, 255, 255, 0.6), transparent),
    radial-gradient(1.5px 1.5px at 10% 80%, rgba(255, 255, 255, 0.7), transparent),
    radial-gradient(1px 1px at 40% 20%, rgba(255, 255, 255, 0.5), transparent),
    radial-gradient(2px 2px at 70% 90%, rgba(255, 255, 255, 0.8), transparent),
    radial-gradient(1px 1px at 15% 50%, rgba(255, 255, 255, 0.6), transparent),
    radial-gradient(1.5px 1.5px at 85% 15%, rgba(255, 255, 255, 0.7), transparent),
    radial-gradient(1px 1px at 25% 75%, rgba(255, 255, 255, 0.5), transparent),
    radial-gradient(2px 2px at 55% 25%, rgba(255, 255, 255, 0.8), transparent),
    radial-gradient(1px 1px at 75% 65%, rgba(255, 255, 255, 0.6), transparent);
  background-size: 200% 200%;
  background-repeat: repeat;
  animation: twinkle 8s ease-in-out infinite;
  will-change: opacity;
}

.stars::after {
  background-image: 
    radial-gradient(1.5px 1.5px at 30% 40%, rgba(193, 157, 230, 0.6), transparent),
    radial-gradient(1px 1px at 70% 20%, rgba(193, 157, 230, 0.5), transparent),
    radial-gradient(2px 2px at 45% 80%, rgba(193, 157, 230, 0.7), transparent),
    radial-gradient(1px 1px at 85% 60%, rgba(193, 157, 230, 0.4), transparent),
    radial-gradient(1.5px 1.5px at 20% 70%, rgba(193, 157, 230, 0.6), transparent),
    radial-gradient(1px 1px at 65% 35%, rgba(193, 157, 230, 0.5), transparent),
    radial-gradient(2px 2px at 35% 15%, rgba(193, 157, 230, 0.7), transparent),
    radial-gradient(1px 1px at 90% 85%, rgba(193, 157, 230, 0.4), transparent),
    radial-gradient(1.5px 1.5px at 50% 55%, rgba(193, 157, 230, 0.6), transparent),
    radial-gradient(1px 1px at 15% 25%, rgba(193, 157, 230, 0.5), transparent);
  animation: twinkle 6s ease-in-out infinite reverse;
  animation-delay: -3s;
}

@keyframes twinkle {
  0%, 100% {
    opacity: 0.3;
  }
  50% {
    opacity: 1;
  }
}


/* Vector Shapes on Both Sides */
.vector-shape {
  position: fixed;
  width: 288px;
  top: 0;
  bottom: 0;
  height: 100vh;
  z-index: 1;
  opacity: 0.6;
  pointer-events: none;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}

.vector-left {
  left: 0;
  background-image: url('/images/backgrounds/vector1.svg');
  background-position: left center;
}

.vector-right {
  right: 0;
  background-image: url('/images/backgrounds/vector1.svg');
  background-position: right center;
  transform: scaleX(-1); /* Flip horizontally for right side */
}

.home-container {
  position: relative;
  z-index: 2;
  max-width: 900px;
  width: 100%;
  text-align: center;
}

/* Hero Section */
.hero-section {
  margin-bottom: 5rem;
}

.hero-headline {
  font-size: 4.5rem;
  font-weight: 700;
  line-height: 1.1;
  margin-bottom: 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.headline-white {
  color: #F5F7FA;
}

.headline-purple {
  background: linear-gradient(103deg, #5B2096 0.52%, #C19DE6 125.79%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.supporting-text {
  font-size: 1.25rem;
  color: rgba(245, 247, 250, 0.9);
  line-height: 1.8;
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
  border: 1px solid rgba(67, 24, 111, 0.5);
  border-radius: 8px;
  color: #F5F7FA;
  font-size: 1rem;
  transition: all 0.2s ease;
}

.whatsapp-input::placeholder {
  color: rgba(245, 247, 250, 0.5);
}

.whatsapp-input:focus {
  outline: none;
  border-color: #5B2096;
  background-color: rgba(245, 247, 250, 0.15);
  box-shadow: 0 0 0 3px rgba(91, 32, 150, 0.2);
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
}

.star {
  font-size: 1.2rem;
}

/* Second Section */
.second-section {
  position: relative;
  width: 100%;
  min-height: 100vh;
  padding: 160px 20px 80px;
  margin-top: 120px;
  z-index: 2;
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
  line-height: normal;
  margin: 0;
}

.section-description {
  color: #ABBED1;
  text-align: center;
  font-family: 'Roboto', sans-serif;
  font-size: 18px;
  font-weight: 400;
  line-height: normal;
  margin: 0;
}

/* Statistics Grid */
.stats-grid {
  display: flex;
  width: 100%;
  padding: 0 40px;
  justify-content: space-between;
  align-items: flex-start;
  gap: 2rem;
}

.stat-card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 16px;
  flex: 1;
  max-width: 369px;
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
  font-weight: 600;
  line-height: normal;
  background: linear-gradient(180deg, #C19DE6 0%, #7441A8 100%);
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
  padding: 160px 20px;
  margin-top: 120px;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
}

.third-section-container {
  max-width: 1304px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 48px;
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
  height: 409px;
  border-radius: 50px;
  background: #14141B;
  box-shadow: 0 4px 4px 0 #43186F inset, 0 4px 4px 0 #43186F;
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
  color: #C19DE6;
  font-family: 'Roboto', sans-serif;
  font-size: 28px;
  font-weight: 600;
  line-height: normal;
  margin: 0;
  margin-top: 8px;
}

/* Services Section */
.services-section {
  width: 100%;
  max-width: 1127px;
  display: flex;
  flex-direction: column;
  gap: 32px;
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
}

.service-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
  max-width: 309px;
}

.service-icon {
  width: 72px;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
}

.service-name {
  color: #F5F7FA;
  font-family: 'Roboto', sans-serif;
  font-size: 20px;
  font-weight: 600;
  line-height: normal;
  margin: 0;
}

.service-desc {
  width: 251px;
  color: #ABBED1;
  font-family: 'Roboto', sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: normal;
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
}

/* First row: 4 cards */
.steps-grid .step-card:nth-child(1),
.steps-grid .step-card:nth-child(2),
.steps-grid .step-card:nth-child(3),
.steps-grid .step-card:nth-child(4) {
  grid-column: span 1;
}

/* Second row: 3 cards centered */
.steps-grid .step-card:nth-child(5) {
  grid-column: 1 / 2;
}

.steps-grid .step-card:nth-child(6) {
  grid-column: 2 / 3;
}

.steps-grid .step-card:nth-child(7) {
  grid-column: 3 / 4;
}

.step-card {
  width: 275px;
  min-height: 210px;
  border-radius: 50px;
  background: #14141B;
  box-shadow: 0 4px 4px 0 #43186F inset;
  filter: drop-shadow(0 4px 4px #43186F);
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.step-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 12px 0 rgba(67, 24, 111, 0.5) inset;
}

/* Step Card Header */
.step-card-header {
  width: 100%;
  height: 53px;
  border-radius: 50px 50px 0 0;
  background: linear-gradient(180deg, rgba(67, 24, 111, 0.3) 0%, #14141B 100%);
  box-shadow: 0 4px 4px 0 rgba(67, 24, 111, 0.50);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 2;
  border-bottom: 2px solid rgba(67, 24, 111, 0.4);
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
}

.benefit-item {
  display: flex;
  align-items: center;
  gap: 14px;
  height: 62px;
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
  margin-top: 80px;
  z-index: 2;
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
  border: 1px solid rgba(67, 24, 111, 0.5);
  transition: all 0.3s ease;
}

.bonus-item:hover {
  border-color: rgba(67, 24, 111, 0.8);
  box-shadow: 0 4px 12px rgba(67, 24, 111, 0.3);
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
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, #0B0B0F 0%, #0B0B0F 60%, rgba(67, 24, 111, 0.3) 100%);
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
  padding: 20px 0;
}

.clients-slider-track {
  display: flex;
  align-items: center;
  gap: 100px;
  animation: slideRightToLeft 35s linear infinite;
  will-change: transform;
  width: fit-content;
}

.client-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  opacity: 0.7;
  transition: opacity 0.3s ease;
}

.client-logo:hover {
  opacity: 1;
  animation-play-state: paused;
}

.client-logo img {
  max-width: 120px;
  max-height: 100px;
  height: 90px;
  width: auto;
  object-fit: contain;
  filter: brightness(0) invert(1);
}

@keyframes slideRightToLeft {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(calc(-50% - 50px));
  }
}

/* Footer/Bottom Section */
.footer-section {
  position: relative;
  width: 100%;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, rgba(67, 24, 111, 0.3) 0%, rgba(67, 24, 111, 0.5) 100%);
}

.footer-image {
  width: 100%;
  max-width: 100%;
  height: auto;
  display: block;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .hero-headline {
    font-size: 3.5rem;
  }
  
  .supporting-text {
    font-size: 1.1rem;
  }
  
  .vector-shape {
    width: 200px;
    opacity: 0.5;
    top: 0;
    height: 100vh;
  }
  
  .vector-right {
    right: 0;
  }
}

@media (max-width: 768px) {
  .home-view {
    padding: 40px 0 30px 20px;
  }
  
  .hero-headline {
    font-size: 2.5rem;
  }
  
  .supporting-text {
    font-size: 1rem;
    line-height: 1.6;
  }
  
  .vector-shape {
    width: 150px;
    opacity: 0.4;
    top: 0;
    height: 100vh;
  }
  
  .vector-right {
    right: 0;
  }
  
  .whatsapp-form {
    flex-direction: column;
  }
  
  .cta-button {
    width: 100%;
    justify-content: center;
  }
  
  .social-proof {
    font-size: 0.9rem;
  }
  
  .second-section {
    padding: 100px 20px 60px;
    margin-top: 80px;
  }
  
  .bonuses-section {
    padding: 60px 20px;
    margin-top: 60px;
  }
  
  .bonuses-title {
    font-size: 28px;
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
    margin-top: 60px;
  }
  
  .clients-title {
    font-size: 28px;
  }
  
  .clients-subtitle {
    font-size: 16px;
  }
  
  .clients-slider-track {
    gap: 60px;
    animation-duration: 30s;
  }
  
  .client-logo img {
    max-width: 100px;
    max-height: 60px;
  }
}

@media (max-width: 480px) {
  .hero-headline {
    font-size: 2rem;
  }
  
  .supporting-text {
    font-size: 0.9rem;
  }
  
  .vector-shape {
    width: 100px;
    opacity: 0.3;
    top: 0;
    height: 100vh;
  }
  
  .vector-right {
    right: 0;
  }
  
  .whatsapp-input {
    font-size: 0.9rem;
    padding: 0.875rem 1.25rem;
  }
  
  .cta-button {
    padding: 0.875rem 1.5rem;
    font-size: 0.9rem;
  }
  
  .section-title {
    font-size: 24px;
  }
  
  .section-description {
    font-size: 14px;
  }
  
  .clients-section {
    padding: 40px 20px 60px;
    margin-top: 40px;
  }
  
  .clients-container {
    padding: 0 20px;
    gap: 24px;
  }
  
  .clients-title {
    font-size: 24px;
  }
  
  .clients-subtitle {
    font-size: 14px;
  }
  
  .clients-slider-track {
    gap: 50px;
    animation-duration: 25s;
  }
  
  .client-logo img {
    max-width: 80px;
    max-height: 60px;
    height: 60px;
  }
  
  .bonuses-section {
    padding: 40px 20px;
    margin-top: 40px;
  }
  
  .bonuses-title {
    font-size: 24px;
  }
  
  .bonus-item {
    padding: 16px 20px;
    gap: 16px;
    flex-direction: column;
    align-items: flex-start;
  }
  
  .bonus-icon {
    width: 36px;
    height: 36px;
  }
  
  .bonus-text {
    font-size: 16px;
  }
  
  .stat-title {
    font-size: 24px;
  }
  
  .stat-value {
    font-size: 36px;
  }
  
  .stat-description {
    font-size: 16px;
  }
  
  .video-text {
    font-size: 36px;
  }
  
  .third-section {
    padding: 80px 20px;
    margin-top: 60px;
  }
  
  .third-section-title,
  .services-title,
  .what-we-do-title,
  .what-you-get-title {
    font-size: 28px;
  }
  
  .third-section-description,
  .services-description {
    font-size: 16px;
  }
  
  .system-card {
    padding: 40px 30px;
  }
  
  .system-card-title {
    font-size: 24px;
  }
  
  .system-card-text {
    font-size: 16px;
  }
  
  .system-card-roi {
    font-size: 20px;
  }
  
  .services-grid {
    grid-template-columns: 1fr;
  }
  
  .steps-grid {
    grid-template-columns: 1fr;
  }
  
  .steps-grid .step-card:nth-child(5),
  .steps-grid .step-card:nth-child(6),
  .steps-grid .step-card:nth-child(7) {
    grid-column: span 1;
  }
  
  .step-card {
    width: 100%;
    max-width: 100%;
  }
  
  .benefits-grid {
    padding: 0;
  }
}
</style>
