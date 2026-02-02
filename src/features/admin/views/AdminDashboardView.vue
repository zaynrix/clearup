



<template>
  <div class="admin-dashboard">
    <div class="dashboard-content">
      <!-- Sidebar -->
      <aside class="dashboard-sidebar">
        <div class="sidebar-header">
          <div class="logo-section">
            <div class="logo-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#5B2096" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="#5B2096" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="#5B2096" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <h2>{{ isAdmin ? 'Admin Panel' : 'Content Manager' }}</h2>
          </div>
          
          <div class="user-card">
            <div class="user-avatar">
              <span>{{ userInitials }}</span>
            </div>
            <div class="user-details">
              <p class="user-name">{{ user?.displayName || 'Admin' }}</p>
              <p class="user-email">{{ user?.email }}</p>
            </div>
            <button @click="handleLogout" class="logout-btn" title="Logout">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M16 17L21 12L16 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M21 12H9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
        
        <nav class="sidebar-nav">
          <button 
            v-for="tab in tabs" 
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="['nav-item', { active: activeTab === tab.id }]"
          >
            <span class="nav-icon" v-html="getTabIcon(tab.id)"></span>
            <span class="nav-label">{{ tab.label }}</span>
            <span v-if="activeTab === tab.id" class="nav-indicator"></span>
          </button>
        </nav>
      </aside>

      <!-- Main Content Area -->
      <main class="dashboard-main">
        <!-- Header Bar -->
        <div class="main-header">
          <div class="header-content">
            <div>
              <h1 class="page-title">{{ getActiveTabLabel() }}</h1>
              <p class="page-subtitle">Manage and edit your website content</p>
            </div>
            <div class="header-actions">
              <a href="/" target="_blank" class="preview-btn-header">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 13V19C18 19.5304 17.7893 20.0391 17.4142 20.4142C17.0391 20.7893 16.5304 21 16 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V8C3 7.46957 3.21071 6.96086 3.58579 6.58579C3.96086 6.21071 4.46957 6 5 6H11" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M15 3H21V9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M10 14L21 3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Preview
              </a>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="loading-container">
          <div class="loading-spinner">
            <div class="spinner"></div>
          </div>
          <p class="loading-text">Loading content...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="errorMessage" class="error-container">
          <div class="error-card">
            <div class="error-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="#ff6b6b" stroke-width="2"/>
                <path d="M12 8V12" stroke="#ff6b6b" stroke-width="2" stroke-linecap="round"/>
                <path d="M12 16H12.01" stroke="#ff6b6b" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </div>
            <h3>Error Loading Content</h3>
            <p>{{ errorMessage }}</p>
            <button @click="loadContent" class="retry-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 4V10H7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M23 20V14H17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M20.49 9C19.95 5.95 17.42 3.42 14.37 2.88M3.51 15C4.05 18.05 6.58 20.58 9.63 21.12M14.37 2.88C13.69 2.95 13.02 3.11 12.37 3.37M9.63 21.12C10.31 21.05 10.98 20.89 11.63 20.63M14.37 2.88L17.37 5.88M9.63 21.12L6.63 18.12M17.37 5.88L20.37 2.88M6.63 18.12L3.63 21.12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Retry
            </button>
          </div>
        </div>

        <!-- Content Editor -->
        <div v-else class="content-editor">
          <!-- Hero Section Editor -->
          <div v-if="activeTab === 'hero' && canAccessTab('hero')" class="editor-section">
            <div class="section-header">
              <div class="section-title-group">
                <div class="section-icon">🎯</div>
                <div>
                  <h3>Hero Section</h3>
                  <p class="section-description">The main headline and supporting text that visitors see first</p>
                </div>
              </div>
            </div>
            
            <div class="form-grid">
              <div class="form-group">
                <label>
                  <span class="label-text">Headline (White Text)</span>
                  <span class="label-hint">First part of the main headline</span>
                </label>
                <input 
                  v-model="formData.heroHeadlineWhite" 
                  type="text" 
                  placeholder="Like Oxygen For"
                  class="form-input"
                />
              </div>
              
              <div class="form-group">
                <label>
                  <span class="label-text">Headline (Purple Text)</span>
                  <span class="label-hint">Second part - appears in purple gradient</span>
                </label>
                <input 
                  v-model="formData.heroHeadlinePurple" 
                  type="text" 
                  placeholder="Your Business"
                  class="form-input"
                />
              </div>
              
              <div class="form-group full-width">
                <label>
                  <span class="label-text">Supporting Text</span>
                  <span class="label-hint">One line per paragraph (press Enter for new line)</span>
                </label>
                <textarea 
                  v-model="supportingTextTextarea" 
                  rows="4"
                  placeholder="Grow your business to new heights&#10;We make it easy for you.&#10;More customers, more profitable, more freedom, more life."
                  class="form-textarea"
                ></textarea>
                <div class="input-footer">
                  <span class="char-count">{{ supportingTextTextarea.split('\n').filter(l => l.trim()).length }} lines</span>
                </div>
              </div>
            </div>
          </div>

          <!-- CTA Section Editor -->
          <div v-if="activeTab === 'cta' && canAccessTab('cta')" class="editor-section">
            <div class="section-header">
              <div class="section-title-group">
                <div class="section-icon">📞</div>
                <div>
                  <h3>Call-to-Action Section</h3>
                  <p class="section-description">The form and button that captures leads</p>
                </div>
              </div>
            </div>
            
            <div class="form-grid">
              <div class="form-group">
                <label>
                  <span class="label-text">Input Placeholder</span>
                  <span class="label-hint">Text shown in the input field</span>
                </label>
                <input 
                  v-model="formData.ctaPlaceholder" 
                  type="text" 
                  placeholder="Enter your email address to get started"
                  class="form-input"
                />
              </div>
              
              <div class="form-group">
                <label>
                  <span class="label-text">Button Text</span>
                  <span class="label-hint">Text on the submit button</span>
                </label>
                <input 
                  v-model="formData.ctaButtonText" 
                  type="text" 
                  placeholder="Get Started"
                  class="form-input"
                />
              </div>
              
              <div class="form-group full-width">
                <label>
                  <span class="label-text">Social Proof Text</span>
                  <span class="label-hint">Trust indicator below the form</span>
                </label>
                <input 
                  v-model="formData.socialProofText" 
                  type="text" 
                  placeholder="5-star rating with 200+ reviews"
                  class="form-input"
                />
              </div>
            </div>
          </div>

          <!-- Who We Are Editor -->
          <div v-if="activeTab === 'who-we-are' && canAccessTab('who-we-are')" class="editor-section">
            <div class="section-header">
              <div class="section-title-group">
                <div class="section-icon">👥</div>
                <div>
                  <h3>Who We Are Section</h3>
                  <p class="section-description">Introduce your company and showcase key achievements</p>
                </div>
              </div>
            </div>

            <!-- Basic Information -->
            <div class="content-section-card">
              <div class="content-section-header">
                <h4 class="content-section-title">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 19.5C4 18.6716 4.67157 18 5.5 18H18.5C19.3284 18 20 18.6716 20 19.5C20 20.3284 19.3284 21 18.5 21H5.5C4.67157 21 4 20.3284 4 19.5Z" fill="currentColor"/>
                    <path d="M4 4.5C4 3.67157 4.67157 3 5.5 3H18.5C19.3284 3 20 3.67157 20 4.5C20 5.32843 19.3284 6 18.5 6H5.5C4.67157 6 4 5.32843 4 4.5Z" fill="currentColor"/>
                    <path d="M5.5 10.5C4.67157 10.5 4 11.1716 4 12C4 12.8284 4.67157 13.5 5.5 13.5H18.5C19.3284 13.5 20 12.8284 20 12C20 11.1716 19.3284 10.5 18.5 10.5H5.5Z" fill="currentColor"/>
                  </svg>
                  Basic Information
                </h4>
                <p class="content-section-description">Set the title and description for this section</p>
              </div>
            
              <div class="form-grid">
                <div class="form-group full-width">
                  <label>
                    <span class="label-text">Section Title</span>
                    <span class="label-hint">Main heading for the section</span>
                  </label>
                  <input v-model="formData.whoWeAreTitle" type="text" placeholder="Who We Are" class="form-input" />
                </div>
              
                <div class="form-group full-width">
                  <label>
                    <span class="label-text">Description</span>
                    <span class="label-hint">Brief introduction about your company</span>
                  </label>
                  <textarea v-model="formData.whoWeAreDescription" rows="4" placeholder="We are your marketing growth partner." class="form-textarea"></textarea>
                </div>
              </div>
            </div>

            <!-- Video Section -->
            <div class="content-section-card">
              <div class="content-section-header">
                <h4 class="content-section-title">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 10L19.553 7.276C19.8337 7.10733 20.1433 7.02267 20.482 7.022C20.8207 7.02133 21.1307 7.106 21.412 7.276C21.6933 7.446 21.904 7.68067 22.044 7.98C22.184 8.27933 22.254 8.61267 22.254 8.98V15.02C22.254 15.3873 22.184 15.7207 22.044 16.02C21.904 16.3193 21.6933 16.554 21.412 16.724C21.1307 16.894 20.8207 16.9787 20.482 16.978C20.1433 16.9773 19.8337 16.8927 19.553 16.724L15 14V10Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <rect x="2" y="6" width="13" height="12" rx="2" stroke="currentColor" stroke-width="2"/>
                </svg>
                  Video Content
              </h4>
                <p class="content-section-description">Add a video to showcase your company (optional)</p>
              </div>
              
              <div class="video-manager">
                <div class="video-options">
                  <label class="video-option-label">
                    <input 
                      type="radio" 
                      name="videoType" 
                      value="upload" 
                      v-model="formData.videoType"
                      @change="formData.videoUrl = ''"
                    />
                    <span>Upload Video File (Recommended)</span>
                  </label>
                  <label class="video-option-label">
                    <input 
                      type="radio" 
                      name="videoType" 
                      value="link" 
                      v-model="formData.videoType"
                      @change="formData.videoFileUrl = ''"
                    />
                    <span>Use Video Link</span>
                  </label>
                </div>

                <!-- Video Upload (Prioritized) -->
                <div v-if="formData.videoType === 'upload'" class="form-group full-width">
                  <label>
                    <span class="label-text">Video File</span>
                    <span class="label-hint">Upload your own video file (MP4, WebM, MOV, or AVI) - Recommended to avoid YouTube suggestions. Max size: 100MB</span>
                  </label>
                  <div class="video-upload-area">
                    <input 
                      type="file" 
                      accept="video/mp4,video/webm,video/quicktime,video/x-msvideo,.mp4,.webm,.mov,.avi" 
                      @change="handleVideoUpload"
                      ref="videoFileInput"
                      id="video-upload-input"
                      class="video-file-input"
                      :disabled="uploadingVideo"
                    />
                    <label for="video-upload-input" class="video-upload-label" :class="{ 'uploading': uploadingVideo }">
                      <svg v-if="!uploadingVideo" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M17 8L12 3L7 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M12 3V15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                      <div v-else class="upload-spinner"></div>
                      <span>{{ uploadingVideo ? `Uploading... ${Math.round(uploadProgress)}%` : (formData.videoFileUrl ? 'Change Video' : (selectedVideoFile ? selectedVideoFile.name : 'Choose video file (MP4, WebM, MOV, AVI)')) }}</span>
                    </label>
                    <div v-if="uploadingVideo" class="upload-progress-bar">
                      <div class="upload-progress-fill" :style="{ width: `${uploadProgress}%` }"></div>
                    </div>
                  </div>
                  <div v-if="formData.videoFileUrl" class="video-preview">
                    <div class="video-preview-header">
                      <p class="preview-label">Video Preview:</p>
                      <button @click="deleteVideo" class="btn-danger btn-small" type="button">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M3 6H5H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          <path d="M10 11V17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          <path d="M14 11V17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        Delete Video
                      </button>
                    </div>
                    <video :src="formData.videoFileUrl" controls class="video-preview-player"></video>
                  </div>
                </div>

                <!-- Video Link Input -->
                <div v-else-if="formData.videoType === 'link'" class="form-group full-width">
                  <label>
                    <span class="label-text">Video URL</span>
                    <span class="label-hint">YouTube or Vimeo link (Note: YouTube may show suggested videos. Upload your own video to avoid this.)</span>
                  </label>
                  <input 
                    v-model="formData.videoUrl" 
                    type="url" 
                    placeholder="https://www.youtube.com/watch?v=..." 
                    class="form-input"
                  />
                  <div v-if="formData.videoUrl" class="video-preview">
                    <p class="preview-label">Preview:</p>
                    <div class="video-preview-container">
                      <iframe 
                        :src="getVideoEmbedUrl(formData.videoUrl)" 
                        frameborder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowfullscreen
                      ></iframe>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Statistics Section -->
            <div class="content-section-card">
              <div class="content-section-header">
                <h4 class="content-section-title">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 11L12 14L22 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M21 12V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                  Key Statistics
              </h4>
                <p class="content-section-description">Showcase your achievements and key metrics</p>
              </div>
              
              <div class="stats-grid">
                <div class="stat-card-improved">
                  <div class="stat-card-header">
                    <div class="stat-icon-wrapper">
                    <div class="stat-icon">💰</div>
                  </div>
                    <h5 class="stat-card-title">Revenue</h5>
                  </div>
                  <div class="stat-card-body">
                    <div class="form-group">
                      <label>
                        <span class="label-text">Title</span>
                        <span class="label-hint">e.g., "Revenue Generated"</span>
                      </label>
                    <input v-model="formData.stats.revenue.title" placeholder="Title" class="form-input" />
                    </div>
                    <div class="form-group">
                      <label>
                        <span class="label-text">Value</span>
                        <span class="label-hint">e.g., "$4.7M" or "4.7 Million"</span>
                      </label>
                    <input v-model="formData.stats.revenue.value" placeholder="Value (e.g., $4.7M)" class="form-input" />
                    </div>
                    <div class="form-group">
                      <label>
                        <span class="label-text">Description</span>
                        <span class="label-hint">Brief explanation or context</span>
                      </label>
                    <textarea v-model="formData.stats.revenue.description" placeholder="Description" rows="2" class="form-textarea"></textarea>
                    </div>
                  </div>
                </div>
                
                <div class="stat-card-improved">
                  <div class="stat-card-header">
                    <div class="stat-icon-wrapper">
                    <div class="stat-icon">📊</div>
                  </div>
                    <h5 class="stat-card-title">Leads</h5>
                  </div>
                  <div class="stat-card-body">
                    <div class="form-group">
                      <label>
                        <span class="label-text">Title</span>
                        <span class="label-hint">e.g., "Leads Generated"</span>
                      </label>
                    <input v-model="formData.stats.leads.title" placeholder="Title" class="form-input" />
                    </div>
                    <div class="form-group">
                      <label>
                        <span class="label-text">Value</span>
                        <span class="label-hint">e.g., "1.2M" or "1.2 Million"</span>
                      </label>
                    <input v-model="formData.stats.leads.value" placeholder="Value (e.g., 1.2M)" class="form-input" />
                    </div>
                    <div class="form-group">
                      <label>
                        <span class="label-text">Description</span>
                        <span class="label-hint">Brief explanation or context</span>
                      </label>
                    <textarea v-model="formData.stats.leads.description" placeholder="Description" rows="2" class="form-textarea"></textarea>
                    </div>
                  </div>
                </div>
                
                <div class="stat-card-improved">
                  <div class="stat-card-header">
                    <div class="stat-icon-wrapper">
                    <div class="stat-icon">🌍</div>
                  </div>
                    <h5 class="stat-card-title">Reach</h5>
                  </div>
                  <div class="stat-card-body">
                    <div class="form-group">
                      <label>
                        <span class="label-text">Title</span>
                        <span class="label-hint">e.g., "Countries Reached"</span>
                      </label>
                    <input v-model="formData.stats.reach.title" placeholder="Title" class="form-input" />
                    </div>
                    <div class="form-group">
                      <label>
                        <span class="label-text">Value</span>
                        <span class="label-hint">e.g., "28" or "28 Countries"</span>
                      </label>
                    <input v-model="formData.stats.reach.value" placeholder="Value (e.g., 28)" class="form-input" />
                    </div>
                    <div class="form-group">
                      <label>
                        <span class="label-text">Description</span>
                        <span class="label-hint">Brief explanation or context</span>
                      </label>
                    <textarea v-model="formData.stats.reach.description" placeholder="Description" rows="2" class="form-textarea"></textarea>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- System Section Editor -->
          <div v-if="activeTab === 'system' && canAccessTab('system')" class="editor-section">
            <div class="section-header">
              <div class="section-title-group">
                <div class="section-icon">⚙️</div>
                <div>
                  <h3>System Section</h3>
                  <p class="section-description">Your marketing system details and ROI statement</p>
                </div>
              </div>
            </div>
            
            <div class="form-grid">
              <div class="form-group">
                <label>
                  <span class="label-text">Section Title</span>
                </label>
                <input v-model="formData.systemTitle" type="text" placeholder="The Clear up System™" class="form-input" />
              </div>
              
              <div class="form-group">
                <label>
                  <span class="label-text">Description</span>
                </label>
                <textarea v-model="formData.systemDescription" rows="2" placeholder="A done-for-you marketing system built for predictable growth." class="form-textarea"></textarea>
              </div>
              
              <div class="form-group full-width">
                <label>
                  <span class="label-text">Card Title</span>
                </label>
                <input v-model="formData.systemCardTitle" type="text" placeholder="Done-for-you Clear Up System" class="form-input" />
              </div>
              
              <div class="form-group full-width">
                <label>
                  <span class="label-text">Card Text</span>
                  <span class="label-hint">One line per paragraph</span>
                </label>
                <textarea v-model="systemCardTextTextarea" rows="4" class="form-textarea"></textarea>
              </div>
              
              <div class="form-group full-width">
                <label>
                  <span class="label-text">ROI Statement</span>
                  <span class="label-hint">Bold statement about return on investment</span>
                </label>
                <textarea v-model="formData.systemCardROI" rows="3" placeholder="TURN EVERY $1 INTO $833 IN REVENUE..." class="form-textarea roi-textarea"></textarea>
              </div>
            </div>
          </div>

          <!-- Services Editor -->
          <div v-if="activeTab === 'services' && canAccessTab('services')" class="editor-section">
            <div class="section-header">
              <div class="section-title-group">
                <div class="section-icon">🛠️</div>
                <div>
                  <h3>Services Section</h3>
                  <p class="section-description">List of services you offer</p>
                </div>
              </div>
            </div>
            
            <div class="form-grid">
              <div class="form-group">
                <label>
                  <span class="label-text">Section Title</span>
                </label>
                <input v-model="formData.servicesTitle" type="text" placeholder="Our Services" class="form-input" />
              </div>
              
              <div class="form-group">
                <label>
                  <span class="label-text">Description</span>
                </label>
                <input v-model="formData.servicesDescription" type="text" placeholder="We provide a wide range of services." class="form-input" />
              </div>
            </div>
            
            <div class="subsection">
              <div class="subsection-header">
                <h4 class="subsection-title">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 5V19M5 12H19" stroke="#5B2096" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                  Services List
                </h4>
                <button @click="addService" class="add-service-btn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                  Add Service
                </button>
              </div>
              
              <div class="services-list">
                <div v-for="(service, index) in formData.services" :key="index" class="service-card">
                  <div class="service-card-header">
                    <span class="service-number">#{{ index + 1 }}</span>
                    <button @click="removeService(index)" class="remove-service-btn" title="Remove service">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                      </svg>
                    </button>
                  </div>
                  <div class="service-fields">
                    <input v-model="service.name" placeholder="Service Name" class="form-input" />
                    <textarea v-model="service.description" placeholder="Service Description" rows="2" class="form-textarea"></textarea>
                  </div>
                </div>
                <div v-if="formData.services.length === 0" class="empty-state">
                  <p>No services added yet. Click "Add Service" to get started.</p>
                </div>
              </div>
            </div>
          </div>

          <!-- What We Do Editor -->
          <div v-if="activeTab === 'what-we-do' && canAccessTab('what-we-do')" class="editor-section">
            <div class="section-header">
              <div class="section-title-group">
                <div class="section-icon">📋</div>
                <div>
                  <h3>What We Do Section</h3>
                  <p class="section-description">Step-by-step process explanation</p>
                </div>
              </div>
            </div>
            
            <div class="form-grid">
              <div class="form-group full-width">
                <label>
                  <span class="label-text">Section Title</span>
                </label>
                <input v-model="formData.whatWeDoTitle" type="text" placeholder="What We Do" class="form-input" />
              </div>
            </div>
            
            <div class="subsection">
              <div class="subsection-header">
              <h4 class="subsection-title">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 11L12 14L22 4" stroke="#5B2096" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M21 12V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16" stroke="#5B2096" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Process Steps
              </h4>
                <button @click="addStep" type="button" class="btn-primary btn-small">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 5V19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  Add Step
                </button>
              </div>
              <div class="steps-list">
                <div 
                  v-for="(step, index) in formData.steps" 
                  :key="`step-${index}`" 
                  class="step-card"
                  :draggable="true"
                  @dragstart="handleStepDragStart($event, index)"
                  @dragover.prevent="handleStepDragOver($event, index)"
                  @drop="handleStepDrop($event, index)"
                  @dragend="handleStepDragEnd"
                >
                  <div class="step-card-header">
                    <div class="step-drag-handle">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 5H11V7H9V5Z" fill="currentColor"/>
                        <path d="M9 11H11V13H9V11Z" fill="currentColor"/>
                        <path d="M9 17H11V19H9V17Z" fill="currentColor"/>
                        <path d="M13 5H15V7H13V5Z" fill="currentColor"/>
                        <path d="M13 11H15V13H13V11Z" fill="currentColor"/>
                        <path d="M13 17H15V19H13V17Z" fill="currentColor"/>
                      </svg>
                    </div>
                  <div class="step-number">{{ step.number }}</div>
                    <div class="step-actions">
                      <button 
                        @click="moveStepUp(index)" 
                        type="button" 
                        class="btn-icon"
                        :disabled="index === 0"
                        title="Move Up"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M18 15L12 9L6 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                      </button>
                      <button 
                        @click="moveStepDown(index)" 
                        type="button" 
                        class="btn-icon"
                        :disabled="index === formData.steps.length - 1"
                        title="Move Down"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M6 9L12 15L18 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                      </button>
                      <button 
                        @click="removeStep(index)" 
                        type="button" 
                        class="btn-icon btn-danger-icon"
                        title="Delete Step"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M3 6H5H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                      </button>
                </div>
              </div>
                  <textarea 
                    v-model="step.content" 
                    rows="3" 
                    :placeholder="`Step ${step.number} content`" 
                    class="form-textarea step-content-input"
                  ></textarea>
                </div>
                <div v-if="formData.steps.length === 0" class="empty-state">
                  <p>No steps added yet. Click "Add Step" to create your first step.</p>
                </div>
              </div>
            </div>
          </div>

          <!-- What You Get Editor -->
          <div v-if="activeTab === 'what-you-get' && canAccessTab('what-you-get')" class="editor-section">
            <div class="section-header">
              <div class="section-title-group">
                <div class="section-icon">✅</div>
                <div>
                  <h3>What You Get Section</h3>
                  <p class="section-description">Benefits and value propositions</p>
                </div>
              </div>
            </div>
            
            <div class="form-grid">
              <div class="form-group full-width">
                <label>
                  <span class="label-text">Section Title</span>
                </label>
                <input v-model="formData.whatYouGetTitle" type="text" placeholder="What You Get" class="form-input" />
              </div>
              </div>
              
            <div class="subsection">
              <div class="subsection-header">
                <h4 class="subsection-title">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 12L11 14L15 10" stroke="#5B2096" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#5B2096" stroke-width="2"/>
                  </svg>
                  Benefits
                </h4>
                <button @click="addBenefit" type="button" class="btn-primary btn-small">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 5V19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  Add Benefit
                </button>
                </div>
              <div class="benefits-list">
                <div 
                  v-for="(benefit, index) in formData.benefits" 
                  :key="`benefit-${index}`" 
                  class="benefit-card"
                  :draggable="true"
                  @dragstart="handleBenefitDragStart($event, index)"
                  @dragover.prevent="handleBenefitDragOver($event, index)"
                  @drop="handleBenefitDrop($event, index)"
                  @dragend="handleBenefitDragEnd"
                >
                  <div class="benefit-drag-handle">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 5H11V7H9V5Z" fill="currentColor"/>
                      <path d="M9 11H11V13H9V11Z" fill="currentColor"/>
                      <path d="M9 17H11V19H9V17Z" fill="currentColor"/>
                      <path d="M13 5H15V7H13V5Z" fill="currentColor"/>
                      <path d="M13 11H15V13H13V11Z" fill="currentColor"/>
                      <path d="M13 17H15V19H13V17Z" fill="currentColor"/>
                    </svg>
              </div>
                  <div class="benefit-check-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 12L11 14L15 10" stroke="#5B2096" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#5B2096" stroke-width="2"/>
                    </svg>
                  </div>
                  <input 
                    v-model="formData.benefits[index]" 
                    type="text" 
                    :placeholder="`Benefit ${index + 1}`" 
                    class="form-input benefit-input"
                  />
                  <div class="benefit-actions">
                    <button 
                      @click="moveBenefitUp(index)" 
                      type="button" 
                      class="btn-icon"
                      :disabled="index === 0"
                      title="Move Up"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 15L12 9L6 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </button>
                    <button 
                      @click="moveBenefitDown(index)" 
                      type="button" 
                      class="btn-icon"
                      :disabled="index === formData.benefits.length - 1"
                      title="Move Down"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 9L12 15L18 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </button>
                    <button 
                      @click="removeBenefit(index)" 
                      type="button" 
                      class="btn-icon btn-danger-icon"
                      title="Delete Benefit"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 6H5H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </div>
                <div v-if="formData.benefits.length === 0" class="empty-state">
                  <p>No benefits added yet. Click "Add Benefit" to create your first benefit.</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Bonuses Editor -->
          <div v-if="activeTab === 'bonuses' && canAccessTab('bonuses')" class="editor-section">
            <div class="section-header">
              <div class="section-title-group">
                <div class="section-icon">🎁</div>
                <div>
                  <h3>Bonuses Section</h3>
                  <p class="section-description">Additional offerings and bonuses</p>
                </div>
              </div>
            </div>
            
            <div class="form-grid">
              <div class="form-group full-width">
                <label>
                  <span class="label-text">Section Title</span>
                </label>
                <input v-model="formData.bonusesTitle" type="text" placeholder="Bonuses Included" class="form-input" />
              </div>
              </div>
              
            <div class="subsection">
              <div class="subsection-header">
                <h4 class="subsection-title">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="#5B2096" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  Bonuses
                </h4>
                <button @click="addBonus" type="button" class="btn-primary btn-small">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 5V19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  Add Bonus
                </button>
                </div>
              <div class="benefits-list">
                <div 
                  v-for="(bonus, index) in formData.bonuses" 
                  :key="`bonus-${index}`" 
                  class="benefit-card"
                  :draggable="true"
                  @dragstart="handleBonusDragStart($event, index)"
                  @dragover.prevent="handleBonusDragOver($event, index)"
                  @drop="handleBonusDrop($event, index)"
                  @dragend="handleBonusDragEnd"
                >
                  <div class="benefit-drag-handle">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 5H11V7H9V5Z" fill="currentColor"/>
                      <path d="M9 11H11V13H9V11Z" fill="currentColor"/>
                      <path d="M9 17H11V19H9V17Z" fill="currentColor"/>
                      <path d="M13 5H15V7H13V5Z" fill="currentColor"/>
                      <path d="M13 11H15V13H13V11Z" fill="currentColor"/>
                      <path d="M13 17H15V19H13V17Z" fill="currentColor"/>
                    </svg>
              </div>
                  <div class="benefit-check-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="#5B2096" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </div>
                  <input 
                    v-model="formData.bonuses[index]" 
                    type="text" 
                    :placeholder="`Bonus ${index + 1}`" 
                    class="form-input benefit-input"
                  />
                  <div class="benefit-actions">
                    <button 
                      @click="moveBonusUp(index)" 
                      type="button" 
                      class="btn-icon"
                      :disabled="index === 0"
                      title="Move Up"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 15L12 9L6 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </button>
                    <button 
                      @click="moveBonusDown(index)" 
                      type="button" 
                      class="btn-icon"
                      :disabled="index === formData.bonuses.length - 1"
                      title="Move Down"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 9L12 15L18 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </button>
                    <button 
                      @click="removeBonus(index)" 
                      type="button" 
                      class="btn-icon btn-danger-icon"
                      title="Delete Bonus"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 6H5H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </div>
                <div v-if="formData.bonuses.length === 0" class="empty-state">
                  <p>No bonuses added yet. Click "Add Bonus" to create your first bonus.</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Clients & Testimonials Editor -->
          <div v-if="activeTab === 'clients' && canAccessTab('clients')" class="editor-section">
            <div class="section-header">
              <div class="section-title-group">
                <div class="section-icon">💼</div>
                <div>
                  <h3>Clients & Testimonials</h3>
                  <p class="section-description">Manage client logos and customer testimonials</p>
                </div>
              </div>
            </div>

            <!-- Section Titles Configuration -->
            <div class="content-section-card">
              <div class="content-section-header">
                <h4 class="content-section-title">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 19.5C4 18.6716 4.67157 18 5.5 18H18.5C19.3284 18 20 18.6716 20 19.5C20 20.3284 19.3284 21 18.5 21H5.5C4.67157 21 4 20.3284 4 19.5Z" fill="currentColor"/>
                    <path d="M4 4.5C4 3.67157 4.67157 3 5.5 3H18.5C19.3284 3 20 3.67157 20 4.5C20 5.32843 19.3284 6 18.5 6H5.5C4.67157 6 4 5.32843 4 4.5Z" fill="currentColor"/>
                    <path d="M5.5 10.5C4.67157 10.5 4 11.1716 4 12C4 12.8284 4.67157 13.5 5.5 13.5H18.5C19.3284 13.5 20 12.8284 20 12C20 11.1716 19.3284 10.5 18.5 10.5H5.5Z" fill="currentColor"/>
                  </svg>
                  Section Titles
                </h4>
                <p class="content-section-description">Configure titles and subtitles for both sections</p>
            </div>
            
            <div class="form-grid">
              <div class="form-group">
                <label>
                  <span class="label-text">Clients Title</span>
                    <span class="label-hint">Main heading for the clients section</span>
                </label>
                <input v-model="formData.clientsTitle" type="text" placeholder="Our Clients" class="form-input" />
              </div>
              
              <div class="form-group">
                <label>
                  <span class="label-text">Clients Subtitle</span>
                    <span class="label-hint">Supporting text below the clients title</span>
                </label>
                <input v-model="formData.clientsSubtitle" type="text" placeholder="We work with leading brands and businesses." class="form-input" />
              </div>
              
              <div class="form-group">
                <label>
                  <span class="label-text">Testimonials Title</span>
                    <span class="label-hint">Main heading for the testimonials section</span>
                </label>
                <input v-model="formData.testimonialsTitle" type="text" placeholder="What Our Clients Say" class="form-input" />
              </div>
              
              <div class="form-group">
                <label>
                  <span class="label-text">Testimonials Subtitle</span>
                    <span class="label-hint">Supporting text below the testimonials title</span>
                </label>
                <input v-model="formData.testimonialsSubtitle" type="text" placeholder="Read testimonials from clients who worked with us." class="form-input" />
                </div>
              </div>
            </div>

            <!-- Client Logos Management -->
            <div class="content-section-card">
              <div class="content-section-header">
                <h4 class="content-section-title">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 16L8.586 11.414C8.961 11.039 9.47 10.828 10 10.828C10.53 10.828 11.039 11.039 11.414 11.414L16 16M14 14L15.586 12.414C15.961 12.039 16.47 11.828 17 11.828C17.53 11.828 18.039 12.039 18.414 12.414L20 14M14 8H14.01M6 20H18C18.5304 20 19.0391 19.7893 19.4142 19.4142C19.7893 19.0391 20 18.5304 20 18V6C20 5.46957 19.7893 4.96086 19.4142 4.58579C19.0391 4.21071 18.5304 4 18 4H6C5.46957 4 4.96086 4.21071 4.58579 4.58579C4.21071 4.96086 4 5.46957 4 6V18C4 18.5304 4.21071 19.0391 4.58579 19.4142C4.96086 19.7893 5.46957 20 6 20Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                  Client Logos
              </h4>
                <p class="content-section-description">Add and manage client company logos displayed on your website</p>
              </div>

              <div class="client-logos-manager">
                <div class="section-action-bar">
                  <div class="section-info">
                    <span class="section-count">{{ formData.clientLogos?.length || 0 }} logo{{ (formData.clientLogos?.length || 0) !== 1 ? 's' : '' }} added</span>
                  </div>
                  <button @click="addNewClientLogo" class="btn-primary">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                    Add Client Logo
                </button>
                </div>

                <div v-if="!formData.clientLogos || formData.clientLogos.length === 0" class="empty-state-card">
                  <div class="empty-state-icon">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 16L8.586 11.414C8.961 11.039 9.47 10.828 10 10.828C10.53 10.828 11.039 11.039 11.414 11.414L16 16M14 14L15.586 12.414C15.961 12.039 16.47 11.828 17 11.828C17.53 11.828 18.039 12.039 18.414 12.414L20 14M14 8H14.01M6 20H18C18.5304 20 19.0391 19.7893 19.4142 19.4142C19.7893 19.0391 20 18.5304 20 18V6C20 5.46957 19.7893 4.96086 19.4142 4.58579C19.0391 4.21071 18.5304 4 18 4H6C5.46957 4 4.96086 4.21071 4.58579 4.58579C4.21071 4.96086 4 5.46957 4 6V18C4 18.5304 4.21071 19.0391 4.58579 19.4142C4.96086 19.7893 5.46957 20 6 20Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </div>
                  <p class="empty-state-title">No client logos yet</p>
                  <p class="empty-state-description">Add your first client logo to showcase your partnerships</p>
                  <button @click="addNewClientLogo" class="btn-primary" style="margin-top: 1rem;">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                    Add First Logo
                  </button>
                </div>

                <div v-else class="client-logos-grid">
                  <div v-for="(logo, index) in formData.clientLogos" :key="logo.id || index" class="client-logo-card">
                    <div class="client-logo-card-header">
                      <div class="client-logo-card-number">
                        <span>#{{ index + 1 }}</span>
                      </div>
                      <button @click="removeClientLogo(index)" class="btn-icon btn-icon-danger" title="Delete logo">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M3 6H5H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                      </button>
                    </div>

                    <div v-if="logo.logoUrl || logo.logoFileUrl" class="client-logo-preview">
                      <img :src="logo.logoFileUrl || logo.logoUrl" :alt="logo.name || 'Client logo'" class="client-logo-preview-img" />
                    </div>

                    <div class="client-logo-form">
                      <div class="form-group">
                        <label>
                          <span class="label-text">Company Name (Optional)</span>
                          <span class="label-hint">For identification and alt text</span>
                        </label>
                        <input v-model="logo.name" type="text" placeholder="Company Name" class="form-input" />
                      </div>

                      <div class="form-group">
                        <label>
                          <span class="label-text">Logo Image</span>
                          <span class="label-hint">Upload or paste image URL</span>
                        </label>
                        <div class="photo-upload-section">
                          <div class="photo-options">
                            <label class="photo-option-label">
                              <input type="radio" :name="`logo-type-${index}`" value="url" v-model="logo.logoType" @change="logo.logoFileUrl = ''" />
                              <span>Image URL</span>
                            </label>
                            <label class="photo-option-label">
                              <input type="radio" :name="`logo-type-${index}`" value="upload" v-model="logo.logoType" @change="logo.logoUrl = ''" />
                              <span>Upload Image</span>
                            </label>
                          </div>

                          <input 
                            v-if="logo.logoType === 'url'"
                            v-model="logo.logoUrl" 
                            type="url" 
                            placeholder="https://example.com/logo.png" 
                            class="form-input"
                            style="margin-top: 0.5rem;"
                          />

                          <div v-if="logo.logoType === 'upload'" class="photo-upload-area">
                            <input 
                              type="file" 
                              accept="image/png,image/jpeg,image/jpg,image/svg+xml,.png,.jpg,.jpeg,.svg" 
                              @change="handleClientLogoUpload($event, index)"
                              :id="`logo-upload-${index}`"
                              class="photo-file-input"
                            />
                            <label :for="`logo-upload-${index}`" class="photo-upload-label" :class="{ 'uploading': uploadingLogos[index] }">
                              <svg v-if="!uploadingLogos[index]" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M17 8L12 3L7 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M12 3V15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                              </svg>
                              <div v-else class="upload-spinner"></div>
                              <span>{{ uploadingLogos[index] ? 'Uploading...' : (logo.logoFileUrl ? 'Change Logo' : 'Choose logo file') }}</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Testimonials Management -->
            <div class="content-section-card">
              <div class="content-section-header">
                <h4 class="content-section-title">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                  Testimonials
              </h4>
                <p class="content-section-description">Manage customer testimonials and reviews</p>
              </div>

              <div class="testimonials-manager">
                <div class="section-action-bar">
                  <div class="section-info">
                    <span class="section-count">{{ formData.testimonials?.length || 0 }} testimonial{{ (formData.testimonials?.length || 0) !== 1 ? 's' : '' }} added</span>
                  </div>
                  <button @click="addNewTestimonial" class="btn-primary">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                    Add Testimonial
                </button>
                </div>

                <div v-if="formData.testimonials && formData.testimonials.length === 0" class="empty-state-card">
                  <div class="empty-state-icon">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </div>
                  <p class="empty-state-title">No testimonials yet</p>
                  <p class="empty-state-description">Add customer testimonials to build trust and credibility</p>
                  <button @click="addNewTestimonial" class="btn-primary" style="margin-top: 1rem;">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                    Add First Testimonial
                  </button>
                </div>

                <div v-else class="testimonials-grid">
                  <div v-for="(testimonial, index) in formData.testimonials" :key="testimonial.id || index" class="testimonial-card">
                    <div class="testimonial-card-header">
                      <div class="testimonial-card-number">
                        <span>#{{ index + 1 }}</span>
                      </div>
                      <button @click="removeTestimonial(index)" class="btn-icon btn-icon-danger" title="Delete testimonial">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M3 6H5H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                      </button>
                    </div>

                    <div class="testimonial-card-content">
                      <div class="testimonial-preview-section" v-if="testimonial.name || testimonial.review">
                        <div v-if="testimonial.photoUrl || testimonial.photoFileUrl" class="testimonial-preview-photo">
                          <img :src="testimonial.photoFileUrl || testimonial.photoUrl" :alt="testimonial.name" />
                        </div>
                        <div class="testimonial-preview-info">
                          <div class="testimonial-preview-name">{{ testimonial.name || 'Customer Name' }}</div>
                          <div v-if="testimonial.subtitle" class="testimonial-preview-subtitle">{{ testimonial.subtitle }}</div>
                          <div v-if="testimonial.stars" class="testimonial-preview-stars">
                            <span v-for="i in 5" :key="i" class="star" :class="{ 'star-filled': i <= testimonial.stars }">★</span>
                          </div>
                        </div>
                        <div v-if="testimonial.review" class="testimonial-preview-review">{{ testimonial.review }}</div>
                      </div>

                      <div class="testimonial-form-section">
                    <div class="form-grid">
                      <div class="form-group">
                        <label>
                          <span class="label-text">Name *</span>
                              <span class="label-hint">Customer's full name</span>
                        </label>
                        <input v-model="testimonial.name" type="text" placeholder="John Doe" class="form-input" required />
                      </div>

                      <div class="form-group">
                        <label>
                              <span class="label-text">Role/Title</span>
                              <span class="label-hint">e.g., "Founder & CEO - Company"</span>
                        </label>
                        <input v-model="testimonial.subtitle" type="text" placeholder="Founder & CEO - Company Name" class="form-input" />
                      </div>

                      <div class="form-group">
                        <label>
                          <span class="label-text">Star Rating *</span>
                              <span class="label-hint">1-5 stars</span>
                        </label>
                        <select v-model.number="testimonial.stars" class="form-input" required>
                          <option :value="1">1 Star</option>
                          <option :value="2">2 Stars</option>
                          <option :value="3">3 Stars</option>
                          <option :value="4">4 Stars</option>
                          <option :value="5">5 Stars</option>
                        </select>
                      </div>

                      <div class="form-group full-width">
                        <label>
                          <span class="label-text">Review Text *</span>
                              <span class="label-hint">Customer's testimonial</span>
                        </label>
                        <textarea v-model="testimonial.review" rows="4" placeholder="Enter the review text..." class="form-textarea" required></textarea>
                          </div>
                        </div>
                      </div>

                      <!-- Profile Photo Section -->
                      <div class="form-group full-width">
                        <label>
                          <span class="label-text">Profile Photo</span>
                          <span class="label-hint">Profile picture of the reviewer (upload image or paste image URL)</span>
                        </label>
                        <div class="photo-upload-section">
                          <div class="photo-options">
                            <label class="photo-option-label">
                              <input type="radio" :name="`photo-type-${index}`" value="url" v-model="testimonial.photoType" @change="testimonial.photoFileUrl = ''" />
                              <span>Image URL</span>
                            </label>
                            <label class="photo-option-label">
                              <input type="radio" :name="`photo-type-${index}`" value="upload" v-model="testimonial.photoType" @change="testimonial.photoUrl = ''" />
                              <span>Upload Image</span>
                            </label>
                          </div>

                          <input 
                            v-if="testimonial.photoType === 'url'"
                            v-model="testimonial.photoUrl" 
                            type="url" 
                            placeholder="https://example.com/photo.jpg" 
                            class="form-input"
                            style="margin-top: 0.5rem;"
                          />

                          <div v-if="testimonial.photoType === 'upload'" class="photo-upload-area">
                            <input 
                              type="file" 
                              accept="image/png,image/jpeg,image/jpg,image/webp,.png,.jpg,.jpeg,.webp" 
                              @change="handlePhotoUpload($event, index)"
                              :id="`photo-upload-${index}`"
                              class="photo-file-input"
                              :disabled="uploadingPhotos[index]"
                            />
                            <label :for="`photo-upload-${index}`" class="photo-upload-label" :class="{ 'uploading': uploadingPhotos[index] }">
                              <svg v-if="!uploadingPhotos[index]" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M17 8L12 3L7 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M12 3V15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                              </svg>
                              <div v-else class="upload-spinner"></div>
                              <span>{{ uploadingPhotos[index] ? `Uploading... ${Math.round(uploadProgressPhotos[index] || 0)}%` : (testimonial.photoFileUrl ? 'Change Photo' : 'Choose photo file (PNG, JPG, WebP)') }}</span>
                            </label>
                            <div v-if="uploadingPhotos[index]" class="upload-progress-bar">
                              <div class="upload-progress-fill" :style="{ width: `${uploadProgressPhotos[index] || 0}%` }"></div>
                            </div>
                          </div>

                          <div v-if="testimonial.photoUrl || testimonial.photoFileUrl" class="photo-preview">
                            <p class="preview-label">Profile Photo Preview:</p>
                            <img :src="testimonial.photoFileUrl || testimonial.photoUrl" alt="Preview" class="photo-preview-img" />
                          </div>
                        </div>
                      </div>

                      <!-- Video Thumbnail Section -->
                      <div v-if="testimonial.videoUrl || testimonial.videoFileUrl" class="form-group full-width">
                        <label>
                          <span class="label-text">Video Thumbnail Image</span>
                          <span class="label-hint">Thumbnail image shown for the video (upload image or paste image URL)</span>
                        </label>
                        <div class="photo-upload-section">
                          <div class="photo-options">
                            <label class="photo-option-label">
                              <input type="radio" :name="`video-thumbnail-type-${index}`" value="url" v-model="testimonial.videoThumbnailType" @change="testimonial.videoThumbnailFileUrl = ''" />
                              <span>Image URL</span>
                            </label>
                            <label class="photo-option-label">
                              <input type="radio" :name="`video-thumbnail-type-${index}`" value="upload" v-model="testimonial.videoThumbnailType" @change="testimonial.videoThumbnailUrl = ''" />
                              <span>Upload Image</span>
                            </label>
                          </div>

                          <input 
                            v-if="testimonial.videoThumbnailType === 'url'"
                            v-model="testimonial.videoThumbnailUrl" 
                            type="url" 
                            placeholder="https://example.com/thumbnail.jpg" 
                            class="form-input"
                            style="margin-top: 0.5rem;"
                          />

                          <div v-if="testimonial.videoThumbnailType === 'upload'" class="photo-upload-area">
                            <input 
                              type="file" 
                              accept="image/png,image/jpeg,image/jpg,image/webp,.png,.jpg,.jpeg,.webp" 
                              @change="handleVideoThumbnailUpload($event, index)"
                              :id="`video-thumbnail-upload-${index}`"
                              class="photo-file-input"
                              :disabled="uploadingThumbnails[index]"
                            />
                            <label :for="`video-thumbnail-upload-${index}`" class="photo-upload-label" :class="{ 'uploading': uploadingThumbnails[index] }">
                              <svg v-if="!uploadingThumbnails[index]" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M17 8L12 3L7 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M12 3V15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                              </svg>
                              <div v-else class="upload-spinner"></div>
                              <span>{{ uploadingThumbnails[index] ? `Uploading... ${Math.round(uploadProgressThumbnails[index] || 0)}%` : (testimonial.videoThumbnailFileUrl ? 'Change Thumbnail' : 'Choose thumbnail image (PNG, JPG, WebP)') }}</span>
                            </label>
                            <div v-if="uploadingThumbnails[index]" class="upload-progress-bar">
                              <div class="upload-progress-fill" :style="{ width: `${uploadProgressThumbnails[index] || 0}%` }"></div>
                            </div>
                          </div>

                          <div v-if="testimonial.videoThumbnailUrl || testimonial.videoThumbnailFileUrl" class="photo-preview">
                            <p class="preview-label">Video Thumbnail Preview:</p>
                            <img :src="testimonial.videoThumbnailFileUrl || testimonial.videoThumbnailUrl" alt="Thumbnail Preview" class="photo-preview-img" />
                          </div>
                        </div>
                      </div>

                      <!-- Video Section -->
                      <div class="form-group full-width">
                        <label>
                          <span class="label-text">Video (Optional)</span>
                          <span class="label-hint">Upload video or paste video link</span>
                        </label>
                        <div class="testimonial-video-section">
                          <div class="video-options">
                            <label class="video-option-label">
                              <input type="radio" :name="`video-type-${index}`" value="none" v-model="testimonial.videoType" @change="testimonial.videoUrl = ''; testimonial.videoFileUrl = ''" />
                              <span>No Video</span>
                            </label>
                            <label class="video-option-label">
                              <input type="radio" :name="`video-type-${index}`" value="link" v-model="testimonial.videoType" @change="testimonial.videoFileUrl = ''" />
                              <span>Video Link</span>
                            </label>
                            <label class="video-option-label">
                              <input type="radio" :name="`video-type-${index}`" value="upload" v-model="testimonial.videoType" @change="testimonial.videoUrl = ''" />
                              <span>Upload Video</span>
                            </label>
                          </div>

                          <input 
                            v-if="testimonial.videoType === 'link'"
                            v-model="testimonial.videoUrl" 
                            type="url" 
                            placeholder="https://www.youtube.com/watch?v=..." 
                            class="form-input"
                            style="margin-top: 0.5rem;"
                          />

                          <div v-if="testimonial.videoType === 'upload'" class="video-upload-area">
                            <input 
                              type="file" 
                              accept="video/mp4,video/webm,video/quicktime,video/x-msvideo,.mp4,.webm,.mov,.avi" 
                              @change="handleTestimonialVideoUpload($event, index)"
                              :id="`testimonial-video-upload-${index}`"
                              class="video-file-input"
                              :disabled="uploadingTestimonialVideos[index]"
                            />
                            <label :for="`testimonial-video-upload-${index}`" class="video-upload-label" :class="{ 'uploading': uploadingTestimonialVideos[index] }">
                              <svg v-if="!uploadingTestimonialVideos[index]" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M14 2V8H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                              </svg>
                              <div v-else class="upload-spinner"></div>
                              <span>{{ uploadingTestimonialVideos[index] ? `Uploading... ${Math.round(uploadProgressTestimonialVideos[index] || 0)}%` : (testimonial.videoFileUrl ? 'Change Video' : 'Choose video file (MP4, WebM, MOV, AVI)') }}</span>
                            </label>
                            <div v-if="uploadingTestimonialVideos[index]" class="upload-progress-bar">
                              <div class="upload-progress-fill" :style="{ width: `${uploadProgressTestimonialVideos[index] || 0}%` }"></div>
                            </div>
                          </div>

                          <div v-if="(testimonial.videoUrl || testimonial.videoFileUrl) && testimonial.videoType !== 'none'" class="video-preview">
                            <div v-if="testimonial.videoType === 'link'" class="video-preview-container">
                              <iframe :src="getVideoEmbedUrl(testimonial.videoUrl || '')" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                            </div>
                            <div v-else-if="testimonial.videoType === 'upload'">
                              <div class="video-preview-header">
                                <p class="preview-label">Video Preview:</p>
                                <button @click="deleteTestimonialVideo(index)" class="btn-danger btn-small" type="button">
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M3 6H5H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M10 11V17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M14 11V17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                  </svg>
                                  Delete Video
                                </button>
                              </div>
                              <video :src="testimonial.videoFileUrl" controls class="video-preview-player"></video>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Real Results Editor -->
          <div v-if="activeTab === 'real-results' && canAccessTab('real-results')" class="editor-section">
            <div class="section-header">
              <div class="section-title-group">
                <div class="section-icon">📊</div>
                <div>
                  <h3>Real Results, Real Impact</h3>
                  <p class="section-description">Showcase measurable outcomes and success stories</p>
                </div>
              </div>
            </div>

            <!-- Section Titles -->
            <div class="content-section-card">
              <div class="content-section-header">
                <h4 class="content-section-title">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 19.5C4 18.6716 4.67157 18 5.5 18H18.5C19.3284 18 20 18.6716 20 19.5C20 20.3284 19.3284 21 18.5 21H5.5C4.67157 21 4 20.3284 4 19.5Z" fill="currentColor"/>
                    <path d="M4 4.5C4 3.67157 4.67157 3 5.5 3H18.5C19.3284 3 20 3.67157 20 4.5C20 5.32843 19.3284 6 18.5 6H5.5C4.67157 6 4 5.32843 4 4.5Z" fill="currentColor"/>
                    <path d="M5.5 10.5C4.67157 10.5 4 11.1716 4 12C4 12.8284 4.67157 13.5 5.5 13.5H18.5C19.3284 13.5 20 12.8284 20 12C20 11.1716 19.3284 10.5 18.5 10.5H5.5Z" fill="currentColor"/>
                  </svg>
                  Section Titles
                </h4>
                <p class="content-section-description">Configure the main title and subtitle for this section</p>
            </div>
            
            <div class="form-grid">
              <div class="form-group full-width">
                <label>
                  <span class="label-text">Section Title</span>
                    <span class="label-hint">Main heading for the section</span>
                </label>
                <input v-model="formData.realResultsTitle" type="text" placeholder="Real Results, Real Impact." class="form-input" />
              </div>
              
              <div class="form-group full-width">
                <label>
                  <span class="label-text">Subtitle</span>
                    <span class="label-hint">Supporting text below the title</span>
                </label>
                <input v-model="formData.realResultsSubtitle" type="text" placeholder="We focus on measurable outcomes that help brands grow, scale, and stand out." class="form-input" />
                </div>
              </div>
            </div>

            <!-- Real Results Cases Management -->
            <div class="content-section-card">
              <div class="content-section-header">
                <h4 class="content-section-title">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 11L12 14L22 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M21 12V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                  Success Cases
              </h4>
                <p class="content-section-description">Add and manage real results case studies</p>
              </div>

              <div class="real-results-manager">
                <div class="section-action-bar">
                  <div class="section-info">
                    <span class="section-count">{{ formData.realResultsCases?.length || 0 }} case{{ (formData.realResultsCases?.length || 0) !== 1 ? 's' : '' }} added</span>
                  </div>
                  <button @click="addNewRealResultsCase" class="btn-primary">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                    Add Case
                </button>
                </div>

                <div v-if="!formData.realResultsCases || formData.realResultsCases.length === 0" class="empty-state-card">
                  <div class="empty-state-icon">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 11L12 14L22 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M21 12V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </div>
                  <p class="empty-state-title">No cases yet</p>
                  <p class="empty-state-description">Add your first success case to showcase real results</p>
                  <button @click="addNewRealResultsCase" class="btn-primary" style="margin-top: 1rem;">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                    Add First Case
                  </button>
                </div>

                <div v-else class="real-results-cases-grid">
                  <div v-for="(resultCase, caseIndex) in formData.realResultsCases" :key="resultCase.id || caseIndex" class="real-results-case-card">
                    <div class="case-card-header">
                      <div class="case-card-number">
                        <span>Case #{{ caseIndex + 1 }}</span>
                      </div>
                      <button @click="removeRealResultsCase(caseIndex)" class="btn-icon btn-icon-danger" title="Delete case">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M3 6H5H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                      </button>
                    </div>

                    <div class="case-card-preview" v-if="resultCase.headline || resultCase.companyLogo || resultCase.companyLogoFileUrl">
                      <div v-if="resultCase.companyLogo || resultCase.companyLogoFileUrl" class="case-preview-logo">
                        <img :src="resultCase.companyLogoFileUrl || resultCase.companyLogo" alt="Company Logo" />
                      </div>
                      <div v-if="resultCase.headline" class="case-preview-headline">{{ resultCase.headline }}</div>
                      <div v-if="resultCase.cards && resultCase.cards.length > 0" class="case-preview-cards">
                        <div v-for="(card, idx) in resultCase.cards.slice(0, 3)" :key="idx" class="case-preview-card">
                          <span class="preview-card-title">{{ card.title }}</span>
                          <span class="preview-card-metric">{{ card.metric }}</span>
                          <span class="preview-card-subtitle">{{ card.subtitle }}</span>
                        </div>
                      </div>
                    </div>

                    <div class="case-card-form">
                    <div class="form-grid">
                      <!-- Company Logo -->
                      <div class="form-group full-width">
                        <label>
                          <span class="label-text">Company Logo</span>
                          <span class="label-hint">Logo displayed above the headline</span>
                        </label>
                        
                        <div class="photo-upload-section">
                          <div class="photo-options">
                            <label class="photo-option-label">
                              <input 
                                type="radio" 
                                :name="`case-logo-type-${caseIndex}`" 
                                value="url" 
                                v-model="resultCase.companyLogoType" 
                                @change="resultCase.companyLogoFileUrl = ''" 
                              />
                              <span>Logo URL</span>
                            </label>
                            <label class="photo-option-label">
                              <input 
                                type="radio" 
                                :name="`case-logo-type-${caseIndex}`" 
                                value="upload" 
                                v-model="resultCase.companyLogoType" 
                                @change="resultCase.companyLogo = ''" 
                              />
                              <span>Upload Logo</span>
                            </label>
                          </div>

                          <input 
                            v-if="resultCase.companyLogoType === 'url'"
                            v-model="resultCase.companyLogo" 
                            type="url" 
                            placeholder="https://example.com/logo.png" 
                            class="form-input"
                            style="margin-top: 0.5rem;"
                          />

                          <div v-if="resultCase.companyLogoType === 'upload'" class="photo-upload-area">
                            <input 
                              type="file" 
                              accept="image/*" 
                              @change="handleCaseLogoUpload($event, caseIndex)"
                              :id="`case-logo-upload-${caseIndex}`"
                              class="photo-file-input"
                            />
                            <label :for="`case-logo-upload-${caseIndex}`" class="photo-upload-label">
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M17 8L12 3L7 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M12 3V15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                              </svg>
                              <span>{{ resultCase.companyLogoFileUrl ? 'Change Logo' : 'Choose logo file' }}</span>
                            </label>
                          </div>

                          <div v-if="resultCase.companyLogo || resultCase.companyLogoFileUrl" class="photo-preview">
                            <p class="preview-label">Preview:</p>
                            <img :src="resultCase.companyLogoFileUrl || resultCase.companyLogo" alt="Logo Preview" class="photo-preview-img" />
                          </div>
                        </div>
                      </div>

                      <!-- Headline -->
                      <div class="form-group full-width">
                        <label>
                          <span class="label-text">Headline *</span>
                        </label>
                        <input v-model="resultCase.headline" type="text" placeholder="FROM 0 TO $360K IN JUST 6 MONTH" class="form-input" required />
                      </div>

                      <!-- Company Images (for hover on headline) -->
                      <div class="form-group full-width">
                        <label>
                          <span class="label-text">Company Images</span>
                          <span class="label-hint">Images shown when hovering over the headline card (you can add multiple images)</span>
                        </label>
                        
                        <div class="multiple-images-manager">
                          <button 
                            type="button"
                            @click="addCaseCompanyImage(caseIndex)" 
                            class="btn-secondary"
                            style="margin-bottom: 1rem; padding: 0.5rem 1rem;"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                            </svg>
                            Add Company Image
                          </button>

                          <div v-if="!resultCase.companyImages || resultCase.companyImages.length === 0" class="empty-state-small">
                            <p>No images added yet. Click "Add Company Image" to add images.</p>
                          </div>

                          <div v-else class="hover-images-list">
                            <div 
                              v-for="(img, imgIndex) in resultCase.companyImages" 
                              :key="img.id || imgIndex"
                              class="hover-image-item"
                            >
                              <div class="image-item-header">
                                <span class="image-item-number">Image {{ imgIndex + 1 }}</span>
                                <button 
                                  @click="removeCaseCompanyImage(caseIndex, imgIndex)" 
                                  class="btn-danger"
                                  style="padding: 0.25rem 0.5rem; font-size: 0.75rem;"
                                >
                                  Remove
                                </button>
                              </div>

                              <div class="photo-upload-section" style="margin-top: 0.75rem;">
                                <div class="photo-options">
                                  <label class="photo-option-label">
                                    <input 
                                      type="radio" 
                                      :name="`case-company-image-type-${caseIndex}-${imgIndex}`" 
                                      value="url" 
                                      v-model="img.imageType" 
                                      @change="img.imageFileUrl = ''" 
                                    />
                                    <span>Image URL</span>
                                  </label>
                                  <label class="photo-option-label">
                                    <input 
                                      type="radio" 
                                      :name="`case-company-image-type-${caseIndex}-${imgIndex}`" 
                                      value="upload" 
                                      v-model="img.imageType" 
                                      @change="img.imageUrl = ''" 
                                    />
                                    <span>Upload Image</span>
                                  </label>
                                </div>

                                <input 
                                  v-if="img.imageType === 'url'"
                                  v-model="img.imageUrl" 
                                  type="url" 
                                  placeholder="https://example.com/image.jpg" 
                                  class="form-input"
                                  style="margin-top: 0.5rem;"
                                />

                                <div v-if="img.imageType === 'upload'" class="photo-upload-area">
                                  <input 
                                    type="file" 
                                    accept="image/*" 
                                    @change="handleCaseCompanyImageUpload($event, caseIndex, imgIndex)"
                                    :id="`case-company-image-upload-${caseIndex}-${imgIndex}`"
                                    class="photo-file-input"
                                  />
                                  <label :for="`case-company-image-upload-${caseIndex}-${imgIndex}`" class="photo-upload-label">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                      <path d="M17 8L12 3L7 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                      <path d="M12 3V15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                    <span>{{ img.imageFileUrl ? 'Change Image' : 'Choose image file' }}</span>
                                  </label>
                                </div>

                                <div v-if="img.imageUrl || img.imageFileUrl" class="photo-preview">
                                  <p class="preview-label">Preview:</p>
                                  <img :src="img.imageFileUrl || img.imageUrl" alt="Preview" class="photo-preview-img" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                        <!-- Result Cards -->
                      <div class="form-group full-width">
                        <label>
                            <span class="label-text">Result Cards</span>
                            <span class="label-hint">Add cards showing specific metrics and results</span>
                        </label>
                        
                          <div class="result-cards-manager">
                            <div class="section-action-bar" style="margin-bottom: 1rem;">
                              <div class="section-info">
                                <span class="section-count">{{ resultCase.cards?.length || 0 }} card{{ (resultCase.cards?.length || 0) !== 1 ? 's' : '' }}</span>
                              </div>
                          <button 
                            type="button"
                            @click="addCaseCard(caseIndex)" 
                            class="btn-secondary"
                                style="padding: 0.5rem 1rem;"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                            </svg>
                            Add Card
                          </button>
                            </div>

                            <div v-if="!resultCase.cards || resultCase.cards.length === 0" class="empty-state-small-card">
                              <p class="empty-state-small-text">No cards yet. Click "Add Card" to add result cards.</p>
                          </div>

                            <div v-else class="result-cards-grid">
                              <div v-for="(card, cardIndex) in resultCase.cards" :key="card.id || cardIndex" class="result-card-item">
                                <div class="result-card-header">
                                  <div class="result-card-number">
                                    <span>#{{ cardIndex + 1 }}</span>
                                  </div>
                                  <button @click="removeCaseCard(caseIndex, cardIndex)" class="btn-icon btn-icon-danger" title="Delete card">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <path d="M3 6H5H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                      <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                </button>
                              </div>

                              <div class="form-grid">
                                <div class="form-group">
                                  <label>
                                    <span class="label-text">Title *</span>
                                      <span class="label-hint">e.g., "Revenue generated"</span>
                                  </label>
                                  <input v-model="card.title" type="text" placeholder="In revenue generated from Instagram" class="form-input" required />
                                </div>

                                <div class="form-group">
                                  <label>
                                    <span class="label-text">Metric *</span>
                                      <span class="label-hint">e.g., "+380K" or "$500K"</span>
                                  </label>
                                  <input v-model="card.metric" type="text" placeholder="+380K" class="form-input" required />
                                </div>

                                <div class="form-group">
                                  <label>
                                    <span class="label-text">Subtitle *</span>
                                      <span class="label-hint">e.g., "in just 6 months"</span>
                                  </label>
                                  <input v-model="card.subtitle" type="text" placeholder="in just 6 month" class="form-input" required />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <!-- CTA Text -->
                      <div class="form-group full-width">
                        <label>
                          <span class="label-text">CTA Text</span>
                            <span class="label-hint">Call-to-action button text</span>
                        </label>
                        <input v-model="resultCase.ctaText" type="text" placeholder="Explore the Results" class="form-input" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- About Page Editor -->
          <div v-if="activeTab === 'about' && canAccessTab('about')" class="editor-section">
            <div class="section-header">
              <div class="section-title-group">
                <div class="section-icon">ℹ️</div>
                <div>
                  <h3>About Page</h3>
                  <p class="section-description">Manage the About page content, team members, and FAQs</p>
                </div>
              </div>
            </div>

            <!-- Who We Are Section -->
            <div class="content-section-card">
              <div class="content-section-header">
                <h4 class="content-section-title">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="currentColor"/>
                  </svg>
                  Who We Are
                </h4>
                <p class="content-section-description">Main title and description for the About page</p>
              </div>
              
              <div class="form-grid">
                <div class="form-group full-width">
                  <label>
                    <span class="label-text">Title</span>
                  </label>
                  <input v-model="aboutFormData.whoWeAreTitle" type="text" placeholder="Who We Are" class="form-input" />
                </div>
                
                <div class="form-group full-width">
                  <label>
                    <span class="label-text">Description</span>
                  </label>
                  <textarea v-model="aboutFormData.whoWeAreDescription" rows="3" placeholder="We redesign your marketing system to run it self" class="form-textarea"></textarea>
                </div>
              </div>
            </div>

            <!-- Stat Cards Section -->
            <div class="content-section-card">
              <div class="content-section-header">
                <div class="content-section-title-group">
                  <div class="content-section-icon">📊</div>
                  <h3 class="content-section-title">Key Statistics</h3>
                </div>
                <p class="content-section-description">Add stat cards to showcase your achievements and metrics</p>
              </div>
              <div class="section-action-bar">
                <div class="section-info">
                  <span class="section-count">{{ aboutFormData.statCards?.length || 0 }} stat card{{ (aboutFormData.statCards?.length || 0) !== 1 ? 's' : '' }}</span>
                </div>
                <button @click="addNewStatCard" class="btn-primary">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                  Add Stat Card
                </button>
              </div>

              <div v-if="!aboutFormData.statCards || aboutFormData.statCards.length === 0" class="empty-state-card">
                <div class="empty-state-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 7H6C5.46957 7 4.96086 7.21071 4.58579 7.58579C4.21071 7.96086 4 8.46957 4 9V18C4 18.5304 4.21071 19.0391 4.58579 19.4142C4.96086 19.7893 5.46957 20 6 20H15C15.5304 20 16.0391 19.7893 16.4142 19.4142C16.7893 19.0391 17 18.5304 17 18V15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M9 15L12 12L16 16M20 8H17M20 8V11M20 8L17 5M20 8L23 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
                <p class="empty-state-title">No stat cards yet</p>
                <p class="empty-state-description">Add your first stat card to showcase your achievements.</p>
                <button @click="addNewStatCard" class="btn-primary" style="margin-top: 1rem;">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                  Add First Stat Card
                </button>
              </div>

              <div v-else class="stat-cards-grid">
                <div v-for="(statCard, index) in aboutFormData.statCards" :key="statCard.id || index" class="stat-card-item">
                  <div class="stat-card-header">
                    <div class="stat-card-number">
                      <span>#{{ index + 1 }}</span>
                    </div>
                    <div class="stat-card-actions">
                      <button @click="startEditStatCard(index)" class="btn-icon btn-icon-warning" title="Edit stat card">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          <path d="M18.5 2.5C18.8978 2.10217 19.4374 1.87866 20 1.87866C20.5626 1.87866 21.1022 2.10217 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10218 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                      </button>
                      <button @click="deleteStatCard(statCard.id)" class="btn-icon btn-icon-danger" title="Delete stat card">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M3 6H5H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div class="stat-card-preview">
                    <p class="stat-card-title">{{ statCard.title }}</p>
                    <p class="stat-card-value">{{ statCard.value }}</p>
                    <p class="stat-card-description">{{ statCard.description }}</p>
                  </div>
                  <div v-if="editingStatCardId === statCard.id" class="edit-stat-card-form">
                    <div class="form-grid">
                      <div class="form-group">
                        <label><span class="label-text">Title *</span></label>
                        <input v-model="editStatCardForm.title" type="text" class="form-input" placeholder="Revenue generated" required />
                      </div>
                      <div class="form-group">
                        <label><span class="label-text">Value *</span></label>
                        <input v-model="editStatCardForm.value" type="text" class="form-input" placeholder="$4.7M" required />
                      </div>
                      <div class="form-group full-width">
                        <label><span class="label-text">Description *</span></label>
                        <textarea v-model="editStatCardForm.description" rows="2" class="form-textarea" placeholder="We let our numbers do the talking..." required></textarea>
                      </div>
                    </div>
                    <div class="form-actions">
                      <button @click="saveStatCardEdit(statCard.id)" class="btn-primary">Save</button>
                      <button @click="cancelStatCardEdit" class="btn-secondary">Cancel</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Video Section -->
            <div class="content-section-card">
              <div class="content-section-header">
                <h4 class="content-section-title">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 10L19.553 7.276C19.8337 7.10733 20.1433 7.02267 20.482 7.022C20.8207 7.02133 21.1307 7.106 21.412 7.276C21.6933 7.446 21.904 7.68067 22.044 7.98C22.184 8.27933 22.254 8.61267 22.254 8.98V15.02C22.254 15.3873 22.184 15.7207 22.044 16.02C21.904 16.3193 21.6933 16.554 21.412 16.724C21.1307 16.894 20.8207 16.9787 20.482 16.978C20.1433 16.9773 19.8337 16.8927 19.553 16.724L15 14V10Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <rect x="2" y="6" width="13" height="12" rx="2" stroke="currentColor" stroke-width="2"/>
                  </svg>
                  Video
                </h4>
                <p class="content-section-description">Optional video for the About page</p>
              </div>

              <div class="video-manager">
                <div class="video-options">
                  <label class="video-option-label">
                    <input 
                      type="radio" 
                      name="aboutVideoType" 
                      value="none" 
                      v-model="aboutFormData.videoType"
                      @change="aboutFormData.videoUrl = ''; aboutFormData.videoFileUrl = ''"
                    />
                    <span>No Video</span>
                  </label>
                  <label class="video-option-label">
                    <input 
                      type="radio" 
                      name="aboutVideoType" 
                      value="upload" 
                      v-model="aboutFormData.videoType"
                      @change="aboutFormData.videoUrl = ''"
                    />
                    <span>Upload Video File</span>
                  </label>
                  <label class="video-option-label">
                    <input 
                      type="radio" 
                      name="aboutVideoType" 
                      value="link" 
                      v-model="aboutFormData.videoType"
                      @change="aboutFormData.videoFileUrl = ''"
                    />
                    <span>Use Video Link</span>
                  </label>
                </div>

                <!-- Video Upload -->
                <div v-if="aboutFormData.videoType === 'upload'" class="form-group full-width">
                  <label>
                    <span class="label-text">Video File</span>
                    <span class="label-hint">Upload your own video file (MP4, WebM, MOV, or AVI). Max size: 100MB</span>
                  </label>
                  <div class="video-upload-area">
                    <input 
                      type="file" 
                      accept="video/mp4,video/webm,video/quicktime,video/x-msvideo,.mp4,.webm,.mov,.avi" 
                      @change="handleAboutVideoUpload"
                      ref="aboutVideoFileInput"
                      id="about-video-upload-input"
                      class="video-file-input"
                      :disabled="uploadingVideo"
                    />
                    <label for="about-video-upload-input" class="video-upload-label" :class="{ 'uploading': uploadingVideo }">
                      <svg v-if="!uploadingVideo" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M17 8L12 3L7 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M12 3V15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                      <div v-else class="upload-spinner"></div>
                      <span>{{ uploadingVideo ? `Uploading... ${Math.round(uploadProgress)}%` : (aboutFormData.videoFileUrl ? 'Change Video' : 'Choose video file') }}</span>
                    </label>
                    <div v-if="uploadingVideo" class="upload-progress-bar">
                      <div class="upload-progress-fill" :style="{ width: `${uploadProgress}%` }"></div>
                    </div>
                  </div>
                  <div v-if="aboutFormData.videoFileUrl" class="video-preview">
                    <div class="video-preview-header">
                      <p class="preview-label">Video Preview:</p>
                      <button @click="deleteAboutVideo" class="btn-danger btn-small" type="button">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M3 6H5H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        Delete Video
                      </button>
                    </div>
                    <video :src="aboutFormData.videoFileUrl" controls class="video-preview-player"></video>
                  </div>
                </div>

                <!-- Video Link Input -->
                <div v-else-if="aboutFormData.videoType === 'link'" class="form-group full-width">
                  <label>
                    <span class="label-text">Video URL</span>
                    <span class="label-hint">YouTube or Vimeo link</span>
                  </label>
                  <input 
                    v-model="aboutFormData.videoUrl" 
                    type="url" 
                    placeholder="https://www.youtube.com/watch?v=..." 
                    class="form-input"
                  />
                  <div v-if="aboutFormData.videoUrl" class="video-preview">
                    <p class="preview-label">Preview:</p>
                    <div class="video-preview-container">
                      <iframe 
                        :src="getVideoEmbedUrl(aboutFormData.videoUrl)" 
                        frameborder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowfullscreen
                      ></iframe>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- CTA Button -->
            <div class="content-section-card">
              <div class="content-section-header">
                <h4 class="content-section-title">Call to Action Button</h4>
                <p class="content-section-description">Button text and link</p>
              </div>
              
              <div class="form-grid">
                <div class="form-group">
                  <label>
                    <span class="label-text">Button Text</span>
                  </label>
                  <input v-model="aboutFormData.ctaButtonText" type="text" placeholder="Book a Meeting" class="form-input" />
                </div>
                
                <div class="form-group">
                  <label>
                    <span class="label-text">Button Link (Optional)</span>
                    <span class="label-hint">Leave empty for default action</span>
                  </label>
                  <input v-model="aboutFormData.ctaButtonLink" type="url" placeholder="https://..." class="form-input" />
                </div>
              </div>
            </div>

            <!-- Our Team Section -->
            <div class="content-section-card">
              <div class="content-section-header">
                <h4 class="content-section-title">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  Our Team
                </h4>
                <p class="content-section-description">Manage team members</p>
              </div>

              <div class="section-action-bar">
                <div class="section-info">
                  <span class="section-count">{{ aboutFormData.teamMembers.length }} member{{ aboutFormData.teamMembers.length !== 1 ? 's' : '' }}</span>
                </div>
                <button @click="addNewTeamMember" class="btn-primary">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                  Add Team Member
                </button>
              </div>

              <div v-if="aboutFormData.teamMembers.length === 0" class="empty-state-card">
                <div class="empty-state-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
                <p class="empty-state-title">No team members yet</p>
                <p class="empty-state-description">Add your first team member to showcase your team</p>
              </div>

              <div v-else class="team-grid-admin">
                <div v-for="(member, index) in sortedTeamMembers" :key="member.id || index" class="team-member-card-admin">
                  <div class="team-member-header">
                    <div class="team-member-number">#{{ index + 1 }}</div>
                    <div class="team-member-actions">
                      <div class="reorder-buttons">
                        <button 
                          @click="moveTeamMemberUp(index)" 
                          class="btn-icon btn-icon-reorder" 
                          title="Move Up"
                          :disabled="index === 0"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18 15L12 9L6 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          </svg>
                        </button>
                        <button 
                          @click="moveTeamMemberDown(index)" 
                          class="btn-icon btn-icon-reorder" 
                          title="Move Down"
                          :disabled="index === sortedTeamMembers.length - 1"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6 9L12 15L18 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          </svg>
                        </button>
                      </div>
                      <button @click="startEditTeamMemberByOrder(member.order || index)" class="btn-icon" title="Edit">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          <path d="M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10217 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                      </button>
                      <button @click="deleteTeamMemberByOrder(member.order || index)" class="btn-icon btn-icon-danger" title="Delete">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M3 6H5H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div v-if="editingTeamMemberId !== member.id" class="team-member-preview">
                    <div class="member-photo-preview">
                      <img 
                        v-if="member.photoFileUrl || member.photoUrl"
                        :src="member.photoFileUrl || member.photoUrl" 
                        :alt="member.name"
                      />
                      <div v-else class="member-photo-placeholder-small">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                      </div>
                    </div>
                    <h5 class="member-name-preview">{{ member.name }}</h5>
                    <p class="member-role-preview">{{ member.role }}</p>
                  </div>

                  <div v-else class="edit-team-member-form">
                    <div class="form-grid">
                      <div class="form-group">
                        <label>
                          <span class="label-text">Name *</span>
                        </label>
                        <input v-model="editTeamMemberForm.name" type="text" placeholder="John Doe" class="form-input" required />
                      </div>

                      <div class="form-group">
                        <label>
                          <span class="label-text">Role *</span>
                        </label>
                        <input v-model="editTeamMemberForm.role" type="text" placeholder="Head of Marketing" class="form-input" required />
                      </div>

                      <div class="form-group full-width">
                        <label>
                          <span class="label-text">Photo</span>
                        </label>
                        <div class="photo-upload-section">
                          <div class="photo-options">
                            <label class="photo-option-label">
                              <input 
                                type="radio" 
                                :name="`team-photo-type-${index}`" 
                                value="url" 
                                v-model="editTeamMemberForm.photoType" 
                                @change="editTeamMemberForm.photoFileUrl = ''" 
                              />
                              <span>Photo URL</span>
                            </label>
                            <label class="photo-option-label">
                              <input 
                                type="radio" 
                                :name="`team-photo-type-${index}`" 
                                value="upload" 
                                v-model="editTeamMemberForm.photoType" 
                                @change="editTeamMemberForm.photoUrl = ''" 
                              />
                              <span>Upload Photo</span>
                            </label>
                          </div>

                          <input 
                            v-if="editTeamMemberForm.photoType === 'url'"
                            v-model="editTeamMemberForm.photoUrl" 
                            type="url" 
                            placeholder="https://example.com/photo.jpg" 
                            class="form-input"
                            style="margin-top: 0.5rem;"
                          />

                          <div v-if="editTeamMemberForm.photoType === 'upload'" class="photo-upload-area">
                            <input 
                              type="file" 
                              accept="image/png,image/jpeg,image/jpg,image/webp" 
                              @change="handleTeamPhotoUpload($event, member.id || `temp-${index}`)"
                              :id="`team-photo-upload-${member.id || index}`"
                              class="photo-file-input"
                              :disabled="uploadingTeamPhoto[member.id || `temp-${index}`]"
                            />
                            <label :for="`team-photo-upload-${member.id || index}`" class="photo-upload-label" :class="{ 'uploading': uploadingTeamPhoto[member.id || `temp-${index}`] }">
                              <svg v-if="!uploadingTeamPhoto[member.id || `temp-${index}`]" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M17 8L12 3L7 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M12 3V15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                              </svg>
                              <div v-else class="upload-spinner"></div>
                              <span>{{ uploadingTeamPhoto[member.id || `temp-${index}`] ? `Uploading... ${Math.round(uploadProgressTeamPhoto[member.id || `temp-${index}`] || 0)}%` : (editTeamMemberForm.photoFileUrl ? 'Change Photo' : 'Choose photo file (PNG, JPG, JPEG)') }}</span>
                            </label>
                            <div v-if="uploadingTeamPhoto[member.id || `temp-${index}`]" class="upload-progress-bar">
                              <div class="upload-progress-fill" :style="{ width: `${uploadProgressTeamPhoto[member.id || `temp-${index}`] || 0}%` }"></div>
                            </div>
                          </div>

                          <div v-if="editTeamMemberForm.photoUrl || editTeamMemberForm.photoFileUrl" class="photo-preview">
                            <div class="photo-preview-header">
                              <p class="preview-label">Preview:</p>
                              <span v-if="getImageType(editTeamMemberForm.photoFileUrl || editTeamMemberForm.photoUrl || '')" class="image-type-badge">
                                {{ getImageType(editTeamMemberForm.photoFileUrl || editTeamMemberForm.photoUrl || '') }}
                              </span>
                            </div>
                            <img :src="editTeamMemberForm.photoFileUrl || editTeamMemberForm.photoUrl" alt="Preview" class="photo-preview-img" />
                          </div>
                        </div>
                      </div>

                      <div class="form-group full-width">
                        <div class="form-actions">
                          <button @click="saveTeamMemberEditByOrder(member.order || index)" class="btn-primary">Save</button>
                          <button @click="cancelTeamMemberEdit" class="btn-secondary">Cancel</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="form-grid" style="margin-top: 1.5rem;">
                <div class="form-group">
                  <label>
                    <span class="label-text">Team Section Title</span>
                  </label>
                  <input v-model="aboutFormData.teamTitle" type="text" placeholder="Our Team" class="form-input" />
                </div>
                
                <div class="form-group">
                  <label>
                    <span class="label-text">Team Section Subtitle</span>
                  </label>
                  <input v-model="aboutFormData.teamSubtitle" type="text" placeholder="Who is Nextcent suitable for?" class="form-input" />
                </div>
              </div>
            </div>

            <!-- FAQ Section -->
            <div class="content-section-card">
              <div class="content-section-header">
                <h4 class="content-section-title">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.228 9C7.137 9 6.25 9.895 6.25 11C6.25 12.105 7.137 13 8.228 13H15.772C16.863 13 17.75 12.105 17.75 11C17.75 9.895 16.863 9 15.772 9H8.228Z" fill="currentColor"/>
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.477 2 12C2 17.523 6.477 22 12 22C17.523 22 22 17.523 22 12C22 6.477 17.523 2 12 2ZM4 12C4 7.582 7.582 4 12 4C16.418 4 20 7.582 20 12C20 16.418 16.418 20 12 20C7.582 20 4 16.418 4 12Z" fill="currentColor"/>
                  </svg>
                  Frequently Asked Questions
                </h4>
                <p class="content-section-description">Manage FAQs for the About page</p>
              </div>

              <div class="section-action-bar">
                <div class="section-info">
                  <span class="section-count">{{ aboutFormData.faqs.length }} FAQ{{ aboutFormData.faqs.length !== 1 ? 's' : '' }}</span>
                </div>
                <button @click="addNewFAQ" class="btn-primary">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                  Add FAQ
                </button>
              </div>

              <div v-if="aboutFormData.faqs.length === 0" class="empty-state-card">
                <div class="empty-state-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.228 9C7.137 9 6.25 9.895 6.25 11C6.25 12.105 7.137 13 8.228 13H15.772C16.863 13 17.75 12.105 17.75 11C17.75 9.895 16.863 9 15.772 9H8.228Z" fill="currentColor"/>
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.477 2 12C2 17.523 6.477 22 12 22C17.523 22 22 17.523 22 12C22 6.477 17.523 2 12 2ZM4 12C4 7.582 7.582 4 12 4C16.418 4 20 7.582 20 12C20 16.418 16.418 20 12 20C7.582 20 4 16.418 4 12Z" fill="currentColor"/>
                  </svg>
                </div>
                <p class="empty-state-title">No FAQs yet</p>
                <p class="empty-state-description">Add your first FAQ to help visitors</p>
              </div>

              <div v-else class="faq-list-admin">
                <div v-for="(faq, index) in aboutFormData.faqs" :key="faq.id || index" class="faq-item-admin">
                  <div v-if="editingFAQId !== faq.id" class="faq-preview">
                    <div class="faq-preview-header">
                      <div class="faq-number">#{{ index + 1 }}</div>
                      <div class="faq-actions">
                        <button @click="startEditFAQ(index)" class="btn-icon" title="Edit">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10217 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          </svg>
                        </button>
                        <button @click="deleteFAQ(index)" class="btn-icon btn-icon-danger" title="Delete">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 6H5H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                    <h5 class="faq-question-preview">{{ faq.question }}</h5>
                    <p class="faq-answer-preview">{{ faq.answer }}</p>
                  </div>

                  <div v-else class="edit-faq-form">
                    <div class="form-grid">
                      <div class="form-group full-width">
                        <label>
                          <span class="label-text">Question *</span>
                        </label>
                        <input v-model="editFAQForm.question" type="text" placeholder="What does your digital marketing agency do?" class="form-input" required />
                      </div>

                      <div class="form-group full-width">
                        <label>
                          <span class="label-text">Answer *</span>
                        </label>
                        <textarea v-model="editFAQForm.answer" rows="4" placeholder="A good marketing agency understands your business..." class="form-textarea" required></textarea>
                      </div>

                      <div class="form-group full-width">
                        <div class="form-actions">
                          <button @click="saveFAQEdit(index)" class="btn-primary">Save</button>
                          <button @click="cancelFAQEdit" class="btn-secondary">Cancel</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="form-group" style="margin-top: 1.5rem;">
                <label>
                  <span class="label-text">FAQ Section Title</span>
                </label>
                <input v-model="aboutFormData.faqTitle" type="text" placeholder="Frequently Asked Questions" class="form-input" />
              </div>
            </div>
          </div>

          <!-- Services Page Editor -->
          <div v-if="activeTab === 'services-page' && canAccessTab('services-page')" class="editor-section">
            <div class="section-header">
              <div class="section-title-group">
                <div class="section-icon">⚙️</div>
                <div>
                  <h3>Services Page</h3>
                  <p class="section-description">Manage the Services page content, including Why Choose Clear Up features</p>
                </div>
              </div>
            </div>

            <!-- Why Choose Clear Up Section -->
            <div class="content-section-card">
              <div class="content-section-header">
                <div class="content-section-title-group">
                  <div class="content-section-icon">⭐</div>
                  <h3 class="content-section-title">Why Choose Clear Up</h3>
                </div>
                <p class="content-section-description">Add and manage features that highlight why clients should choose Clear Up</p>
              </div>
              <div class="form-grid">
                <div class="form-group full-width">
                  <label>
                    <span class="label-text">Section Title</span>
                  </label>
                  <input v-model="servicesFormData.whyChooseTitle" type="text" placeholder="Why Choose Clear Up" class="form-input" />
                </div>
                <div class="form-group full-width">
                  <label>
                    <span class="label-text">Subtitle</span>
                  </label>
                  <textarea v-model="servicesFormData.whyChooseSubtitle" rows="2" placeholder="Creative thinking, fast execution, and results-driven content built for modern brands." class="form-textarea"></textarea>
                </div>
              </div>
              
              <div class="section-action-bar">
                <div class="section-info">
                  <span class="section-count">{{ servicesFormData.whyChooseFeatures?.length || 0 }} feature{{ (servicesFormData.whyChooseFeatures?.length || 0) !== 1 ? 's' : '' }}</span>
                </div>
                <button @click="addNewWhyChooseFeature" class="btn-primary">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                  Add Feature
                </button>
              </div>

              <div v-if="!servicesFormData.whyChooseFeatures || servicesFormData.whyChooseFeatures.length === 0" class="empty-state-card">
                <div class="empty-state-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
                <p class="empty-state-title">No features yet</p>
                <p class="empty-state-description">Add your first feature to showcase why clients should choose Clear Up.</p>
                <button @click="addNewWhyChooseFeature" class="btn-primary" style="margin-top: 1rem;">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                  Add First Feature
                </button>
              </div>

              <div v-else class="why-choose-features-grid">
                <div v-for="(feature, index) in servicesFormData.whyChooseFeatures" :key="feature.id || index" class="why-choose-feature-card">
                  <div class="why-choose-feature-header">
                    <div class="why-choose-feature-number">
                      <span>#{{ index + 1 }}</span>
                    </div>
                    <div class="why-choose-feature-actions">
                      <button @click="startEditWhyChooseFeature(feature.id)" class="btn-icon btn-icon-warning" title="Edit feature">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          <path d="M18.5 2.5C18.8978 2.10217 19.4374 1.87866 20 1.87866C20.5626 1.87866 21.1022 2.10217 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10218 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                      </button>
                      <button @click="deleteWhyChooseFeature(feature.id)" class="btn-icon btn-icon-danger" title="Delete feature">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M3 6H5H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div class="why-choose-feature-preview">
                    <div class="why-choose-feature-icon-preview">
                      <div class="why-choose-icon-preview-circle">
                        <svg v-if="!feature.icon || feature.icon === 'target'" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="12" cy="12" r="10" stroke="#5B2096" stroke-width="2"/>
                          <circle cx="12" cy="12" r="6" stroke="#5B2096" stroke-width="2"/>
                          <circle cx="12" cy="12" r="2" fill="#5B2096"/>
                        </svg>
                        <svg v-else-if="feature.icon === 'star'" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#5B2096"/>
                        </svg>
                        <svg v-else-if="feature.icon === 'device'" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect x="5" y="2" width="14" height="20" rx="2" stroke="#5B2096" stroke-width="2"/>
                          <rect x="9" y="6" width="6" height="1" fill="#5B2096"/>
                        </svg>
                        <svg v-else-if="feature.icon === 'chart'" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M3 3V21H21" stroke="#5B2096" stroke-width="2" stroke-linecap="round"/>
                          <path d="M7 16L12 11L16 15L21 10" stroke="#5B2096" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                      </div>
                    </div>
                    <h4 class="why-choose-feature-preview-title">{{ feature.title }}</h4>
                    <p class="why-choose-feature-preview-description">{{ feature.description }}</p>
                  </div>
                  <div v-if="editingWhyChooseFeatureId === feature.id" class="edit-why-choose-feature-form">
                    <div class="form-grid">
                      <div class="form-group full-width">
                        <label><span class="label-text">Title *</span></label>
                        <input v-model="editWhyChooseFeatureForm.title" type="text" class="form-input" required />
                      </div>
                      <div class="form-group full-width">
                        <label><span class="label-text">Description *</span></label>
                        <textarea v-model="editWhyChooseFeatureForm.description" rows="3" class="form-textarea" required></textarea>
                      </div>
                      <div class="form-group full-width">
                        <label><span class="label-text">Icon</span></label>
                        <select v-model="editWhyChooseFeatureForm.icon" class="form-input">
                          <option value="target">Target</option>
                          <option value="star">Star</option>
                          <option value="device">Device</option>
                          <option value="chart">Chart</option>
                        </select>
                      </div>
                    </div>
                    <div class="form-actions">
                      <button @click="saveWhyChooseFeatureEdit(feature.id)" class="btn-primary">Save</button>
                      <button @click="cancelWhyChooseFeatureEdit" class="btn-secondary">Cancel</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer Editor -->
          <div v-if="activeTab === 'footer' && canAccessTab('footer')" class="editor-section">
            <div class="section-header">
              <div class="section-title-group">
                <div class="section-icon">📄</div>
                <div>
                  <h3>Footer</h3>
                  <p class="section-description">Footer content and information</p>
                </div>
              </div>
            </div>
            
            <div class="form-grid">
              <div class="form-group full-width">
                <label>
                  <span class="label-text">Tagline</span>
                </label>
                <textarea v-model="formData.footerTagline" rows="3" placeholder="Your creative digital partner for high-impact video ads and marketing content." class="form-textarea"></textarea>
              </div>
              
              <div class="form-group full-width">
                <label>
                  <span class="label-text">Address</span>
                  <span class="label-hint">Optional - physical address or contact info</span>
                </label>
                <input v-model="formData.footerAddress" type="text" placeholder="123 Business St, City, Country" class="form-input" />
              </div>
            </div>
          </div>

          <!-- Legal Pages Editor -->
          <div v-if="activeTab === 'legal-pages' && canAccessTab('legal-pages')" class="editor-section">
            <div class="section-header">
              <div class="section-title-group">
                <div class="section-icon">⚖️</div>
                <div>
                  <h3>Legal Pages</h3>
                  <p class="section-description">Manage Privacy Policy, Terms of Service, and Cookie Policy content</p>
                </div>
              </div>
            </div>

            <!-- Privacy Policy Section -->
            <div class="content-section-card">
              <div class="content-section-header">
                <div class="content-section-title-group">
                  <div class="content-section-icon">🔒</div>
                  <h3 class="content-section-title">Privacy Policy</h3>
                </div>
                <p class="content-section-description">Your website's privacy policy - explains how you collect and use user data</p>
              </div>
              
              <div class="form-grid">
                <div class="form-group">
                  <label>
                    <span class="label-text">Page Title</span>
                  </label>
                  <input v-model="legalFormData.privacyPolicy.title" type="text" placeholder="Privacy Policy" class="form-input" />
                </div>
                <div class="form-group">
                  <label>
                    <span class="label-text">Last Updated Date</span>
                  </label>
                  <input v-model="legalFormData.privacyPolicy.lastUpdated" type="text" placeholder="January 31, 2026" class="form-input" />
                </div>
              </div>

              <div class="section-action-bar">
                <div class="section-info">
                  <span class="section-count">{{ legalFormData.privacyPolicy.sections?.length || 0 }} section{{ (legalFormData.privacyPolicy.sections?.length || 0) !== 1 ? 's' : '' }}</span>
                </div>
                <button @click="addLegalSection('privacy')" class="btn-primary">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                  Add Section
                </button>
              </div>

              <div v-if="legalFormData.privacyPolicy.sections && legalFormData.privacyPolicy.sections.length > 0" class="legal-sections-list">
                <div v-for="(section, index) in legalFormData.privacyPolicy.sections" :key="section.id" class="legal-section-item">
                  <div class="legal-section-header">
                    <div class="legal-section-number">#{{ index + 1 }}</div>
                    <div class="legal-section-title">{{ section.heading }}</div>
                    <div class="legal-section-actions">
                      <button @click="startEditLegalSection('privacy', index)" class="btn-icon btn-icon-warning" title="Edit section">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          <path d="M18.5 2.5C18.8978 2.10217 19.4374 1.87866 20 1.87866C20.5626 1.87866 21.1022 2.10217 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10218 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                      </button>
                      <button @click="removeLegalSection('privacy', index)" class="btn-icon btn-icon-danger" title="Remove section">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M3 6H5H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div class="legal-section-preview">{{ section.content.substring(0, 150) }}{{ section.content.length > 150 ? '...' : '' }}</div>
                </div>
              </div>
            </div>

            <!-- Terms of Service Section -->
            <div class="content-section-card">
              <div class="content-section-header">
                <div class="content-section-title-group">
                  <div class="content-section-icon">📜</div>
                  <h3 class="content-section-title">Terms of Service</h3>
                </div>
                <p class="content-section-description">Terms and conditions for using your website and services</p>
              </div>
              
              <div class="form-grid">
                <div class="form-group">
                  <label>
                    <span class="label-text">Page Title</span>
                  </label>
                  <input v-model="legalFormData.termsOfService.title" type="text" placeholder="Terms of Service" class="form-input" />
                </div>
                <div class="form-group">
                  <label>
                    <span class="label-text">Last Updated Date</span>
                  </label>
                  <input v-model="legalFormData.termsOfService.lastUpdated" type="text" placeholder="January 31, 2026" class="form-input" />
                </div>
              </div>

              <div class="section-action-bar">
                <div class="section-info">
                  <span class="section-count">{{ legalFormData.termsOfService.sections?.length || 0 }} section{{ (legalFormData.termsOfService.sections?.length || 0) !== 1 ? 's' : '' }}</span>
                </div>
                <button @click="addLegalSection('terms')" class="btn-primary">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                  Add Section
                </button>
              </div>

              <div v-if="legalFormData.termsOfService.sections && legalFormData.termsOfService.sections.length > 0" class="legal-sections-list">
                <div v-for="(section, index) in legalFormData.termsOfService.sections" :key="section.id" class="legal-section-item">
                  <div class="legal-section-header">
                    <div class="legal-section-number">#{{ index + 1 }}</div>
                    <div class="legal-section-title">{{ section.heading }}</div>
                    <div class="legal-section-actions">
                      <button @click="startEditLegalSection('terms', index)" class="btn-icon btn-icon-warning" title="Edit section">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          <path d="M18.5 2.5C18.8978 2.10217 19.4374 1.87866 20 1.87866C20.5626 1.87866 21.1022 2.10217 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10218 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                      </button>
                      <button @click="removeLegalSection('terms', index)" class="btn-icon btn-icon-danger" title="Remove section">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M3 6H5H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div class="legal-section-preview">{{ section.content.substring(0, 150) }}{{ section.content.length > 150 ? '...' : '' }}</div>
                </div>
              </div>
            </div>

            <!-- Cookie Policy Section -->
            <div class="content-section-card">
              <div class="content-section-header">
                <div class="content-section-title-group">
                  <div class="content-section-icon">🍪</div>
                  <h3 class="content-section-title">Cookie Policy</h3>
                </div>
                <p class="content-section-description">Information about how your website uses cookies</p>
              </div>
              
              <div class="form-grid">
                <div class="form-group">
                  <label>
                    <span class="label-text">Page Title</span>
                  </label>
                  <input v-model="legalFormData.cookiePolicy.title" type="text" placeholder="Cookie Policy" class="form-input" />
                </div>
                <div class="form-group">
                  <label>
                    <span class="label-text">Last Updated Date</span>
                  </label>
                  <input v-model="legalFormData.cookiePolicy.lastUpdated" type="text" placeholder="January 31, 2026" class="form-input" />
                </div>
              </div>

              <div class="section-action-bar">
                <div class="section-info">
                  <span class="section-count">{{ legalFormData.cookiePolicy.sections?.length || 0 }} section{{ (legalFormData.cookiePolicy.sections?.length || 0) !== 1 ? 's' : '' }}</span>
                </div>
                <button @click="addLegalSection('cookies')" class="btn-primary">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                  Add Section
                </button>
              </div>

              <div v-if="legalFormData.cookiePolicy.sections && legalFormData.cookiePolicy.sections.length > 0" class="legal-sections-list">
                <div v-for="(section, index) in legalFormData.cookiePolicy.sections" :key="section.id" class="legal-section-item">
                  <div class="legal-section-header">
                    <div class="legal-section-number">#{{ index + 1 }}</div>
                    <div class="legal-section-title">{{ section.heading }}</div>
                    <div class="legal-section-actions">
                      <button @click="startEditLegalSection('cookies', index)" class="btn-icon btn-icon-warning" title="Edit section">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          <path d="M18.5 2.5C18.8978 2.10217 19.4374 1.87866 20 1.87866C20.5626 1.87866 21.1022 2.10217 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10218 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                      </button>
                      <button @click="removeLegalSection('cookies', index)" class="btn-icon btn-icon-danger" title="Remove section">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M3 6H5H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div class="legal-section-preview">{{ section.content.substring(0, 150) }}{{ section.content.length > 150 ? '...' : '' }}</div>
                </div>
              </div>
            </div>

            <!-- Edit Legal Section Modal -->
            <div v-if="editingLegalPolicy !== null" class="modal-overlay" @click.self="cancelEditLegalSection">
              <div class="modal-content">
                <div class="modal-header">
                  <h3>Edit {{ editingLegalPolicy === 'privacy' ? 'Privacy Policy' : editingLegalPolicy === 'terms' ? 'Terms of Service' : 'Cookie Policy' }} Section</h3>
                  <button @click="cancelEditLegalSection" class="modal-close">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </button>
                </div>
                <div class="modal-body">
                  <div class="form-group">
                    <label>
                      <span class="label-text">Section Heading</span>
                    </label>
                    <input v-model="editLegalSectionForm.heading" type="text" placeholder="e.g., Information We Collect" class="form-input" />
                  </div>
                  <div class="form-group">
                    <label>
                      <span class="label-text">Section Content</span>
                    </label>
                    <textarea v-model="editLegalSectionForm.content" rows="8" placeholder="Enter the section content..." class="form-textarea"></textarea>
                  </div>
                </div>
                <div class="modal-footer">
                  <button @click="cancelEditLegalSection" class="btn-secondary">Cancel</button>
                  <button @click="saveLegalSection" class="btn-primary">Save Section</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Email Submissions -->
          <div v-if="activeTab === 'email-submissions' && canAccessTab('email-submissions')" class="editor-section">
            <div class="section-header">
              <div class="section-title-group">
                <div class="section-icon">📧</div>
                <div>
                  <h3>Email Submissions</h3>
                  <p class="section-description">View and manage emails submitted from the home screen</p>
                </div>
              </div>
              <button @click="loadEmailSubmissions" class="btn-secondary btn-small" :disabled="loadingEmails">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 4V10H7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M23 20V14H17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M20.49 9C19.95 5.95 17.42 3.42 14.37 2.88M3.51 15C4.05 18.05 6.58 20.58 9.63 21.12M14.37 2.88C13.69 2.95 13.02 3.11 12.37 3.37M9.63 21.12C10.31 21.05 10.98 20.89 11.63 20.63M14.37 2.88L17.37 5.88M9.63 21.12L6.63 18.12M17.37 5.88L20.37 2.88M6.63 18.12L3.63 21.12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Refresh
              </button>
            </div>
            
            <div v-if="loadingEmails" class="loading-state">
              <div class="upload-spinner"></div>
              <p>Loading email submissions...</p>
            </div>
            
            <div v-else-if="emailSubmissions.length === 0" class="empty-state">
              <p>No email submissions yet.</p>
            </div>
            
            <div v-else class="email-submissions-list">
              <div class="submissions-header">
                <div class="submission-count">
                  <span>Total: {{ emailSubmissions.length }} submission{{ emailSubmissions.length !== 1 ? 's' : '' }}</span>
                </div>
                <div class="submission-filters">
                  <button 
                    @click="emailFilter = 'all'" 
                    class="filter-btn"
                    :class="{ 'active': emailFilter === 'all' }"
                  >
                    All
                  </button>
                  <button 
                    @click="emailFilter = 'confirmed'" 
                    class="filter-btn"
                    :class="{ 'active': emailFilter === 'confirmed' }"
                  >
                    Confirmed
                  </button>
                  <button 
                    @click="emailFilter = 'pending'" 
                    class="filter-btn"
                    :class="{ 'active': emailFilter === 'pending' }"
                  >
                    Pending
                  </button>
                </div>
              </div>
              
              <div class="submissions-table">
                <div class="table-header">
                  <div class="table-cell">Email</div>
                  <div class="table-cell">Status</div>
                  <div class="table-cell">Confirmation Sent</div>
                  <div class="table-cell">Submitted At</div>
                  <div class="table-cell">Actions</div>
                </div>
                
                <div 
                  v-for="submission in filteredEmailSubmissions" 
                  :key="submission.id" 
                  class="table-row"
                >
                  <div class="table-cell">
                    <div class="email-cell">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M22 6L12 13L2 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                      <span>{{ submission.email }}</span>
                    </div>
                  </div>
                  <div class="table-cell">
                    <span 
                      class="status-badge" 
                      :class="{
                        'status-pending': submission.status === 'pending',
                        'status-confirmed': submission.status === 'confirmed',
                        'status-sent': submission.status === 'sent'
                      }"
                    >
                      {{ submission.status }}
                    </span>
                  </div>
                  <div class="table-cell">
                    <span v-if="submission.confirmationEmailSent" class="check-icon">✓</span>
                    <span v-else class="cross-icon">✗</span>
                  </div>
                  <div class="table-cell">
                    {{ formatDate(submission.createdAt) }}
                  </div>
                  <div class="table-cell">
                    <button 
                      @click="resendConfirmationEmail(submission)" 
                      class="btn-icon btn-small"
                      :disabled="submission.confirmationEmailSent"
                      title="Resend Confirmation Email"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 4V10H7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M23 20V14H17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M20.49 9C19.95 5.95 17.42 3.42 14.37 2.88M3.51 15C4.05 18.05 6.58 20.58 9.63 21.12M14.37 2.88C13.69 2.95 13.02 3.11 12.37 3.37M9.63 21.12C10.31 21.05 10.98 20.89 11.63 20.63M14.37 2.88L17.37 5.88M9.63 21.12L6.63 18.12M17.37 5.88L20.37 2.88M6.63 18.12L3.63 21.12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Contact Messages -->
          <div v-if="activeTab === 'contact-messages' && canAccessTab('contact-messages')" class="editor-section">
            <div class="section-header">
              <div class="section-title-group">
                <div class="section-icon">💬</div>
                <div>
                  <h3>Contact Messages</h3>
                  <p class="section-description">View and manage messages from the contact form</p>
                </div>
              </div>
            </div>
            
            <div v-if="loadingContactMessages" class="loading-state">
              <div class="loading-spinner"></div>
              <p>Loading messages...</p>
            </div>
            
            <div v-else-if="contactMessages.length === 0" class="empty-state">
              <p>No contact messages yet.</p>
            </div>
            
            <div v-else class="contact-messages-list">
              <div class="submissions-header">
                <div class="submission-count">
                  <span>Total: {{ contactMessages.length }} message{{ contactMessages.length !== 1 ? 's' : '' }}</span>
                </div>
                <div class="submission-filters">
                  <button 
                    :class="['filter-btn', { active: contactMessageFilter === 'all' }]"
                    @click="contactMessageFilter = 'all'"
                  >All</button>
                  <button 
                    :class="['filter-btn', { active: contactMessageFilter === 'pending' }]"
                    @click="contactMessageFilter = 'pending'"
                  >Pending</button>
                  <button 
                    :class="['filter-btn', { active: contactMessageFilter === 'read' }]"
                    @click="contactMessageFilter = 'read'"
                  >Read</button>
                  <button 
                    :class="['filter-btn', { active: contactMessageFilter === 'replied' }]"
                    @click="contactMessageFilter = 'replied'"
                  >Replied</button>
                </div>
              </div>
              
              <div class="messages-grid">
                <div 
                  v-for="message in filteredContactMessages" 
                  :key="message.id"
                  class="message-card"
                  :class="{ 'message-unread': message.status === 'pending' }"
                >
                  <div class="message-header">
                    <div class="message-sender">
                      <span class="sender-name">{{ message.name }}</span>
                      <span class="sender-email">{{ message.email }}</span>
                    </div>
                    <div class="message-meta">
                      <span :class="['status-badge', `status-${message.status}`]">
                        {{ message.status }}
                      </span>
                      <span class="message-date">{{ formatContactDate(message.createdAt) }}</span>
                    </div>
                  </div>
                  <div class="message-subject">
                    <strong>Subject:</strong> {{ message.subject }}
                  </div>
                  <div class="message-body">
                    {{ message.message }}
                  </div>
                  <div class="message-actions">
                    <select 
                      :value="message.status"
                      @change="updateContactMessageStatus(message.id!, ($event.target as HTMLSelectElement).value as ContactMessage['status'])"
                      class="status-select"
                    >
                      <option value="pending">Pending</option>
                      <option value="read">Read</option>
                      <option value="replied">Replied</option>
                    </select>
                    <a :href="'mailto:' + message.email + '?subject=Re: ' + message.subject" class="btn-reply">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 10H13C17.4183 10 21 13.5817 21 18V20M3 10L9 16M3 10L9 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                      Reply
                    </a>
                    <button 
                      v-if="hasPermission('delete_contact_messages')"
                      @click="deleteContactMessage(message.id!)" 
                      class="btn-delete"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 6H5H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Contact Settings -->
          <div v-if="activeTab === 'contact-settings' && canAccessTab('contact-settings')" class="editor-section">
            <div class="section-header">
              <div class="section-title-group">
                <div class="section-icon">📞</div>
                <div>
                  <h3>Contact Settings</h3>
                  <p class="section-description">Edit contact page content and social links</p>
                </div>
              </div>
            </div>
            
            <div class="form-section">
              <h4 class="subsection-title">Page Header</h4>
              <div class="form-group">
                <label>Header Title</label>
                <input v-model="contactSettings.headerTitle" type="text" class="form-input" placeholder="Ready To Elevate Your Brand ?" />
              </div>
              <div class="form-group">
                <label>Header Subtitle</label>
                <input v-model="contactSettings.headerSubtitle" type="text" class="form-input" placeholder="Contact us today for a free consultation and quote" />
              </div>
            </div>

            <div class="form-section">
              <h4 class="subsection-title">Section Titles</h4>
              <div class="form-row">
                <div class="form-group">
                  <label>Form Section Title</label>
                  <input v-model="contactSettings.formTitle" type="text" class="form-input" placeholder="Send us a Message" />
                </div>
                <div class="form-group">
                  <label>Contact Info Title</label>
                  <input v-model="contactSettings.infoTitle" type="text" class="form-input" placeholder="Contact Information" />
                </div>
              </div>
            </div>

            <div class="form-section">
              <h4 class="subsection-title">Contact Information</h4>
              
              <div class="contact-info-grid">
                <!-- Instagram -->
                <div class="contact-info-card">
                  <div class="contact-info-header">
                    <span class="contact-info-icon instagram">📷</span>
                    <span class="contact-info-label">Instagram</span>
                  </div>
                  <div class="form-group">
                    <label>Display Name</label>
                    <input v-model="contactSettings.contactInfo.instagram" type="text" class="form-input" placeholder="clear-up00" />
                  </div>
                  <div class="form-group">
                    <label>Profile URL</label>
                    <input v-model="contactSettings.contactInfo.instagramUrl" type="url" class="form-input" placeholder="https://instagram.com/clear-up00" />
                  </div>
                </div>

                <!-- Email -->
                <div class="contact-info-card">
                  <div class="contact-info-header">
                    <span class="contact-info-icon email">✉️</span>
                    <span class="contact-info-label">Email</span>
                  </div>
                  <div class="form-group">
                    <label>Email Address</label>
                    <input v-model="contactSettings.contactInfo.email" type="email" class="form-input" placeholder="info@ClearUP.com" />
                  </div>
                </div>

                <!-- LinkedIn -->
                <div class="contact-info-card">
                  <div class="contact-info-header">
                    <span class="contact-info-icon linkedin">💼</span>
                    <span class="contact-info-label">LinkedIn</span>
                  </div>
                  <div class="form-group">
                    <label>Display Name</label>
                    <input v-model="contactSettings.contactInfo.linkedin" type="text" class="form-input" placeholder="Clear Up" />
                  </div>
                  <div class="form-group">
                    <label>Profile URL</label>
                    <input v-model="contactSettings.contactInfo.linkedinUrl" type="url" class="form-input" placeholder="https://linkedin.com/company/clearup" />
                  </div>
                </div>

                <!-- WhatsApp -->
                <div class="contact-info-card">
                  <div class="contact-info-header">
                    <span class="contact-info-icon whatsapp">📱</span>
                    <span class="contact-info-label">WhatsApp</span>
                  </div>
                  <div class="form-group">
                    <label>Phone Number</label>
                    <input v-model="contactSettings.contactInfo.whatsapp" type="text" class="form-input" placeholder="+9708888888" />
                  </div>
                  <div class="form-group">
                    <label>WhatsApp Link</label>
                    <input v-model="contactSettings.contactInfo.whatsappUrl" type="url" class="form-input" placeholder="https://wa.me/9708888888" />
                  </div>
                </div>
              </div>
            </div>

            <div class="form-actions">
              <button @click="saveContactSettings" class="btn-primary" :disabled="savingContactSettings">
                <span v-if="savingContactSettings">Saving...</span>
                <span v-else>Save Contact Settings</span>
              </button>
            </div>
          </div>

          <!-- User Management (Admin Only) -->
          <div v-if="activeTab === 'users' && isAdmin && canAccessTab('users')" class="editor-section">
            <div class="section-header">
              <div class="section-title-group">
                <div class="section-icon">👥</div>
                <div>
                  <h3>User Management</h3>
                  <p class="section-description">Create and manage users</p>
                </div>
              </div>
            </div>

            <!-- Create User Form -->
            <div class="admin-form-card">
              <h4>Create New User</h4>
              <div class="form-grid">
                <div class="form-group">
                  <label>Email</label>
                  <input v-model="newUserForm.email" type="email" placeholder="user@example.com" class="form-input" />
                </div>
                <div class="form-group">
                  <label>Password</label>
                  <input v-model="newUserForm.password" type="password" placeholder="Password" class="form-input" />
                </div>
                <div class="form-group">
                  <label>Display Name</label>
                  <input v-model="newUserForm.displayName" type="text" placeholder="John Doe" class="form-input" />
                </div>
                <div class="form-group">
                  <label>Role</label>
                  <select v-model="newUserForm.role" class="form-input">
                    <option v-for="role in roles" :key="role.id" :value="role.name">
                      {{ role.name }}
                      <template v-if="role.description"> - {{ role.description }}</template>
                    </option>
                  </select>
                  <p v-if="getSelectedRolePermissions(newUserForm.role).length > 0" class="role-permissions-hint">
                    <span class="hint-label">Permissions:</span>
                    {{ getSelectedRolePermissions(newUserForm.role).slice(0, 3).map(p => getPermissionLabel(p)).join(', ') }}
                    <span v-if="getSelectedRolePermissions(newUserForm.role).length > 3">
                      +{{ getSelectedRolePermissions(newUserForm.role).length - 3 }} more
                    </span>
                  </p>
                </div>
              </div>
              <button @click="createUser" :disabled="isAdminLoading || !newUserForm.email || !newUserForm.password" class="btn-primary" style="margin-top: 1rem;">
                <svg v-if="!isAdminLoading" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <circle cx="8.5" cy="7" r="4" stroke="currentColor" stroke-width="2"/>
                  <path d="M20 8V14M17 11H23" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                <div v-else class="btn-spinner"></div>
                {{ isAdminLoading ? 'Creating...' : 'Create User' }}
              </button>
            </div>

            <!-- Users List -->
            <div class="admin-table-card">
              <h4>All Users</h4>
              <div v-if="isAdminLoading" class="loading-text">Loading users...</div>
              <div v-else class="users-list">
                <div v-for="u in users" :key="u.id" class="user-card">
                  <div v-if="editingUserId !== u.id" class="user-card-content">
                    <div class="user-info">
                      <div class="user-main-info">
                        <h5>{{ u.email }}</h5>
                        <p>{{ u.displayName || 'No display name' }}</p>
                        <span 
                          class="user-role-badge" 
                          :class="{ 
                            'role-admin': u.role === 'admin', 
                            'role-user': u.role === 'user' 
                          }"
                          :title="getRoleDescription(u.role || '')"
                        >
                          {{ u.role }}
                        </span>
                      </div>
                    </div>
                    <div class="user-actions">
                      <button @click="startEditUser(u)" class="btn-icon" title="Edit user">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          <path d="M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10217 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                      </button>
                        <button 
                          @click="resetUserPassword(u.email)" 
                        class="btn-icon btn-icon-warning" 
                          title="Send password reset email"
                        >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1 4V10H7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          <path d="M23 20V14H17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          <path d="M20.49 9C19.95 5.95 17.42 3.42 14.37 2.88M3.51 15C4.05 18.05 6.58 20.58 9.63 21.12M14.37 2.88C13.69 2.95 13.02 3.11 12.37 3.37M9.63 21.12C10.31 21.05 10.98 20.89 11.63 20.63M14.37 2.88L17.37 5.88M9.63 21.12L6.63 18.12M17.37 5.88L20.37 2.88M6.63 18.12L3.63 21.12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        </button>
                        <button 
                          @click="deleteUser(u.id)" 
                        class="btn-icon btn-icon-danger" 
                        title="Delete user"
                        >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M3 6H5H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        </button>
                      </div>
                  </div>
                  <!-- Edit Form -->
                  <div v-else class="user-edit-form">
                    <div class="form-grid">
                      <div class="form-group">
                        <label>Email</label>
                        <input v-model="editUserForm.email" type="email" class="form-input" />
                      </div>
                      <div class="form-group">
                        <label>Display Name</label>
                        <input v-model="editUserForm.displayName" type="text" class="form-input" />
                      </div>
                      <div class="form-group">
                        <label>Role</label>
                        <select v-model="editUserForm.role" class="form-input">
                          <option v-for="role in roles" :key="role.id" :value="role.name">
                            {{ role.name }}
                          </option>
                        </select>
                        <p v-if="getSelectedRolePermissions(editUserForm.role).length > 0" class="role-permissions-hint">
                          <span class="hint-label">Permissions:</span>
                          {{ getSelectedRolePermissions(editUserForm.role).slice(0, 3).map(p => getPermissionLabel(p)).join(', ') }}
                          <span v-if="getSelectedRolePermissions(editUserForm.role).length > 3">
                            +{{ getSelectedRolePermissions(editUserForm.role).length - 3 }} more
                          </span>
                        </p>
                      </div>
                    </div>
                    <div class="user-edit-actions">
                      <button @click="cancelUserEdit" class="btn-secondary">
                        Cancel
                      </button>
                      <button @click="saveUserEdit(u.id)" :disabled="isAdminLoading" class="btn-primary">
                        <div v-if="isAdminLoading" class="btn-spinner"></div>
                        {{ isAdminLoading ? 'Saving...' : 'Save Changes' }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Role Management (Admin Only) -->
          <div v-if="activeTab === 'roles' && isAdmin && canAccessTab('roles')" class="editor-section">
            <div class="section-header">
              <div class="section-title-group">
                <div class="section-icon">🔐</div>
                <div>
                  <h3>Role Management</h3>
                  <p class="section-description">Create and manage roles with specific permissions</p>
                </div>
              </div>
            </div>
            
            <!-- Info Banner -->
            <div class="info-banner">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                <path d="M12 16V12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <circle cx="12" cy="8" r="1" fill="currentColor"/>
              </svg>
              <div>
                <strong>How permissions work:</strong> When you update a role's permissions, users with that role will see the changes when they refresh their page or log in again.
              </div>
            </div>

            <!-- Create Role Form -->
            <div class="admin-form-card">
              <h4>Create New Role</h4>
              <div class="form-grid">
                <div class="form-group">
                  <label>Role Name</label>
                  <input v-model="newRoleForm.name" type="text" placeholder="e.g., content_writer" class="form-input" />
                </div>
                <div class="form-group full-width">
                  <label>Description</label>
                  <textarea v-model="newRoleForm.description" rows="2" placeholder="Describe what this role can do" class="form-textarea"></textarea>
                </div>
              </div>
              
              <!-- Permissions Selection -->
              <div class="permissions-section">
                <h5 class="permissions-title">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="2"/>
                    <path d="M9 12L11 14L15 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  Permissions
                </h5>
                <p class="permissions-description">Select what this role can access and modify</p>
                
                <div class="permissions-categories">
                  <div v-for="(permissions, category) in permissionsByCategory" :key="category" class="permission-category">
                    <div class="category-header">
                      <h6 class="category-title">{{ category }}</h6>
                      <div class="category-actions">
                        <button 
                          type="button"
                          @click="selectAllInCategory(newRoleForm, category)" 
                          class="category-btn"
                          :class="{ 'active': allCategorySelected(newRoleForm, category) }"
                        >
                          Select All
                        </button>
                        <button 
                          type="button"
                          @click="deselectAllInCategory(newRoleForm, category)" 
                          class="category-btn"
                        >
                          Clear
                        </button>
                      </div>
                    </div>
                    <div class="permission-checkboxes">
                      <label 
                        v-for="permission in permissions" 
                        :key="permission.id" 
                        class="permission-checkbox"
                        :class="{ 'checked': newRoleForm.permissions.includes(permission.id) }"
                      >
                        <input 
                          type="checkbox" 
                          :checked="newRoleForm.permissions.includes(permission.id)"
                          @change="togglePermission(newRoleForm, permission.id)"
                        />
                        <span class="checkbox-custom"></span>
                        <span class="checkbox-label">{{ permission.label }}</span>
                      </label>
                    </div>
                  </div>
                </div>
                
                <div class="selected-permissions-count">
                  <span class="count-badge">{{ newRoleForm.permissions.length }}</span>
                  permission{{ newRoleForm.permissions.length !== 1 ? 's' : '' }} selected
                </div>
              </div>
              
              <button @click="createRole" :disabled="isAdminLoading || !newRoleForm.name" class="btn-primary" style="margin-top: 1.5rem;">
                <svg v-if="!isAdminLoading" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                <div v-else class="btn-spinner"></div>
                {{ isAdminLoading ? 'Creating...' : 'Create Role' }}
              </button>
            </div>

            <!-- Roles List -->
            <div class="admin-table-card">
              <h4>Existing Roles</h4>
              <div v-if="isAdminLoading && roles.length === 0" class="loading-text">Loading roles...</div>
              <div v-else-if="roles.length === 0" class="empty-state">
                <p>No roles created yet. Create your first role above.</p>
              </div>
              <div v-else class="roles-list">
                <div v-for="role in roles" :key="role.id" class="role-card">
                  <div v-if="editingRoleId !== role.id" class="role-card-content">
                    <div class="role-info">
                      <div class="role-header">
                        <h5 class="role-name">
                          {{ role.name }}
                          <span v-if="role.name === 'admin'" class="role-badge admin-badge">System</span>
                          <span v-else-if="role.name === 'user'" class="role-badge user-badge">Default</span>
                        </h5>
                        <p class="role-description">{{ role.description || 'No description provided' }}</p>
                      </div>
                      <div v-if="role.permissions && role.permissions.length > 0" class="role-permissions">
                        <span class="permissions-label">Permissions:</span>
                        <div class="permission-badges">
                          <span 
                            v-for="permission in role.permissions.slice(0, 5)" 
                            :key="permission" 
                            class="permission-badge"
                            :title="getPermissionLabel(permission)"
                          >
                            {{ getPermissionLabel(permission) }}
                          </span>
                          <span 
                            v-if="role.permissions.length > 5" 
                            class="permission-badge more-badge"
                            :title="role.permissions.slice(5).map(p => getPermissionLabel(p)).join(', ')"
                          >
                            +{{ role.permissions.length - 5 }} more
                          </span>
                        </div>
                      </div>
                      <div v-else class="role-no-permissions">
                        <span>No permissions assigned</span>
                      </div>
                    </div>
                    <div class="role-actions">
                      <button @click="startEditRole(role)" class="btn-icon btn-icon-warning" title="Edit role">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          <path d="M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10217 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                      </button>
                      <button 
                        @click="deleteRole(role.id)" 
                        class="btn-icon btn-icon-danger" 
                        title="Delete role" 
                        :disabled="role.name === 'admin' || role.name === 'user'"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M3 6H5H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  <!-- Edit Form -->
                  <div v-else class="role-edit-form">
                    <div class="form-grid">
                      <div class="form-group">
                        <label>Role Name</label>
                        <input 
                          v-model="editRoleForm.name" 
                          type="text" 
                          class="form-input" 
                          :disabled="role.name === 'admin' || role.name === 'user'"
                        />
                      </div>
                      <div class="form-group full-width">
                        <label>Description</label>
                        <textarea v-model="editRoleForm.description" rows="2" class="form-textarea"></textarea>
                      </div>
                    </div>
                    
                    <!-- Permissions Selection for Edit -->
                    <div class="permissions-section">
                      <h5 class="permissions-title">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="2"/>
                          <path d="M9 12L11 14L15 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        Permissions
                      </h5>
                      
                      <div class="permissions-categories">
                        <div v-for="(permissions, category) in permissionsByCategory" :key="category" class="permission-category">
                          <div class="category-header">
                            <h6 class="category-title">{{ category }}</h6>
                            <div class="category-actions">
                              <button 
                                type="button"
                                @click="selectAllInCategory(editRoleForm, category)" 
                                class="category-btn"
                                :class="{ 'active': allCategorySelected(editRoleForm, category) }"
                              >
                                Select All
                              </button>
                              <button 
                                type="button"
                                @click="deselectAllInCategory(editRoleForm, category)" 
                                class="category-btn"
                              >
                                Clear
                              </button>
                            </div>
                          </div>
                          <div class="permission-checkboxes">
                            <label 
                              v-for="permission in permissions" 
                              :key="permission.id" 
                              class="permission-checkbox"
                              :class="{ 'checked': editRoleForm.permissions.includes(permission.id) }"
                            >
                              <input 
                                type="checkbox" 
                                :checked="editRoleForm.permissions.includes(permission.id)"
                                @change="togglePermission(editRoleForm, permission.id)"
                              />
                              <span class="checkbox-custom"></span>
                              <span class="checkbox-label">{{ permission.label }}</span>
                            </label>
                          </div>
                        </div>
                      </div>
                      
                      <div class="selected-permissions-count">
                        <span class="count-badge">{{ editRoleForm.permissions.length }}</span>
                        permission{{ editRoleForm.permissions.length !== 1 ? 's' : '' }} selected
                      </div>
                    </div>
                    
                    <div class="role-edit-actions">
                      <button @click="cancelRoleEdit" class="btn-secondary">
                        Cancel
                      </button>
                      <button @click="saveRoleEdit(role.id)" :disabled="isAdminLoading" class="btn-primary">
                        <div v-if="isAdminLoading" class="btn-spinner"></div>
                        {{ isAdminLoading ? 'Saving...' : 'Save Changes' }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Site Settings (Admin Only) -->
          <div v-if="activeTab === 'site-settings' && isAdmin && canAccessTab('site-settings')" class="editor-section">
            <div class="section-header">
              <div class="section-title-group">
                <div class="section-icon">⚙️</div>
                <div>
                  <h3>Site Settings</h3>
                  <p class="section-description">Enable or disable website sections</p>
                </div>
              </div>
            </div>

            <div class="admin-table-card">
              <h4>Section Management</h4>
              <p style="color: rgba(245, 247, 250, 0.6); margin-bottom: 1.5rem; font-size: 0.9rem;">
                Disable sections that need to be fixed or are experiencing errors. Disabled sections will be hidden from the website.
              </p>
              <div v-if="isAdminLoading" class="loading-text">Loading settings...</div>
              <div v-else class="sections-groups">
                <!-- Home Page Sections -->
                <div class="section-group">
                  <h5 class="section-group-title">🏠 Home Page</h5>
                  <div class="sections-list">
                    <div v-for="section in homeSections" :key="section.id" class="section-toggle-item">
                      <div class="section-info">
                        <h5>{{ section.label }}</h5>
                        <span class="section-id">ID: {{ section.id }}</span>
                      </div>
                      <label class="toggle-switch">
                        <input 
                          type="checkbox" 
                          :checked="!siteSettings.disabledSections?.includes(section.id)"
                          @change="toggleSection(section.id, !($event.target as HTMLInputElement).checked)"
                        />
                        <span class="toggle-slider"></span>
                        <span class="toggle-label">{{ siteSettings.disabledSections?.includes(section.id) ? 'Disabled' : 'Enabled' }}</span>
                      </label>
                    </div>
                  </div>
                </div>

                <!-- About Page Sections -->
                <div class="section-group">
                  <h5 class="section-group-title">ℹ️ About Page</h5>
                  <div class="sections-list">
                    <div v-for="section in aboutSections" :key="section.id" class="section-toggle-item">
                      <div class="section-info">
                        <h5>{{ section.label }}</h5>
                        <span class="section-id">ID: {{ section.id }}</span>
                      </div>
                      <label class="toggle-switch">
                        <input 
                          type="checkbox" 
                          :checked="!siteSettings.disabledSections?.includes(section.id)"
                          @change="toggleSection(section.id, !($event.target as HTMLInputElement).checked)"
                        />
                        <span class="toggle-slider"></span>
                        <span class="toggle-label">{{ siteSettings.disabledSections?.includes(section.id) ? 'Disabled' : 'Enabled' }}</span>
                      </label>
                    </div>
                  </div>
                </div>

                <!-- Services Page Sections -->
                <div class="section-group">
                  <h5 class="section-group-title">🛠️ Services Page</h5>
                  <div class="sections-list">
                    <div v-for="section in servicesSections" :key="section.id" class="section-toggle-item">
                      <div class="section-info">
                        <h5>{{ section.label }}</h5>
                        <span class="section-id">ID: {{ section.id }}</span>
                      </div>
                      <label class="toggle-switch">
                        <input 
                          type="checkbox" 
                          :checked="!siteSettings.disabledSections?.includes(section.id)"
                          @change="toggleSection(section.id, !($event.target as HTMLInputElement).checked)"
                        />
                        <span class="toggle-slider"></span>
                        <span class="toggle-label">{{ siteSettings.disabledSections?.includes(section.id) ? 'Disabled' : 'Enabled' }}</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Maintenance Mode (Admin Only) -->
          <div v-if="activeTab === 'maintenance' && isAdmin && canAccessTab('maintenance')" class="editor-section">
            <div class="section-header">
              <div class="section-title-group">
                <div class="section-icon">🔧</div>
                <div>
                  <h3>Maintenance Mode</h3>
                  <p class="section-description">Control website maintenance with multi-admin approval</p>
                </div>
              </div>
              <button @click="loadMaintenanceData" class="btn-secondary btn-small" :disabled="loadingMaintenance">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 4V10H7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M23 20V14H17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M20.49 9C19.95 5.95 17.42 3.42 14.37 2.88M3.51 15C4.05 18.05 6.58 20.58 9.63 21.12M14.37 2.88C13.69 2.95 13.02 3.11 12.37 3.37M9.63 21.12C10.31 21.05 10.98 20.89 11.63 20.63M14.37 2.88L17.37 5.88M9.63 21.12L6.63 18.12M17.37 5.88L20.37 2.88M6.63 18.12L3.63 21.12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Refresh
              </button>
            </div>

            <div v-if="loadingMaintenance" class="loading-state">
              <div class="upload-spinner"></div>
              <p>Loading maintenance status...</p>
            </div>

            <div v-else class="maintenance-content">
              <!-- Current Status -->
              <div class="maintenance-status-card" :class="{ 'active': isMaintenanceActive }">
                <div class="status-header">
                  <div class="status-indicator" :class="{ 'active': isMaintenanceActive }"></div>
                  <h4>{{ isMaintenanceActive ? 'Maintenance Mode Active' : 'Website Online' }}</h4>
                </div>
                <p v-if="activeMaintenanceRequest" class="status-details">
                  {{ activeMaintenanceRequest.type === 'turn_off' ? 'Website is currently offline for maintenance.' : 'Website is online.' }}
                </p>
                <p v-else class="status-details">Website is currently online and accessible.</p>
              </div>

              <!-- Action Buttons -->
              <div class="maintenance-actions">
                <button 
                  v-if="!isMaintenanceActive"
                  @click="showTurnOffModal = true"
                  class="btn-danger btn-large"
                  :disabled="hasPendingRequest"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  Turn Off Website
                </button>
                <button 
                  v-else
                  @click="showTurnOnModal = true"
                  class="btn-success btn-large"
                  :disabled="hasPendingRequest"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  Turn On Website
                </button>
              </div>

              <!-- Pending Requests -->
              <div v-if="pendingRequests.length > 0" class="pending-requests-section">
                <h4 class="subsection-title">Pending Approval Requests</h4>
                <div class="requests-list">
                  <div v-for="request in pendingRequests" :key="request.id" class="request-card">
                    <div class="request-header">
                      <div class="request-info">
                        <h5>{{ request.type === 'turn_off' ? 'Turn Off Website' : 'Turn On Website' }}</h5>
                        <p class="request-meta">
                          Requested by <strong>{{ request.requestedByName || request.requestedByEmail }}</strong>
                          <span v-if="request.createdAt" class="request-time">
                            on {{ formatMaintenanceDate(request.createdAt) }}
                          </span>
                        </p>
                        <p v-if="request.message" class="request-message">{{ request.message }}</p>
                        <p v-if="request.estimatedEndTime" class="request-time">
                          Estimated end: {{ formatMaintenanceDate(request.estimatedEndTime) }}
                        </p>
                      </div>
                      <div class="request-status-badge pending">Pending (1/2)</div>
                    </div>
                    <div class="request-actions">
                      <button 
                        v-if="request.requestedBy !== currentUserId"
                        @click="approveMaintenanceRequest(request.id!)"
                        class="btn-success btn-small"
                        :disabled="processingRequest === request.id"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        Approve
                      </button>
                      <button 
                        v-if="request.requestedBy !== currentUserId"
                        @click="() => { rejectRequest = request; showRejectModal = true }"
                        class="btn-danger btn-small"
                        :disabled="processingRequest === request.id"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          <path d="M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        Reject
                      </button>
                      <button 
                        v-if="request.requestedBy === currentUserId"
                        @click="cancelMaintenanceRequest(request.id!)"
                        class="btn-secondary btn-small"
                        :disabled="processingRequest === request.id"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          <path d="M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Request History -->
              <div v-if="maintenanceHistory.length > 0" class="maintenance-history-section">
                <h4 class="subsection-title">Request History</h4>
                <div class="history-list">
                  <div v-for="request in maintenanceHistory" :key="request.id" class="history-item">
                    <div class="history-info">
                      <div class="history-type">
                        <span class="history-badge" :class="request.type">{{ request.type === 'turn_off' ? 'Turn Off' : 'Turn On' }}</span>
                        <span class="history-status" :class="request.status">{{ request.status }}</span>
                      </div>
                      <p class="history-meta">
                        Requested by <strong>{{ request.requestedByName || request.requestedByEmail }}</strong>
                        <span v-if="request.approvedBy">, approved by <strong>{{ request.approvedByName || request.approvedByEmail }}</strong></span>
                        <span v-if="request.createdAt" class="history-time"> on {{ formatMaintenanceDate(request.createdAt) }}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Bookings Management (Admin Only) -->
          <div v-if="activeTab === 'bookings' && isAdmin && canAccessTab('bookings')" class="editor-section">
            <div class="section-header">
              <div class="section-title-group">
                <div class="section-icon">📅</div>
                <div>
                  <h3>Meeting Bookings</h3>
                  <p class="section-description">View and manage all meeting bookings</p>
                </div>
              </div>
              <div class="section-header-actions">
                <div v-if="upcomingBookingsCount > 0" class="reminder-badge">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="currentColor"/>
                  </svg>
                  {{ upcomingBookingsCount }} upcoming
                </div>
                <button @click="refreshBookings" class="btn-secondary">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 4V10H7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M23 20V14H17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M20.49 9C19.95 5.95 17.42 3.42 14.37 2.88M3.51 15C4.05 18.05 6.58 20.58 9.63 21.12M14.37 2.88C13.69 2.95 13.02 3.11 12.37 3.37M9.63 21.12C10.31 21.05 10.98 20.89 11.63 20.63M14.37 2.88L17.37 5.88M9.63 21.12L6.63 18.12M17.37 5.88L20.37 2.88M6.63 18.12L3.63 21.12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  Refresh
                </button>
              </div>
            </div>

            <!-- Upcoming Bookings Reminder -->
            <div v-if="upcomingBookings.length > 0" class="reminder-section">
              <div class="reminder-header">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="currentColor"/>
                </svg>
                <h4>Upcoming Meetings (Next 24 Hours)</h4>
              </div>
              <div class="reminder-list">
                <div 
                  v-for="booking in upcomingBookings" 
                  :key="booking.id"
                  class="reminder-item"
                >
                  <div class="reminder-time">{{ formatBookingDateTime(booking) }}</div>
                  <div class="reminder-info">
                    <strong>{{ booking.userName }}</strong>
                    <span>{{ booking.userEmail }}</span>
                  </div>
                  <button @click="startEditBooking(booking)" class="btn-icon-small" title="View/Edit">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10217 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <!-- View Toggle -->
            <div class="view-toggle">
              <button 
                @click="bookingViewMode = 'list'" 
                :class="['view-toggle-btn', { active: bookingViewMode === 'list' }]"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 6H21M8 12H21M8 18H21M3 6H3.01M3 12H3.01M3 18H3.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                List View
              </button>
              <button 
                @click="bookingViewMode = 'calendar'" 
                :class="['view-toggle-btn', { active: bookingViewMode === 'calendar' }]"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 2V6M16 2V6M3 10H21M5 4H19C20.1046 4 21 4.89543 21 6V20C21 21.1046 20.1046 22 19 22H5C3.89543 22 3 21.1046 3 20V6C3 4.89543 3.89543 4 5 4Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Calendar View
              </button>
              <button 
                @click="bookingViewMode = 'availability'" 
                :class="['view-toggle-btn', { active: bookingViewMode === 'availability' }]"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="currentColor"/>
                </svg>
                Manage Availability
              </button>
            </div>

            <!-- List View -->
            <div v-if="bookingViewMode === 'list'" class="admin-table-card">
              <div v-if="isLoadingBookings && bookings.length === 0" class="loading-text">Loading bookings...</div>
              <div v-else-if="bookings.length === 0" class="empty-state">
                <p>No bookings found.</p>
              </div>
              <div v-else class="bookings-list">
                <div v-for="booking in sortedBookings" :key="booking.id" class="booking-card">
                  <div v-if="editingBookingId !== booking.id" class="booking-card-content">
                    <div class="booking-info">
                      <div class="booking-header">
                        <h5 class="booking-user-name">{{ booking.userName }}</h5>
                        <span :class="['booking-status-badge', `status-${booking.status}`]">
                          {{ booking.status }}
                        </span>
                      </div>
                      <div class="booking-details">
                        <div class="booking-detail-item">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 4H20C21.1 4 22 4.9 22 6V20C22 21.1 21.1 22 20 22H4C2.9 22 2 21.1 2 20V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M22 6L12 13L2 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          </svg>
                          <span>{{ booking.userEmail }}</span>
                        </div>
                        <div class="booking-detail-item">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                            <path d="M12 6V12L16 14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                          </svg>
                          <span>{{ formatBookingDateTime(booking) }}</span>
                        </div>
                        <div v-if="booking.userPhone" class="booking-detail-item">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22 16.92V19.92C22.0011 20.1985 21.9441 20.4742 21.8325 20.7292C21.7209 20.9842 21.5573 21.2131 21.3522 21.4014C21.1472 21.5897 20.9053 21.7334 20.6391 21.8232C20.373 21.913 20.0882 21.9468 19.8052 21.9222C16.7427 21.5857 13.7862 20.5341 11.19 18.8522C8.77382 17.3147 6.72533 15.2662 5.18779 12.85C3.50589 10.2538 2.45428 7.29729 2.11779 4.23479C2.09319 3.9518 2.127 3.66898 2.2168 3.40285C2.30659 3.13672 2.45026 2.89479 2.63857 2.68975C2.82688 2.48471 3.05578 2.32115 3.31078 2.20955C3.56578 2.09795 3.84149 2.04095 4.11979 2.04192H7.11979C7.59722 2.04192 8.05553 2.23158 8.39379 2.56984C8.73205 2.9081 8.92171 3.36641 8.92171 3.84392C8.92171 4.32143 8.73205 4.77974 8.39379 5.118C8.05553 5.45626 7.59722 5.64592 7.11979 5.64592H5.11979C5.11979 7.92092 5.80979 10.1209 7.08979 11.9809L8.51979 10.5509C8.85979 10.2109 9.31979 10.0209 9.79979 10.0209C10.2798 10.0209 10.7398 10.2109 11.0798 10.5509L13.5198 12.9909C13.8598 13.3309 14.0498 13.7909 14.0498 14.2709C14.0498 14.7509 13.8598 15.2109 13.5198 15.5509L12.0898 16.9809C13.9498 18.2609 16.1498 18.9509 18.4248 18.9509H16.4248C15.9473 18.9509 15.489 19.1406 15.1507 19.4788C14.8125 19.8171 14.6228 20.2754 14.6228 20.7529C14.6228 21.2304 14.8125 21.6887 15.1507 22.027C15.489 22.3652 15.9473 22.5549 16.4248 22.5549H19.4248C19.9023 22.5549 20.3606 22.3652 20.6989 22.027C21.0371 21.6887 21.2268 21.2304 21.2268 20.7529C21.2268 20.2754 21.0371 19.8171 20.6989 19.4788C20.3606 19.1406 19.9023 18.9509 19.4248 18.9509V16.9509C19.9023 16.9509 20.3606 17.1406 20.6989 17.4788C21.0371 17.8171 21.2268 18.2754 21.2268 18.7529C21.2268 19.2304 21.0371 19.6887 20.6989 20.027C20.3606 20.3652 19.9023 20.5549 19.4248 20.5549Z" fill="currentColor"/>
                          </svg>
                          <span>{{ booking.userPhone }}</span>
                        </div>
                        <div class="booking-detail-item">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="currentColor"/>
                          </svg>
                          <span>{{ booking.contactMethod === 'email' ? 'Email' : 'WhatsApp' }}</span>
                        </div>
                        <div v-if="booking.meetingLink" class="booking-detail-item">
                          <a :href="booking.meetingLink" target="_blank" class="meeting-link">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M18 13V19C18 19.5304 17.7893 20.0391 17.4142 20.4142C17.0391 20.7893 16.5304 21 16 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V8C3 7.46957 3.21071 6.96086 3.58579 6.58579C3.96086 6.21071 4.46957 6 5 6H11" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                              <path d="M15 3H21M21 3V9M21 3L9 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            Meeting Link
                          </a>
                        </div>
                      </div>
                      <div v-if="booking.notes" class="booking-notes">
                        <strong>Notes:</strong> {{ booking.notes }}
                      </div>
                    </div>
                    <div class="booking-actions">
                      <button @click="startEditBooking(booking)" class="btn-icon" title="Edit booking">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          <path d="M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10217 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                      </button>
                      <button 
                        v-if="booking.status !== 'cancelled'"
                        @click="cancelBooking(booking.id!)" 
                        class="btn-icon btn-icon-danger" 
                        title="Cancel booking"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                      </button>
                      <button 
                        @click="deleteBooking(booking.id!)" 
                        class="btn-icon btn-icon-danger" 
                        title="Delete booking"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M3 6H5H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  <!-- Edit Booking Form -->
                  <div v-else-if="editingBookingId === booking.id" class="booking-edit-form">
                    <div class="form-grid">
                      <div class="form-group">
                        <label>User Name</label>
                        <input v-model="editBookingForm.userName" type="text" class="form-input" />
                      </div>
                      <div class="form-group">
                        <label>Email</label>
                        <input v-model="editBookingForm.userEmail" type="email" class="form-input" />
                      </div>
                      <div class="form-group">
                        <label>Phone</label>
                        <input v-model="editBookingForm.userPhone" type="tel" class="form-input" />
                      </div>
                      <div class="form-group">
                        <label>Date</label>
                        <input v-model="editBookingForm.meetingDate" type="date" class="form-input" />
                      </div>
                      <div class="form-group">
                        <label>Time</label>
                        <input v-model="editBookingForm.meetingTime" type="time" class="form-input" />
                      </div>
                      <div class="form-group">
                        <label>Status</label>
                        <select v-model="editBookingForm.status" class="form-input">
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="cancelled">Cancelled</option>
                          <option value="completed">Completed</option>
                        </select>
                      </div>
                      <div class="form-group full-width">
                        <label>Notes</label>
                        <textarea v-model="editBookingForm.notes" rows="3" class="form-textarea"></textarea>
                      </div>
                    </div>
                    <div class="booking-edit-actions">
                      <button @click="cancelBookingEdit" class="btn-secondary" :disabled="isSavingBooking">Cancel</button>
                      <button @click="saveBookingEdit(booking.id!)" :disabled="isSavingBooking" class="btn-primary">
                        <div v-if="isSavingBooking" class="btn-spinner"></div>
                        {{ isSavingBooking ? 'Saving...' : 'Save Changes' }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Calendar View -->
            <div v-if="bookingViewMode === 'calendar'" class="admin-table-card">
              <div class="calendar-view-container">
                <div class="calendar-header-controls">
                  <button @click="previousMonth" class="calendar-nav-btn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </button>
                  <h4>{{ calendarMonthYear }}</h4>
                  <button @click="nextMonth" class="calendar-nav-btn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </button>
                </div>
                <div class="admin-calendar-grid">
                  <div class="calendar-day-header" v-for="day in dayHeaders" :key="day">
                    {{ day }}
                  </div>
                  <div 
                    v-for="day in adminCalendarDays" 
                    :key="day.date.toISOString()"
                    class="admin-calendar-day"
                    :class="{
                      'other-month': !day.isCurrentMonth,
                      'has-booking': day.bookings.length > 0,
                      'today': day.isToday
                    }"
                    @click="selectCalendarDate(day.date)"
                  >
                    <div class="calendar-day-number">{{ day.day }}</div>
                    <div v-if="day.bookings.length > 0" class="calendar-day-bookings">
                      <div 
                        v-for="booking in day.bookings" 
                        :key="booking.id"
                        class="calendar-booking-dot"
                        :class="`status-${booking.status}`"
                        :title="`${booking.userName} - ${booking.meetingTime}`"
                      ></div>
                    </div>
                  </div>
                </div>
                <div v-if="selectedCalendarDate" class="selected-date-bookings">
                  <h5>Bookings on {{ formatSelectedDate(selectedCalendarDate) }}</h5>
                  <div v-if="getBookingsForDate(selectedCalendarDate).length === 0" class="no-bookings">
                    No bookings for this date
                  </div>
                  <div v-else class="date-bookings-list">
                    <div 
                      v-for="booking in getBookingsForDate(selectedCalendarDate)" 
                      :key="booking.id"
                      class="date-booking-item"
                    >
                      <div class="booking-time">{{ booking.meetingTime }}</div>
                      <div class="booking-info">
                        <strong>{{ booking.userName }}</strong>
                        <span class="booking-email">{{ booking.userEmail }}</span>
                      </div>
                      <div class="booking-actions">
                        <span :class="['booking-status-badge', `status-${booking.status}`]">
                          {{ booking.status }}
                        </span>
                        <button 
                          v-if="booking.id"
                          @click="deleteBooking(booking.id)" 
                          class="btn-icon btn-icon-danger" 
                          title="Delete booking"
                          style="margin-left: 8px;"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 6H5H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Availability Management View -->
            <div v-if="bookingViewMode === 'availability'" class="admin-table-card">
              <div class="availability-management">
                <div class="availability-header">
                  <h4>Manage Your Availability</h4>
                  <p class="section-description">Block or unblock time slots to control when meetings can be booked</p>
                </div>
                
                <div class="availability-calendar-container">
                  <div class="calendar-header-controls">
                    <button @click="previousAvailabilityMonth" class="calendar-nav-btn">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </button>
                    <h4>{{ availabilityMonthYear }}</h4>
                    <button @click="nextAvailabilityMonth" class="calendar-nav-btn">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </button>
                  </div>
                  
                  <div class="admin-calendar-grid">
                    <div class="calendar-day-header" v-for="day in dayHeaders" :key="day">
                      {{ day }}
                    </div>
                    <div 
                      v-for="day in availabilityCalendarDays" 
                      :key="day.date.toISOString()"
                      class="admin-calendar-day"
                      :class="{
                        'other-month': !day.isCurrentMonth,
                        'selected': isSelectedAvailabilityDate(day.date),
                        'today': day.isToday
                      }"
                      @click="selectAvailabilityDate(day.date)"
                    >
                      <div class="calendar-day-number">{{ day.day }}</div>
                    </div>
                  </div>
                  
                  <div v-if="selectedAvailabilityDate" class="availability-date-controls">
                    <h5>Manage Time Slots for {{ formatSelectedDate(selectedAvailabilityDate) }}</h5>
                    <div class="time-slots-management">
                      <div 
                        v-for="slot in defaultTimeSlots" 
                        :key="slot"
                        class="time-slot-control"
                        :class="{ 'blocked': isTimeSlotBlocked(selectedAvailabilityDate, slot) }"
                      >
                        <div class="time-slot-info">
                          <span class="time-slot-time">{{ formatTime(slot) }}</span>
                          <span v-if="isTimeSlotBlocked(selectedAvailabilityDate, slot)" class="blocked-reason">
                            {{ getBlockedReason(selectedAvailabilityDate, slot) }}
                          </span>
                        </div>
                        <button 
                          @click="toggleTimeSlot(selectedAvailabilityDate, slot)"
                          :class="['btn-toggle', isTimeSlotBlocked(selectedAvailabilityDate, slot) ? 'btn-unblock' : 'btn-block']"
                        >
                          {{ isTimeSlotBlocked(selectedAvailabilityDate, slot) ? 'Unblock' : 'Block' }}
                        </button>
                      </div>
                    </div>
                  </div>
                  <div v-else class="select-date-message">
                    <p>Select a date from the calendar above to manage time slots</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Google Calendar Settings (Admin Only) -->
          <div v-if="activeTab === 'google-calendar' && isAdmin && canAccessTab('google-calendar')" class="editor-section">
            <div class="section-header">
              <div class="section-title-group">
                <div class="section-icon">📅</div>
                <div>
                  <h3>Google Calendar Integration</h3>
                  <p class="section-description">Connect your Google Calendar to automatically create Google Meet links for bookings</p>
                </div>
              </div>
            </div>

            <div class="admin-table-card">
              <div v-if="isLoadingGoogleCalendar" class="loading-text">Loading...</div>
              <div v-else>
                <div v-if="isGoogleCalendarConnected" class="google-calendar-connected">
                  <div class="connection-status success">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#28a745" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <div>
                      <h4>Google Calendar Connected</h4>
                      <p>Your Google Calendar is connected. Google Meet links will be automatically created for new bookings.</p>
                    </div>
                  </div>
                  <button @click="disconnectGoogleCalendar" class="btn-secondary" style="margin-top: 20px;">
                    Disconnect Google Calendar
                  </button>
                </div>
                <div v-else class="google-calendar-disconnected">
                  <div class="connection-status">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <div>
                      <h4>Google Calendar Not Connected</h4>
                      <p>Connect your Google Calendar to automatically create Google Meet events and send calendar invites when users book meetings.</p>
                    </div>
                  </div>
                  <div class="connection-benefits">
                    <h5>Benefits of connecting:</h5>
                    <ul>
                      <li>✅ Automatic Google Meet link generation for each booking</li>
                      <li>✅ Calendar invites sent to both you and the user</li>
                      <li>✅ Automatic event updates when bookings are rescheduled</li>
                      <li>✅ Event cancellation when bookings are cancelled</li>
                    </ul>
                  </div>
                  <button @click="connectGoogleCalendar" class="btn-primary" style="margin-top: 20px;">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-right: 8px;">
                      <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM16.64 8.8C16.49 10.38 15.84 11.9 14.96 13.1C14.06 14.3 13.03 15.28 11.8 16.04C11.5 16.22 11.2 16.3 10.88 16.37C10.57 16.44 10.23 16.5 9.89 16.5H9.75C9.44 16.5 9.14 16.4 8.88 16.23C8.61 16.06 8.38 15.82 8.24 15.53L8.09 15.23C7.95 14.94 7.9 14.62 7.96 14.31C8.02 14 8.18 13.72 8.42 13.5C8.66 13.28 8.97 13.14 9.29 13.1H9.43C9.67 13.07 9.9 13.04 10.12 13C10.95 12.83 11.66 12.5 12.3 12.01C12.93 11.52 13.46 10.9 13.85 10.19C14.25 9.48 14.5 8.69 14.6 7.85C14.62 7.67 14.65 7.49 14.67 7.31C14.69 7.13 14.7 6.95 14.7 6.77C14.7 6.22 14.47 5.69 14.07 5.29C13.67 4.89 13.14 4.66 12.59 4.66C12.04 4.66 11.51 4.89 11.11 5.29C10.71 5.69 10.48 6.22 10.48 6.77H8.48C8.48 5.66 8.92 4.6 9.71 3.81C10.5 3.02 11.56 2.58 12.67 2.58C13.78 2.58 14.84 3.02 15.63 3.81C16.42 4.6 16.86 5.66 16.86 6.77C16.86 7.15 16.8 7.52 16.69 7.88C16.58 8.24 16.42 8.58 16.22 8.89L16.64 8.8Z" fill="currentColor"/>
                    </svg>
                    Connect Google Calendar
                  </button>
                </div>
                <div v-if="googleCalendarError" class="error-message" style="margin-top: 20px;">
                  {{ googleCalendarError }}
                </div>
              </div>
            </div>
          </div>

          <!-- Activity Logs (Admin Only) -->
          <div v-if="activeTab === 'activity-logs' && isAdmin && canAccessTab('activity-logs')" class="editor-section">
            <div class="section-header">
              <div class="section-title-group">
                <div class="section-icon">📋</div>
                <div>
                  <h3>Activity Logs</h3>
                  <p class="section-description">View all user activities and changes</p>
                </div>
              </div>
              <button @click="refreshActivityLogs" class="btn-secondary" style="margin-left: auto;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 4V10H7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M23 20V14H17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M20.49 9C19.95 5.95 17.42 3.42 14.37 2.88M3.51 15C4.05 18.05 6.58 20.58 9.63 21.12M14.37 2.88C13.69 2.95 13.02 3.11 12.37 3.37M9.63 21.12C10.31 21.05 10.98 20.89 11.63 20.63M14.37 2.88L17.37 5.88M9.63 21.12L6.63 18.12M17.37 5.88L20.37 2.88M6.63 18.12L3.63 21.12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Refresh
              </button>
            </div>

            <div class="admin-table-card">
              <div v-if="isAdminLoading" class="loading-text">Loading activity logs...</div>
              <div v-else-if="activityLogs.length === 0" class="empty-state">
                <p>No activity logs found. Changes made by users will appear here.</p>
              </div>
              <div v-else class="activity-logs">
                <div v-for="log in activityLogs" :key="log.id" class="activity-log-item">
                  <div class="log-header">
                    <div class="log-user-info">
                      <div class="log-user-avatar">
                        {{ ((log.userName || log.userEmail || 'U') as string)?.[0]?.toUpperCase() || 'U' }}
                      </div>
                      <div>
                        <strong class="log-user-name">{{ log.userName || log.userEmail || 'Unknown User' }}</strong>
                        <div class="log-action-badge">{{ formatAction(log.action) }}</div>
                      </div>
                    </div>
                    <span class="log-time">{{ formatDate(log.createdAt) }}</span>
                  </div>
                  <div class="log-content">
                    <div class="log-description">
                      {{ getLogDescription(log) }}
                    </div>
                    <div v-if="log.changes && Object.keys(log.changes).length > 0" class="log-changes-summary">
                      <div class="changes-header">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <span>{{ getChangedFieldsCount(log.changes) }} field(s) changed</span>
                      </div>
                      <details class="log-changes-details">
                        <summary>View detailed changes</summary>
                        <div class="changes-list">
                          <div v-for="(change, field) in log.changes" :key="field" class="change-item">
                            <div class="change-field">{{ formatFieldName(field) }}</div>
                            <div class="change-values">
                              <div v-if="change.before !== undefined" class="change-before">
                                <span class="change-label">Before:</span>
                                <span class="change-value">{{ formatChangeValue(change.before) }}</span>
                              </div>
                              <div v-if="change.after !== undefined" class="change-after">
                                <span class="change-label">After:</span>
                                <span class="change-value">{{ formatChangeValue(change.after) }}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </details>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Analytics Section -->
          <div v-if="activeTab === 'analytics' && canAccessTab('analytics')" class="editor-section">
            <div class="section-header">
              <div class="section-title-group">
                <div class="section-icon">📊</div>
                <div>
                  <h3>Website Analytics</h3>
                  <p class="section-description">View visitor statistics, countries, and traffic trends</p>
                </div>
              </div>
              <button @click="loadAnalytics" :disabled="loadingAnalytics" class="btn-secondary btn-small">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 4V10H7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M23 20V14H17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M20.49 9C19.95 5.95 17.42 3.42 14.37 2.88M3.51 15C4.05 18.05 6.58 20.58 9.63 21.12M14.37 2.88C13.69 2.95 13.02 3.11 12.37 3.37M9.63 21.12C10.31 21.05 10.98 20.89 11.63 20.63M14.37 2.88L17.37 5.88M9.63 21.12L6.63 18.12M17.37 5.88L20.37 2.88M6.63 18.12L3.63 21.12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Refresh
              </button>
            </div>

            <!-- Statistics Cards -->
            <div class="analytics-stats-grid">
              <div class="stat-card">
                <div class="stat-icon">👥</div>
                <div class="stat-content">
                  <div class="stat-label">Total Visits</div>
                  <div class="stat-value">{{ analyticsStats.totalVisits.toLocaleString() }}</div>
                </div>
              </div>
              <div class="stat-card">
                <div class="stat-icon">🆔</div>
                <div class="stat-content">
                  <div class="stat-label">Unique Visitors</div>
                  <div class="stat-value">{{ analyticsStats.uniqueVisitors.toLocaleString() }}</div>
                </div>
              </div>
              <div class="stat-card">
                <div class="stat-icon">📅</div>
                <div class="stat-content">
                  <div class="stat-label">Today</div>
                  <div class="stat-value">{{ analyticsStats.todayVisits.toLocaleString() }}</div>
                </div>
              </div>
              <div class="stat-card">
                <div class="stat-icon">📆</div>
                <div class="stat-content">
                  <div class="stat-label">This Month</div>
                  <div class="stat-value">{{ analyticsStats.thisMonthVisits.toLocaleString() }}</div>
                </div>
              </div>
              <div class="stat-card">
                <div class="stat-icon">🗓️</div>
                <div class="stat-content">
                  <div class="stat-label">This Year</div>
                  <div class="stat-value">{{ analyticsStats.thisYearVisits.toLocaleString() }}</div>
                </div>
              </div>
            </div>

            <!-- Time Period Selector -->
            <div class="analytics-period-selector">
              <button 
                v-for="period in analyticsPeriods" 
                :key="period.value"
                @click="selectedAnalyticsPeriod = period.value as 'daily' | 'monthly' | 'yearly'"
                :class="['period-btn', { active: selectedAnalyticsPeriod === period.value }]"
              >
                {{ period.label }}
              </button>
            </div>

            <!-- Charts -->
            <div class="analytics-charts-grid">
              <!-- Daily/Monthly/Yearly Chart -->
              <div class="chart-card">
                <h4 class="chart-title">
                  {{ selectedAnalyticsPeriod === 'daily' ? 'Daily' : selectedAnalyticsPeriod === 'monthly' ? 'Monthly' : 'Yearly' }} Visits
                </h4>
                <div class="chart-wrapper">
                  <AnalyticsChart
                    :type="selectedAnalyticsPeriod === 'yearly' ? 'bar' : 'line'"
                    :data="timeSeriesChartData"
                    :options="{
                      plugins: {
                        legend: { display: false }
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: {
                            precision: 0
                          }
                        }
                      }
                    }"
                  />
                </div>
              </div>

              <!-- Country Chart -->
              <div class="chart-card">
                <h4 class="chart-title">Visits by Country</h4>
                <div class="chart-wrapper">
                  <AnalyticsChart
                    type="doughnut"
                    :data="countryChartData"
                    :options="{
                      plugins: {
                        legend: {
                          position: 'right'
                        }
                      }
                    }"
                  />
                </div>
              </div>
            </div>

            <!-- Country List -->
            <div class="analytics-country-list">
              <h4 class="section-subtitle">Top Countries</h4>
              <div class="country-list">
                <div 
                  v-for="(country, index) in topCountries" 
                  :key="country.country"
                  class="country-item"
                >
                  <div class="country-rank">{{ index + 1 }}</div>
                  <div class="country-name">{{ country.country }}</div>
                  <div class="country-count">{{ country.count.toLocaleString() }} visits</div>
                  <div class="country-bar">
                    <div 
                      class="country-bar-fill" 
                      :style="{ width: `${(country.count / (topCountries[0]?.count || 1)) * 100}%` }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Fixed Action Bar -->
          <div class="action-bar" v-if="!['users', 'roles', 'site-settings', 'activity-logs', 'analytics'].includes(activeTab)">
            <div class="action-bar-content">
              <div class="action-info">
                <div v-if="saveMessage" :class="['status-message', saveMessageType]">
                  <svg v-if="saveMessageType === 'success'" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                    <path d="M12 8V12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    <path d="M12 16H12.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                  <span>{{ saveMessage }}</span>
                </div>
                <div v-else class="action-hint">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="2"/>
                    <path d="M12 16V12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    <path d="M12 8H12.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                  Make changes and click Save to update your website
                </div>
              </div>
              
              <div class="action-buttons">
                <button v-if="isAdmin" @click="resetContent" :disabled="isSaving" class="btn-secondary">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 4V10H7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M23 20V14H17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M20.49 9C19.95 5.95 17.42 3.42 14.37 2.88M3.51 15C4.05 18.05 6.58 20.58 9.63 21.12M14.37 2.88C13.69 2.95 13.02 3.11 12.37 3.37M9.63 21.12C10.31 21.05 10.98 20.89 11.63 20.63M14.37 2.88L17.37 5.88M9.63 21.12L6.63 18.12M17.37 5.88L20.37 2.88M6.63 18.12L3.63 21.12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  Reset
                </button>
                <button @click="saveContent" :disabled="isSaving" class="btn-primary">
                  <svg v-if="!isSaving" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16L21 8V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M17 21V13H7V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M7 3V8H15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <div v-else class="btn-spinner"></div>
                  {{ isSaving ? 'Saving...' : 'Save Changes' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- Maintenance Modals -->
    <!-- Turn Off Modal -->
    <div v-if="showTurnOffModal" class="modal-overlay" @click.self="showTurnOffModal = false">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Turn Off Website</h3>
          <button @click="showTurnOffModal = false" class="modal-close">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <p class="modal-warning">
            This will create a maintenance request that requires approval from another admin. 
            Once approved, the website will be turned off for all non-admin users.
          </p>
          <div class="form-group">
            <label>Maintenance Message (Optional)</label>
            <textarea 
              v-model="maintenanceForm.message" 
              rows="3" 
              class="form-textarea"
              placeholder="Website is currently under maintenance. Please check back later."
            ></textarea>
          </div>
          <div class="form-group">
            <label>Estimated End Time (Optional)</label>
            <input 
              v-model="maintenanceForm.estimatedEndTime" 
              type="datetime-local" 
              class="form-input"
            />
          </div>
        </div>
        <div class="modal-footer">
          <button @click="showTurnOffModal = false" class="btn-secondary">Cancel</button>
          <button 
            @click="createMaintenanceRequest('turn_off')" 
            class="btn-danger"
            :disabled="processingRequest === 'creating'"
          >
            {{ processingRequest === 'creating' ? 'Creating...' : 'Create Request' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Turn On Modal -->
    <div v-if="showTurnOnModal" class="modal-overlay" @click.self="showTurnOnModal = false">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Turn On Website</h3>
          <button @click="showTurnOnModal = false" class="modal-close">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <p class="modal-warning">
            This will create a maintenance request that requires approval from another admin. 
            Once approved, the website will be turned back on for all users.
          </p>
        </div>
        <div class="modal-footer">
          <button @click="showTurnOnModal = false" class="btn-secondary">Cancel</button>
          <button 
            @click="createMaintenanceRequest('turn_on')" 
            class="btn-success"
            :disabled="processingRequest === 'creating'"
          >
            {{ processingRequest === 'creating' ? 'Creating...' : 'Create Request' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Reject Modal -->
    <div v-if="showRejectModal && rejectRequest" class="modal-overlay" @click.self="showRejectModal = false">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Reject Maintenance Request</h3>
          <button @click="showRejectModal = false" class="modal-close">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <p>Are you sure you want to reject this maintenance request?</p>
          <div class="form-group">
            <label>Rejection Reason (Optional)</label>
            <textarea 
              v-model="rejectReason" 
              rows="3" 
              class="form-textarea"
              placeholder="Reason for rejection..."
            ></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="showRejectModal = false" class="btn-secondary">Cancel</button>
          <button 
            @click="rejectMaintenanceRequest(rejectRequest.id!, rejectReason || undefined)" 
            class="btn-danger"
            :disabled="processingRequest === rejectRequest.id"
          >
            {{ processingRequest === rejectRequest.id ? 'Rejecting...' : 'Reject Request' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { authService } from '@/features/auth/services/AuthService'
import { storageService } from '@/shared/services'
import { AuthViewController } from '@/features/auth/controllers/AuthViewController'
import { homeContentController } from '@/features/home/controllers/HomeContentController'
import { aboutContentController } from '@/features/about/controllers/AboutContentController'
import { servicesContentController } from '@/features/services/controllers/ServicesContentController'
import { legalContentController } from '@/features/legal/controllers/LegalContentController'
import { adminUserController } from '../controllers/UserController'
import { adminUserService } from '../services/UserService'
import { roleController } from '../controllers/RoleController'
import { activityLogController } from '../controllers/ActivityLogController'
import { siteSettingsController } from '../controllers/SiteSettingsController'
import { maintenanceController } from '../controllers/MaintenanceController'
import { emailController } from '@/features/home/controllers/EmailController'
import { contactContentController } from '@/features/contact/controllers/ContactContentController'
import type { EmailSubmission } from '@/features/home/services/EmailService'
import type { ContactMessage, ContactContent, ContactInfo } from '@/features/contact/models/ContactMessage'
import { bookingController } from '@/features/booking/controllers/BookingController'
import type { Booking, BookingData } from '@/features/booking/models/Booking'
import { availabilityService } from '@/features/booking/services/AvailabilityService'
import { googleCalendarController } from '../controllers/GoogleCalendarController'
import { analyticsController } from '@/features/analytics/controllers/AnalyticsController'
import AnalyticsChart from '@/shared/components/AnalyticsChart.vue'
import type { SiteSettings } from '../models/SiteSettings'
import type { HomeContent } from '@/features/home/models/HomeContent'
import type { AboutContent, TeamMember, FAQ, StatCard } from '@/features/about/models/AboutContent'
import type { ServicesContent, WhyChooseFeature } from '@/features/services/models/ServicesContent'
import type { LegalContent } from '@/features/legal/models/LegalContent'
import { defaultLegalContent } from '@/features/legal/models/LegalContent'
import type { User } from '@/features/auth/models/User'
import type { Role } from '../models/Role'
import type { ActivityLog } from '../models/ActivityLog'
import type { MaintenanceRequest } from '../models/MaintenanceRequest'

const router = useRouter()
const route = useRoute()
const userViewController = new AuthViewController()

const user = computed(() => userViewController.user)
const isLoading = ref(true)
const isSaving = ref(false)
const errorMessage = ref('')
const saveMessage = ref('')
const saveMessageType = ref<'success' | 'error'>('success')

const activeTab = ref('hero')
const isAdmin = ref(false)
const uploadingLogos = ref<Record<number, boolean>>({})
const uploadingPhotos = ref<Record<number, boolean>>({})
const uploadingTestimonialVideos = ref<Record<number, boolean>>({})
const uploadingThumbnails = ref<Record<number, boolean>>({})
const uploadProgressPhotos = ref<Record<number, number>>({})
const uploadProgressTestimonialVideos = ref<Record<number, number>>({})
const uploadProgressThumbnails = ref<Record<number, number>>({})
const baseTabs = [
  { id: 'hero', label: 'Hero Section' },
  { id: 'cta', label: 'CTA Section' },
  { id: 'who-we-are', label: 'Who We Are' },
  { id: 'system', label: 'System' },
  { id: 'services', label: 'Services' },
  { id: 'what-we-do', label: 'What We Do' },
  { id: 'what-you-get', label: 'What You Get' },
  { id: 'bonuses', label: 'Bonuses' },
  { id: 'clients', label: 'Clients & Testimonials' },
  { id: 'real-results', label: 'Real Results' },
  { id: 'about', label: 'About Page' },
  { id: 'services-page', label: 'Services Page' },
  { id: 'footer', label: 'Footer' },
  { id: 'legal-pages', label: 'Legal Pages' },
  { id: 'email-submissions', label: 'Email Submissions' },
  { id: 'contact-messages', label: 'Contact Messages' },
  { id: 'contact-settings', label: 'Contact Settings' }
]
const adminTabs = [
  { id: 'analytics', label: 'Analytics' },
  { id: 'users', label: 'User Management' },
  { id: 'roles', label: 'Role Management' },
  { id: 'bookings', label: 'Bookings' },
  { id: 'google-calendar', label: 'Google Calendar' },
  { id: 'site-settings', label: 'Site Settings' },
  { id: 'maintenance', label: 'Maintenance Mode' },
  { id: 'activity-logs', label: 'Activity Logs' }
]
// Map tabs to required permissions
const tabPermissionMap: Record<string, string> = {
  'hero': 'edit_hero',
  'cta': 'edit_cta',
  'who-we-are': 'edit_who_we_are',
  'system': 'edit_system',
  'services': 'edit_services',
  'what-we-do': 'edit_what_we_do',
  'what-you-get': 'edit_what_you_get',
  'bonuses': 'edit_bonuses',
  'clients': 'edit_clients',
  'real-results': 'edit_real_results',
  'footer': 'edit_footer',
  'about': 'edit_about_page',
  'services-page': 'edit_services_page',
  'legal-pages': 'edit_legal_pages',
  'email-submissions': 'view_email_submissions',
  'contact-messages': 'view_contact_messages',
  'contact-settings': 'edit_contact_settings',
  'users': 'manage_users',
  'roles': 'manage_roles',
  'analytics': 'view_analytics',
  'bookings': 'manage_bookings',
  'google-calendar': 'manage_bookings',
  'site-settings': 'manage_site_settings',
  'maintenance': 'manage_maintenance',
  'activity-logs': 'view_activity_logs',
}

// Get current user's permissions from their role
const userPermissions = computed(() => {
  if (isAdmin.value) {
    // Admin has all permissions
    return availablePermissions.map(p => p.id)
  }
  
  const userRole = user.value?.role
  if (!userRole) return []
  
  const role = roles.value.find(r => r.name === userRole)
  return role?.permissions || []
})

// Check if user has a specific permission
const hasPermission = (permissionId: string): boolean => {
  if (isAdmin.value) return true
  return userPermissions.value.includes(permissionId)
}

// Check if user can access a specific tab
const canAccessTab = (tabId: string): boolean => {
  if (isAdmin.value) return true
  
  const requiredPermission = tabPermissionMap[tabId]
  if (!requiredPermission) return true // Tab has no permission requirement
  
  return hasPermission(requiredPermission)
}

const tabs = computed(() => {
  const allTabs = isAdmin.value ? [...baseTabs, ...adminTabs] : baseTabs
  
  // For admin, show all tabs
  if (isAdmin.value) {
    return allTabs
  }
  
  // For other users, filter tabs based on permissions
  return allTabs.filter(tab => canAccessTab(tab.id))
})

// Admin management state
const users = ref<User[]>([])
const roles = ref<Role[]>([])
const activityLogs = ref<ActivityLog[]>([])
const isAdminLoading = ref(false)
const siteSettings = ref<SiteSettings>({
  disabledSections: [],
  maintenanceMode: false
})
const emailSubmissions = ref<EmailSubmission[]>([])
const loadingEmails = ref(false)
const emailFilter = ref<'all' | 'pending' | 'confirmed'>('all')

// Contact management state
const contactMessages = ref<ContactMessage[]>([])
const loadingContactMessages = ref(false)
const contactMessageFilter = ref<'all' | 'pending' | 'read' | 'replied'>('all')
const contactSettings = ref<ContactContent>({
  headerTitle: 'Ready To Elevate Your Brand ?',
  headerSubtitle: 'Contact us today for a free consultation and quote',
  formTitle: 'Send us a Message',
  infoTitle: 'Contact Information',
  contactInfo: {
    instagram: 'clear-up00',
    instagramUrl: 'https://instagram.com/clear-up00',
    email: 'info@ClearUP.com',
    linkedin: 'Clear Up',
    linkedinUrl: 'https://linkedin.com/company/clearup',
    whatsapp: '+9708888888',
    whatsappUrl: 'https://wa.me/9708888888'
  }
})
const savingContactSettings = ref(false)

// Maintenance management state
const isMaintenanceActive = ref(false)
const activeMaintenanceRequest = ref<MaintenanceRequest | null>(null)
const pendingRequests = ref<MaintenanceRequest[]>([])
const maintenanceHistory = ref<MaintenanceRequest[]>([])
const loadingMaintenance = ref(false)
const processingRequest = ref<string | null>(null)
const showTurnOffModal = ref(false)
const showTurnOnModal = ref(false)
const showRejectModal = ref(false)
const rejectRequest = ref<MaintenanceRequest | null>(null)

// Analytics state
const loadingAnalytics = ref(false)
const analyticsStats = ref({
  totalVisits: 0,
  uniqueVisitors: 0,
  todayVisits: 0,
  thisMonthVisits: 0,
  thisYearVisits: 0
})
const selectedAnalyticsPeriod = ref<'daily' | 'monthly' | 'yearly'>('daily')
const analyticsPeriods = [
  { value: 'daily', label: 'Last 30 Days' },
  { value: 'monthly', label: 'This Year' },
  { value: 'yearly', label: 'All Time' }
]
const dailyStats = ref<{ date: string; count: number }[]>([])
const monthlyStats = ref<{ month: string; count: number }[]>([])
const yearlyStats = ref<{ year: string; count: number }[]>([])
const countryStats = ref<{ country: string; count: number }[]>([])

const timeSeriesChartData = computed(() => {
  let labels: string[] = []
  let data: number[] = []

  if (selectedAnalyticsPeriod.value === 'daily') {
    labels = dailyStats.value.map(s => {
      const date = new Date(s.date)
      return `${date.getMonth() + 1}/${date.getDate()}`
    })
    data = dailyStats.value.map(s => s.count)
  } else if (selectedAnalyticsPeriod.value === 'monthly') {
    labels = monthlyStats.value.map(s => {
      const [year, month] = s.month.split('-')
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      return monthNames[parseInt(month || '1') - 1] || 'Unknown'
    })
    data = monthlyStats.value.map(s => s.count)
  } else {
    labels = yearlyStats.value.map(s => s.year)
    data = yearlyStats.value.map(s => s.count)
  }

  return {
    labels,
    datasets: [{
      label: 'Visits',
      data,
      backgroundColor: 'rgba(91, 32, 150, 0.1)',
      borderColor: 'rgba(91, 32, 150, 1)',
      borderWidth: 2,
      tension: 0.4,
      fill: true
    }]
  }
})

const countryChartData = computed(() => {
  const top10 = countryStats.value.slice(0, 10)
  const colors = [
    'rgba(91, 32, 150, 0.8)',
    'rgba(138, 43, 226, 0.8)',
    'rgba(186, 85, 211, 0.8)',
    'rgba(221, 160, 221, 0.8)',
    'rgba(230, 230, 250, 0.8)',
    'rgba(147, 112, 219, 0.8)',
    'rgba(123, 104, 238, 0.8)',
    'rgba(106, 90, 205, 0.8)',
    'rgba(72, 61, 139, 0.8)',
    'rgba(75, 0, 130, 0.8)'
  ]

  return {
    labels: top10.map(c => c.country),
    datasets: [{
      label: 'Visits',
      data: top10.map(c => c.count),
      backgroundColor: colors.slice(0, top10.length),
      borderWidth: 2,
      borderColor: '#fff'
    }]
  }
})

const topCountries = computed(() => countryStats.value.slice(0, 10))

const loadAnalytics = async () => {
  loadingAnalytics.value = true
  try {
    // Load statistics
    const stats = await analyticsController.getStatistics()
    analyticsStats.value = stats

    // Load time series data
    dailyStats.value = await analyticsController.getDailyStatistics(30)
    monthlyStats.value = await analyticsController.getMonthlyStatistics()
    yearlyStats.value = await analyticsController.getYearlyStatistics()

    // Load country statistics
    countryStats.value = await analyticsController.getCountryStatistics()
  } catch (error) {
    console.error('Failed to load analytics:', error)
    errorMessage.value = 'Failed to load analytics data'
  } finally {
    loadingAnalytics.value = false
  }
}
const maintenanceForm = ref({
  message: '',
  estimatedEndTime: ''
})
const rejectReason = ref('')
const currentUserId = computed(() => user.value?.id || authService.getCurrentUser()?.uid || '')

const hasPendingRequest = computed(() => {
  return pendingRequests.value.length > 0
})

// Booking management state
const bookings = ref<Booking[]>([])
const isLoadingBookings = ref(false)
const isSavingBooking = ref(false)

// Google Calendar state
const isGoogleCalendarConnected = ref(false)
const isLoadingGoogleCalendar = ref(false)
const googleCalendarError = ref('')
const editingBookingId = ref<string | null>(null)
const bookingViewMode = ref<'list' | 'calendar' | 'availability'>('list')
const editBookingForm = ref<Partial<BookingData>>({
  userName: '',
  userEmail: '',
  userPhone: '',
  meetingDate: undefined,
  meetingTime: '',
  status: 'pending',
  notes: ''
})

// Calendar view state
const calendarMonth = ref(new Date().getMonth())
const calendarYear = ref(new Date().getFullYear())
const selectedCalendarDate = ref<Date | null>(null)

// Availability management state
const availabilityMonth = ref(new Date().getMonth())
const availabilityYear = ref(new Date().getFullYear())
const selectedAvailabilityDate = ref<Date | null>(null)
const blockedSlots = ref<Map<string, { reason?: string; blockedBy?: string }>>(new Map())
const defaultTimeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00'
]

const sortedBookings = computed(() => {
  // Filter out bookings without IDs and log warnings
  const validBookings = bookings.value.filter(booking => {
    if (!booking.id) {
      console.warn('Booking without ID found:', booking)
      return false
    }
    return true
  })
  
  return [...validBookings].sort((a, b) => {
    const dateA = new Date(a.meetingDate).getTime()
    const dateB = new Date(b.meetingDate).getTime()
    if (dateA !== dateB) return dateA - dateB
    return a.meetingTime.localeCompare(b.meetingTime)
  })
})

const upcomingBookings = computed(() => {
  const now = new Date()
  const tomorrow = new Date(now)
  tomorrow.setDate(tomorrow.getDate() + 1)
  
  return sortedBookings.value.filter(booking => {
    // Only include bookings with valid IDs
    if (!booking.id) return false
    if (booking.status === 'cancelled') return false
    const bookingDate = booking.getFullDateTime()
    return bookingDate >= now && bookingDate <= tomorrow
  })
})

const upcomingBookingsCount = computed(() => {
  return upcomingBookings.value.length
})

const formatBookingDateTime = (booking: Booking): string => {
  const date = new Date(booking.meetingDate)
  const dateStr = date.toLocaleDateString('en-US', { 
    weekday: 'short', 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  })
  const timeParts = booking.meetingTime.split(':')
  const hours = timeParts[0] ? parseInt(timeParts[0]) : 0
  const minutes = timeParts[1] ? parseInt(timeParts[1]) : 0
  const timeStr = new Date(2000, 0, 1, hours, minutes)
    .toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
  return `${dateStr} at ${timeStr}`
}

const loadBookings = async () => {
  isLoadingBookings.value = true
  try {
    const result = await bookingController.getAllBookings()
    if (result.success && result.data) {
      bookings.value = result.data
    } else {
      console.error('Failed to load bookings:', result.error)
    }
  } catch (error) {
    console.error('Error loading bookings:', error)
  } finally {
    isAdminLoading.value = false
  }
}

const refreshBookings = () => {
  loadBookings()
}

// Google Calendar functions
const checkGoogleCalendarConnection = async () => {
  isLoadingGoogleCalendar.value = true
  googleCalendarError.value = ''
  try {
    const result = await googleCalendarController.isGoogleConnected()
    if (result.success) {
      isGoogleCalendarConnected.value = result.data || false
    } else {
      googleCalendarError.value = result.error || 'Failed to check connection status'
    }
  } catch (error) {
    googleCalendarError.value = error instanceof Error ? error.message : 'Failed to check connection status'
  } finally {
    isLoadingGoogleCalendar.value = false
  }
}

const connectGoogleCalendar = async () => {
  try {
    const result = googleCalendarController.getAuthorizationUrl()
    if (result.success && result.data) {
      // Redirect to Google OAuth
      window.location.href = result.data
    } else {
      googleCalendarError.value = result.error || 'Failed to get authorization URL'
    }
  } catch (error) {
    googleCalendarError.value = error instanceof Error ? error.message : 'Failed to connect Google Calendar'
  }
}

const disconnectGoogleCalendar = async () => {
  if (!confirm('Are you sure you want to disconnect your Google Calendar? This will prevent automatic Google Meet link generation for new bookings.')) {
    return
  }
  
  isLoadingGoogleCalendar.value = true
  googleCalendarError.value = ''
  try {
    const result = await googleCalendarController.disconnectGoogleCalendar()
    if (result.success) {
      isGoogleCalendarConnected.value = false
      saveMessage.value = 'Google Calendar disconnected successfully'
      saveMessageType.value = 'success'
      setTimeout(() => { saveMessage.value = '' }, 4000)
    } else {
      googleCalendarError.value = result.error || 'Failed to disconnect Google Calendar'
    }
  } catch (error) {
    googleCalendarError.value = error instanceof Error ? error.message : 'Failed to disconnect Google Calendar'
  } finally {
    isLoadingGoogleCalendar.value = false
  }
}

const startEditBooking = (booking: Booking) => {
  // Try multiple ways to get the ID
  const bookingId = booking.id || (booking as any).id || (booking as any)['id']
  
  if (!bookingId) {
    console.error('Cannot edit booking: booking.id is undefined', {
      booking,
      hasId: 'id' in booking,
      keys: Object.keys(booking),
      bookingString: JSON.stringify(booking, null, 2)
    })
    alert('Error: Cannot edit this booking. The booking ID is missing. Please refresh the page and try again.')
    return
  }
  
  // Set the editing ID to this specific booking
  editingBookingId.value = bookingId
  const date = new Date(booking.meetingDate)
  editBookingForm.value = {
    userName: booking.userName,
    userEmail: booking.userEmail,
    userPhone: booking.userPhone || '',
    meetingDate: date.toISOString().split('T')[0],
    meetingTime: booking.meetingTime,
    status: booking.status,
    notes: booking.notes || ''
  }
}

const cancelBookingEdit = () => {
  editingBookingId.value = null
  editBookingForm.value = {
    userName: '',
    userEmail: '',
    userPhone: '',
    meetingDate: undefined,
    meetingTime: '',
    status: 'pending',
    notes: ''
  }
}

const saveBookingEdit = async (bookingId: string) => {
  isSavingBooking.value = true
  try {
    const updateData: Partial<BookingData> = {
      userName: editBookingForm.value.userName,
      userEmail: editBookingForm.value.userEmail,
      userPhone: editBookingForm.value.userPhone,
      meetingDate: editBookingForm.value.meetingDate ? new Date(editBookingForm.value.meetingDate) : undefined,
      meetingTime: editBookingForm.value.meetingTime,
      status: editBookingForm.value.status as any,
      notes: editBookingForm.value.notes
    }
    
    const result = await bookingController.updateBooking(bookingId, updateData)
    if (result.success) {
      await loadBookings()
      editingBookingId.value = null
      // TODO: Send notification email to user about the change
    } else {
      console.error('Failed to update booking:', result.error)
      alert('Failed to update booking: ' + (result.error || 'Unknown error'))
    }
  } catch (error) {
    console.error('Error updating booking:', error)
    alert('Error updating booking: ' + (error instanceof Error ? error.message : 'Unknown error'))
  } finally {
    isSavingBooking.value = false
  }
}

const cancelBooking = async (bookingId: string) => {
  if (!confirm('Are you sure you want to cancel this booking?')) return
  
  isLoadingBookings.value = true
  try {
    const userId = user.value?.id || 'admin'
    const result = await bookingController.cancelBooking(bookingId, userId, 'Cancelled by admin')
    if (result.success) {
      await loadBookings()
      // TODO: Send cancellation notification to user
    } else {
      console.error('Failed to cancel booking:', result.error)
    }
  } catch (error) {
    console.error('Error cancelling booking:', error)
  } finally {
    isLoadingBookings.value = false
  }
}

const deleteBooking = async (bookingId: string) => {
  if (!confirm('Are you sure you want to delete this booking? This action cannot be undone.')) return
  
  isLoadingBookings.value = true
  saveMessage.value = ''
  try {
    const result = await bookingController.deleteBooking(bookingId)
    if (result.success) {
      saveMessage.value = 'Booking deleted successfully'
      saveMessageType.value = 'success'
      await loadBookings()
      setTimeout(() => { saveMessage.value = '' }, 4000)
    } else {
      saveMessage.value = result.error || 'Failed to delete booking'
      saveMessageType.value = 'error'
      setTimeout(() => { saveMessage.value = '' }, 5000)
    }
  } catch (error) {
    saveMessage.value = error instanceof Error ? error.message : 'Error deleting booking'
    saveMessageType.value = 'error'
    setTimeout(() => { saveMessage.value = '' }, 5000)
  } finally {
    isLoadingBookings.value = false
  }
}

// Calendar view functions
const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const calendarMonthYear = computed(() => {
  const date = new Date(calendarYear.value, calendarMonth.value, 1)
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
})

const adminCalendarDays = computed(() => {
  const firstDay = new Date(calendarYear.value, calendarMonth.value, 1)
  const startDate = new Date(firstDay)
  startDate.setDate(startDate.getDate() - startDate.getDay())
  
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const days: Array<{
    date: Date
    day: number
    isCurrentMonth: boolean
    isToday: boolean
    bookings: Booking[]
  }> = []
  
  for (let i = 0; i < 42; i++) {
    const date = new Date(startDate)
    date.setDate(startDate.getDate() + i)
    const dateOnly = new Date(date)
    dateOnly.setHours(0, 0, 0, 0)
    
    const dateStr = dateOnly.toISOString().split('T')[0]
    const dayBookings = bookings.value.filter(b => {
      const bookingDate = new Date(b.meetingDate)
      bookingDate.setHours(0, 0, 0, 0)
      return bookingDate.getTime() === dateOnly.getTime()
    })
    
    days.push({
      date,
      day: date.getDate(),
      isCurrentMonth: date.getMonth() === calendarMonth.value,
      isToday: dateOnly.getTime() === today.getTime(),
      bookings: dayBookings
    })
  }
  
  return days
})

const previousMonth = () => {
  if (calendarMonth.value === 0) {
    calendarMonth.value = 11
    calendarYear.value--
  } else {
    calendarMonth.value--
  }
}

const nextMonth = () => {
  if (calendarMonth.value === 11) {
    calendarMonth.value = 0
    calendarYear.value++
  } else {
    calendarMonth.value++
  }
}

const selectCalendarDate = (date: Date) => {
  selectedCalendarDate.value = date
}

const formatSelectedDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
}

const getBookingsForDate = (date: Date): Booking[] => {
  const dateStr = date.toISOString().split('T')[0]
  return bookings.value.filter(b => {
    const bookingDate = new Date(b.meetingDate)
    bookingDate.setHours(0, 0, 0, 0)
    return bookingDate.toISOString().split('T')[0] === dateStr
  }).sort((a, b) => a.meetingTime.localeCompare(b.meetingTime))
}

// Availability management functions
const availabilityMonthYear = computed(() => {
  const date = new Date(availabilityYear.value, availabilityMonth.value, 1)
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
})

const previousAvailabilityMonth = () => {
  if (availabilityMonth.value === 0) {
    availabilityMonth.value = 11
    availabilityYear.value--
  } else {
    availabilityMonth.value--
  }
  loadBlockedSlots()
}

const nextAvailabilityMonth = () => {
  if (availabilityMonth.value === 11) {
    availabilityMonth.value = 0
    availabilityYear.value++
  } else {
    availabilityMonth.value++
  }
  loadBlockedSlots()
}

const loadBlockedSlots = async () => {
  try {
    const startDate = new Date(availabilityYear.value, availabilityMonth.value, 1)
    const endDate = new Date(availabilityYear.value, availabilityMonth.value + 1, 0)
    const blocked = await availabilityService.getBlockedSlots(startDate, endDate)
    
    blockedSlots.value.clear()
    blocked.forEach(avail => {
      const key = `${avail.date}-${avail.timeSlot}`
      blockedSlots.value.set(key, {
        reason: avail.reason,
        blockedBy: avail.blockedBy
      })
    })
  } catch (error) {
    console.error('Error loading blocked slots:', error)
  }
}

const isTimeSlotBlocked = (date: Date, timeSlot: string): boolean => {
  const dateStr = date.toISOString().split('T')[0]
  const key = `${dateStr}-${timeSlot}`
  return blockedSlots.value.has(key)
}

const getBlockedReason = (date: Date, timeSlot: string): string => {
  const dateStr = date.toISOString().split('T')[0]
  const key = `${dateStr}-${timeSlot}`
  const blocked = blockedSlots.value.get(key)
  return blocked?.reason || 'Blocked'
}

const toggleTimeSlot = async (date: Date, timeSlot: string) => {
  try {
    const dateStr = date.toISOString().split('T')[0]
    const key = `${dateStr}-${timeSlot}`
    const isBlocked = blockedSlots.value.has(key)
    
    if (isBlocked) {
      await availabilityService.unblockTimeSlot(date, timeSlot)
      blockedSlots.value.delete(key)
    } else {
      const reason = prompt('Reason for blocking this time slot (optional):') || undefined
      const userId = user.value?.id || 'admin'
      await availabilityService.blockTimeSlot(date, timeSlot, reason, userId)
      blockedSlots.value.set(key, { reason, blockedBy: userId })
    }
    
    // Reload bookings to reflect availability changes
    await loadBookings()
  } catch (error) {
    console.error('Error toggling time slot:', error)
    alert('Failed to update availability. Please try again.')
  }
}

const formatTime = (time: string): string => {
  const [hours, minutes] = time.split(':').map(Number)
  const date = new Date()
  date.setHours(hours || 0, minutes || 0)
  return date.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  })
}

// Availability calendar days
const availabilityCalendarDays = computed(() => {
  const firstDay = new Date(availabilityYear.value, availabilityMonth.value, 1)
  const startDate = new Date(firstDay)
  startDate.setDate(startDate.getDate() - startDate.getDay())
  
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const days: Array<{
    date: Date
    day: number
    isCurrentMonth: boolean
    isToday: boolean
  }> = []
  
  for (let i = 0; i < 42; i++) {
    const date = new Date(startDate)
    date.setDate(startDate.getDate() + i)
    const dateOnly = new Date(date)
    dateOnly.setHours(0, 0, 0, 0)
    
    days.push({
      date,
      day: date.getDate(),
      isCurrentMonth: date.getMonth() === availabilityMonth.value,
      isToday: dateOnly.getTime() === today.getTime()
    })
  }
  
  return days
})

const isSelectedAvailabilityDate = (date: Date): boolean => {
  if (!selectedAvailabilityDate.value) return false
  const d1 = new Date(date)
  const d2 = new Date(selectedAvailabilityDate.value)
  d1.setHours(0, 0, 0, 0)
  d2.setHours(0, 0, 0, 0)
  return d1.getTime() === d2.getTime()
}

const selectAvailabilityDate = (date: Date) => {
  selectedAvailabilityDate.value = date
}

// Initialize availability calendar
const initAvailabilityCalendar = () => {
  const today = new Date()
  selectedAvailabilityDate.value = today
  loadBlockedSlots()
}

const selectedVideoFile = ref<File | null>(null)
const uploadingVideo = ref(false)
const uploadProgress = ref(0)
const videoFileInput = ref<HTMLInputElement | null>(null)
const availableSections = [
  // Home Page Sections
  { id: 'hero', label: 'Hero Section (Home)' },
  { id: 'cta', label: 'CTA Section (Home)' },
  { id: 'social-proof', label: 'Social Proof (Home)' },
  { id: 'who-we-are', label: 'Who We Are (Home)' },
  { id: 'stats', label: 'Statistics (Home)' },
  { id: 'system', label: 'System Section (Home)' },
  { id: 'services', label: 'Services (Home)' },
  { id: 'what-we-do', label: 'What We Do (Home)' },
  { id: 'what-you-get', label: 'What You Get (Home)' },
  { id: 'bonuses', label: 'Bonuses (Home)' },
  { id: 'clients', label: 'Clients (Home)' },
  { id: 'real-results', label: 'Real Results (Home)' },
  { id: 'testimonials', label: 'Testimonials (Home)' },
  { id: 'footer', label: 'Footer (Home)' },
  // About Page Sections
  { id: 'about-page', label: 'About Page (Entire Page)' },
  { id: 'about-who-we-are', label: 'Who We Are (About)' },
  { id: 'about-video', label: 'Video Section (About)' },
  { id: 'about-cta', label: 'CTA Section (About)' },
  { id: 'about-team', label: 'Our Team (About)' },
  { id: 'about-faq', label: 'FAQ Section (About)' },
  // Services Page Sections
  { id: 'services-page', label: 'Services Page (Entire Page)' },
  { id: 'services-hero', label: 'Hero Section (Services)' },
  { id: 'services-system', label: 'System Section (Services)' },
  { id: 'services-what-we-do', label: 'What We Do (Services)' },
  { id: 'services-what-you-get', label: 'What You Get (Services)' },
  { id: 'services-bonuses', label: 'Bonuses (Services)' },
  { id: 'services-why-choose', label: 'Why Choose Us (Services)' },
  { id: 'services-testimonials', label: 'Testimonials (Services)' }
]

// Computed properties for section groups
const homeSections = computed(() => availableSections.filter(s => 
  !s.id.startsWith('about-') && !s.id.startsWith('services-')
))
const aboutSections = computed(() => availableSections.filter(s => 
  s.id.startsWith('about-') || s.id === 'about-page'
))
const servicesSections = computed(() => availableSections.filter(s => 
  s.id.startsWith('services-') || s.id === 'services-page'
))

const newUserForm = ref({
  email: '',
  password: '',
  displayName: '',
  role: 'user'
})
const editingUserId = ref<string | null>(null)
const editUserForm = ref({
  email: '',
  displayName: '',
  role: 'user'
})
const newRoleForm = ref({
  name: '',
  description: '',
  permissions: [] as string[]
})
const editingRoleId = ref<string | null>(null)
const editRoleForm = ref({
  name: '',
  description: '',
  permissions: [] as string[]
})

// Available permissions for roles
const availablePermissions = [
  // Home Page Sections
  { id: 'edit_hero', label: 'Edit Hero Section', category: 'Home Page' },
  { id: 'edit_cta', label: 'Edit CTA Section', category: 'Home Page' },
  { id: 'edit_who_we_are', label: 'Edit Who We Are', category: 'Home Page' },
  { id: 'edit_system', label: 'Edit System Section', category: 'Home Page' },
  { id: 'edit_services', label: 'Edit Services Section', category: 'Home Page' },
  { id: 'edit_what_we_do', label: 'Edit What We Do', category: 'Home Page' },
  { id: 'edit_what_you_get', label: 'Edit What You Get', category: 'Home Page' },
  { id: 'edit_bonuses', label: 'Edit Bonuses Section', category: 'Home Page' },
  { id: 'edit_clients', label: 'Edit Clients & Testimonials', category: 'Home Page' },
  { id: 'edit_real_results', label: 'Edit Real Results', category: 'Home Page' },
  { id: 'edit_footer', label: 'Edit Footer', category: 'Home Page' },
  // Other Pages
  { id: 'edit_about_page', label: 'Edit About Page', category: 'Other Pages' },
  { id: 'edit_services_page', label: 'Edit Services Page', category: 'Other Pages' },
  { id: 'edit_legal_pages', label: 'Edit Legal Pages', category: 'Other Pages' },
  // Content Management
  { id: 'view_email_submissions', label: 'View Email Submissions', category: 'Content Management' },
  { id: 'delete_email_submissions', label: 'Delete Email Submissions', category: 'Content Management' },
  { id: 'view_contact_messages', label: 'View Contact Messages', category: 'Content Management' },
  { id: 'delete_contact_messages', label: 'Delete Contact Messages', category: 'Content Management' },
  { id: 'edit_contact_settings', label: 'Edit Contact Settings', category: 'Content Management' },
  { id: 'manage_bookings', label: 'Manage Bookings', category: 'Content Management' },
  // Admin Functions (only for admin role)
  { id: 'manage_users', label: 'Manage Users', category: 'Administration' },
  { id: 'manage_roles', label: 'Manage Roles', category: 'Administration' },
  { id: 'manage_site_settings', label: 'Manage Site Settings', category: 'Administration' },
  { id: 'view_activity_logs', label: 'View Activity Logs', category: 'Administration' },
]

// Group permissions by category for display
const permissionsByCategory = computed(() => {
  const categories: Record<string, typeof availablePermissions> = {}
  availablePermissions.forEach(permission => {
    if (!categories[permission.category]) {
      categories[permission.category] = []
    }
    categories[permission.category]!.push(permission)
  })
  return categories
})

// Toggle permission in form
const togglePermission = (form: { permissions: string[] }, permissionId: string) => {
  const index = form.permissions.indexOf(permissionId)
  if (index === -1) {
    form.permissions.push(permissionId)
  } else {
    form.permissions.splice(index, 1)
  }
}

// Select all permissions in a category
const selectAllInCategory = (form: { permissions: string[] }, category: string) => {
  const categoryPermissions = availablePermissions.filter(p => p.category === category)
  categoryPermissions.forEach(p => {
    if (!form.permissions.includes(p.id)) {
      form.permissions.push(p.id)
    }
  })
}

// Deselect all permissions in a category
const deselectAllInCategory = (form: { permissions: string[] }, category: string) => {
  const categoryPermissions = availablePermissions.filter(p => p.category === category)
  categoryPermissions.forEach(p => {
    const index = form.permissions.indexOf(p.id)
    if (index !== -1) {
      form.permissions.splice(index, 1)
    }
  })
}

// Check if all permissions in category are selected
const allCategorySelected = (form: { permissions: string[] }, category: string) => {
  const categoryPermissions = availablePermissions.filter(p => p.category === category)
  return categoryPermissions.every(p => form.permissions.includes(p.id))
}

// Get permission label by id
const getPermissionLabel = (permissionId: string): string => {
  const permission = availablePermissions.find(p => p.id === permissionId)
  return permission?.label || permissionId
}

// Get permissions for a selected role name
const getSelectedRolePermissions = (roleName: string): string[] => {
  const role = roles.value.find(r => r.name === roleName)
  return role?.permissions || []
}

// Get role description by name
const getRoleDescription = (roleName: string): string => {
  const role = roles.value.find(r => r.name === roleName)
  if (!role) return ''
  
  const permCount = role.permissions?.length || 0
  if (role.description) {
    return `${role.description} (${permCount} permission${permCount !== 1 ? 's' : ''})`
  }
  return `${permCount} permission${permCount !== 1 ? 's' : ''}`
}

// Sorted team members by order
const sortedTeamMembers = computed(() => {
  const members = [...aboutFormData.value.teamMembers]
  // Ensure all members have an order property
  members.forEach((member, index) => {
    if (member.order === undefined || member.order === null) {
      member.order = index
    }
  })
  // Sort by order, then by index if order is the same
  return members.sort((a, b) => {
    const orderA = a.order ?? 0
    const orderB = b.order ?? 0
    if (orderA !== orderB) {
      return orderA - orderB
    }
    return 0
  })
})

// About page form data
const aboutFormData = ref<AboutContent>({
  whoWeAreTitle: '',
  whoWeAreDescription: '',
  videoUrl: '',
  videoFileUrl: '',
  videoType: 'none',
  ctaButtonText: 'Book a Meeting',
  ctaButtonLink: '',
  teamTitle: 'Our Team',
  teamSubtitle: 'Who is Nextcent suitable for?',
  teamMembers: [],
  faqTitle: 'Frequently Asked Questions',
  faqs: [],
  statCards: []
})

const editingTeamMemberId = ref<string | null>(null)
const editTeamMemberForm = ref<Partial<TeamMember>>({
  name: '',
  role: '',
  photoUrl: '',
  photoFileUrl: '',
  photoType: 'url'
})

const editingFAQId = ref<string | null>(null)
const editFAQForm = ref<Partial<FAQ>>({
  question: '',
  answer: ''
})

const editingStatCardId = ref<string | null>(null)
const editStatCardForm = ref<Partial<StatCard>>({
  title: '',
  value: '',
  description: ''
})

const uploadingTeamPhoto = ref<Record<string, boolean>>({})
const uploadProgressTeamPhoto = ref<Record<string, number>>({})

// Services Page form data
const servicesFormData = ref<ServicesContent>({
  whyChooseTitle: 'Why Choose Clear Up',
  whyChooseSubtitle: 'Creative thinking, fast execution, and results-driven content built for modern brands.',
  whyChooseFeatures: []
})

// Legal Pages form data
const legalFormData = ref<LegalContent>({ ...defaultLegalContent })

// Editing states for legal sections
const editingLegalPolicy = ref<'privacy' | 'terms' | 'cookies' | null>(null)
const editingLegalSectionIndex = ref<number | null>(null)
const editLegalSectionForm = ref<{ heading: string; content: string }>({
  heading: '',
  content: ''
})

// Track original feature IDs from backend to detect new features
const originalFeatureIds = ref<Set<string>>(new Set())

const editingWhyChooseFeatureId = ref<string | null>(null)
const editWhyChooseFeatureForm = ref<Partial<WhyChooseFeature>>({
  title: '',
  description: '',
  icon: 'target'
})

const formData = ref<HomeContent>({
  heroHeadlineWhite: '',
  heroHeadlinePurple: '',
  supportingText: [],
  ctaPlaceholder: '',
  ctaButtonText: '',
  socialProofText: '',
  whoWeAreTitle: '',
  whoWeAreDescription: '',
  videoUrl: '',
  videoFileUrl: '',
  videoType: 'link',
  stats: {
    revenue: { title: '', value: '', description: '' },
    leads: { title: '', value: '', description: '' },
    reach: { title: '', value: '', description: '' }
  },
  systemTitle: '',
  systemDescription: '',
  systemCardTitle: '',
  systemCardText: [],
  systemCardROI: '',
  servicesTitle: '',
  servicesDescription: '',
  services: [],
  whatWeDoTitle: '',
  steps: [],
  whatYouGetTitle: '',
  benefits: [],
  bonusesTitle: '',
  bonuses: [],
  clientsTitle: '',
  clientsSubtitle: '',
  clientLogos: [],
  realResultsTitle: '',
  realResultsSubtitle: '',
  realResultsCases: [],
  testimonialsTitle: '',
  testimonialsSubtitle: '',
  testimonials: [],
  footerTagline: '',
  footerAddress: ''
})

// Computed properties
const userInitials = computed(() => {
  if (user.value?.displayName) {
    return user.value.displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }
  if (user.value?.email) {
    return (user.value.email as string)?.[0]?.toUpperCase() || 'A'
  }
  return 'A'
})

const supportingTextTextarea = computed({
  get: () => formData.value.supportingText.join('\n'),
  set: (value: string) => {
    formData.value.supportingText = value.split('\n').filter(line => line.trim())
  }
})

const systemCardTextTextarea = computed({
  get: () => formData.value.systemCardText.join('\n'),
  set: (value: string) => {
    formData.value.systemCardText = value.split('\n').filter(line => line.trim())
  }
})

// Benefits are now managed individually, no need for textarea computed property

// Bonuses are now managed individually, no need for textarea computed property

// Helper functions
const getTabIcon = (tabId: string): string => {
  const icons: Record<string, string> = {
    'hero': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 22V12H15V22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    'cta': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22 16V19C22 19.5304 21.7893 20.0391 21.4142 20.4142C21.0391 20.7893 20.5304 21 20 21H4C3.46957 21 2.96086 20.7893 2.58579 20.4142C2.21071 20.0391 2 19.5304 2 19V5C2 4.46957 2.21071 3.96086 2.58579 3.58579C2.96086 3.21071 3.46957 3 4 3H7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 3H22V9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M11 13L22 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    'who-we-are': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    'system': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="3" width="20" height="14" rx="2" stroke="currentColor" stroke-width="2"/><path d="M8 21H16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M12 17V21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    'services': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    'what-we-do': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 11L12 14L22 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M21 12V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    'what-you-get': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 11L12 14L22 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M21 12V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    'bonuses': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    'clients': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    'real-results': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 3V21H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M7 16L12 11L16 15L21 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M21 10V3H14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    'about': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="currentColor"/></svg>',
    'services-page': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    'footer': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    'legal-pages': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M14 2V8H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 18V12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 15L12 12L15 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    'analytics': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 3V21H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M7 16L12 11L16 15L21 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M21 10V3H14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    'email-submissions': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M22 6L12 13L2 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    'contact-messages': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    'contact-settings': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22 16.92V19.92C22.0011 20.1985 21.9441 20.4742 21.8325 20.7293C21.7209 20.9845 21.5573 21.2136 21.3521 21.4019C21.1468 21.5901 20.9046 21.7335 20.6407 21.8227C20.3769 21.9119 20.0974 21.9451 19.82 21.92C16.7428 21.5856 13.787 20.5341 11.19 18.85C8.77382 17.3147 6.72533 15.2662 5.18999 12.85C3.49997 10.2412 2.44824 7.27099 2.11999 4.18C2.09501 3.90347 2.12787 3.62476 2.21649 3.36162C2.30512 3.09849 2.44756 2.85669 2.63476 2.65162C2.82196 2.44655 3.0498 2.28271 3.30379 2.17052C3.55777 2.05833 3.83233 2.00026 4.10999 2H7.10999C7.5953 1.99522 8.06579 2.16708 8.43376 2.48353C8.80173 2.79999 9.04207 3.23945 9.10999 3.72C9.23662 4.68007 9.47144 5.62273 9.80999 6.53C9.94454 6.88792 9.97366 7.27691 9.8939 7.65088C9.81415 8.02485 9.62886 8.36811 9.35999 8.64L8.08999 9.91C9.51355 12.4135 11.5765 14.4765 14.08 15.9L15.35 14.63C15.6219 14.3611 15.9651 14.1758 16.3391 14.0961C16.7131 14.0163 17.1021 14.0454 17.46 14.18C18.3673 14.5185 19.3099 14.7534 20.27 14.88C20.7558 14.9485 21.1996 15.1907 21.5177 15.5627C21.8359 15.9347 22.0058 16.4108 22 16.9V16.92Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    'users': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    'roles': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="2"/><path d="M12 6V12L16 14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    'site-settings': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M19.4 15C19.2669 15.3016 19.2272 15.6362 19.286 15.9606C19.3448 16.285 19.4995 16.5843 19.73 16.82L19.79 16.88C19.976 17.0657 20.1235 17.2863 20.2241 17.5291C20.3248 17.7719 20.3766 18.0322 20.3766 18.295C20.3766 18.5578 20.3248 18.8181 20.2241 19.0609C20.1235 19.3037 19.976 19.5243 19.79 19.71C19.6043 19.896 19.3837 20.0435 19.1409 20.1441C18.8981 20.2448 18.6378 20.2966 18.375 20.2966C18.1122 20.2966 17.8519 20.2448 17.6091 20.1441C17.3663 20.0435 17.1457 19.896 16.96 19.71L16.9 19.65C16.6643 19.4195 16.365 19.2648 16.0406 19.206C15.7162 19.1472 15.3816 19.1869 15.08 19.32C14.7842 19.4468 14.532 19.6572 14.3543 19.9255C14.1766 20.1938 14.0813 20.5082 14.08 20.83V21C14.08 21.5304 13.8693 22.0391 13.4942 22.4142C13.1191 22.7893 12.6104 23 12.08 23C11.5496 23 11.0409 22.7893 10.6658 22.4142C10.2907 22.0391 10.08 21.5304 10.08 21V20.91C10.0723 20.579 9.96512 20.258 9.77251 19.9887C9.5799 19.7194 9.31074 19.5143 9 19.4C8.69838 19.2669 8.36381 19.2272 8.03941 19.286C7.71502 19.3448 7.41568 19.4995 7.18 19.73L7.12 19.79C6.93425 19.976 6.71368 20.1235 6.47088 20.2241C6.22808 20.3248 5.96783 20.3766 5.705 20.3766C5.44217 20.3766 5.18192 20.3248 4.93912 20.2241C4.69632 20.1235 4.47575 19.976 4.29 19.79C4.10405 19.6043 3.95653 19.3837 3.85588 19.1409C3.75523 18.8981 3.70343 18.6378 3.70343 18.375C3.70343 18.1122 3.75523 17.8519 3.85588 17.6091C3.95653 17.3663 4.10405 17.1457 4.29 16.96L4.35 16.9C4.58054 16.6643 4.73519 16.365 4.794 16.0406C4.85282 15.7162 4.81312 15.3816 4.68 15.08C4.55324 14.7842 4.34276 14.532 4.07447 14.3543C3.80618 14.1766 3.49179 14.0813 3.17 14.08H3C2.46957 14.08 1.96086 13.8693 1.58579 13.4942C1.21071 13.1191 1 12.6104 1 12.08C1 11.5496 1.21071 11.0409 1.58579 10.6658C1.96086 10.2907 2.46957 10.08 3 10.08H3.09C3.42099 10.0723 3.742 9.96512 4.01131 9.77251C4.28062 9.5799 4.48571 9.31074 4.6 9C4.73312 8.69838 4.77282 8.36381 4.714 8.03941C4.65519 7.71502 4.50054 7.41568 4.27 7.18L4.21 7.12C4.02405 6.93425 3.87653 6.71368 3.77588 6.47088C3.67523 6.22808 3.62343 5.96783 3.62343 5.705C3.62343 5.44217 3.67523 5.18192 3.77588 4.93912C3.87653 4.69632 4.02405 4.47575 4.21 4.29C4.39575 4.10405 4.61632 3.95653 4.85912 3.85588C5.10192 3.75523 5.36217 3.70343 5.625 3.70343C5.88783 3.70343 6.14808 3.75523 6.39088 3.85588C6.63368 3.95653 6.85425 4.10405 7.04 4.29L7.1 4.35C7.33568 4.58054 7.63502 4.73519 7.95941 4.794C8.28381 4.85282 8.61838 4.81312 8.92 4.68H9C9.29577 4.55324 9.54802 4.34276 9.72569 4.07447C9.90337 3.80618 9.99872 3.49179 10 3.17V3C10 2.46957 10.2107 1.96086 10.5858 1.58579C10.9609 1.21071 11.4696 1 12 1C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3V3.09C14.0013 3.41179 14.0966 3.72618 14.2743 3.99447C14.452 4.26276 14.7042 4.47324 15 4.6C15.3016 4.73312 15.6362 4.77282 15.9606 4.714C16.285 4.65519 16.5843 4.50054 16.82 4.27L16.88 4.21C17.0657 4.02405 17.2863 3.87653 17.5291 3.77588C17.7719 3.67523 18.0322 3.62343 18.295 3.62343C18.5578 3.62343 18.8181 3.67523 19.0609 3.77588C19.3037 3.87653 19.5243 4.02405 19.71 4.21C19.896 4.39575 20.0435 4.61632 20.1441 4.85912C20.2448 5.10192 20.2966 5.36217 20.2966 5.625C20.2966 5.88783 20.2448 6.14808 20.1441 6.39088C20.0435 6.63368 19.896 6.85425 19.71 7.04L19.65 7.1C19.4195 7.33568 19.2648 7.63502 19.206 7.95941C19.1472 8.28381 19.1869 8.61838 19.32 8.92V9C19.4468 9.29577 19.6572 9.54802 19.9255 9.72569C20.1938 9.90337 20.5082 9.99872 20.83 10H21C21.5304 10 22.0391 10.2107 22.4142 10.5858C22.7893 10.9609 23 11.4696 23 12C23 12.5304 22.7893 13.0391 22.4142 13.4142C22.0391 13.7893 21.5304 14 21 14H20.91C20.5882 14.0013 20.2738 14.0966 20.0055 14.2743C19.7372 14.452 19.5268 14.7042 19.4 15Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    'activity-logs': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M14 2V8H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 13H8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M16 17H8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M10 9H9H8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>'
  }
  return icons[tabId] || ''
}

const getActiveTabLabel = (): string => {
  const tab = tabs.value.find(t => t.id === activeTab.value)
  return tab?.label || 'Dashboard'
}

const formatAction = (action: string): string => {
  const actionMap: Record<string, string> = {
    'update_home_content': 'Updated Home Content',
    'save_home_content': 'Saved Home Content',
    'reset_home_content': 'Reset Home Content',
    'create_user': 'Created User',
    'update_user_role': 'Updated User Role',
    'delete_user': 'Deleted User'
  }
  return actionMap[action] || action
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

const formatDate = (date: Date | string | undefined): string => {
  if (!date) return '-'
  try {
    const dateObj = date instanceof Date ? date : new Date(date)
    const now = new Date()
    const diffMs = now.getTime() - dateObj.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)
    
    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
    
    return dateObj.toLocaleString()
  } catch {
    return '-'
  }
}

const getLogDescription = (log: ActivityLog): string => {
  const action = log.action
  const resource = log.resource
  
  if (action === 'update_home_content' || action === 'save_home_content') {
    const changedFields = log.changes ? Object.keys(log.changes) : []
    if (changedFields.length > 0) {
      const sections = changedFields.map(field => getSectionName(field)).filter(Boolean)
      if (sections.length > 0) {
        return `Updated ${sections.join(', ')} section${sections.length > 1 ? 's' : ''}`
      }
    }
    return 'Updated home page content'
  }
  
  if (action === 'reset_home_content') {
    return 'Reset home page content to default values'
  }
  
  if (action === 'create_user') {
    const email = log.changes?.email?.after || log.changes?.email
    return `Created new user account${email ? `: ${email}` : ''}`
  }
  
  if (action === 'update_user_role') {
    const email = log.changes?.userEmail || log.changes?.userEmail?.after
    const oldRole = log.changes?.oldRole
    const newRole = log.changes?.newRole
    if (email && oldRole && newRole) {
      return `Changed role for ${email} from "${oldRole}" to "${newRole}"`
    }
    return 'Updated user role'
  }
  
  if (action === 'delete_user') {
    const email = log.changes?.deletedUserEmail
    return `Deleted user account${email ? `: ${email}` : ''}`
  }
  
  return `${formatAction(action)} on ${resource}`
}

const getSectionName = (field: string): string => {
  const sectionMap: Record<string, string> = {
    'heroHeadlineWhite': 'Hero',
    'heroHeadlinePurple': 'Hero',
    'supportingText': 'Hero',
    'ctaPlaceholder': 'CTA',
    'ctaButtonText': 'CTA',
    'socialProofText': 'CTA',
    'whoWeAreTitle': 'Who We Are',
    'whoWeAreDescription': 'Who We Are',
    'stats': 'Statistics',
    'systemTitle': 'System',
    'systemDescription': 'System',
    'systemCardTitle': 'System',
    'systemCardText': 'System',
    'systemCardROI': 'System',
    'servicesTitle': 'Services',
    'servicesDescription': 'Services',
    'services': 'Services',
    'whatWeDoTitle': 'What We Do',
    'steps': 'What We Do',
    'whatYouGetTitle': 'What You Get',
    'benefits': 'What You Get',
    'bonusesTitle': 'Bonuses',
    'bonuses': 'Bonuses',
    'clientsTitle': 'Clients',
    'clientsSubtitle': 'Clients',
    'testimonialsTitle': 'Testimonials',
    'testimonialsSubtitle': 'Testimonials',
    'footerTagline': 'Footer',
    'footerAddress': 'Footer'
  }
  return sectionMap[field] || field
}

const formatFieldName = (field: string): string => {
  return field
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim()
}

const formatChangeValue = (value: any): string => {
  if (value === null || value === undefined) return 'None'
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'
  if (Array.isArray(value)) {
    if (value.length === 0) return 'Empty list'
    if (value.length <= 3) return value.join(', ')
    return `${value.slice(0, 3).join(', ')}... (${value.length} total)`
  }
  if (typeof value === 'object') {
    return JSON.stringify(value, null, 2)
  }
  if (typeof value === 'string' && value.length > 100) {
    return value.substring(0, 100) + '...'
  }
  return String(value)
}

const getChangedFieldsCount = (changes: Record<string, any>): number => {
  return Object.keys(changes).length
}

const getVideoEmbedUrl = (url: string): string => {
  if (!url) return ''
  
  // YouTube - Add parameters to disable suggestions and related videos
  const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
  const youtubeMatch = url.match(youtubeRegex)
  if (youtubeMatch) {
    // Parameters to disable YouTube suggestions:
    // rel=0 - Don't show related videos from other channels
    // modestbranding=1 - Reduce YouTube branding
    // iv_load_policy=3 - Don't show video annotations
    // cc_load_policy=0 - Don't show captions by default
    // fs=1 - Allow fullscreen
    return `https://www.youtube.com/embed/${youtubeMatch[1]}?rel=0&modestbranding=1&iv_load_policy=3&cc_load_policy=0&fs=1`
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

// Helper function to get image type from URL
const getImageType = (url: string): string | null => {
  if (!url) return null
  
  // Extract file extension from URL
  const urlLower = url.toLowerCase()
  if (urlLower.includes('.png')) return 'PNG'
  if (urlLower.includes('.jpg') || urlLower.includes('.jpeg')) return 'JPG'
  if (urlLower.includes('.webp')) return 'WEBP'
  if (urlLower.includes('.gif')) return 'GIF'
  if (urlLower.includes('.svg')) return 'SVG'
  
  // Try to get from query params or path
  try {
    const urlObj = new URL(url)
    const pathname = urlObj.pathname.toLowerCase()
    if (pathname.endsWith('.png')) return 'PNG'
    if (pathname.endsWith('.jpg') || pathname.endsWith('.jpeg')) return 'JPG'
    if (pathname.endsWith('.webp')) return 'WEBP'
    if (pathname.endsWith('.gif')) return 'GIF'
    if (pathname.endsWith('.svg')) return 'SVG'
  } catch {
    // If URL parsing fails, return null
  }
  
  return null
}

const handleVideoUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (!file) return
  
  // Validate file type - only allow specific video formats
  const allowedTypes = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo']
  const allowedExtensions = ['.mp4', '.webm', '.mov', '.avi']
  const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'))
  
  if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
    saveMessage.value = 'Please select a valid video file (MP4, WebM, MOV, or AVI)'
    saveMessageType.value = 'error'
    setTimeout(() => { saveMessage.value = '' }, 4000)
    // Reset file input
    if (videoFileInput.value) {
      videoFileInput.value.value = ''
    }
    return
  }
  
  // Validate file size (100MB max)
  const maxSize = 100 * 1024 * 1024 // 100MB
  if (file.size > maxSize) {
    saveMessage.value = 'Video file is too large. Maximum size is 100MB'
    saveMessageType.value = 'error'
    setTimeout(() => { saveMessage.value = '' }, 4000)
    // Reset file input
    if (videoFileInput.value) {
      videoFileInput.value.value = ''
    }
    return
  }
  
  selectedVideoFile.value = file
  uploadingVideo.value = true
  uploadProgress.value = 0
  
  try {
    const userId = user.value?.id || authService.getCurrentUser()?.uid || 'unknown'
    const timestamp = Date.now()
    const fileName = `videos/${userId}/${timestamp}-${file.name}`
    
    // Upload video to Firebase Storage with progress tracking
    const videoUrl = await storageService.uploadAndGetUrlWithProgress(
      fileName,
      file,
      (progress) => {
        uploadProgress.value = progress
      },
      {
        contentType: file.type,
        customMetadata: {
          uploadedBy: userId,
          uploadedAt: new Date().toISOString(),
          originalName: file.name
        }
      }
    )
    
    formData.value.videoFileUrl = videoUrl
    formData.value.videoType = 'upload'
    selectedVideoFile.value = null
    
    // Reset file input
    if (videoFileInput.value) {
      videoFileInput.value.value = ''
    }
    
    saveMessage.value = 'Video uploaded successfully!'
    saveMessageType.value = 'success'
    setTimeout(() => { saveMessage.value = '' }, 4000)
  } catch (error) {
    saveMessage.value = error instanceof Error ? error.message : 'Failed to upload video'
    saveMessageType.value = 'error'
    setTimeout(() => { saveMessage.value = '' }, 5000)
  } finally {
    uploadingVideo.value = false
    uploadProgress.value = 0
  }
}

/**
 * Extract file path from Firebase Storage URL
 */
const extractFilePathFromUrl = (url: string): string | null => {
  try {
    // Firebase Storage URL format: https://firebasestorage.googleapis.com/v0/b/{bucket}/o/{encodedPath}?alt=media&token={token}
    const urlObj = new URL(url)
    const pathMatch = urlObj.pathname.match(/\/o\/(.+)/)
    if (pathMatch && pathMatch[1]) {
      // Decode the path (it's URL encoded)
      return decodeURIComponent(pathMatch[1])
    }
    return null
  } catch (error) {
    console.error('Error extracting file path from URL:', error)
    return null
  }
}

/**
 * Delete video from Firebase Storage and clear form data
 */
const deleteVideo = async () => {
  if (!formData.value.videoFileUrl) return
  
  const videoUrl = formData.value.videoFileUrl
  const filePath = extractFilePathFromUrl(videoUrl)
  
  // Clear form data first
  formData.value.videoFileUrl = ''
  formData.value.videoType = 'link'
  selectedVideoFile.value = null
  if (videoFileInput.value) {
    videoFileInput.value.value = ''
  }
  
  // Delete from Firebase Storage if we have the path
  if (filePath) {
    try {
      await storageService.deleteFile(filePath)
      saveMessage.value = 'Video deleted successfully!'
      saveMessageType.value = 'success'
      setTimeout(() => { saveMessage.value = '' }, 3000)
    } catch (error) {
      console.error('Error deleting video from storage:', error)
      // Don't show error to user since we already cleared the form
      // The file might have already been deleted or the URL might be invalid
    }
  }
}

/**
 * Delete testimonial video from Firebase Storage and clear form data
 */
const deleteTestimonialVideo = async (index: number) => {
  const testimonial = formData.value.testimonials[index]
  if (!testimonial?.videoFileUrl) return
  
  const videoUrl = testimonial.videoFileUrl
  const filePath = extractFilePathFromUrl(videoUrl)
  
  // Clear form data first
  testimonial.videoFileUrl = ''
  testimonial.videoType = 'none'
  
  // Delete from Firebase Storage if we have the path
  if (filePath) {
    try {
      await storageService.deleteFile(filePath)
      saveMessage.value = 'Testimonial video deleted successfully!'
      saveMessageType.value = 'success'
      setTimeout(() => { saveMessage.value = '' }, 3000)
    } catch (error) {
      console.error('Error deleting testimonial video from storage:', error)
      // Don't show error to user since we already cleared the form
    }
  }
}

const removeVideo = () => {
  formData.value.videoFileUrl = ''
  formData.value.videoUrl = ''
  formData.value.videoType = 'link'
  selectedVideoFile.value = null
  if (videoFileInput.value) {
    videoFileInput.value.value = ''
  }
}

// About page video methods
const aboutVideoFileInput = ref<HTMLInputElement | null>(null)
const selectedAboutVideoFile = ref<File | null>(null)

const handleAboutVideoUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (!file) return
  
  const allowedTypes = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo']
  const allowedExtensions = ['.mp4', '.webm', '.mov', '.avi']
  const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'))
  
  if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
    saveMessage.value = 'Please select a valid video file (MP4, WebM, MOV, or AVI)'
    saveMessageType.value = 'error'
    setTimeout(() => { saveMessage.value = '' }, 4000)
    if (aboutVideoFileInput.value) {
      aboutVideoFileInput.value.value = ''
    }
    return
  }
  
  const maxSize = 100 * 1024 * 1024
  if (file.size > maxSize) {
    saveMessage.value = 'Video file is too large. Maximum size is 100MB'
    saveMessageType.value = 'error'
    setTimeout(() => { saveMessage.value = '' }, 4000)
    if (aboutVideoFileInput.value) {
      aboutVideoFileInput.value.value = ''
    }
    return
  }
  
  selectedAboutVideoFile.value = file
  uploadingVideo.value = true
  uploadProgress.value = 0
  
  try {
    const userId = user.value?.id || authService.getCurrentUser()?.uid || 'unknown'
    const timestamp = Date.now()
    const fileName = `about/videos/${userId}/${timestamp}-${file.name}`
    
    const videoUrl = await storageService.uploadAndGetUrlWithProgress(
      fileName,
      file,
      (progress) => {
        uploadProgress.value = progress
      },
      {
        contentType: file.type,
        customMetadata: {
          uploadedBy: userId,
          uploadedAt: new Date().toISOString(),
          originalName: file.name
        }
      }
    )
    
    aboutFormData.value.videoFileUrl = videoUrl
    aboutFormData.value.videoType = 'upload'
    selectedAboutVideoFile.value = null
    
    saveMessage.value = 'Video uploaded successfully!'
    saveMessageType.value = 'success'
    setTimeout(() => { saveMessage.value = '' }, 3000)
  } catch (error) {
    saveMessage.value = error instanceof Error ? error.message : 'Failed to upload video'
    saveMessageType.value = 'error'
    setTimeout(() => { saveMessage.value = '' }, 4000)
  } finally {
    uploadingVideo.value = false
    uploadProgress.value = 0
    if (aboutVideoFileInput.value) {
      aboutVideoFileInput.value.value = ''
    }
  }
}

const deleteAboutVideo = async () => {
  if (!confirm('Are you sure you want to delete this video?')) {
    return
  }
  
  try {
    if (aboutFormData.value.videoFileUrl) {
      const filePath = extractFilePathFromUrl(aboutFormData.value.videoFileUrl)
      if (filePath) {
        await storageService.deleteFile(filePath)
      }
    }
    
    aboutFormData.value.videoFileUrl = ''
    aboutFormData.value.videoUrl = ''
    aboutFormData.value.videoType = 'none'
    
    saveMessage.value = 'Video deleted successfully'
    saveMessageType.value = 'success'
    setTimeout(() => { saveMessage.value = '' }, 3000)
  } catch (error) {
    saveMessage.value = error instanceof Error ? error.message : 'Failed to delete video'
    saveMessageType.value = 'error'
    setTimeout(() => { saveMessage.value = '' }, 4000)
  }
}

// Team member methods
const addNewTeamMember = () => {
  // Get the maximum order value or use length
  const maxOrder = aboutFormData.value.teamMembers.length > 0
    ? Math.max(...aboutFormData.value.teamMembers.map(m => m.order ?? 0))
    : -1
  
  const newMember: TeamMember = {
    id: `temp-${Date.now()}`,
    name: '',
    role: '',
    photoType: 'url',
    order: maxOrder + 1
  }
  aboutFormData.value.teamMembers.push(newMember)
  startEditTeamMember(aboutFormData.value.teamMembers.length - 1)
}

const startEditTeamMember = (index: number) => {
  const member = aboutFormData.value.teamMembers[index]
  if (!member) return
  
  editingTeamMemberId.value = member.id || null
  editTeamMemberForm.value = {
    name: member.name,
    role: member.role,
    photoUrl: member.photoUrl,
    photoFileUrl: member.photoFileUrl,
    photoType: member.photoType || 'url'
  }
}

const cancelTeamMemberEdit = () => {
  editingTeamMemberId.value = null
  editTeamMemberForm.value = {
    name: '',
    role: '',
    photoUrl: '',
    photoFileUrl: '',
    photoType: 'url'
  }
}

// Helper function to find member index by order
const findMemberIndexByOrder = (order: number): number => {
  return aboutFormData.value.teamMembers.findIndex(m => (m.order ?? 0) === order)
}

// Helper function to find member by order
const findMemberByOrder = (order: number): TeamMember | undefined => {
  return aboutFormData.value.teamMembers.find(m => (m.order ?? 0) === order)
}

const saveTeamMemberEdit = (index: number) => {
  const member = aboutFormData.value.teamMembers[index]
  if (!member) return
  
  if (!editTeamMemberForm.value.name || !editTeamMemberForm.value.role) {
    saveMessage.value = 'Name and role are required'
    saveMessageType.value = 'error'
    setTimeout(() => { saveMessage.value = '' }, 3000)
    return
  }
  
  aboutFormData.value.teamMembers[index] = {
    ...member,
    name: editTeamMemberForm.value.name,
    role: editTeamMemberForm.value.role,
    photoUrl: editTeamMemberForm.value.photoUrl,
    photoFileUrl: editTeamMemberForm.value.photoFileUrl,
    photoType: editTeamMemberForm.value.photoType || 'url'
  }
  
  cancelTeamMemberEdit()
  saveMessage.value = 'Team member updated'
  saveMessageType.value = 'success'
  setTimeout(() => { saveMessage.value = '' }, 2000)
}

const saveTeamMemberEditByOrder = (order: number) => {
  const index = findMemberIndexByOrder(order)
  if (index === -1) return
  saveTeamMemberEdit(index)
}

const deleteTeamMember = (index: number) => {
  if (!confirm('Are you sure you want to delete this team member?')) {
    return
  }
  
  const member = aboutFormData.value.teamMembers[index]
  if (member?.photoFileUrl) {
    const filePath = extractFilePathFromUrl(member.photoFileUrl)
    if (filePath) {
      storageService.deleteFile(filePath).catch(() => {
        // Ignore errors if file doesn't exist
      })
    }
  }
  
  aboutFormData.value.teamMembers.splice(index, 1)
  // Reassign order values after deletion
  aboutFormData.value.teamMembers.forEach((m, i) => {
    m.order = i
  })
  saveMessage.value = 'Team member deleted'
  saveMessageType.value = 'success'
  setTimeout(() => { saveMessage.value = '' }, 2000)
}

const deleteTeamMemberByOrder = (order: number) => {
  const index = findMemberIndexByOrder(order)
  if (index === -1) return
  deleteTeamMember(index)
}

const startEditTeamMemberByOrder = (order: number) => {
  const index = findMemberIndexByOrder(order)
  if (index === -1) return
  startEditTeamMember(index)
}

// Move team member up in the list
const moveTeamMemberUp = (sortedIndex: number) => {
  if (sortedIndex === 0) return
  
  const member = sortedTeamMembers.value[sortedIndex]
  const previousMember = sortedTeamMembers.value[sortedIndex - 1]
  
  if (!member || !previousMember) return
  
  // Swap orders
  const tempOrder = member.order ?? sortedIndex
  member.order = previousMember.order ?? sortedIndex - 1
  previousMember.order = tempOrder
  
  saveMessage.value = 'Team member order updated'
  saveMessageType.value = 'success'
  setTimeout(() => { saveMessage.value = '' }, 2000)
}

// Move team member down in the list
const moveTeamMemberDown = (sortedIndex: number) => {
  if (sortedIndex === sortedTeamMembers.value.length - 1) return
  
  const member = sortedTeamMembers.value[sortedIndex]
  const nextMember = sortedTeamMembers.value[sortedIndex + 1]
  
  if (!member || !nextMember) return
  
  // Swap orders
  const tempOrder = member.order ?? sortedIndex
  member.order = nextMember.order ?? sortedIndex + 1
  nextMember.order = tempOrder
  
  saveMessage.value = 'Team member order updated'
  saveMessageType.value = 'success'
  setTimeout(() => { saveMessage.value = '' }, 2000)
}

const handleTeamPhotoUpload = async (event: Event, memberId: string) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (!file) return
  
  if (!file.type.startsWith('image/')) {
    saveMessage.value = 'Please select a valid image file'
    saveMessageType.value = 'error'
    setTimeout(() => { saveMessage.value = '' }, 3000)
    return
  }
  
  uploadingTeamPhoto.value[memberId] = true
  uploadProgressTeamPhoto.value[memberId] = 0
  
  try {
    const userId = user.value?.id || authService.getCurrentUser()?.uid || 'unknown'
    const timestamp = Date.now()
    const fileName = `about/team/${userId}/${timestamp}-${file.name}`
    
    const photoUrl = await storageService.uploadAndGetUrlWithProgress(
      fileName,
      file,
      (progress) => {
        uploadProgressTeamPhoto.value[memberId] = progress
      },
      {
        contentType: file.type
      }
    )
    
    editTeamMemberForm.value.photoFileUrl = photoUrl
    editTeamMemberForm.value.photoType = 'upload'
    
    saveMessage.value = 'Photo uploaded successfully!'
    saveMessageType.value = 'success'
    setTimeout(() => { saveMessage.value = '' }, 2000)
  } catch (error) {
    saveMessage.value = error instanceof Error ? error.message : 'Failed to upload photo'
    saveMessageType.value = 'error'
    setTimeout(() => { saveMessage.value = '' }, 4000)
  } finally {
    uploadingTeamPhoto.value[memberId] = false
    uploadProgressTeamPhoto.value[memberId] = 0
  }
}

// FAQ methods
const addNewFAQ = () => {
  const newFAQ: FAQ = {
    id: `temp-${Date.now()}`,
    question: '',
    answer: '',
    order: aboutFormData.value.faqs.length
  }
  aboutFormData.value.faqs.push(newFAQ)
  startEditFAQ(aboutFormData.value.faqs.length - 1)
}

const startEditFAQ = (index: number) => {
  const faq = aboutFormData.value.faqs[index]
  if (!faq) return
  
  editingFAQId.value = faq.id || null
  editFAQForm.value = {
    question: faq.question,
    answer: faq.answer
  }
}

const cancelFAQEdit = () => {
  editingFAQId.value = null
  editFAQForm.value = {
    question: '',
    answer: ''
  }
}

const saveFAQEdit = (index: number) => {
  const faq = aboutFormData.value.faqs[index]
  if (!faq) return
  
  if (!editFAQForm.value.question || !editFAQForm.value.answer) {
    saveMessage.value = 'Question and answer are required'
    saveMessageType.value = 'error'
    setTimeout(() => { saveMessage.value = '' }, 3000)
    return
  }
  
  aboutFormData.value.faqs[index] = {
    ...faq,
    question: editFAQForm.value.question,
    answer: editFAQForm.value.answer
  }
  
  cancelFAQEdit()
  saveMessage.value = 'FAQ updated'
  saveMessageType.value = 'success'
  setTimeout(() => { saveMessage.value = '' }, 2000)
}

const deleteFAQ = (index: number) => {
  if (!confirm('Are you sure you want to delete this FAQ?')) {
    return
  }
  
  aboutFormData.value.faqs.splice(index, 1)
  saveMessage.value = 'FAQ deleted'
  saveMessageType.value = 'success'
  setTimeout(() => { saveMessage.value = '' }, 2000)
}

// Legal section methods
const getLegalPolicySections = (policy: 'privacy' | 'terms' | 'cookies') => {
  if (policy === 'privacy') return legalFormData.value.privacyPolicy.sections
  if (policy === 'terms') return legalFormData.value.termsOfService.sections
  return legalFormData.value.cookiePolicy.sections
}

const setLegalPolicySections = (policy: 'privacy' | 'terms' | 'cookies', sections: Array<{ id: string; heading: string; content: string }>) => {
  if (policy === 'privacy') {
    legalFormData.value.privacyPolicy.sections = sections
  } else if (policy === 'terms') {
    legalFormData.value.termsOfService.sections = sections
  } else {
    legalFormData.value.cookiePolicy.sections = sections
  }
}

const addLegalSection = (policy: 'privacy' | 'terms' | 'cookies') => {
  const sections = getLegalPolicySections(policy)
  const newSection = {
    id: `section-${Date.now()}`,
    heading: '',
    content: ''
  }
  sections.push(newSection)
  startEditLegalSection(policy, sections.length - 1)
}

const startEditLegalSection = (policy: 'privacy' | 'terms' | 'cookies', index: number) => {
  const sections = getLegalPolicySections(policy)
  const section = sections[index]
  if (!section) return
  
  editingLegalPolicy.value = policy
  editingLegalSectionIndex.value = index
  editLegalSectionForm.value = {
    heading: section.heading,
    content: section.content
  }
}

const cancelEditLegalSection = () => {
  // If it's a new empty section, remove it
  if (editingLegalPolicy.value !== null && editingLegalSectionIndex.value !== null) {
    const sections = getLegalPolicySections(editingLegalPolicy.value)
    const section = sections[editingLegalSectionIndex.value]
    if (section && !section.heading && !section.content) {
      sections.splice(editingLegalSectionIndex.value, 1)
    }
  }
  
  editingLegalPolicy.value = null
  editingLegalSectionIndex.value = null
  editLegalSectionForm.value = { heading: '', content: '' }
}

const saveLegalSection = () => {
  if (editingLegalPolicy.value === null || editingLegalSectionIndex.value === null) return
  
  if (!editLegalSectionForm.value.heading || !editLegalSectionForm.value.content) {
    saveMessage.value = 'Heading and content are required'
    saveMessageType.value = 'error'
    setTimeout(() => { saveMessage.value = '' }, 3000)
    return
  }
  
  const sections = getLegalPolicySections(editingLegalPolicy.value)
  const section = sections[editingLegalSectionIndex.value]
  if (!section) return
  
  section.heading = editLegalSectionForm.value.heading
  section.content = editLegalSectionForm.value.content
  
  saveMessage.value = 'Section updated'
  saveMessageType.value = 'success'
  setTimeout(() => { saveMessage.value = '' }, 2000)
  
  editingLegalPolicy.value = null
  editingLegalSectionIndex.value = null
  editLegalSectionForm.value = { heading: '', content: '' }
}

const removeLegalSection = (policy: 'privacy' | 'terms' | 'cookies', index: number) => {
  if (!confirm('Are you sure you want to delete this section?')) {
    return
  }
  
  const sections = getLegalPolicySections(policy)
  sections.splice(index, 1)
  
  saveMessage.value = 'Section deleted'
  saveMessageType.value = 'success'
  setTimeout(() => { saveMessage.value = '' }, 2000)
}

// Stat Card methods
const addNewStatCard = () => {
  // Ensure statCards array exists
  if (!aboutFormData.value.statCards) {
    aboutFormData.value.statCards = []
  }
  
  const newStatCard: StatCard = {
    id: `temp-${Date.now()}`,
    title: '',
    value: '',
    description: '',
    order: aboutFormData.value.statCards.length
  }
  aboutFormData.value.statCards.push(newStatCard)
  startEditStatCard(aboutFormData.value.statCards.length - 1)
}

const startEditStatCard = (index: number) => {
  if (!aboutFormData.value.statCards || !aboutFormData.value.statCards[index]) return
  
  const statCard = aboutFormData.value.statCards[index]
  editingStatCardId.value = statCard.id || null
  editStatCardForm.value = {
    title: statCard.title,
    value: statCard.value,
    description: statCard.description
  }
}

const cancelStatCardEdit = () => {
  editingStatCardId.value = null
  editStatCardForm.value = {
    title: '',
    value: '',
    description: ''
  }
}

const saveStatCardEdit = (statCardId: string | undefined) => {
  if (!statCardId) return
  
  if (!aboutFormData.value.statCards) {
    aboutFormData.value.statCards = []
  }
  
  const index = aboutFormData.value.statCards.findIndex(s => s.id === statCardId)
  if (index === -1) return
  
  const statCard = aboutFormData.value.statCards[index]
  if (!statCard) return
  
  if (!editStatCardForm.value.title || !editStatCardForm.value.value || !editStatCardForm.value.description) {
    saveMessage.value = 'Title, value, and description are required'
    saveMessageType.value = 'error'
    setTimeout(() => { saveMessage.value = '' }, 3000)
    return
  }
  
  aboutFormData.value.statCards[index] = {
    ...statCard,
    title: editStatCardForm.value.title,
    value: editStatCardForm.value.value,
    description: editStatCardForm.value.description
  }
  
  cancelStatCardEdit()
  saveMessage.value = 'Stat card updated'
  saveMessageType.value = 'success'
  setTimeout(() => { saveMessage.value = '' }, 2000)
}

const deleteStatCard = (statCardId: string | undefined) => {
  if (!statCardId) return
  
  if (!aboutFormData.value.statCards) {
    aboutFormData.value.statCards = []
    return
  }
  
  if (!confirm('Are you sure you want to delete this stat card?')) {
    return
  }
  
  const index = aboutFormData.value.statCards.findIndex(s => s.id === statCardId)
  if (index === -1) return
  
  aboutFormData.value.statCards.splice(index, 1)
  saveMessage.value = 'Stat card deleted'
  saveMessageType.value = 'success'
  setTimeout(() => { saveMessage.value = '' }, 2000)
}

// Why Choose Clear Up Features Management
const addNewWhyChooseFeature = () => {
  if (!servicesFormData.value.whyChooseFeatures) {
    servicesFormData.value.whyChooseFeatures = []
  }
  
  const newFeature: WhyChooseFeature = {
    id: `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
    title: 'New Feature',
    description: 'Feature description',
    icon: 'target',
    order: servicesFormData.value.whyChooseFeatures.length
  }
  
  servicesFormData.value.whyChooseFeatures.push(newFeature)
  editingWhyChooseFeatureId.value = newFeature.id || null
  editWhyChooseFeatureForm.value = {
    title: newFeature.title,
    description: newFeature.description,
    icon: newFeature.icon
  }
}

const startEditWhyChooseFeature = (featureId: string | undefined) => {
  if (!featureId || !servicesFormData.value.whyChooseFeatures) return
  
  const feature = servicesFormData.value.whyChooseFeatures.find(f => f.id === featureId)
  if (!feature) return
  
  editingWhyChooseFeatureId.value = featureId || null
  editWhyChooseFeatureForm.value = {
    title: feature.title,
    description: feature.description,
    icon: feature.icon || 'target'
  }
}

const cancelWhyChooseFeatureEdit = () => {
  editingWhyChooseFeatureId.value = null
  editWhyChooseFeatureForm.value = {
    title: '',
    description: '',
    icon: 'target'
  }
}

const saveWhyChooseFeatureEdit = async (featureId: string | undefined) => {
  if (!featureId || !servicesFormData.value.whyChooseFeatures) return
  
  if (!editWhyChooseFeatureForm.value.title || !editWhyChooseFeatureForm.value.description) {
    saveMessage.value = 'Title and description are required'
    saveMessageType.value = 'error'
    setTimeout(() => { saveMessage.value = '' }, 3000)
    return
  }
  
  const index = servicesFormData.value.whyChooseFeatures.findIndex(f => f.id === featureId)
  if (index === -1) return
  
  const feature = servicesFormData.value.whyChooseFeatures[index]
  if (!feature) return
  
  // Check if this is a new feature (not in original loaded features)
  const isNewFeature = !originalFeatureIds.value.has(featureId)
  
  // Save to backend
  if (user.value?.id) {
    let result
    if (isNewFeature) {
      // Add new feature to backend
      result = await servicesContentController.addWhyChooseFeature(
        {
          title: editWhyChooseFeatureForm.value.title,
          description: editWhyChooseFeatureForm.value.description,
          icon: editWhyChooseFeatureForm.value.icon || 'target',
          order: servicesFormData.value.whyChooseFeatures.length
        },
        user.value.id
      )
      
      if (result.success && result.data) {
        // Update local feature with the ID from backend
        const newId = result.data.id
        if (newId) {
          servicesFormData.value.whyChooseFeatures[index] = {
            ...result.data,
            title: editWhyChooseFeatureForm.value.title,
            description: editWhyChooseFeatureForm.value.description,
            icon: editWhyChooseFeatureForm.value.icon || 'target'
          }
          // Add to original IDs set
          originalFeatureIds.value.add(newId)
        }
      }
    } else {
      // Update existing feature
      result = await servicesContentController.updateWhyChooseFeature(
        featureId,
        {
          title: editWhyChooseFeatureForm.value.title,
          description: editWhyChooseFeatureForm.value.description,
          icon: editWhyChooseFeatureForm.value.icon || 'target'
        },
        user.value.id
      )
      
      if (result.success) {
        // Update local feature
        servicesFormData.value.whyChooseFeatures[index] = {
          ...feature,
          title: editWhyChooseFeatureForm.value.title,
          description: editWhyChooseFeatureForm.value.description,
          icon: editWhyChooseFeatureForm.value.icon || 'target'
        }
      }
    }
    
    if (result.success) {
      cancelWhyChooseFeatureEdit()
      // Reload services content to get the latest data
      const servicesResult = await servicesContentController.getServicesContent()
      if (servicesResult.success && servicesResult.data) {
        servicesFormData.value = servicesResult.data
        // Update original feature IDs
        originalFeatureIds.value = new Set(
          (servicesResult.data.whyChooseFeatures || [])
            .map(f => f.id)
            .filter((id): id is string => !!id)
        )
      }
      saveMessage.value = isNewFeature ? 'Feature added successfully!' : 'Feature updated successfully!'
      saveMessageType.value = 'success'
      setTimeout(() => { saveMessage.value = '' }, 2000)
    } else {
      saveMessage.value = result.error || (isNewFeature ? 'Failed to add feature' : 'Failed to update feature')
      saveMessageType.value = 'error'
      setTimeout(() => { saveMessage.value = '' }, 3000)
    }
  }
}

const deleteWhyChooseFeature = async (featureId: string | undefined) => {
  if (!featureId || !servicesFormData.value.whyChooseFeatures) return
  
  if (!confirm('Are you sure you want to delete this feature?')) {
    return
  }
  
  const index = servicesFormData.value.whyChooseFeatures.findIndex(f => f.id === featureId)
  if (index === -1) return
  
  const isNewFeature = !originalFeatureIds.value.has(featureId)
  
  // Delete from backend if it's not a new feature
  if (!isNewFeature && user.value?.id) {
    const result = await servicesContentController.deleteWhyChooseFeature(featureId, user.value.id)
    
    if (result.success) {
      servicesFormData.value.whyChooseFeatures.splice(index, 1)
      originalFeatureIds.value.delete(featureId)
      // Reload to get latest data
      const servicesResult = await servicesContentController.getServicesContent()
      if (servicesResult.success && servicesResult.data) {
        servicesFormData.value = servicesResult.data
        originalFeatureIds.value = new Set(
          (servicesResult.data.whyChooseFeatures || [])
            .map(f => f.id)
            .filter((id): id is string => !!id)
        )
      }
      saveMessage.value = 'Feature deleted successfully!'
      saveMessageType.value = 'success'
      setTimeout(() => { saveMessage.value = '' }, 2000)
    } else {
      saveMessage.value = result.error || 'Failed to delete feature'
      saveMessageType.value = 'error'
      setTimeout(() => { saveMessage.value = '' }, 3000)
    }
  } else {
    // Just remove from local if it's a new feature that wasn't saved yet
    servicesFormData.value.whyChooseFeatures.splice(index, 1)
    saveMessage.value = 'Feature removed'
    saveMessageType.value = 'success'
    setTimeout(() => { saveMessage.value = '' }, 2000)
  }
}

// Steps Management
const draggedStepIndex = ref<number | null>(null)

/**
 * Add a new step
 */
const addStep = () => {
  const newStepNumber = formData.value.steps.length + 1
  formData.value.steps.push({
    number: newStepNumber,
    content: ''
  })
}

/**
 * Remove a step
 */
const removeStep = (index: number) => {
  if (formData.value.steps.length > 0) {
    formData.value.steps.splice(index, 1)
    // Update step numbers after removal
    updateStepNumbers()
  }
}

/**
 * Update step numbers sequentially
 */
const updateStepNumbers = () => {
  formData.value.steps.forEach((step, index) => {
    step.number = index + 1
  })
}

/**
 * Move step up
 */
const moveStepUp = (index: number) => {
  if (index > 0 && formData.value.steps) {
    const steps = formData.value.steps
    const current = steps[index]
    const previous = steps[index - 1]
    if (current && previous) {
      const temp = current
      steps[index] = previous
      steps[index - 1] = temp
      updateStepNumbers()
    }
  }
}

/**
 * Move step down
 */
const moveStepDown = (index: number) => {
  if (formData.value.steps && index < formData.value.steps.length - 1) {
    const steps = formData.value.steps
    const current = steps[index]
    const next = steps[index + 1]
    if (current && next) {
      const temp = current
      steps[index] = next
      steps[index + 1] = temp
      updateStepNumbers()
    }
  }
}

/**
 * Handle drag start for step reordering
 */
const handleStepDragStart = (event: DragEvent, index: number) => {
  draggedStepIndex.value = index
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/html', '')
  }
  if (event.target instanceof HTMLElement) {
    event.target.style.opacity = '0.5'
  }
}

/**
 * Handle drag over for step reordering
 */
const handleStepDragOver = (event: DragEvent, index: number) => {
  event.preventDefault()
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move'
  }
  if (draggedStepIndex.value !== null && draggedStepIndex.value !== index) {
    const stepCard = event.currentTarget as HTMLElement
    stepCard.classList.add('drag-over')
  }
}

/**
 * Handle drop for step reordering
 */
const handleStepDrop = (event: DragEvent, index: number) => {
  event.preventDefault()
  const stepCard = event.currentTarget as HTMLElement
  stepCard.classList.remove('drag-over')
  
  if (draggedStepIndex.value !== null && draggedStepIndex.value !== index && formData.value.steps) {
    const steps = formData.value.steps
    const draggedStep = steps[draggedStepIndex.value]
    if (draggedStep) {
      steps.splice(draggedStepIndex.value, 1)
      steps.splice(index, 0, draggedStep)
      updateStepNumbers()
    }
  }
}

/**
 * Handle drag end for step reordering
 */
const handleStepDragEnd = (event: DragEvent) => {
  if (event.target instanceof HTMLElement) {
    event.target.style.opacity = '1'
  }
  // Remove drag-over class from all step cards
  document.querySelectorAll('.step-card').forEach(card => {
    card.classList.remove('drag-over')
  })
  draggedStepIndex.value = null
}

// Benefits Management
const draggedBenefitIndex = ref<number | null>(null)

/**
 * Add a new benefit
 */
const addBenefit = () => {
  if (!formData.value.benefits) {
    formData.value.benefits = []
  }
  formData.value.benefits.push('')
}

/**
 * Remove a benefit
 */
const removeBenefit = (index: number) => {
  if (formData.value.benefits && formData.value.benefits.length > 0) {
    formData.value.benefits.splice(index, 1)
  }
}

/**
 * Move benefit up
 */
const moveBenefitUp = (index: number) => {
  if (index > 0 && formData.value.benefits) {
    const benefits = formData.value.benefits
    const current = benefits[index]
    const previous = benefits[index - 1]
    if (current !== undefined && previous !== undefined) {
      const temp = current
      benefits[index] = previous
      benefits[index - 1] = temp
    }
  }
}

/**
 * Move benefit down
 */
const moveBenefitDown = (index: number) => {
  if (formData.value.benefits && index < formData.value.benefits.length - 1) {
    const benefits = formData.value.benefits
    const current = benefits[index]
    const next = benefits[index + 1]
    if (current !== undefined && next !== undefined) {
      const temp = current
      benefits[index] = next
      benefits[index + 1] = temp
    }
  }
}

/**
 * Handle drag start for benefit reordering
 */
const handleBenefitDragStart = (event: DragEvent, index: number) => {
  draggedBenefitIndex.value = index
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/html', '')
  }
  if (event.target instanceof HTMLElement) {
    event.target.style.opacity = '0.5'
  }
}

/**
 * Handle drag over for benefit reordering
 */
const handleBenefitDragOver = (event: DragEvent, index: number) => {
  event.preventDefault()
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move'
  }
  if (draggedBenefitIndex.value !== null && draggedBenefitIndex.value !== index) {
    const benefitCard = event.currentTarget as HTMLElement
    benefitCard.classList.add('drag-over')
  }
}

/**
 * Handle drop for benefit reordering
 */
const handleBenefitDrop = (event: DragEvent, index: number) => {
  event.preventDefault()
  const benefitCard = event.currentTarget as HTMLElement
  benefitCard.classList.remove('drag-over')
  
  if (draggedBenefitIndex.value !== null && draggedBenefitIndex.value !== index && formData.value.benefits) {
    const benefits = formData.value.benefits
    const draggedBenefit = benefits[draggedBenefitIndex.value]
    if (draggedBenefit !== undefined) {
      benefits.splice(draggedBenefitIndex.value, 1)
      benefits.splice(index, 0, draggedBenefit)
    }
  }
}

/**
 * Handle drag end for benefit reordering
 */
const handleBenefitDragEnd = (event: DragEvent) => {
  if (event.target instanceof HTMLElement) {
    event.target.style.opacity = '1'
  }
  // Remove drag-over class from all benefit cards
  document.querySelectorAll('.benefit-card').forEach(card => {
    card.classList.remove('drag-over')
  })
  draggedBenefitIndex.value = null
}

// Bonuses Management
const draggedBonusIndex = ref<number | null>(null)

/**
 * Add a new bonus
 */
const addBonus = () => {
  if (!formData.value.bonuses) {
    formData.value.bonuses = []
  }
  formData.value.bonuses.push('')
}

/**
 * Remove a bonus
 */
const removeBonus = (index: number) => {
  if (formData.value.bonuses && formData.value.bonuses.length > 0) {
    formData.value.bonuses.splice(index, 1)
  }
}

/**
 * Move bonus up
 */
const moveBonusUp = (index: number) => {
  if (index > 0 && formData.value.bonuses) {
    const bonuses = formData.value.bonuses
    const current = bonuses[index]
    const previous = bonuses[index - 1]
    if (current !== undefined && previous !== undefined) {
      const temp = current
      bonuses[index] = previous
      bonuses[index - 1] = temp
    }
  }
}

/**
 * Move bonus down
 */
const moveBonusDown = (index: number) => {
  if (formData.value.bonuses && index < formData.value.bonuses.length - 1) {
    const bonuses = formData.value.bonuses
    const current = bonuses[index]
    const next = bonuses[index + 1]
    if (current !== undefined && next !== undefined) {
      const temp = current
      bonuses[index] = next
      bonuses[index + 1] = temp
    }
  }
}

/**
 * Handle drag start for bonus reordering
 */
const handleBonusDragStart = (event: DragEvent, index: number) => {
  draggedBonusIndex.value = index
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/html', '')
  }
  if (event.target instanceof HTMLElement) {
    event.target.style.opacity = '0.5'
  }
}

/**
 * Handle drag over for bonus reordering
 */
const handleBonusDragOver = (event: DragEvent, index: number) => {
  event.preventDefault()
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move'
  }
  if (draggedBonusIndex.value !== null && draggedBonusIndex.value !== index) {
    const bonusCard = event.currentTarget as HTMLElement
    bonusCard.classList.add('drag-over')
  }
}

/**
 * Handle drop for bonus reordering
 */
const handleBonusDrop = (event: DragEvent, index: number) => {
  event.preventDefault()
  const bonusCard = event.currentTarget as HTMLElement
  bonusCard.classList.remove('drag-over')
  
  if (draggedBonusIndex.value !== null && draggedBonusIndex.value !== index && formData.value.bonuses) {
    const bonuses = formData.value.bonuses
    const draggedBonus = bonuses[draggedBonusIndex.value]
    if (draggedBonus !== undefined) {
      bonuses.splice(draggedBonusIndex.value, 1)
      bonuses.splice(index, 0, draggedBonus)
    }
  }
}

/**
 * Handle drag end for bonus reordering
 */
const handleBonusDragEnd = (event: DragEvent) => {
  if (event.target instanceof HTMLElement) {
    event.target.style.opacity = '1'
  }
  // Remove drag-over class from all bonus cards
  document.querySelectorAll('.benefit-card').forEach(card => {
    card.classList.remove('drag-over')
  })
  draggedBonusIndex.value = null
}

// Email Submissions Management
const filteredEmailSubmissions = computed(() => {
  if (emailFilter.value === 'all') {
    return emailSubmissions.value
  }
  return emailSubmissions.value.filter(sub => sub.status === emailFilter.value)
})

/**
 * Load email submissions
 */
const loadEmailSubmissions = async () => {
  loadingEmails.value = true
  try {
    const result = await emailController.getSubmissions()
    if (result.success && result.data) {
      emailSubmissions.value = result.data
    } else {
      saveMessage.value = result.error || 'Failed to load email submissions'
      saveMessageType.value = 'error'
      setTimeout(() => { saveMessage.value = '' }, 3000)
    }
  } catch (error) {
    saveMessage.value = error instanceof Error ? error.message : 'Failed to load email submissions'
    saveMessageType.value = 'error'
    setTimeout(() => { saveMessage.value = '' }, 3000)
  } finally {
    loadingEmails.value = false
  }
}

/**
 * Resend confirmation email
 */
const resendConfirmationEmail = async (submission: EmailSubmission) => {
  if (!submission.id) return
  
  try {
    const result = await emailController.submitEmail(submission.email)
    if (result.success) {
      saveMessage.value = 'Confirmation email sent successfully!'
      saveMessageType.value = 'success'
      setTimeout(() => { saveMessage.value = '' }, 3000)
      // Reload submissions to update status
      await loadEmailSubmissions()
    } else {
      saveMessage.value = result.error || 'Failed to send confirmation email'
      saveMessageType.value = 'error'
      setTimeout(() => { saveMessage.value = '' }, 3000)
    }
  } catch (error) {
    saveMessage.value = error instanceof Error ? error.message : 'Failed to send confirmation email'
    saveMessageType.value = 'error'
    setTimeout(() => { saveMessage.value = '' }, 3000)
  }
}

// Contact Messages Management
const loadContactMessages = async () => {
  loadingContactMessages.value = true
  try {
    const result = await contactContentController.getMessages()
    if (result.success && result.data) {
      contactMessages.value = result.data
    } else {
      saveMessage.value = result.error || 'Failed to load contact messages'
      saveMessageType.value = 'error'
      setTimeout(() => { saveMessage.value = '' }, 3000)
    }
  } catch (error) {
    saveMessage.value = error instanceof Error ? error.message : 'Failed to load contact messages'
    saveMessageType.value = 'error'
    setTimeout(() => { saveMessage.value = '' }, 3000)
  } finally {
    loadingContactMessages.value = false
  }
}

const filteredContactMessages = computed(() => {
  if (contactMessageFilter.value === 'all') {
    return contactMessages.value
  }
  return contactMessages.value.filter(msg => msg.status === contactMessageFilter.value)
})

const updateContactMessageStatus = async (messageId: string, status: ContactMessage['status']) => {
  try {
    const result = await contactContentController.updateMessageStatus(messageId, status)
    if (result.success) {
      saveMessage.value = 'Message status updated!'
      saveMessageType.value = 'success'
      setTimeout(() => { saveMessage.value = '' }, 3000)
      await loadContactMessages()
    } else {
      saveMessage.value = result.error || 'Failed to update message status'
      saveMessageType.value = 'error'
      setTimeout(() => { saveMessage.value = '' }, 3000)
    }
  } catch (error) {
    saveMessage.value = error instanceof Error ? error.message : 'Failed to update message status'
    saveMessageType.value = 'error'
    setTimeout(() => { saveMessage.value = '' }, 3000)
  }
}

const deleteContactMessage = async (messageId: string) => {
  if (!confirm('Are you sure you want to delete this message?')) return
  
  try {
    const result = await contactContentController.deleteMessage(messageId)
    if (result.success) {
      saveMessage.value = 'Message deleted!'
      saveMessageType.value = 'success'
      setTimeout(() => { saveMessage.value = '' }, 3000)
      await loadContactMessages()
    } else {
      saveMessage.value = result.error || 'Failed to delete message'
      saveMessageType.value = 'error'
      setTimeout(() => { saveMessage.value = '' }, 3000)
    }
  } catch (error) {
    saveMessage.value = error instanceof Error ? error.message : 'Failed to delete message'
    saveMessageType.value = 'error'
    setTimeout(() => { saveMessage.value = '' }, 3000)
  }
}

const formatContactDate = (date: Date | string | undefined): string => {
  if (!date) return 'N/A'
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Contact Settings Management
const loadContactSettings = async () => {
  try {
    const result = await contactContentController.getContactContent()
    if (result.success && result.data) {
      contactSettings.value = result.data
    }
  } catch (error) {
    console.error('Failed to load contact settings:', error)
  }
}

const saveContactSettings = async () => {
  savingContactSettings.value = true
  try {
    const result = await contactContentController.updateContactContent(contactSettings.value)
    if (result.success) {
      saveMessage.value = 'Contact settings saved successfully!'
      saveMessageType.value = 'success'
      setTimeout(() => { saveMessage.value = '' }, 3000)
    } else {
      saveMessage.value = result.error || 'Failed to save contact settings'
      saveMessageType.value = 'error'
      setTimeout(() => { saveMessage.value = '' }, 3000)
    }
  } catch (error) {
    saveMessage.value = error instanceof Error ? error.message : 'Failed to save contact settings'
    saveMessageType.value = 'error'
    setTimeout(() => { saveMessage.value = '' }, 3000)
  } finally {
    savingContactSettings.value = false
  }
}

// Maintenance Mode Management
const loadMaintenanceData = async () => {
  loadingMaintenance.value = true
  try {
    // Check if maintenance is active
    const activeResult = await maintenanceController.getActiveMaintenanceRequest()
    if (activeResult.success && activeResult.data) {
      activeMaintenanceRequest.value = activeResult.data
      isMaintenanceActive.value = activeResult.data.type === 'turn_off'
    } else {
      activeMaintenanceRequest.value = null
      isMaintenanceActive.value = false
    }

    // Load pending requests
    const pendingResult = await maintenanceController.getPendingRequests()
    if (pendingResult.success && pendingResult.data) {
      pendingRequests.value = pendingResult.data
    }

    // Load history
    const historyResult = await maintenanceController.getAllRequests(20)
    if (historyResult.success && historyResult.data) {
      maintenanceHistory.value = historyResult.data.filter(r => r.status !== 'pending')
    }
  } catch (error) {
    console.error('Failed to load maintenance data:', error)
    saveMessage.value = error instanceof Error ? error.message : 'Failed to load maintenance data'
    saveMessageType.value = 'error'
    setTimeout(() => { saveMessage.value = '' }, 3000)
  } finally {
    loadingMaintenance.value = false
  }
}

const createMaintenanceRequest = async (type: 'turn_on' | 'turn_off') => {
  processingRequest.value = 'creating'
  try {
    const estimatedEndTime = maintenanceForm.value.estimatedEndTime 
      ? new Date(maintenanceForm.value.estimatedEndTime)
      : undefined

    const result = await maintenanceController.createMaintenanceRequest(
      type,
      estimatedEndTime,
      maintenanceForm.value.message || undefined
    )

    if (result.success) {
      saveMessage.value = `Maintenance request created. Waiting for another admin's approval.`
      saveMessageType.value = 'success'
      setTimeout(() => { saveMessage.value = '' }, 5000)
      showTurnOffModal.value = false
      showTurnOnModal.value = false
      maintenanceForm.value = { message: '', estimatedEndTime: '' }
      await loadMaintenanceData()
    } else {
      saveMessage.value = result.error || 'Failed to create maintenance request'
      saveMessageType.value = 'error'
      setTimeout(() => { saveMessage.value = '' }, 3000)
    }
  } catch (error) {
    saveMessage.value = error instanceof Error ? error.message : 'Failed to create maintenance request'
    saveMessageType.value = 'error'
    setTimeout(() => { saveMessage.value = '' }, 3000)
  } finally {
    processingRequest.value = null
  }
}

const approveMaintenanceRequest = async (requestId: string) => {
  if (!confirm('Are you sure you want to approve this maintenance request? This will immediately ' + 
    (pendingRequests.value.find(r => r.id === requestId)?.type === 'turn_off' ? 'turn off' : 'turn on') + 
    ' the website.')) {
    return
  }

  processingRequest.value = requestId
  try {
    const result = await maintenanceController.approveMaintenanceRequest(requestId)
    if (result.success) {
      saveMessage.value = 'Maintenance request approved. Website status updated.'
      saveMessageType.value = 'success'
      setTimeout(() => { saveMessage.value = '' }, 5000)
      await loadMaintenanceData()
    } else {
      saveMessage.value = result.error || 'Failed to approve maintenance request'
      saveMessageType.value = 'error'
      setTimeout(() => { saveMessage.value = '' }, 3000)
    }
  } catch (error) {
    saveMessage.value = error instanceof Error ? error.message : 'Failed to approve maintenance request'
    saveMessageType.value = 'error'
    setTimeout(() => { saveMessage.value = '' }, 3000)
  } finally {
    processingRequest.value = null
  }
}

const rejectMaintenanceRequest = async (requestId: string, reason?: string) => {
  processingRequest.value = requestId
  try {
    const result = await maintenanceController.rejectMaintenanceRequest(requestId, reason)
    if (result.success) {
      saveMessage.value = 'Maintenance request rejected.'
      saveMessageType.value = 'success'
      setTimeout(() => { saveMessage.value = '' }, 3000)
      showRejectModal.value = false
      rejectRequest.value = null
      rejectReason.value = ''
      await loadMaintenanceData()
    } else {
      saveMessage.value = result.error || 'Failed to reject maintenance request'
      saveMessageType.value = 'error'
      setTimeout(() => { saveMessage.value = '' }, 3000)
    }
  } catch (error) {
    saveMessage.value = error instanceof Error ? error.message : 'Failed to reject maintenance request'
    saveMessageType.value = 'error'
    setTimeout(() => { saveMessage.value = '' }, 3000)
  } finally {
    processingRequest.value = null
  }
}

const cancelMaintenanceRequest = async (requestId: string) => {
  if (!confirm('Are you sure you want to cancel this maintenance request?')) {
    return
  }

  processingRequest.value = requestId
  try {
    const result = await maintenanceController.cancelMaintenanceRequest(requestId)
    if (result.success) {
      saveMessage.value = 'Maintenance request cancelled.'
      saveMessageType.value = 'success'
      setTimeout(() => { saveMessage.value = '' }, 3000)
      await loadMaintenanceData()
    } else {
      saveMessage.value = result.error || 'Failed to cancel maintenance request'
      saveMessageType.value = 'error'
      setTimeout(() => { saveMessage.value = '' }, 3000)
    }
  } catch (error) {
    saveMessage.value = error instanceof Error ? error.message : 'Failed to cancel maintenance request'
    saveMessageType.value = 'error'
    setTimeout(() => { saveMessage.value = '' }, 3000)
  } finally {
    processingRequest.value = null
  }
}

const formatMaintenanceDate = (date: Date | string | undefined): string => {
  if (!date) return ''
  const d = date instanceof Date ? date : new Date(date)
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Real Results Cases Management
const addNewRealResultsCase = () => {
  if (!formData.value.realResultsCases) {
    formData.value.realResultsCases = []
  }
  formData.value.realResultsCases.push({
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    companyLogo: '',
    companyLogoFileUrl: '',
    companyLogoType: 'url' as 'url' | 'upload',
    headline: '',
    cards: [],
    companyImages: [],
    ctaText: ''
  })
}

const removeRealResultsCase = (index: number) => {
  if (confirm('Are you sure you want to delete this case?')) {
    formData.value.realResultsCases.splice(index, 1)
  }
}

const handleCaseLogoUpload = async (event: Event, caseIndex: number) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (!file) return
  
  if (!file.type.startsWith('image/')) {
    saveMessage.value = 'Please select a valid image file'
    saveMessageType.value = 'error'
    setTimeout(() => { saveMessage.value = '' }, 4000)
    return
  }
  
  const maxSize = 5 * 1024 * 1024 // 5MB
  if (file.size > maxSize) {
    saveMessage.value = 'Image file is too large. Maximum size is 5MB'
    saveMessageType.value = 'error'
    setTimeout(() => { saveMessage.value = '' }, 4000)
    return
  }
  
  try {
    const userId = user.value?.id || authService.getCurrentUser()?.uid || 'unknown'
    const timestamp = Date.now()
    const fileName = `real-results/logo/${userId}/${timestamp}-${file.name}`
    
    const imageUrl = await storageService.uploadAndGetUrl(
      fileName,
      file,
      {
        contentType: file.type,
        customMetadata: {
          uploadedBy: userId,
          uploadedAt: new Date().toISOString(),
          originalName: file.name
        }
      }
    )
    
    if (formData.value.realResultsCases && formData.value.realResultsCases[caseIndex]) {
      formData.value.realResultsCases[caseIndex].companyLogoFileUrl = imageUrl
      formData.value.realResultsCases[caseIndex].companyLogoType = 'upload'
    }
    
    saveMessage.value = 'Logo uploaded successfully!'
    saveMessageType.value = 'success'
    setTimeout(() => { saveMessage.value = '' }, 3000)
  } catch (error) {
    saveMessage.value = error instanceof Error ? error.message : 'Failed to upload logo'
    saveMessageType.value = 'error'
    setTimeout(() => { saveMessage.value = '' }, 5000)
  }
}

const addCaseCompanyImage = (caseIndex: number) => {
  const caseItem = formData.value.realResultsCases[caseIndex]
  if (!caseItem) return
  if (!caseItem.companyImages) {
    caseItem.companyImages = []
  }
  caseItem.companyImages.push({
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    imageUrl: '',
    imageFileUrl: '',
    imageType: 'url'
  })
}

const removeCaseCompanyImage = (caseIndex: number, imageIndex: number) => {
  if (confirm('Are you sure you want to remove this image?')) {
    const caseItem = formData.value.realResultsCases[caseIndex]
    if (caseItem?.companyImages) {
      caseItem.companyImages.splice(imageIndex, 1)
    }
  }
}

const handleCaseCompanyImageUpload = async (event: Event, caseIndex: number, imageIndex: number) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (!file) return
  
  if (!file.type.startsWith('image/')) {
    saveMessage.value = 'Please select a valid image file'
    saveMessageType.value = 'error'
    setTimeout(() => { saveMessage.value = '' }, 4000)
    return
  }
  
  const maxSize = 5 * 1024 * 1024 // 5MB
  if (file.size > maxSize) {
    saveMessage.value = 'Image file is too large. Maximum size is 5MB'
    saveMessageType.value = 'error'
    setTimeout(() => { saveMessage.value = '' }, 4000)
    return
  }
  
  try {
    const userId = user.value?.id || authService.getCurrentUser()?.uid || 'unknown'
    const timestamp = Date.now()
    const fileName = `real-results/company/${userId}/${timestamp}-${file.name}`
    
    const imageUrl = await storageService.uploadAndGetUrl(
      fileName,
      file,
      {
        contentType: file.type,
        customMetadata: {
          uploadedBy: userId,
          uploadedAt: new Date().toISOString(),
          originalName: file.name
        }
      }
    )
    
    if (formData.value.realResultsCases && formData.value.realResultsCases[caseIndex]?.companyImages?.[imageIndex]) {
      formData.value.realResultsCases[caseIndex].companyImages[imageIndex].imageFileUrl = imageUrl
      formData.value.realResultsCases[caseIndex].companyImages[imageIndex].imageType = 'upload'
    }
    
    saveMessage.value = 'Image uploaded successfully!'
    saveMessageType.value = 'success'
    setTimeout(() => { saveMessage.value = '' }, 3000)
  } catch (error) {
    saveMessage.value = error instanceof Error ? error.message : 'Failed to upload image'
    saveMessageType.value = 'error'
    setTimeout(() => { saveMessage.value = '' }, 5000)
  }
}

const addCaseCard = (caseIndex: number) => {
  const caseItem = formData.value.realResultsCases[caseIndex]
  if (!caseItem) return
  if (!caseItem.cards) {
    caseItem.cards = []
  }
  caseItem.cards.push({
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    title: '',
    metric: '',
    subtitle: ''
  })
}

const removeCaseCard = (caseIndex: number, cardIndex: number) => {
  if (confirm('Are you sure you want to delete this card?')) {
    const caseItem = formData.value.realResultsCases[caseIndex]
    if (caseItem) {
      caseItem.cards.splice(cardIndex, 1)
    }
  }
}

const addNewTestimonial = () => {
  if (!formData.value.testimonials) {
    formData.value.testimonials = []
  }
  formData.value.testimonials.push({
    id: Date.now().toString(),
    name: '',
    subtitle: '',
    stars: 5,
    review: '',
    photoUrl: '',
    photoFileUrl: '',
    photoType: 'url',
    videoThumbnailUrl: '',
    videoThumbnailFileUrl: '',
    videoThumbnailType: 'url',
    videoUrl: '',
    videoFileUrl: '',
    videoType: 'none'
  })
}

const removeTestimonial = (index: number) => {
  if (confirm('Are you sure you want to delete this testimonial?')) {
    formData.value.testimonials.splice(index, 1)
  }
}

const addNewClientLogo = () => {
  if (!formData.value.clientLogos) {
    formData.value.clientLogos = []
  }
  formData.value.clientLogos.push({
    id: Date.now().toString(),
    logoUrl: '',
    logoFileUrl: '',
    logoType: 'url',
    name: ''
  })
}

const removeClientLogo = (index: number) => {
  if (confirm('Are you sure you want to delete this client logo?')) {
    formData.value.clientLogos.splice(index, 1)
  }
}

const handleClientLogoUpload = async (event: Event, index: number) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (!file) return
  
  // Validate file type - only allow PNG, JPG, or SVG
  const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml']
  const allowedExtensions = ['.png', '.jpg', '.jpeg', '.svg']
  const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'))
  
  if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
    saveMessage.value = 'Please select a PNG, JPG, or SVG image file'
    saveMessageType.value = 'error'
    setTimeout(() => { saveMessage.value = '' }, 3000)
    return
  }
  
  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    saveMessage.value = 'Image file size must be less than 5MB'
    saveMessageType.value = 'error'
    setTimeout(() => { saveMessage.value = '' }, 3000)
    return
  }
  
  // Set uploading state
  uploadingLogos.value[index] = true
  
  try {
    const logo = formData.value.clientLogos[index]
    if (!logo) {
      uploadingLogos.value[index] = false
      return
    }
    
    const userId = user.value?.id || authService.getCurrentUser()?.uid || 'unknown'
    const timestamp = Date.now()
    const fileName = `client-logos/${userId}/${timestamp}-${file.name}`
    
    // Upload image to Firebase Storage
    const imageUrl = await storageService.uploadAndGetUrl(
      fileName,
      file,
      {
        contentType: file.type,
        customMetadata: {
          uploadedBy: userId,
          uploadedAt: new Date().toISOString(),
          originalName: file.name
        }
      }
    )
    
    if (imageUrl) {
      logo.logoFileUrl = imageUrl
      logo.logoType = 'upload'
    }
    
    saveMessage.value = 'Logo uploaded successfully!'
    saveMessageType.value = 'success'
    setTimeout(() => { saveMessage.value = '' }, 3000)
  } catch (error) {
    console.error('Error uploading logo:', error)
    saveMessage.value = 'Failed to upload logo. Please try again.'
    saveMessageType.value = 'error'
    setTimeout(() => { saveMessage.value = '' }, 3000)
  } finally {
    // Clear uploading state
    uploadingLogos.value[index] = false
  }
}

const handlePhotoUpload = async (event: Event, index: number) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (!file) return
  
  // Validate file type - only allow PNG, JPG, or WebP
  const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
  const allowedExtensions = ['.png', '.jpg', '.jpeg', '.webp']
  const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'))
  
  if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
    saveMessage.value = 'Please select a valid image file (PNG, JPG, or WebP)'
    saveMessageType.value = 'error'
    setTimeout(() => { saveMessage.value = '' }, 4000)
    // Reset file input
    if (target) {
      target.value = ''
    }
    return
  }
  
  // Validate file size (5MB max)
  const maxSize = 5 * 1024 * 1024 // 5MB
  if (file.size > maxSize) {
    saveMessage.value = 'Image file is too large. Maximum size is 5MB'
    saveMessageType.value = 'error'
    setTimeout(() => { saveMessage.value = '' }, 4000)
    // Reset file input
    if (target) {
      target.value = ''
    }
    return
  }
  
  uploadingPhotos.value[index] = true
  uploadProgressPhotos.value[index] = 0
  
  try {
    const userId = user.value?.id || authService.getCurrentUser()?.uid || 'unknown'
    const timestamp = Date.now()
    const fileName = `testimonials/${userId}/${timestamp}-${file.name}`
    
    // Upload image to Firebase Storage with progress tracking
    const imageUrl = await storageService.uploadAndGetUrlWithProgress(
      fileName,
      file,
      (progress) => {
        uploadProgressPhotos.value[index] = progress
      },
      {
        contentType: file.type,
        customMetadata: {
          uploadedBy: userId,
          uploadedAt: new Date().toISOString(),
          originalName: file.name
        }
      }
    )
    
    const testimonial = formData.value.testimonials[index]
    if (testimonial) {
      testimonial.photoFileUrl = imageUrl
      testimonial.photoType = 'upload'
    }
    
    saveMessage.value = 'Photo uploaded successfully!'
    saveMessageType.value = 'success'
    setTimeout(() => { saveMessage.value = '' }, 3000)
  } catch (error) {
    saveMessage.value = error instanceof Error ? error.message : 'Failed to upload photo'
    saveMessageType.value = 'error'
    setTimeout(() => { saveMessage.value = '' }, 5000)
  } finally {
    uploadingPhotos.value[index] = false
    uploadProgressPhotos.value[index] = 0
  }
}

const handleTestimonialVideoUpload = async (event: Event, index: number) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (!file) return
  
  // Validate file type - only allow specific video formats
  const allowedTypes = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo']
  const allowedExtensions = ['.mp4', '.webm', '.mov', '.avi']
  const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'))
  
  if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
    saveMessage.value = 'Please select a valid video file (MP4, WebM, MOV, or AVI)'
    saveMessageType.value = 'error'
    setTimeout(() => { saveMessage.value = '' }, 4000)
    // Reset file input
    if (target) {
      target.value = ''
    }
    return
  }
  
  // Validate file size (100MB max)
  const maxSize = 100 * 1024 * 1024 // 100MB
  if (file.size > maxSize) {
    saveMessage.value = 'Video file is too large. Maximum size is 100MB'
    saveMessageType.value = 'error'
    setTimeout(() => { saveMessage.value = '' }, 4000)
    // Reset file input
    if (target) {
      target.value = ''
    }
    return
  }
  
  uploadingTestimonialVideos.value[index] = true
  uploadProgressTestimonialVideos.value[index] = 0
  
  try {
    const userId = user.value?.id || authService.getCurrentUser()?.uid || 'unknown'
    const timestamp = Date.now()
    const fileName = `testimonials/${userId}/${timestamp}-${file.name}`
    
    // Upload video to Firebase Storage with progress tracking
    const videoUrl = await storageService.uploadAndGetUrlWithProgress(
      fileName,
      file,
      (progress) => {
        uploadProgressTestimonialVideos.value[index] = progress
      },
      {
        contentType: file.type,
        customMetadata: {
          uploadedBy: userId,
          uploadedAt: new Date().toISOString(),
          originalName: file.name
        }
      }
    )
    
    const testimonial = formData.value.testimonials[index]
    if (testimonial) {
      testimonial.videoFileUrl = videoUrl
      testimonial.videoType = 'upload'
    }
    
    saveMessage.value = 'Video uploaded successfully!'
    saveMessageType.value = 'success'
    setTimeout(() => { saveMessage.value = '' }, 3000)
  } catch (error) {
    saveMessage.value = error instanceof Error ? error.message : 'Failed to upload video'
    saveMessageType.value = 'error'
    setTimeout(() => { saveMessage.value = '' }, 5000)
  } finally {
    uploadingTestimonialVideos.value[index] = false
    uploadProgressTestimonialVideos.value[index] = 0
  }
}

const handleVideoThumbnailUpload = async (event: Event, index: number) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (!file) return
  
  // Validate file type - only allow PNG, JPG, or WebP
  const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
  const allowedExtensions = ['.png', '.jpg', '.jpeg', '.webp']
  const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'))
  
  if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
    saveMessage.value = 'Please select a valid image file (PNG, JPG, or WebP)'
    saveMessageType.value = 'error'
    setTimeout(() => { saveMessage.value = '' }, 4000)
    // Reset file input
    if (target) {
      target.value = ''
    }
    return
  }
  
  // Validate file size (5MB max)
  const maxSize = 5 * 1024 * 1024 // 5MB
  if (file.size > maxSize) {
    saveMessage.value = 'Image file is too large. Maximum size is 5MB'
    saveMessageType.value = 'error'
    setTimeout(() => { saveMessage.value = '' }, 4000)
    // Reset file input
    if (target) {
      target.value = ''
    }
    return
  }
  
  uploadingThumbnails.value[index] = true
  uploadProgressThumbnails.value[index] = 0
  
  try {
    const userId = user.value?.id || authService.getCurrentUser()?.uid || 'unknown'
    const timestamp = Date.now()
    const fileName = `testimonials/${userId}/thumbnails/${timestamp}-${file.name}`
    
    // Upload image to Firebase Storage with progress tracking
    const imageUrl = await storageService.uploadAndGetUrlWithProgress(
      fileName,
      file,
      (progress) => {
        uploadProgressThumbnails.value[index] = progress
      },
      {
        contentType: file.type,
        customMetadata: {
          uploadedBy: userId,
          uploadedAt: new Date().toISOString(),
          originalName: file.name
        }
      }
    )
    
    const testimonial = formData.value.testimonials[index]
    if (testimonial) {
      testimonial.videoThumbnailFileUrl = imageUrl
      testimonial.videoThumbnailType = 'upload'
    }
    
    saveMessage.value = 'Video thumbnail uploaded successfully!'
    saveMessageType.value = 'success'
    setTimeout(() => { saveMessage.value = '' }, 3000)
  } catch (error) {
    saveMessage.value = error instanceof Error ? error.message : 'Failed to upload video thumbnail'
    saveMessageType.value = 'error'
    setTimeout(() => { saveMessage.value = '' }, 5000)
  } finally {
    uploadingThumbnails.value[index] = false
    uploadProgressThumbnails.value[index] = 0
  }
}

const loadContent = async () => {
  isLoading.value = true
  errorMessage.value = ''
  
  try {
    await userViewController.loadCurrentUser()
    
    // Check if user is admin
    if (user.value?.id) {
      isAdmin.value = await adminUserService.isAdmin(user.value.id)
    }
    
    const result = await homeContentController.getHomeContent()
    
    if (result.success && result.data) {
      formData.value = result.data
      // Ensure step numbers are properly initialized
      if (formData.value.steps && formData.value.steps.length > 0) {
        updateStepNumbers()
      }
    } else {
      errorMessage.value = result.error || 'Failed to load content'
    }

    // Load about content
    const aboutResult = await aboutContentController.getAboutContent()
    if (aboutResult.success && aboutResult.data) {
      aboutFormData.value = aboutResult.data
      // Ensure all team members have order values
      aboutFormData.value.teamMembers.forEach((member, index) => {
        if (member.order === undefined || member.order === null) {
          member.order = index
        }
      })
    }
    
    // Load services content
    const servicesResult = await servicesContentController.getServicesContent()
    if (servicesResult.success && servicesResult.data) {
      servicesFormData.value = servicesResult.data
      // Store original feature IDs to detect new features
      originalFeatureIds.value = new Set(
        (servicesResult.data.whyChooseFeatures || [])
          .map(f => f.id)
          .filter((id): id is string => !!id)
      )
    }
    
    // Load legal content
    const legalResult = await legalContentController.getLegalContent()
    if (legalResult.success && legalResult.data) {
      legalFormData.value = legalResult.data
    }
    
    // Load roles for all users (needed for permission checking)
    const rolesResult = await roleController.getAllRoles()
    if (rolesResult.success && rolesResult.data) {
      roles.value = rolesResult.data
    }
    
    // Load admin data if admin
    if (isAdmin.value) {
      await loadAdminData()
    }
    
    // Set initial tab to first accessible tab
    const accessibleTabs = tabs.value
    if (accessibleTabs.length > 0 && !canAccessTab(activeTab.value) && accessibleTabs[0]) {
      activeTab.value = accessibleTabs[0].id
    }
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Failed to load content'
  } finally {
    isLoading.value = false
  }
}

const loadAdminData = async () => {
  if (!isAdmin.value) return
  
  isAdminLoading.value = true
  try {
    // Load users
    const usersResult = await adminUserController.getAllUsers()
    if (usersResult.success && usersResult.data) {
      users.value = usersResult.data
    }
    
    // Load roles
    const rolesResult = await roleController.getAllRoles()
    if (rolesResult.success && rolesResult.data) {
      roles.value = rolesResult.data
    }
    
    // Load activity logs
    const logsResult = await activityLogController.getRecentLogs(100)
    if (logsResult.success && logsResult.data) {
      activityLogs.value = logsResult.data
    }
    
    // Load site settings
    const settingsResult = await siteSettingsController.getSiteSettings()
    if (settingsResult.success && settingsResult.data) {
      siteSettings.value = settingsResult.data
    }
  } catch (error) {
    console.error('Failed to load admin data:', error)
  } finally {
    isAdminLoading.value = false
  }
}

const createUser = async () => {
  if (!user.value?.id) return
  
  isAdminLoading.value = true
  try {
    const result = await adminUserController.createUser(
      newUserForm.value.email,
      newUserForm.value.password,
      newUserForm.value.displayName,
      newUserForm.value.role,
      user.value.id
    )
    
    if (result.success) {
      // Clear form first
      newUserForm.value = { email: '', password: '', displayName: '', role: 'user' }
      
      // Reload admin data to refresh the users list and activity logs
      await loadAdminData()
      
      // Force Vue to recognize the change by creating a new array reference
      users.value = [...users.value]
      
      // Refresh activity logs if currently viewing them
      if (activeTab.value === 'activity-logs') {
        await refreshActivityLogs()
      }
      
      saveMessage.value = 'User created successfully!'
      saveMessageType.value = 'success'
      setTimeout(() => { saveMessage.value = '' }, 4000)
    } else {
      saveMessage.value = result.error || 'Failed to create user'
      saveMessageType.value = 'error'
    }
  } catch (error) {
    saveMessage.value = error instanceof Error ? error.message : 'Failed to create user'
    saveMessageType.value = 'error'
  } finally {
    isAdminLoading.value = false
  }
}

const startEditUser = (userData: any) => {
  editingUserId.value = userData.id
  editUserForm.value = {
    email: userData.email || '',
    displayName: userData.displayName || '',
    role: userData.role || 'user'
  }
}

const cancelUserEdit = () => {
  editingUserId.value = null
  editUserForm.value = { email: '', displayName: '', role: 'user' }
}

const saveUserEdit = async (userId: string) => {
  if (!user.value?.id) return
  
  isAdminLoading.value = true
  try {
    const result = await adminUserController.updateUser(userId, editUserForm.value, user.value.id)
    if (result.success) {
      editingUserId.value = null
      editUserForm.value = { email: '', displayName: '', role: 'user' }
      await loadAdminData()
      // Force Vue to recognize the change
      users.value = [...users.value]
      // Refresh activity logs if currently viewing them
      if (activeTab.value === 'activity-logs') {
        await refreshActivityLogs()
      }
      saveMessage.value = 'User updated successfully!'
      saveMessageType.value = 'success'
      setTimeout(() => { saveMessage.value = '' }, 4000)
    } else {
      saveMessage.value = result.error || 'Failed to update user'
      saveMessageType.value = 'error'
    }
  } catch (error) {
    saveMessage.value = error instanceof Error ? error.message : 'Failed to update user'
    saveMessageType.value = 'error'
  } finally {
    isAdminLoading.value = false
  }
}

const updateUserRole = async (userId: string, newRole: string) => {
  if (!user.value?.id) return
  
  isAdminLoading.value = true
  try {
    const result = await adminUserController.updateUserRole(userId, newRole, user.value.id)
    if (result.success) {
      await loadAdminData()
      // Force Vue to recognize the change
      users.value = [...users.value]
      // Refresh activity logs if currently viewing them
      if (activeTab.value === 'activity-logs') {
        await refreshActivityLogs()
      }
      saveMessage.value = 'User role updated successfully!'
      saveMessageType.value = 'success'
      setTimeout(() => { saveMessage.value = '' }, 4000)
    } else {
      saveMessage.value = result.error || 'Failed to update user role'
      saveMessageType.value = 'error'
    }
  } catch (error) {
    saveMessage.value = error instanceof Error ? error.message : 'Failed to update user role'
    saveMessageType.value = 'error'
  } finally {
    isAdminLoading.value = false
  }
}

const deleteUser = async (userId: string) => {
  if (!user.value?.id || !confirm('Are you sure you want to delete this user?')) return
  
  isAdminLoading.value = true
  try {
    const result = await adminUserController.deleteUser(userId, user.value.id)
    if (result.success) {
      await loadAdminData()
      // Force Vue to recognize the change
      users.value = [...users.value]
      // Refresh activity logs if currently viewing them
      if (activeTab.value === 'activity-logs') {
        await refreshActivityLogs()
      }
      saveMessage.value = 'User deleted successfully!'
      saveMessageType.value = 'success'
      setTimeout(() => { saveMessage.value = '' }, 4000)
    } else {
      saveMessage.value = result.error || 'Failed to delete user'
      saveMessageType.value = 'error'
    }
  } catch (error) {
    saveMessage.value = error instanceof Error ? error.message : 'Failed to delete user'
    saveMessageType.value = 'error'
  } finally {
    isAdminLoading.value = false
  }
}

const createRole = async () => {
  isAdminLoading.value = true
  try {
    const result = await roleController.createRole(newRoleForm.value)
    if (result.success) {
      newRoleForm.value = { name: '', description: '', permissions: [] }
      
      // Reload roles to update the dropdown lists
      await reloadRoles()
      await loadAdminData()
      
      saveMessage.value = 'Role created successfully!'
      saveMessageType.value = 'success'
      setTimeout(() => { saveMessage.value = '' }, 4000)
    } else {
      saveMessage.value = result.error || 'Failed to create role'
      saveMessageType.value = 'error'
    }
  } catch (error) {
    saveMessage.value = error instanceof Error ? error.message : 'Failed to create role'
    saveMessageType.value = 'error'
  } finally {
    isAdminLoading.value = false
  }
}

const startEditRole = (role: any) => {
  editingRoleId.value = role.id
  editRoleForm.value = {
    name: role.name || '',
    description: role.description || '',
    permissions: role.permissions || []
  }
}

const cancelRoleEdit = () => {
  editingRoleId.value = null
  editRoleForm.value = { name: '', description: '', permissions: [] }
}

const saveRoleEdit = async (roleId: string) => {
  if (!user.value?.id) return
  
  isAdminLoading.value = true
  try {
    const result = await roleController.updateRole(roleId, editRoleForm.value, user.value.id)
    if (result.success) {
      editingRoleId.value = null
      editRoleForm.value = { name: '', description: '', permissions: [] }
      
      // Reload roles to update permissions across the app
      await reloadRoles()
      await loadAdminData()
      
      saveMessage.value = 'Role updated successfully! Users with this role will see updated permissions.'
      saveMessageType.value = 'success'
      setTimeout(() => { saveMessage.value = '' }, 4000)
    } else {
      saveMessage.value = result.error || 'Failed to update role'
      saveMessageType.value = 'error'
    }
  } catch (error) {
    saveMessage.value = error instanceof Error ? error.message : 'Failed to update role'
    saveMessageType.value = 'error'
  } finally {
    isAdminLoading.value = false
  }
}

// Reload roles to refresh permissions
const reloadRoles = async () => {
  const rolesResult = await roleController.getAllRoles()
  if (rolesResult.success && rolesResult.data) {
    // Create a new array reference to ensure reactivity
    roles.value = [...rolesResult.data]
  }
}

const deleteRole = async (roleId: string) => {
  if (!user.value?.id || !confirm('Are you sure you want to delete this role? Users with this role may lose access.')) return
  
  isAdminLoading.value = true
  try {
    const result = await roleController.deleteRole(roleId, user.value.id)
    if (result.success) {
      // Reload roles to update permissions
      await reloadRoles()
      await loadAdminData()
      
      saveMessage.value = 'Role deleted successfully!'
      saveMessageType.value = 'success'
      setTimeout(() => { saveMessage.value = '' }, 4000)
    } else {
      saveMessage.value = result.error || 'Failed to delete role'
      saveMessageType.value = 'error'
    }
  } catch (error) {
    saveMessage.value = error instanceof Error ? error.message : 'Failed to delete role'
    saveMessageType.value = 'error'
  } finally {
    isAdminLoading.value = false
  }
}

const resetUserPassword = async (userEmail: string) => {
  if (!user.value?.id || !confirm(`Send password reset email to ${userEmail}?`)) return
  
  isAdminLoading.value = true
  try {
    const result = await adminUserController.resetUserPassword(userEmail, user.value.id)
    if (result.success) {
      await loadAdminData()
      if (activeTab.value === 'activity-logs') {
        await refreshActivityLogs()
      }
      saveMessage.value = `Password reset email sent to ${userEmail}`
      saveMessageType.value = 'success'
      setTimeout(() => { saveMessage.value = '' }, 5000)
    } else {
      saveMessage.value = result.error || 'Failed to send password reset email'
      saveMessageType.value = 'error'
    }
  } catch (error) {
    saveMessage.value = error instanceof Error ? error.message : 'Failed to send password reset email'
    saveMessageType.value = 'error'
  } finally {
    isAdminLoading.value = false
  }
}

const toggleSection = async (sectionId: string, disabled: boolean) => {
  isAdminLoading.value = true
  try {
    const result = await siteSettingsController.toggleSection(sectionId, disabled)
    if (result.success) {
      await loadAdminData()
      saveMessage.value = `${disabled ? 'Disabled' : 'Enabled'} ${availableSections.find(s => s.id === sectionId)?.label || sectionId}`
      saveMessageType.value = 'success'
      setTimeout(() => { saveMessage.value = '' }, 3000)
    } else {
      saveMessage.value = result.error || 'Failed to update section'
      saveMessageType.value = 'error'
    }
  } catch (error) {
    saveMessage.value = error instanceof Error ? error.message : 'Failed to update section'
    saveMessageType.value = 'error'
  } finally {
    isAdminLoading.value = false
  }
}

const refreshActivityLogs = async () => {
  if (!isAdmin.value) return
  
  isAdminLoading.value = true
  try {
    const logsResult = await activityLogController.getRecentLogs(100)
    if (logsResult.success && logsResult.data) {
      activityLogs.value = logsResult.data
      // Force Vue reactivity
      activityLogs.value = [...activityLogs.value]
    }
  } catch (error) {
    console.error('Failed to refresh activity logs:', error)
  } finally {
    isAdminLoading.value = false
  }
}

// Watch for tab changes to refresh activity logs when viewing them
watch(activeTab, (newTab) => {
  if (newTab === 'analytics' && isAdmin.value) {
    loadAnalytics()
  }
  if (newTab === 'bookings' && isAdmin.value) {
    loadBookings()
    initAvailabilityCalendar()
  }
  if (newTab === 'google-calendar' && isAdmin.value) {
    checkGoogleCalendarConnection()
  }
  if (newTab === 'activity-logs' && isAdmin.value) {
    refreshActivityLogs()
  }
  if (newTab === 'email-submissions') {
    loadEmailSubmissions()
  }
  if (newTab === 'contact-messages') {
    loadContactMessages()
  }
  if (newTab === 'contact-settings') {
    loadContactSettings()
  }
  if (newTab === 'maintenance' && isAdmin.value) {
    loadMaintenanceData()
  }
})

// Watch for user changes to reload roles and update permissions
watch(() => user.value?.id, async (newUserId, oldUserId) => {
  if (newUserId && newUserId !== oldUserId) {
    // User logged in or changed - reload roles to get latest permissions
    const rolesResult = await roleController.getAllRoles()
    if (rolesResult.success && rolesResult.data) {
      roles.value = rolesResult.data
    }
  }
})

// Watch for role changes to ensure permissions are up to date
watch(() => roles.value, () => {
  // When roles change, permissions will automatically update via computed property
  // This ensures UI reacts to role permission changes
}, { deep: true })

const saveContent = async () => {
  isSaving.value = true
  saveMessage.value = ''
  
  try {
    const userId = user.value?.id || authService.getCurrentUser()?.uid
    if (!userId) {
      saveMessage.value = 'User ID is required'
      saveMessageType.value = 'error'
      return
    }

    // Check if user has permission to save this content
    if (!canAccessTab(activeTab.value)) {
      saveMessage.value = 'You do not have permission to modify this content'
      saveMessageType.value = 'error'
      isSaving.value = false
      return
    }

    // Save about content if on about tab
    if (activeTab.value === 'about') {
      const aboutResult = await aboutContentController.updateAboutContent(aboutFormData.value, userId)
      if (aboutResult.success) {
        saveMessage.value = 'About content saved successfully!'
        saveMessageType.value = 'success'
        setTimeout(() => { saveMessage.value = '' }, 4000)
      } else {
        saveMessage.value = aboutResult.error || 'Failed to save about content'
        saveMessageType.value = 'error'
      }
      return
    }

    // Save services content if on services-page tab
    if (activeTab.value === 'services-page') {
      const servicesResult = await servicesContentController.updateServicesContent(servicesFormData.value, userId)
      if (servicesResult.success) {
        saveMessage.value = 'Services content saved successfully!'
        saveMessageType.value = 'success'
        setTimeout(() => { saveMessage.value = '' }, 4000)
      } else {
        saveMessage.value = servicesResult.error || 'Failed to save services content'
        saveMessageType.value = 'error'
      }
      return
    }

    // Save legal content if on legal-pages tab
    if (activeTab.value === 'legal-pages') {
      const legalResult = await legalContentController.updateLegalContent(legalFormData.value)
      if (legalResult.success) {
        saveMessage.value = 'Legal content saved successfully!'
        saveMessageType.value = 'success'
        setTimeout(() => { saveMessage.value = '' }, 4000)
      } else {
        saveMessage.value = legalResult.error || 'Failed to save legal content'
        saveMessageType.value = 'error'
      }
      return
    }

    // Save home content for other tabs
    const result = await homeContentController.updateHomeContent(formData.value, userId)
    
    if (result.success) {
      // Refresh activity logs if currently viewing them
      if (activeTab.value === 'activity-logs' && isAdmin.value) {
        await refreshActivityLogs()
      }
      saveMessage.value = 'Content saved successfully!'
      saveMessageType.value = 'success'
      setTimeout(() => { saveMessage.value = '' }, 4000)
    } else {
      saveMessage.value = result.error || 'Failed to save content'
      saveMessageType.value = 'error'
    }
  } catch (error) {
    saveMessage.value = error instanceof Error ? error.message : 'Failed to save content'
    saveMessageType.value = 'error'
  } finally {
    isSaving.value = false
  }
}

const resetContent = async () => {
  if (!confirm('Are you sure you want to reset all content to defaults? This action cannot be undone.')) {
    return
  }
  
  isSaving.value = true
  saveMessage.value = ''
  
  try {
    const userId = user.value?.id || authService.getCurrentUser()?.uid
    const result = await homeContentController.resetHomeContent(userId)
    
    if (result.success) {
      await loadContent()
      saveMessage.value = 'Content reset to defaults successfully!'
      saveMessageType.value = 'success'
      setTimeout(() => { saveMessage.value = '' }, 4000)
    } else {
      saveMessage.value = result.error || 'Failed to reset content'
      saveMessageType.value = 'error'
    }
  } catch (error) {
    saveMessage.value = error instanceof Error ? error.message : 'Failed to reset content'
    saveMessageType.value = 'error'
  } finally {
    isSaving.value = false
  }
}

const addService = () => {
  formData.value.services.push({ name: '', description: '' })
}

const removeService = (index: number) => {
  if (confirm('Are you sure you want to remove this service?')) {
    formData.value.services.splice(index, 1)
  }
}

const handleLogout = async () => {
  if (confirm('Are you sure you want to logout?')) {
    await userViewController.logout()
    router.push('/login')
  }
}

// Function to set active tab from query parameter
const setActiveTabFromQuery = () => {
  if (route.query.tab && typeof route.query.tab === 'string') {
    const tabExists = tabs.value.find(t => t.id === route.query.tab)
    if (tabExists && canAccessTab(route.query.tab as string)) {
      activeTab.value = route.query.tab as string
      // If Google Calendar tab, check connection status
      if (route.query.tab === 'google-calendar' && isAdmin.value) {
        checkGoogleCalendarConnection()
      }
    }
  }
}

// Watch for route query to set active tab
watch(() => route.query.tab, (newTab) => {
  if (newTab && typeof newTab === 'string') {
    const tabExists = tabs.value.find(t => t.id === newTab)
    if (tabExists && canAccessTab(newTab)) {
      activeTab.value = newTab
      // If Google Calendar tab, check connection status
      if (newTab === 'google-calendar' && isAdmin.value) {
        checkGoogleCalendarConnection()
      }
    }
  }
}, { immediate: true })

// Watch for isAdmin and tabs to be ready, then set tab from query
watch([isAdmin, tabs], () => {
  if (isAdmin.value && tabs.value.length > 0) {
    setActiveTabFromQuery()
  }
}, { immediate: true })

onMounted(() => {
  loadContent()
  // Set initial tab from query parameter after a short delay to ensure isAdmin is set
  setTimeout(() => {
    setActiveTabFromQuery()
  }, 100)
})
</script>

<style scoped>
.admin-dashboard {
  min-height: 100vh;
  background: #0B0B0F;
  color: #F5F7FA;
  font-family: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.dashboard-content {
  display: flex;
  min-height: 100vh;
  margin-top: 0;
}

/* Sidebar Styles */
.dashboard-sidebar {
  width: 300px;
  background: linear-gradient(180deg, #14141B 0%, #1A1A24 100%);
  border-right: 1px solid rgba(91, 32, 150, 0.2);
  padding: 0;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
}

.dashboard-sidebar::-webkit-scrollbar {
  width: 6px;
}

.dashboard-sidebar::-webkit-scrollbar-track {
  background: transparent;
}

.dashboard-sidebar::-webkit-scrollbar-thumb {
  background: rgba(91, 32, 150, 0.3);
  border-radius: 3px;
}

.dashboard-sidebar::-webkit-scrollbar-thumb:hover {
  background: rgba(91, 32, 150, 0.5);
}

.sidebar-header {
  padding: 2rem 1.5rem;
  border-bottom: 1px solid rgba(91, 32, 150, 0.2);
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.logo-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, rgba(91, 32, 150, 0.2) 0%, rgba(193, 157, 230, 0.1) 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(91, 32, 150, 0.3);
}

.logo-section h2 {
  margin: 0;
  color: #F5F7FA;
  font-size: 1.25rem;
  font-weight: 600;
  letter-spacing: -0.3px;
}

.user-card {
  background: rgba(91, 32, 150, 0.1);
  border: 1px solid rgba(91, 32, 150, 0.2);
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  position: relative;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: linear-gradient(135deg, #5B2096 0%, #C19DE6 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #F5F7FA;
  font-weight: 600;
  font-size: 0.875rem;
  flex-shrink: 0;
}

.user-details {
  flex: 1;
  min-width: 0;
}

.user-name {
  margin: 0 0 0.25rem 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: #F5F7FA;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-email {
  margin: 0;
  font-size: 0.75rem;
  color: rgba(245, 247, 250, 0.6);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.logout-btn {
  width: 36px;
  height: 36px;
  padding: 0;
  background: rgba(91, 32, 150, 0.2);
  border: 1px solid rgba(91, 32, 150, 0.3);
  border-radius: 8px;
  color: #F5F7FA;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  flex-shrink: 0;
}

.logout-btn:hover {
  background: rgba(91, 32, 150, 0.3);
  border-color: rgba(91, 32, 150, 0.5);
  transform: scale(1.05);
}

.sidebar-nav {
  padding: 1rem 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.nav-item {
  position: relative;
  padding: 0.875rem 1rem;
  text-align: left;
  background: transparent;
  border: none;
  border-radius: 10px;
  color: rgba(245, 247, 250, 0.7);
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-family: 'Roboto', sans-serif;
}

.nav-item:hover {
  background: rgba(91, 32, 150, 0.15);
  color: #F5F7FA;
  transform: translateX(4px);
}

.nav-item.active {
  background: linear-gradient(90deg, rgba(91, 32, 150, 0.25) 0%, rgba(91, 32, 150, 0.1) 100%);
  color: #F5F7FA;
  font-weight: 600;
  border-left: 3px solid #5B2096;
}

.nav-item.active .nav-icon {
  color: #C19DE6;
}

.nav-icon {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: color 0.2s;
}

.nav-icon svg {
  width: 100%;
  height: 100%;
}

.nav-label {
  flex: 1;
}

.nav-indicator {
  width: 6px;
  height: 6px;
  background: #5B2096;
  border-radius: 50%;
  position: absolute;
  right: 1rem;
}

/* Main Content Area */
.dashboard-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.main-header {
  background: linear-gradient(180deg, rgba(20, 20, 27, 0.95) 0%, rgba(20, 20, 27, 0.8) 100%);
  border-bottom: 1px solid rgba(91, 32, 150, 0.2);
  padding: 1.5rem 2rem;
  backdrop-filter: blur(10px);
  position: sticky;
  top: 0;
  z-index: 10;
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-title {
  margin: 0 0 0.25rem 0;
  color: #F5F7FA;
  font-size: 1.75rem;
  font-weight: 600;
  letter-spacing: -0.5px;
}

.page-subtitle {
  margin: 0;
  color: rgba(245, 247, 250, 0.6);
  font-size: 0.9rem;
}

.preview-btn-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  background: rgba(91, 32, 150, 0.2);
  border: 1px solid rgba(91, 32, 150, 0.3);
  border-radius: 8px;
  color: #F5F7FA;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s;
}

.preview-btn-header:hover {
  background: rgba(91, 32, 150, 0.3);
  border-color: rgba(91, 32, 150, 0.5);
  transform: translateY(-1px);
}

.preview-btn-header svg {
  transition: transform 0.2s;
}

.preview-btn-header:hover svg {
  transform: translate(2px, -2px);
}

/* Loading State */
.loading-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  min-height: 400px;
}

.loading-spinner {
  margin-bottom: 1.5rem;
}

.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid rgba(91, 32, 150, 0.2);
  border-top-color: #5B2096;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-text {
  color: rgba(245, 247, 250, 0.7);
  font-size: 1rem;
}

/* Error State */
.error-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
}

.error-card {
  background: #14141B;
  border: 1px solid rgba(204, 51, 51, 0.3);
  border-radius: 16px;
  padding: 3rem;
  text-align: center;
  max-width: 500px;
}

.error-icon {
  margin: 0 auto 1.5rem;
  width: 64px;
  height: 64px;
}

.error-card h3 {
  margin: 0 0 0.75rem 0;
  color: #F5F7FA;
  font-size: 1.5rem;
  font-weight: 600;
}

.error-card p {
  margin: 0 0 2rem 0;
  color: rgba(245, 247, 250, 0.7);
  font-size: 1rem;
}

.retry-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(103deg, #5B2096 0.52%, #C19DE6 125.79%);
  color: #F5F7FA;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.retry-btn:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

/* Content Editor */
.content-editor {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  padding-bottom: 120px; /* Space for fixed action bar */
}

.content-editor::-webkit-scrollbar {
  width: 8px;
}

.content-editor::-webkit-scrollbar-track {
  background: transparent;
}

.content-editor::-webkit-scrollbar-thumb {
  background: rgba(91, 32, 150, 0.3);
  border-radius: 4px;
}

.content-editor::-webkit-scrollbar-thumb:hover {
  background: rgba(91, 32, 150, 0.5);
}

.editor-section {
  background: #14141B;
  border: 1px solid rgba(91, 32, 150, 0.2);
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 1.5rem;
  transition: all 0.3s ease;
}

.editor-section:hover {
  border-color: rgba(91, 32, 150, 0.4);
  box-shadow: 0 4px 12px rgba(91, 32, 150, 0.1);
}

.section-header {
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid rgba(91, 32, 150, 0.2);
}

.section-title-group {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.section-icon {
  font-size: 2rem;
  line-height: 1;
  flex-shrink: 0;
}

.section-title-group h3 {
  margin: 0 0 0.5rem 0;
  color: #F5F7FA;
  font-size: 1.5rem;
  font-weight: 600;
  letter-spacing: -0.3px;
}

.section-description {
  margin: 0;
  color: rgba(245, 247, 250, 0.6);
  font-size: 0.9rem;
  line-height: 1.5;
}

/* Form Styles */
.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group label {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.label-text {
  color: rgba(245, 247, 250, 0.95);
  font-weight: 500;
  font-size: 0.9rem;
}

.label-hint {
  color: rgba(245, 247, 250, 0.5);
  font-size: 0.8rem;
  font-weight: 400;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 0.875rem 1rem;
  background: rgba(245, 247, 250, 0.05);
  border: 1px solid rgba(91, 32, 150, 0.3);
  border-radius: 10px;
  color: #F5F7FA;
  font-size: 0.95rem;
  font-family: 'Roboto', sans-serif;
  transition: all 0.2s ease;
}

.form-input::placeholder,
.form-textarea::placeholder {
  color: rgba(245, 247, 250, 0.3);
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #5B2096;
  background: rgba(245, 247, 250, 0.08);
  box-shadow: 0 0 0 4px rgba(91, 32, 150, 0.15);
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
  line-height: 1.6;
}

.roi-textarea {
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.input-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 0.25rem;
}

.char-count {
  color: rgba(245, 247, 250, 0.4);
  font-size: 0.75rem;
}

/* Subsection Styles */
.subsection {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(91, 32, 150, 0.2);
}

.subsection-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 0 1.5rem 0;
  color: #F5F7FA;
  font-size: 1.2rem;
  font-weight: 600;
}

.subsection-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

/* Stats Editor */
.stats-editor {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

/* Statistics Grid - Improved */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.5rem;
}

.stat-card-improved {
  background: rgba(245, 247, 250, 0.05);
  border: 1px solid rgba(91, 32, 150, 0.2);
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.2s;
}

.stat-card-improved:hover {
  border-color: rgba(91, 32, 150, 0.4);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(91, 32, 150, 0.1);
}

.stat-card-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.25rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(91, 32, 150, 0.1);
}

.stat-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: rgba(91, 32, 150, 0.15);
  border-radius: 10px;
  border: 1px solid rgba(91, 32, 150, 0.2);
  flex-shrink: 0;
}

.stat-icon {
  font-size: 1.5rem;
  line-height: 1;
}

.stat-card-title {
  margin: 0;
  color: #F5F7FA;
  font-size: 1.125rem;
  font-weight: 600;
}

.stat-card-body {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.stat-card {
  background: rgba(91, 32, 150, 0.08);
  border: 1px solid rgba(91, 32, 150, 0.2);
  border-radius: 12px;
  padding: 1.25rem;
  transition: all 0.2s;
}

.stat-card:hover {
  border-color: rgba(91, 32, 150, 0.4);
  background: rgba(91, 32, 150, 0.12);
}

.stat-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid rgba(91, 32, 150, 0.2);
}

.stat-header h5 {
  margin: 0;
  color: #C19DE6;
  font-size: 1rem;
  font-weight: 600;
}

.stat-fields {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

/* Services List */
.services-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.service-card {
  background: rgba(91, 32, 150, 0.08);
  border: 1px solid rgba(91, 32, 150, 0.2);
  border-radius: 12px;
  padding: 1.25rem;
  transition: all 0.2s;
}

.service-card:hover {
  border-color: rgba(91, 32, 150, 0.4);
  transform: translateX(4px);
}

.service-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.service-number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: rgba(91, 32, 150, 0.3);
  border-radius: 6px;
  color: #C19DE6;
  font-weight: 600;
  font-size: 0.875rem;
}

.remove-service-btn {
  width: 32px;
  height: 32px;
  padding: 0;
  background: rgba(204, 51, 51, 0.1);
  border: 1px solid rgba(204, 51, 51, 0.3);
  border-radius: 6px;
  color: #ff6b6b;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.remove-service-btn:hover {
  background: rgba(204, 51, 51, 0.2);
  border-color: rgba(204, 51, 51, 0.5);
  transform: scale(1.1);
}

.service-fields {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.add-service-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: rgba(91, 32, 150, 0.2);
  border: 1px dashed rgba(91, 32, 150, 0.5);
  border-radius: 10px;
  color: #C19DE6;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.add-service-btn:hover {
  background: rgba(91, 32, 150, 0.3);
  border-color: rgba(91, 32, 150, 0.7);
  border-style: solid;
  transform: translateY(-1px);
}

.empty-state {
  text-align: center;
  padding: 3rem 2rem;
  color: rgba(245, 247, 250, 0.5);
  font-size: 0.9rem;
}

/* Steps List */
.subsection-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.steps-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.step-card {
  background: rgba(91, 32, 150, 0.08);
  border: 1px solid rgba(91, 32, 150, 0.2);
  border-radius: 12px;
  padding: 1.25rem;
  transition: all 0.2s;
  cursor: move;
}

.step-card:hover {
  border-color: rgba(91, 32, 150, 0.4);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(91, 32, 150, 0.15);
}

.step-card.drag-over {
  border-color: #5B2096;
  background: rgba(91, 32, 150, 0.15);
  transform: scale(1.02);
}

.step-card-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.step-drag-handle {
  color: rgba(245, 247, 250, 0.5);
  cursor: grab;
  display: flex;
  align-items: center;
  transition: color 0.2s;
}

.step-drag-handle:active {
  cursor: grabbing;
}

.step-card:hover .step-drag-handle {
  color: rgba(245, 247, 250, 0.8);
}

.step-number {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #5B2096 0%, #C19DE6 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #F5F7FA;
  font-weight: 700;
  font-size: 1rem;
  flex-shrink: 0;
}

.step-actions {
  display: flex;
  gap: 0.5rem;
  margin-left: auto;
}

.btn-icon {
  width: 32px;
  height: 32px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(245, 247, 250, 0.1);
  border: 1px solid rgba(91, 32, 150, 0.2);
  border-radius: 6px;
  color: rgba(245, 247, 250, 0.7);
  cursor: pointer;
  transition: all 0.2s;
}

.btn-icon:hover:not(:disabled) {
  background: rgba(245, 247, 250, 0.15);
  border-color: rgba(91, 32, 150, 0.4);
  color: #F5F7FA;
}

.btn-icon:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.btn-icon-danger,
.btn-danger-icon {
  background: rgba(204, 51, 51, 0.1);
  border-color: rgba(204, 51, 51, 0.2);
  color: #ff6b6b;
}

.btn-icon-danger:hover:not(:disabled),
.btn-danger-icon:hover:not(:disabled) {
  background: rgba(204, 51, 51, 0.2);
  border-color: rgba(204, 51, 51, 0.4);
}

.btn-icon-warning {
  background: rgba(255, 193, 7, 0.1);
  border-color: rgba(255, 193, 7, 0.2);
  color: #ffc107;
}

.btn-icon-warning:hover:not(:disabled) {
  background: rgba(255, 193, 7, 0.2);
  border-color: rgba(255, 193, 7, 0.4);
}

.step-content-input {
  width: 100%;
  margin: 0;
}

.empty-state {
  padding: 2rem;
  text-align: center;
  color: rgba(245, 247, 250, 0.5);
  background: rgba(91, 32, 150, 0.05);
  border: 1px dashed rgba(91, 32, 150, 0.2);
  border-radius: 12px;
}

.empty-state p {
  margin: 0;
}

/* Benefits List Styles */
.benefits-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.benefit-card {
  background: rgba(91, 32, 150, 0.08);
  border: 1px solid rgba(91, 32, 150, 0.2);
  border-radius: 12px;
  padding: 1rem 1.25rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.2s;
  cursor: move;
}

.benefit-card:hover {
  border-color: rgba(91, 32, 150, 0.4);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(91, 32, 150, 0.15);
}

.benefit-card.drag-over {
  border-color: #5B2096;
  background: rgba(91, 32, 150, 0.15);
  transform: scale(1.02);
}

.benefit-drag-handle {
  color: rgba(245, 247, 250, 0.5);
  cursor: grab;
  display: flex;
  align-items: center;
  transition: color 0.2s;
  flex-shrink: 0;
}

.benefit-drag-handle:active {
  cursor: grabbing;
}

.benefit-card:hover .benefit-drag-handle {
  color: rgba(245, 247, 250, 0.8);
}

.benefit-check-icon {
  color: #5B2096;
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.benefit-input {
  flex: 1;
  margin: 0;
  background: rgba(245, 247, 250, 0.05);
  border: 1px solid rgba(91, 32, 150, 0.2);
}

.benefit-input:focus {
  background: rgba(245, 247, 250, 0.08);
  border-color: rgba(91, 32, 150, 0.4);
}

.benefit-actions {
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
}

/* Action Bar */
.action-bar {
  position: fixed;
  bottom: 0;
  left: 300px;
  right: 0;
  background: linear-gradient(180deg, rgba(20, 20, 27, 0.95) 0%, rgba(20, 20, 27, 0.98) 100%);
  border-top: 1px solid rgba(91, 32, 150, 0.3);
  padding: 1.25rem 2rem;
  backdrop-filter: blur(20px);
  z-index: 100;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.3);
}

.action-bar-content {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
}

.action-info {
  flex: 1;
  min-width: 0;
}

.action-hint {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: rgba(245, 247, 250, 0.5);
  font-size: 0.875rem;
}

.status-message {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.status-message.success {
  background: rgba(76, 175, 80, 0.15);
  border: 1px solid rgba(76, 175, 80, 0.3);
  color: #4caf50;
}

.status-message.error {
  background: rgba(204, 51, 51, 0.15);
  border: 1px solid rgba(204, 51, 51, 0.3);
  color: #ff6b6b;
}

.action-buttons {
  display: flex;
  gap: 0.75rem;
}

.btn-primary,
.btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  border-radius: 10px;
  font-weight: 500;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  font-family: 'Roboto', sans-serif;
}

.btn-primary {
  background: linear-gradient(103deg, #5B2096 0.52%, #C19DE6 125.79%);
  color: #F5F7FA;
  box-shadow: 0 4px 12px rgba(91, 32, 150, 0.3);
}

.btn-primary:hover:not(:disabled) {
  opacity: 0.95;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(91, 32, 150, 0.4);
}

.btn-secondary {
  background: rgba(245, 247, 250, 0.1);
  border: 1px solid rgba(91, 32, 150, 0.3);
  color: #F5F7FA;
}

.btn-secondary:hover:not(:disabled) {
  background: rgba(245, 247, 250, 0.15);
  border-color: rgba(91, 32, 150, 0.5);
  transform: translateY(-1px);
}

.btn-primary:disabled,
.btn-secondary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.btn-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(245, 247, 250, 0.3);
  border-top-color: #F5F7FA;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .dashboard-sidebar {
    width: 260px;
  }
  
  .action-bar {
    margin-left: 260px;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .stats-editor {
    grid-template-columns: 1fr;
  }
  
  .steps-list {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .dashboard-content {
    flex-direction: column;
  }
  
  .dashboard-sidebar {
    width: 100%;
    position: relative;
    top: 0;
    height: auto;
    max-height: none;
    border-right: none;
    border-bottom: 1px solid rgba(91, 32, 150, 0.2);
  }
  
  .sidebar-nav {
    flex-direction: row;
    flex-wrap: wrap;
    padding: 0.5rem;
  }
  
  .nav-item {
    flex: 1;
    min-width: calc(50% - 0.5rem);
    justify-content: center;
  }
  
  .nav-item.active {
    border-left: none;
    border-bottom: 3px solid #5B2096;
  }
  
  .nav-indicator {
    display: none;
  }
  
  .main-header {
    padding: 1rem 1.5rem;
  }
  
  .page-title {
    font-size: 1.5rem;
  }
  
  .content-editor {
    padding: 1.5rem 1rem;
  }
  
  .editor-section {
    padding: 1.5rem;
  }
  
  .action-bar {
    margin-left: 0;
    padding: 1rem;
  }
  
  .action-bar-content {
    flex-direction: column;
    gap: 1rem;
  }
  
  .action-buttons {
    width: 100%;
  }
  
  .btn-primary,
  .btn-secondary {
    flex: 1;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .main-header {
    padding: 1rem;
  }
  
  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .preview-btn-header {
    width: 100%;
    justify-content: center;
  }
  
  .content-editor {
    padding: 1rem 0.75rem;
  }
  
  .editor-section {
    padding: 1.25rem;
  }
  
  .section-title-group {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .section-icon {
    font-size: 1.5rem;
  }
  
  .admin-table {
    font-size: 0.875rem;
  }
  
  .admin-table th,
  .admin-table td {
    padding: 0.5rem;
  }
  
  .roles-list {
    grid-template-columns: 1fr;
  }
}

/* Admin Management Styles */
.admin-form-card {
  background: rgba(245, 247, 250, 0.05);
  border: 1px solid rgba(91, 32, 150, 0.2);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.admin-form-card h4 {
  margin: 0 0 1rem 0;
  color: #F5F7FA;
  font-size: 1.1rem;
  font-weight: 600;
}

.admin-table-card {
  background: rgba(245, 247, 250, 0.05);
  border: 1px solid rgba(91, 32, 150, 0.2);
  border-radius: 12px;
  padding: 1.5rem;
}

.admin-table-card h4 {
  margin: 0 0 1rem 0;
  color: #F5F7FA;
  font-size: 1.1rem;
  font-weight: 600;
}

.admin-table {
  width: 100%;
  border-collapse: collapse;
}

.admin-table thead {
  background: rgba(91, 32, 150, 0.1);
}

.admin-table th {
  padding: 0.75rem;
  text-align: left;
  color: #F5F7FA;
  font-weight: 600;
  font-size: 0.9rem;
  border-bottom: 1px solid rgba(91, 32, 150, 0.2);
}

.admin-table td {
  padding: 0.75rem;
  color: rgba(245, 247, 250, 0.8);
  border-bottom: 1px solid rgba(91, 32, 150, 0.1);
}

.admin-table tr:hover {
  background: rgba(91, 32, 150, 0.05);
}

.btn-danger {
  background: rgba(204, 51, 51, 0.2);
  border: 1px solid rgba(204, 51, 51, 0.3);
  color: #ff6b6b;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-danger:hover {
  background: rgba(204, 51, 51, 0.3);
  border-color: rgba(204, 51, 51, 0.5);
}

.btn-small {
  padding: 0.4rem 0.8rem;
  font-size: 0.85rem;
}

.btn-small svg {
  width: 14px;
  height: 14px;
}

.roles-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}

.role-card {
  background: rgba(245, 247, 250, 0.05);
  border: 1px solid rgba(91, 32, 150, 0.2);
  border-radius: 8px;
  padding: 1rem;
  transition: all 0.2s;
}

.role-card:hover {
  border-color: rgba(91, 32, 150, 0.4);
}

.role-card-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
}

.role-card h5 {
  margin: 0 0 0.5rem 0;
  color: #F5F7FA;
  font-size: 1rem;
  font-weight: 600;
}

.role-card p {
  margin: 0 0 0.5rem 0;
  color: rgba(245, 247, 250, 0.6);
  font-size: 0.875rem;
}

.role-permissions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.permission-badge {
  padding: 0.25rem 0.5rem;
  background: rgba(91, 32, 150, 0.2);
  border: 1px solid rgba(91, 32, 150, 0.3);
  border-radius: 4px;
  color: rgba(245, 247, 250, 0.8);
  font-size: 0.75rem;
  font-weight: 500;
}

.role-actions {
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
}

.role-edit-form {
  width: 100%;
}

.role-edit-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
}

.users-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}

.user-card {
  background: rgba(245, 247, 250, 0.05);
  border: 1px solid rgba(91, 32, 150, 0.2);
  border-radius: 8px;
  padding: 1rem;
  transition: all 0.2s;
}

.user-card:hover {
  border-color: rgba(91, 32, 150, 0.4);
}

.user-card-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
}

.user-info {
  flex: 1;
}

.user-main-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.user-card h5 {
  margin: 0;
  color: #F5F7FA;
  font-size: 1rem;
  font-weight: 600;
}

.user-card p {
  margin: 0;
  color: rgba(245, 247, 250, 0.6);
  font-size: 0.875rem;
}

.user-role-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  margin-top: 0.25rem;
}

.user-role-badge.role-admin {
  background: rgba(91, 32, 150, 0.2);
  border: 1px solid rgba(91, 32, 150, 0.3);
  color: #C19DE6;
}

.user-role-badge.role-user {
  background: rgba(245, 247, 250, 0.1);
  border: 1px solid rgba(245, 247, 250, 0.2);
  color: rgba(245, 247, 250, 0.8);
}

.user-actions {
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
}

.user-edit-form {
  width: 100%;
}

.user-edit-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
}

.activity-logs {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.activity-log-item {
  background: rgba(245, 247, 250, 0.05);
  border: 1px solid rgba(91, 32, 150, 0.2);
  border-radius: 12px;
  padding: 1.25rem;
  margin-bottom: 1rem;
  transition: all 0.2s;
}

.activity-log-item:hover {
  border-color: rgba(91, 32, 150, 0.4);
  background: rgba(245, 247, 250, 0.08);
}

.log-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.log-user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
}

.log-user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #5B2096 0%, #C19DE6 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #F5F7FA;
  font-weight: 600;
  font-size: 0.9rem;
  flex-shrink: 0;
}

.log-user-name {
  color: #F5F7FA;
  font-size: 0.95rem;
  display: block;
  margin-bottom: 0.25rem;
}

.log-action-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: rgba(91, 32, 150, 0.2);
  border: 1px solid rgba(91, 32, 150, 0.3);
  border-radius: 6px;
  color: #C19DE6;
  font-size: 0.75rem;
  font-weight: 500;
}

.log-time {
  color: rgba(245, 247, 250, 0.5);
  font-size: 0.875rem;
  white-space: nowrap;
}

.log-content {
  margin-top: 0.75rem;
}

.log-description {
  color: rgba(245, 247, 250, 0.9);
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: 0.75rem;
}

.log-changes-summary {
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid rgba(91, 32, 150, 0.1);
}

.changes-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: rgba(245, 247, 250, 0.7);
  font-size: 0.85rem;
  margin-bottom: 0.5rem;
}

.changes-header svg {
  color: #5B2096;
}

.log-changes-details {
  margin-top: 0.5rem;
}

.log-changes-details summary {
  color: #C19DE6;
  font-size: 0.85rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 6px;
  transition: background 0.2s;
}

.log-changes-details summary:hover {
  background: rgba(91, 32, 150, 0.1);
}

.changes-list {
  margin-top: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.change-item {
  padding: 0.75rem;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  border-left: 3px solid #5B2096;
}

.change-field {
  color: #C19DE6;
  font-weight: 600;
  font-size: 0.85rem;
  margin-bottom: 0.5rem;
}

.change-values {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.change-before,
.change-after {
  display: flex;
  gap: 0.5rem;
  font-size: 0.8rem;
}

.change-label {
  color: rgba(245, 247, 250, 0.6);
  font-weight: 500;
  min-width: 50px;
}

.change-before .change-value {
  color: #ff6b6b;
  text-decoration: line-through;
}

.change-after .change-value {
  color: #4caf50;
  font-weight: 500;
}

.change-value {
  flex: 1;
  word-break: break-word;
}

.loading-text {
  color: rgba(245, 247, 250, 0.6);
  text-align: center;
  padding: 2rem;
}

.btn-warning {
  background: rgba(255, 152, 0, 0.2);
  border: 1px solid rgba(255, 152, 0, 0.3);
  color: #ff9800;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-warning:hover {
  background: rgba(255, 152, 0, 0.3);
  border-color: rgba(255, 152, 0, 0.5);
}

.sections-groups {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.section-group {
  background: rgba(91, 32, 150, 0.05);
  border: 1px solid rgba(91, 32, 150, 0.15);
  border-radius: 12px;
  padding: 1.5rem;
}

.section-group-title {
  color: #F5F7FA;
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid rgba(91, 32, 150, 0.2);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.sections-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.section-toggle-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: rgba(245, 247, 250, 0.05);
  border: 1px solid rgba(91, 32, 150, 0.2);
  border-radius: 8px;
  transition: all 0.2s;
}

.section-toggle-item:hover {
  border-color: rgba(91, 32, 150, 0.4);
  background: rgba(245, 247, 250, 0.08);
}

.section-info {
  flex: 1;
}

.section-info h5 {
  margin: 0 0 0.25rem 0;
  color: #F5F7FA;
  font-size: 0.95rem;
  font-weight: 600;
}

.section-id {
  color: rgba(245, 247, 250, 0.5);
  font-size: 0.8rem;
}

.toggle-switch {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
}

.toggle-switch input[type="checkbox"] {
  display: none;
}

.toggle-slider {
  position: relative;
  width: 50px;
  height: 26px;
  background: rgba(91, 32, 150, 0.3);
  border-radius: 13px;
  transition: background 0.3s;
}

.toggle-slider::before {
  content: '';
  position: absolute;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #F5F7FA;
  top: 3px;
  left: 3px;
  transition: transform 0.3s;
}

.toggle-switch input[type="checkbox"]:checked + .toggle-slider {
  background: linear-gradient(135deg, #5B2096 0%, #C19DE6 100%);
}

.toggle-switch input[type="checkbox"]:checked + .toggle-slider::before {
  transform: translateX(24px);
}

.toggle-label {
  color: rgba(245, 247, 250, 0.8);
  font-size: 0.875rem;
  font-weight: 500;
  min-width: 70px;
}

/* Video Manager Styles */
.video-manager {
  margin-top: 1rem;
  padding: 1.5rem;
  background: rgba(245, 247, 250, 0.05);
  border: 1px solid rgba(91, 32, 150, 0.2);
  border-radius: 12px;
}

.video-options {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.video-option-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: rgba(245, 247, 250, 0.8);
  font-size: 0.9rem;
  cursor: pointer;
}

.video-option-label input[type="radio"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #5B2096;
}

.video-upload-area {
  margin-top: 0.5rem;
}

.video-file-input {
  display: none;
}

.video-upload-label {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 2rem;
  border: 2px dashed rgba(91, 32, 150, 0.3);
  border-radius: 8px;
  background: rgba(91, 32, 150, 0.05);
  color: rgba(245, 247, 250, 0.7);
  cursor: pointer;
  transition: all 0.2s;
  min-height: 120px;
}

.video-upload-label:hover {
  border-color: rgba(91, 32, 150, 0.5);
  background: rgba(91, 32, 150, 0.1);
}

.video-upload-label svg {
  color: #5B2096;
}

.video-preview {
  margin-top: 1rem;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
}

.video-preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.preview-label {
  margin: 0;
  color: rgba(245, 247, 250, 0.7);
  font-size: 0.875rem;
  font-weight: 500;
}

.video-preview-container {
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: 8px;
  overflow: hidden;
  background: #000;
}

.video-preview-container iframe {
  width: 100%;
  height: 100%;
  border: none;
}

.video-preview-player {
  width: 100%;
  max-height: 400px;
  border-radius: 8px;
}

/* Email Submissions Styles */
.email-submissions-list {
  margin-top: 1.5rem;
}

.submissions-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: rgba(245, 247, 250, 0.05);
  border: 1px solid rgba(91, 32, 150, 0.2);
  border-radius: 8px;
}

.submission-count {
  color: #F5F7FA;
  font-weight: 500;
}

.submission-filters {
  display: flex;
  gap: 0.5rem;
}

.filter-btn {
  padding: 0.5rem 1rem;
  background: rgba(245, 247, 250, 0.05);
  border: 1px solid rgba(91, 32, 150, 0.2);
  border-radius: 6px;
  color: rgba(245, 247, 250, 0.7);
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-btn:hover {
  background: rgba(91, 32, 150, 0.1);
  border-color: rgba(91, 32, 150, 0.4);
}

.filter-btn.active {
  background: rgba(91, 32, 150, 0.2);
  border-color: #5B2096;
  color: #F5F7FA;
}

.submissions-table {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.table-header,
.table-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1.2fr 1.5fr 0.8fr;
  gap: 1rem;
  padding: 1rem;
  align-items: center;
}

.table-header {
  background: rgba(91, 32, 150, 0.1);
  border: 1px solid rgba(91, 32, 150, 0.2);
  border-radius: 8px;
  font-weight: 600;
  color: #F5F7FA;
  font-size: 0.875rem;
}

.table-row {
  background: rgba(245, 247, 250, 0.05);
  border: 1px solid rgba(91, 32, 150, 0.2);
  border-radius: 8px;
  transition: all 0.2s;
}

.table-row:hover {
  background: rgba(245, 247, 250, 0.08);
  border-color: rgba(91, 32, 150, 0.3);
}

.table-cell {
  color: rgba(245, 247, 250, 0.9);
  font-size: 0.875rem;
}

.email-cell {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.email-cell svg {
  color: #5B2096;
  flex-shrink: 0;
}

.status-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: capitalize;
}

.status-pending {
  background: rgba(255, 193, 7, 0.2);
  color: #FFC107;
  border: 1px solid rgba(255, 193, 7, 0.3);
}

.status-confirmed {
  background: rgba(76, 175, 80, 0.2);
  color: #4CAF50;
  border: 1px solid rgba(76, 175, 80, 0.3);
}

.status-sent {
  background: rgba(33, 150, 243, 0.2);
  color: #2196F3;
  border: 1px solid rgba(33, 150, 243, 0.3);
}

.check-icon {
  color: #4CAF50;
  font-weight: bold;
  font-size: 1.1rem;
}

.cross-icon {
  color: rgba(245, 247, 250, 0.4);
  font-weight: bold;
  font-size: 1.1rem;
}

/* Contact Messages Styles */
.contact-messages-list {
  margin-top: 1.5rem;
}

.messages-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
}

.message-card {
  background: rgba(245, 247, 250, 0.03);
  border: 1px solid rgba(91, 32, 150, 0.2);
  border-radius: 12px;
  padding: 1.25rem;
  transition: all 0.2s;
}

.message-card:hover {
  background: rgba(245, 247, 250, 0.05);
  border-color: rgba(91, 32, 150, 0.3);
}

.message-card.message-unread {
  border-left: 3px solid #5B2096;
  background: rgba(91, 32, 150, 0.05);
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
}

.message-sender {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.sender-name {
  font-weight: 600;
  color: #F5F7FA;
  font-size: 1rem;
}

.sender-email {
  font-size: 0.875rem;
  color: rgba(245, 247, 250, 0.6);
}

.message-meta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.message-date {
  font-size: 0.8rem;
  color: rgba(245, 247, 250, 0.5);
}

.message-subject {
  font-size: 0.9rem;
  color: rgba(245, 247, 250, 0.8);
  margin-bottom: 0.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgba(91, 32, 150, 0.15);
}

.message-body {
  font-size: 0.9rem;
  color: rgba(245, 247, 250, 0.7);
  line-height: 1.6;
  margin-bottom: 1rem;
  white-space: pre-wrap;
}

.message-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid rgba(91, 32, 150, 0.15);
}

.status-select {
  padding: 0.5rem 0.75rem;
  background: rgba(245, 247, 250, 0.05);
  border: 1px solid rgba(91, 32, 150, 0.3);
  border-radius: 6px;
  color: #F5F7FA;
  font-size: 0.85rem;
  cursor: pointer;
}

.status-select:focus {
  outline: none;
  border-color: #5B2096;
}

.btn-reply {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 1rem;
  background: rgba(91, 32, 150, 0.2);
  border: 1px solid rgba(91, 32, 150, 0.3);
  border-radius: 6px;
  color: #C19DE6;
  font-size: 0.85rem;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.2s;
}

.btn-reply:hover {
  background: rgba(91, 32, 150, 0.3);
  border-color: #5B2096;
}

.btn-delete {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 6px;
  color: #ef4444;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-delete:hover {
  background: rgba(239, 68, 68, 0.2);
  border-color: rgba(239, 68, 68, 0.4);
}

.status-badge.status-pending {
  background: rgba(255, 193, 7, 0.2);
  color: #FFC107;
  border: 1px solid rgba(255, 193, 7, 0.3);
}

.status-badge.status-read {
  background: rgba(33, 150, 243, 0.2);
  color: #2196F3;
  border: 1px solid rgba(33, 150, 243, 0.3);
}

.status-badge.status-replied {
  background: rgba(76, 175, 80, 0.2);
  color: #4CAF50;
  border: 1px solid rgba(76, 175, 80, 0.3);
}

/* Contact Settings Styles */
.form-section {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: rgba(245, 247, 250, 0.03);
  border: 1px solid rgba(91, 32, 150, 0.2);
  border-radius: 12px;
}

.subsection-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #F5F7FA;
  margin: 0 0 1.25rem 0;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid rgba(91, 32, 150, 0.2);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.contact-info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.contact-info-card {
  background: rgba(20, 20, 27, 0.5);
  border: 1px solid rgba(91, 32, 150, 0.25);
  border-radius: 10px;
  padding: 1.25rem;
}

.contact-info-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid rgba(91, 32, 150, 0.15);
}

.contact-info-icon {
  font-size: 1.25rem;
}

.contact-info-label {
  font-weight: 600;
  color: #F5F7FA;
  font-size: 1rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 1.5rem;
}

.btn-primary {
  padding: 0.875rem 2rem;
  background: linear-gradient(90deg, #5B2096 0%, #C19DE6 100%);
  border: none;
  border-radius: 8px;
  color: #F5F7FA;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(91, 32, 150, 0.4);
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .contact-info-grid {
    grid-template-columns: 1fr;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .message-header {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .message-actions {
    flex-wrap: wrap;
  }
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  gap: 1rem;
  color: rgba(245, 247, 250, 0.7);
}

.upload-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(91, 32, 150, 0.2);
  border-top-color: #5B2096;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Content Section Cards */
.content-section-card {
  background: rgba(245, 247, 250, 0.03);
  border: 1px solid rgba(91, 32, 150, 0.15);
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  transition: all 0.2s;
}

.content-section-card:hover {
  border-color: rgba(91, 32, 150, 0.25);
}

.content-section-header {
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(91, 32, 150, 0.1);
}

.content-section-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 0 0 0.5rem 0;
  color: #F5F7FA;
  font-size: 1.125rem;
  font-weight: 600;
}

.content-section-title svg {
  color: #5B2096;
}

.content-section-description {
  margin: 0;
  color: rgba(245, 247, 250, 0.6);
  font-size: 0.875rem;
  line-height: 1.5;
}

.section-action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: rgba(245, 247, 250, 0.05);
  border: 1px solid rgba(91, 32, 150, 0.1);
  border-radius: 8px;
}

.section-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.section-count {
  color: rgba(245, 247, 250, 0.7);
  font-size: 0.875rem;
  font-weight: 500;
}

/* Empty State Card */
.empty-state-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
  text-align: center;
  background: rgba(245, 247, 250, 0.02);
  border: 2px dashed rgba(91, 32, 150, 0.2);
  border-radius: 12px;
}

.empty-state-icon {
  color: rgba(91, 32, 150, 0.4);
  margin-bottom: 1rem;
}

.empty-state-title {
  margin: 0 0 0.5rem 0;
  color: #F5F7FA;
  font-size: 1.125rem;
  font-weight: 600;
}

.empty-state-description {
  margin: 0 0 1rem 0;
  color: rgba(245, 247, 250, 0.6);
  font-size: 0.875rem;
  max-width: 400px;
}

/* Client Logos Grid */
.client-logos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.client-logo-card {
  background: rgba(245, 247, 250, 0.05);
  border: 1px solid rgba(91, 32, 150, 0.2);
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.2s;
}

.client-logo-card:hover {
  border-color: rgba(91, 32, 150, 0.4);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(91, 32, 150, 0.1);
}

.client-logo-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(91, 32, 150, 0.1);
}

.client-logo-card-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: rgba(91, 32, 150, 0.2);
  border-radius: 6px;
  color: #C19DE6;
  font-weight: 600;
  font-size: 0.875rem;
}

.client-logo-preview {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1rem;
  padding: 1rem;
  background: rgba(245, 247, 250, 0.05);
  border-radius: 8px;
  min-height: 120px;
}

.client-logo-preview-img {
  max-width: 100%;
  max-height: 100px;
  object-fit: contain;
}

.client-logo-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Testimonials Grid */
.testimonials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 1.5rem;
}

.testimonial-card {
  background: rgba(245, 247, 250, 0.05);
  border: 1px solid rgba(91, 32, 150, 0.2);
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.2s;
}

.testimonial-card:hover {
  border-color: rgba(91, 32, 150, 0.4);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(91, 32, 150, 0.1);
}

.testimonial-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(91, 32, 150, 0.1);
}

.testimonial-card-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: rgba(91, 32, 150, 0.2);
  border-radius: 6px;
  color: #C19DE6;
  font-weight: 600;
  font-size: 0.875rem;
}

.testimonial-card-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.testimonial-preview-section {
  padding: 1rem;
  background: rgba(245, 247, 250, 0.05);
  border-radius: 8px;
  border: 1px solid rgba(91, 32, 150, 0.1);
}

.testimonial-preview-photo {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 0.75rem;
  border: 2px solid rgba(91, 32, 150, 0.3);
}

.testimonial-preview-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.testimonial-preview-info {
  margin-bottom: 0.75rem;
}

.testimonial-preview-name {
  color: #F5F7FA;
  font-weight: 600;
  font-size: 0.95rem;
  margin-bottom: 0.25rem;
}

.testimonial-preview-subtitle {
  color: rgba(245, 247, 250, 0.6);
  font-size: 0.8rem;
  margin-bottom: 0.5rem;
}

.testimonial-preview-stars {
  display: flex;
  gap: 0.25rem;
  margin-bottom: 0.75rem;
}

.testimonial-preview-stars .star {
  color: rgba(245, 247, 250, 0.3);
  font-size: 1rem;
}

.testimonial-preview-stars .star.star-filled {
  color: #ffc107;
}

.testimonial-preview-review {
  color: rgba(245, 247, 250, 0.8);
  font-size: 0.875rem;
  line-height: 1.6;
  font-style: italic;
}

.testimonial-form-section {
  border-top: 1px solid rgba(91, 32, 150, 0.1);
  padding-top: 1rem;
}

/* Testimonials Manager Styles */
.testimonials-manager {
  margin-top: 0;
}

.testimonials-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.testimonial-editor-card {
  padding: 1.5rem;
  background: rgba(245, 247, 250, 0.05);
  border: 1px solid rgba(91, 32, 150, 0.2);
  border-radius: 12px;
}

.testimonial-editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(91, 32, 150, 0.2);
}

.testimonial-editor-header h5 {
  margin: 0;
  color: #F5F7FA;
  font-size: 1.1rem;
  font-weight: 600;
}

/* Photo Upload Styles */
.photo-upload-section {
  margin-top: 0.5rem;
}

.photo-options {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1rem;
}

.photo-option-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: rgba(245, 247, 250, 0.8);
  font-size: 0.9rem;
  cursor: pointer;
}

.photo-option-label input[type="radio"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #5B2096;
}

.photo-upload-area {
  margin-top: 0.5rem;
}

.photo-file-input {
  display: none;
}

.photo-upload-label {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1.5rem;
  border: 2px dashed rgba(91, 32, 150, 0.3);
  border-radius: 8px;
  background: rgba(91, 32, 150, 0.05);
  color: rgba(245, 247, 250, 0.7);
  cursor: pointer;
  transition: all 0.2s;
  min-height: 100px;
}

.photo-upload-label:hover:not(.uploading) {
  border-color: rgba(91, 32, 150, 0.5);
  background: rgba(91, 32, 150, 0.1);
}

.photo-upload-label.uploading {
  border-color: rgba(91, 32, 150, 0.6);
  background: rgba(91, 32, 150, 0.15);
  cursor: wait;
  opacity: 0.8;
}

.photo-upload-label svg {
  color: #5B2096;
}

.upload-spinner {
  width: 24px;
  height: 24px;
  border: 3px solid rgba(91, 32, 150, 0.2);
  border-top-color: #5B2096;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.upload-progress-bar {
  width: 100%;
  height: 6px;
  background: rgba(91, 32, 150, 0.2);
  border-radius: 3px;
  overflow: hidden;
  margin-top: 0.5rem;
}

.upload-progress-fill {
  height: 100%;
  background: linear-gradient(103deg, #5B2096 0.52%, #C19DE6 125.79%);
  border-radius: 3px;
  transition: width 0.3s ease;
}

.photo-preview {
  margin-top: 1rem;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
}

.photo-preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.photo-preview-img {
  width: 100%;
  max-width: 200px;
  height: auto;
  border-radius: 8px;
  object-fit: cover;
}

.image-type-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  background: rgba(91, 32, 150, 0.2);
  border: 1px solid rgba(91, 32, 150, 0.4);
  border-radius: 12px;
  color: #C19DE6;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.testimonial-video-section {
  margin-top: 0.5rem;
}

/* Real Results Manager Styles */
.real-results-manager {
  margin-top: 0;
}

.real-results-cases-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(450px, 1fr));
  gap: 1.5rem;
}

.real-results-case-card {
  background: rgba(245, 247, 250, 0.05);
  border: 1px solid rgba(91, 32, 150, 0.2);
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.2s;
}

.real-results-case-card:hover {
  border-color: rgba(91, 32, 150, 0.4);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(91, 32, 150, 0.1);
}

.case-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(91, 32, 150, 0.1);
}

.case-card-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: rgba(91, 32, 150, 0.2);
  border-radius: 8px;
  color: #C19DE6;
  font-weight: 600;
  font-size: 0.875rem;
}

.case-card-preview {
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: rgba(245, 247, 250, 0.05);
  border: 1px solid rgba(91, 32, 150, 0.1);
  border-radius: 8px;
}

.case-preview-logo {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
}

.case-preview-logo img {
  max-width: 150px;
  max-height: 80px;
  object-fit: contain;
}

.case-preview-headline {
  color: #F5F7FA;
  font-size: 1.125rem;
  font-weight: 600;
  text-align: center;
  margin-bottom: 1rem;
  padding: 0.75rem;
  background: rgba(91, 32, 150, 0.1);
  border-radius: 6px;
}

.case-preview-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: center;
}

.case-preview-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.75rem;
  background: rgba(91, 32, 150, 0.1);
  border: 1px solid rgba(91, 32, 150, 0.2);
  border-radius: 6px;
  min-width: 120px;
}

.preview-card-title {
  font-size: 0.75rem;
  color: rgba(245, 247, 250, 0.7);
  margin-bottom: 0.25rem;
  text-align: center;
}

.preview-card-metric {
  font-size: 1.25rem;
  font-weight: 700;
  color: #C19DE6;
  margin-bottom: 0.25rem;
}

.preview-card-subtitle {
  font-size: 0.7rem;
  color: rgba(245, 247, 250, 0.6);
  text-align: center;
}

.case-card-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.result-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}

.result-card-item {
  background: rgba(245, 247, 250, 0.03);
  border: 1px solid rgba(91, 32, 150, 0.15);
  border-radius: 10px;
  padding: 1.25rem;
  transition: all 0.2s;
}

.result-card-item:hover {
  border-color: rgba(91, 32, 150, 0.3);
  background: rgba(245, 247, 250, 0.05);
}

.result-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid rgba(91, 32, 150, 0.1);
}

.result-card-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: rgba(91, 32, 150, 0.2);
  border-radius: 6px;
  color: #C19DE6;
  font-weight: 600;
  font-size: 0.75rem;
}

.empty-state-small-card {
  padding: 1.5rem;
  text-align: center;
  background: rgba(245, 247, 250, 0.02);
  border: 1px dashed rgba(91, 32, 150, 0.2);
  border-radius: 8px;
}

.empty-state-small-text {
  margin: 0;
  color: rgba(245, 247, 250, 0.5);
  font-size: 0.875rem;
}

.real-results-cards-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.real-results-card-editor {
  padding: 1.5rem;
  background: rgba(245, 247, 250, 0.05);
  border: 1px solid rgba(91, 32, 150, 0.2);
  border-radius: 12px;
}

.card-editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(91, 32, 150, 0.2);
}

.card-editor-header h5 {
  margin: 0;
  color: #F5F7FA;
  font-size: 1.1rem;
  font-weight: 600;
}

/* Multiple Images Manager Styles */
.multiple-images-manager {
  margin-top: 0.5rem;
}

.empty-state-small {
  padding: 1rem;
  text-align: center;
  color: rgba(245, 247, 250, 0.5);
  font-size: 0.875rem;
  background: rgba(91, 32, 150, 0.05);
  border-radius: 8px;
  border: 1px dashed rgba(91, 32, 150, 0.3);
}

.hover-images-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.hover-image-item {
  padding: 1rem;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(91, 32, 150, 0.2);
  border-radius: 8px;
}

.image-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.image-item-number {
  color: rgba(245, 247, 250, 0.7);
  font-size: 0.875rem;
  font-weight: 500;
}

/* Team Management Styles */
.team-grid-admin {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.team-member-card-admin {
  background: rgba(245, 247, 250, 0.05);
  border: 1px solid rgba(91, 32, 150, 0.2);
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.2s;
}

.team-member-card-admin:hover {
  border-color: rgba(91, 32, 150, 0.4);
}

.team-member-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(91, 32, 150, 0.1);
}

.team-member-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: rgba(91, 32, 150, 0.2);
  border-radius: 6px;
  color: #C19DE6;
  font-weight: 600;
  font-size: 0.875rem;
}

.reorder-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-right: 0.5rem;
}

.btn-icon-reorder {
  padding: 0.375rem;
  background: rgba(91, 32, 150, 0.15);
  border: 1px solid rgba(91, 32, 150, 0.3);
  color: rgba(245, 247, 250, 0.7);
  transition: all 0.2s ease;
  cursor: pointer;
}

.btn-icon-reorder:hover:not(:disabled) {
  background: rgba(91, 32, 150, 0.25);
  border-color: rgba(91, 32, 150, 0.4);
  color: rgba(245, 247, 250, 0.9);
  transform: translateY(-1px);
}

.btn-icon-reorder:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.btn-icon-reorder:active:not(:disabled) {
  transform: translateY(0);
}

.team-member-actions {
  display: flex;
  gap: 0.5rem;
}

.team-member-preview {
  text-align: center;
}

.member-photo-preview {
  width: 120px;
  height: 120px;
  margin: 0 auto 1rem;
  border-radius: 50%;
  overflow: hidden;
  background: rgba(91, 32, 150, 0.1);
  border: 2px solid rgba(91, 32, 150, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
}

.member-photo-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.member-photo-placeholder-small {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(245, 247, 250, 0.5);
}

.member-name-preview {
  font-size: 1.125rem;
  font-weight: 600;
  color: #F5F7FA;
  margin-bottom: 0.5rem;
}

.member-role-preview {
  font-size: 0.95rem;
  color: rgba(245, 247, 250, 0.7);
  margin: 0;
}

.edit-team-member-form {
  margin-top: 1rem;
}

/* FAQ Management Styles */
.faq-list-admin {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1.5rem;
}

.faq-item-admin {
  background: rgba(245, 247, 250, 0.05);
  border: 1px solid rgba(91, 32, 150, 0.2);
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.2s;
}

.faq-item-admin:hover {
  border-color: rgba(91, 32, 150, 0.4);
}

/* Stat Cards Styles */
.why-choose-features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.why-choose-feature-card {
  background: rgba(245, 247, 250, 0.05);
  border: 1px solid rgba(91, 32, 150, 0.2);
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.3s ease;
}

.why-choose-feature-card:hover {
  border-color: rgba(91, 32, 150, 0.4);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(91, 32, 150, 0.2);
}

.why-choose-feature-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.why-choose-feature-number {
  background: rgba(91, 32, 150, 0.2);
  color: #C19DE6;
  font-size: 0.875rem;
  font-weight: 600;
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
}

.why-choose-feature-actions {
  display: flex;
  gap: 0.5rem;
}

.why-choose-feature-preview {
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.why-choose-feature-icon-preview {
  display: flex;
  align-items: center;
  margin-bottom: 0.25rem;
}

.why-choose-icon-preview-circle {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(193, 157, 230, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.why-choose-icon-preview-circle svg {
  width: 24px;
  height: 24px;
}

.why-choose-feature-preview-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #F5F7FA;
  margin: 0;
  line-height: 1.4;
}

.why-choose-feature-preview-description {
  font-size: 0.95rem;
  color: rgba(245, 247, 250, 0.7);
  line-height: 1.6;
  margin: 0;
}

.edit-why-choose-feature-form {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(91, 32, 150, 0.2);
}

.stat-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.stat-card-item {
  background: rgba(245, 247, 250, 0.05);
  border: 1px solid rgba(91, 32, 150, 0.2);
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.2s;
}

.stat-card-item:hover {
  border-color: rgba(91, 32, 150, 0.4);
}

.stat-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(91, 32, 150, 0.1);
}

.stat-card-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: rgba(91, 32, 150, 0.2);
  border-radius: 6px;
  color: #C19DE6;
  font-weight: 600;
  font-size: 0.875rem;
}

.stat-card-actions {
  display: flex;
  gap: 0.5rem;
}

.stat-card-preview {
  text-align: center;
}

.stat-card-title {
  font-size: 0.95rem;
  color: rgba(245, 247, 250, 0.7);
  margin-bottom: 0.75rem;
  font-weight: 500;
}

.stat-card-value {
  font-size: 2.5rem;
  font-weight: 700;
  color: #5B2096;
  margin-bottom: 0.75rem;
  line-height: 1.2;
}

.stat-card-description {
  font-size: 0.875rem;
  color: rgba(245, 247, 250, 0.6);
  line-height: 1.5;
  margin: 0;
}

.edit-stat-card-form {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(91, 32, 150, 0.1);
}

.faq-preview {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.faq-preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid rgba(91, 32, 150, 0.1);
}

.faq-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: rgba(91, 32, 150, 0.2);
  border-radius: 6px;
  color: #C19DE6;
  font-weight: 600;
  font-size: 0.875rem;
}

.faq-actions {
  display: flex;
  gap: 0.5rem;
}

.faq-question-preview {
  font-size: 1.125rem;
  font-weight: 600;
  color: #F5F7FA;
  margin: 0;
}

.faq-answer-preview {
  font-size: 0.95rem;
  color: rgba(245, 247, 250, 0.7);
  margin: 0;
  line-height: 1.6;
}

.edit-faq-form {
  margin-top: 1rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

/* Legal Sections Styles */
.legal-sections-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
}

.legal-section-item {
  background: rgba(245, 247, 250, 0.05);
  border: 1px solid rgba(91, 32, 150, 0.2);
  border-radius: 12px;
  padding: 1.25rem;
  transition: all 0.2s;
}

.legal-section-item:hover {
  border-color: rgba(91, 32, 150, 0.4);
}

.legal-section-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.75rem;
}

.legal-section-number {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  height: 32px;
  background: rgba(91, 32, 150, 0.2);
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  color: #C19DE6;
}

.legal-section-title {
  flex: 1;
  font-size: 1rem;
  font-weight: 600;
  color: #F5F7FA;
}

.legal-section-actions {
  display: flex;
  gap: 0.5rem;
}

.legal-section-preview {
  font-size: 0.9rem;
  color: rgba(245, 247, 250, 0.6);
  line-height: 1.6;
  padding-left: 2.75rem;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: #1a1a2e;
  border: 1px solid rgba(91, 32, 150, 0.3);
  border-radius: 16px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid rgba(91, 32, 150, 0.2);
}

.modal-header h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #F5F7FA;
  margin: 0;
}

.modal-close {
  background: transparent;
  border: none;
  color: rgba(245, 247, 250, 0.6);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.2s;
}

.modal-close:hover {
  background: rgba(245, 247, 250, 0.1);
  color: #F5F7FA;
}

.modal-body {
  padding: 1.5rem;
}

.modal-body .form-group {
  margin-bottom: 1.5rem;
}

.modal-body .form-group:last-child {
  margin-bottom: 0;
}

.modal-footer {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  padding: 1.5rem;
  border-top: 1px solid rgba(91, 32, 150, 0.2);
}

/* Permissions Section Styles */
.permissions-section {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(91, 32, 150, 0.2);
}

.permissions-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  color: #F5F7FA;
  margin: 0 0 0.5rem 0;
}

.permissions-title svg {
  color: #C19DE6;
}

.permissions-description {
  font-size: 0.875rem;
  color: rgba(245, 247, 250, 0.6);
  margin: 0 0 1.25rem 0;
}

.permissions-categories {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.permission-category {
  background: rgba(245, 247, 250, 0.03);
  border: 1px solid rgba(91, 32, 150, 0.15);
  border-radius: 12px;
  padding: 1rem;
}

.category-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid rgba(91, 32, 150, 0.1);
}

.category-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: #C19DE6;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.category-actions {
  display: flex;
  gap: 0.5rem;
}

.category-btn {
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  background: rgba(91, 32, 150, 0.2);
  border: 1px solid rgba(91, 32, 150, 0.3);
  border-radius: 4px;
  color: rgba(245, 247, 250, 0.7);
  cursor: pointer;
  transition: all 0.2s;
}

.category-btn:hover {
  background: rgba(91, 32, 150, 0.3);
  color: #F5F7FA;
}

.category-btn.active {
  background: rgba(91, 32, 150, 0.4);
  border-color: #5B2096;
  color: #F5F7FA;
}

/* Booking Cards */
.bookings-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.booking-card {
  background: rgba(245, 247, 250, 0.03);
  border: 1px solid rgba(91, 32, 150, 0.2);
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.3s ease;
}

.booking-card:hover {
  border-color: rgba(91, 32, 150, 0.4);
  background: rgba(245, 247, 250, 0.05);
}

.booking-card-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1.5rem;
}

.booking-info {
  flex: 1;
}

.booking-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.booking-user-name {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #F5F7FA;
}

.booking-status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-pending {
  background: rgba(255, 193, 7, 0.2);
  color: #ffc107;
  border: 1px solid rgba(255, 193, 7, 0.3);
}

.status-confirmed {
  background: rgba(40, 167, 69, 0.2);
  color: #28a745;
  border: 1px solid rgba(40, 167, 69, 0.3);
}

.status-cancelled {
  background: rgba(220, 53, 69, 0.2);
  color: #dc3545;
  border: 1px solid rgba(220, 53, 69, 0.3);
}

.status-completed {
  background: rgba(108, 117, 125, 0.2);
  color: #6c757d;
  border: 1px solid rgba(108, 117, 125, 0.3);
}

.booking-details {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.booking-detail-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: rgba(245, 247, 250, 0.7);
  font-size: 0.9rem;
}

.booking-detail-item svg {
  width: 16px;
  height: 16px;
  color: rgba(193, 157, 230, 0.7);
  flex-shrink: 0;
}

.meeting-link {
  color: #C19DE6;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: color 0.2s ease;
}

.meeting-link:hover {
  color: #F5F7FA;
}

.booking-notes {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(91, 32, 150, 0.2);
  color: rgba(245, 247, 250, 0.7);
  font-size: 0.9rem;
}

.booking-notes strong {
  color: #F5F7FA;
}

.booking-actions {
  display: flex;
  gap: 0.5rem;
}

.booking-edit-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.booking-edit-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  padding-top: 1rem;
  border-top: 1px solid rgba(91, 32, 150, 0.2);
}

/* View Toggle */
.view-toggle {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(91, 32, 150, 0.2);
}

.view-toggle-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(245, 247, 250, 0.05);
  border: 1px solid rgba(91, 32, 150, 0.3);
  border-radius: 8px;
  color: rgba(245, 247, 250, 0.7);
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.view-toggle-btn:hover {
  background: rgba(91, 32, 150, 0.1);
  border-color: rgba(91, 32, 150, 0.5);
  color: #F5F7FA;
}

.view-toggle-btn.active {
  background: linear-gradient(103deg, #5B2096 0.52%, #C19DE6 125.79%);
  border-color: rgba(193, 157, 230, 0.5);
  color: #F5F7FA;
}

/* Calendar View */
.calendar-view-container {
  padding: 1rem;
}

.calendar-header-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.calendar-header-controls h4 {
  margin: 0;
  color: #F5F7FA;
  font-size: 1.25rem;
  font-weight: 600;
}

.calendar-nav-btn {
  background: rgba(91, 32, 150, 0.2);
  border: 1px solid rgba(91, 32, 150, 0.3);
  border-radius: 8px;
  color: #F5F7FA;
  padding: 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.calendar-nav-btn:hover {
  background: rgba(91, 32, 150, 0.3);
  border-color: rgba(91, 32, 150, 0.5);
}

.admin-calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5rem;
  margin-bottom: 2rem;
}

.admin-calendar-day {
  aspect-ratio: 1;
  background: rgba(245, 247, 250, 0.03);
  border: 1px solid rgba(91, 32, 150, 0.2);
  border-radius: 8px;
  padding: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
}

.admin-calendar-day:hover {
  border-color: rgba(91, 32, 150, 0.4);
  background: rgba(245, 247, 250, 0.05);
}

.admin-calendar-day.other-month {
  opacity: 0.3;
  cursor: not-allowed;
}

.admin-calendar-day.today {
  border-color: rgba(193, 157, 230, 0.5);
  background: rgba(193, 157, 230, 0.1);
}

.admin-calendar-day.has-booking {
  border-color: rgba(40, 167, 69, 0.5);
}

.admin-calendar-day.selected {
  border-color: rgba(193, 157, 230, 0.8);
  background: rgba(193, 157, 230, 0.2);
  box-shadow: 0 0 0 2px rgba(193, 157, 230, 0.3);
}

.calendar-day-number {
  font-size: 0.9rem;
  font-weight: 600;
  color: #F5F7FA;
  margin-bottom: 0.25rem;
}

.calendar-day-bookings {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  justify-content: center;
  width: 100%;
}

.calendar-booking-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}

.calendar-booking-dot.status-pending {
  background: #ffc107;
}

.calendar-booking-dot.status-confirmed {
  background: #28a745;
}

.calendar-booking-dot.status-cancelled {
  background: #dc3545;
}

.calendar-booking-dot.status-completed {
  background: #6c757d;
}

.selected-date-bookings {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(91, 32, 150, 0.2);
}

.selected-date-bookings h5 {
  margin: 0 0 1rem 0;
  color: #F5F7FA;
  font-size: 1.125rem;
}

.date-bookings-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.date-booking-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1rem;
  background: rgba(245, 247, 250, 0.05);
  border: 1px solid rgba(91, 32, 150, 0.2);
  border-radius: 8px;
}

.booking-time {
  font-weight: 600;
  color: #C19DE6;
  min-width: 80px;
}

.booking-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.booking-info strong {
  color: #F5F7FA;
}

.booking-email {
  font-size: 0.85rem;
  color: rgba(245, 247, 250, 0.6);
}

/* Availability Management */
.availability-management {
  padding: 1rem;
}

.availability-header {
  margin-bottom: 2rem;
}

.availability-header h4 {
  margin: 0 0 0.5rem 0;
  color: #F5F7FA;
  font-size: 1.25rem;
}

.availability-calendar-container {
  margin-top: 1.5rem;
}

.select-date-message {
  text-align: center;
  padding: 3rem 1rem;
  color: rgba(245, 247, 250, 0.6);
  font-style: italic;
}

.availability-date-controls {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(91, 32, 150, 0.2);
}

.availability-date-controls h5 {
  margin: 0 0 1rem 0;
  color: #F5F7FA;
  font-size: 1.125rem;
}

.time-slots-management {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 0.75rem;
}

.time-slot-control {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  background: rgba(245, 247, 250, 0.05);
  border: 1px solid rgba(91, 32, 150, 0.2);
  border-radius: 8px;
  transition: all 0.2s ease;
}

.time-slot-control.blocked {
  background: rgba(220, 53, 69, 0.1);
  border-color: rgba(220, 53, 69, 0.3);
}

.time-slot-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.time-slot-time {
  font-weight: 600;
  color: #F5F7FA;
}

.blocked-reason {
  font-size: 0.75rem;
  color: rgba(245, 247, 250, 0.5);
  font-style: italic;
}

.btn-toggle {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: all 0.2s ease;
}

.btn-block {
  background: rgba(220, 53, 69, 0.2);
  color: #dc3545;
  border: 1px solid rgba(220, 53, 69, 0.3);
}

.btn-block:hover {
  background: rgba(220, 53, 69, 0.3);
  border-color: rgba(220, 53, 69, 0.5);
}

.btn-unblock {
  background: rgba(40, 167, 69, 0.2);
  color: #28a745;
  border: 1px solid rgba(40, 167, 69, 0.3);
}

.btn-unblock:hover {
  background: rgba(40, 167, 69, 0.3);
  border-color: rgba(40, 167, 69, 0.5);
}

/* Reminder Section */
.section-header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.reminder-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(255, 193, 7, 0.15);
  border: 1px solid rgba(255, 193, 7, 0.3);
  border-radius: 8px;
  color: #ffc107;
  font-size: 0.9rem;
  font-weight: 600;
}

.reminder-section {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: rgba(255, 193, 7, 0.05);
  border: 1px solid rgba(255, 193, 7, 0.2);
  border-radius: 12px;
}

.reminder-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  color: #ffc107;
}

.reminder-header h4 {
  margin: 0;
  color: #ffc107;
  font-size: 1.125rem;
}

.reminder-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.reminder-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(245, 247, 250, 0.05);
  border: 1px solid rgba(91, 32, 150, 0.2);
  border-radius: 8px;
  transition: all 0.2s ease;
}

.reminder-item:hover {
  border-color: rgba(255, 193, 7, 0.4);
  background: rgba(255, 193, 7, 0.05);
}

.reminder-time {
  font-weight: 600;
  color: #ffc107;
  min-width: 200px;
}

.reminder-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.reminder-info strong {
  color: #F5F7FA;
}

.reminder-info span {
  font-size: 0.85rem;
  color: rgba(245, 247, 250, 0.6);
}

.btn-icon-small {
  background: transparent;
  border: 1px solid rgba(91, 32, 150, 0.3);
  border-radius: 6px;
  color: rgba(245, 247, 250, 0.7);
  padding: 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.btn-icon-small:hover {
  background: rgba(91, 32, 150, 0.2);
  border-color: rgba(91, 32, 150, 0.5);
  color: #F5F7FA;
}

.permission-checkboxes {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 0.5rem;
}

.permission-checkbox {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: rgba(245, 247, 250, 0.02);
  border: 1px solid rgba(91, 32, 150, 0.1);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.permission-checkbox:hover {
  background: rgba(91, 32, 150, 0.1);
  border-color: rgba(91, 32, 150, 0.3);
}

.permission-checkbox.checked {
  background: rgba(91, 32, 150, 0.15);
  border-color: rgba(91, 32, 150, 0.4);
}

.permission-checkbox input[type="checkbox"] {
  display: none;
}

.checkbox-custom {
  width: 18px;
  height: 18px;
  min-width: 18px;
  border: 2px solid rgba(91, 32, 150, 0.4);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.permission-checkbox.checked .checkbox-custom {
  background: linear-gradient(135deg, #5B2096, #7B3DB8);
  border-color: #5B2096;
}

.permission-checkbox.checked .checkbox-custom::after {
  content: '';
  width: 5px;
  height: 9px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
  margin-bottom: 2px;
}

.checkbox-label {
  font-size: 0.875rem;
  color: rgba(245, 247, 250, 0.85);
  line-height: 1.3;
}

.selected-permissions-count {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(91, 32, 150, 0.1);
  font-size: 0.875rem;
  color: rgba(245, 247, 250, 0.7);
}

.count-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  height: 24px;
  padding: 0 0.5rem;
  background: linear-gradient(135deg, #5B2096, #7B3DB8);
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  color: #F5F7FA;
}

/* Role Card Improvements */
.role-card {
  background: rgba(245, 247, 250, 0.03);
  border: 1px solid rgba(91, 32, 150, 0.2);
  border-radius: 12px;
  padding: 1.25rem;
  margin-bottom: 1rem;
  transition: all 0.2s;
}

.role-card:hover {
  border-color: rgba(91, 32, 150, 0.4);
}

.role-card-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
}

.role-info {
  flex: 1;
}

.role-header {
  margin-bottom: 0.75rem;
}

.role-name {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: #F5F7FA;
  margin: 0 0 0.25rem 0;
}

.role-badge {
  font-size: 0.65rem;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.admin-badge {
  background: rgba(239, 68, 68, 0.2);
  color: #f87171;
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.user-badge {
  background: rgba(59, 130, 246, 0.2);
  color: #60a5fa;
  border: 1px solid rgba(59, 130, 246, 0.3);
}

.role-description {
  font-size: 0.9rem;
  color: rgba(245, 247, 250, 0.6);
  margin: 0;
}

.role-permissions {
  margin-top: 0.75rem;
}

.permissions-label {
  display: block;
  font-size: 0.75rem;
  color: rgba(245, 247, 250, 0.5);
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.permission-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
}

.permission-badge {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  background: rgba(91, 32, 150, 0.2);
  border: 1px solid rgba(91, 32, 150, 0.3);
  border-radius: 4px;
  color: rgba(245, 247, 250, 0.85);
}

.permission-badge.more-badge {
  background: rgba(245, 247, 250, 0.1);
  border-color: rgba(245, 247, 250, 0.2);
  color: rgba(245, 247, 250, 0.7);
  cursor: help;
}

.role-no-permissions {
  margin-top: 0.75rem;
  font-size: 0.85rem;
  color: rgba(245, 247, 250, 0.4);
  font-style: italic;
}

.role-actions {
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
}

.role-edit-form {
  padding-top: 0.5rem;
}

.role-edit-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(91, 32, 150, 0.2);
}

/* Empty state for roles */
.roles-list .empty-state {
  text-align: center;
  padding: 2rem;
  color: rgba(245, 247, 250, 0.5);
}

/* Info banner */
.info-banner {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 10px;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
  color: rgba(245, 247, 250, 0.85);
  line-height: 1.5;
}

.info-banner svg {
  color: #60a5fa;
  flex-shrink: 0;
  margin-top: 2px;
}

.info-banner strong {
  color: #60a5fa;
}

/* Role permissions hint in user form */
.role-permissions-hint {
  margin-top: 0.5rem;
  font-size: 0.8rem;
  color: rgba(245, 247, 250, 0.6);
  line-height: 1.4;
}

.role-permissions-hint .hint-label {
  color: #C19DE6;
  font-weight: 500;
}

/* User role badge improvements */
.user-role-badge {
  display: inline-block;
  padding: 0.25rem 0.6rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: capitalize;
  margin-top: 0.5rem;
}

.user-role-badge.role-admin {
  background: rgba(239, 68, 68, 0.2);
  color: #f87171;
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.user-role-badge.role-user {
  background: rgba(59, 130, 246, 0.2);
  color: #60a5fa;
  border: 1px solid rgba(59, 130, 246, 0.3);
}

.user-role-badge:not(.role-admin):not(.role-user) {
  background: rgba(91, 32, 150, 0.2);
  color: #C19DE6;
  border: 1px solid rgba(91, 32, 150, 0.3);
}

@media (max-width: 768px) {
  .permission-checkboxes {
    grid-template-columns: 1fr;
  }
  
  .category-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .role-card-content {
    flex-direction: column;
  }
  
  .role-actions {
    width: 100%;
    justify-content: flex-end;
  }
  
  /* Booking Section Responsive */
  .bookings-list {
    gap: 0.75rem;
  }
  
  .booking-card {
    padding: 1rem;
  }
  
  .booking-card-content {
    flex-direction: column;
    gap: 1rem;
  }
  
  .booking-actions {
    width: 100%;
    justify-content: flex-end;
    flex-wrap: wrap;
  }
  
  .view-toggle {
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  
  .view-toggle-btn {
    flex: 1;
    min-width: 120px;
    justify-content: center;
  }
  
  .calendar-header-controls {
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  
  .calendar-header-controls h4 {
    font-size: 1rem;
    width: 100%;
    text-align: center;
  }
  
  .admin-calendar-grid {
    gap: 0.25rem;
  }
  
  .admin-calendar-day {
    padding: 0.25rem;
    font-size: 0.75rem;
    min-height: 40px;
  }
  
  .calendar-day-header {
    font-size: 0.7rem;
    padding: 0.25rem;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .booking-edit-actions {
    flex-direction: column;
  }
  
  .booking-edit-actions button {
    width: 100%;
  }
  
  .time-slots-management {
    gap: 0.75rem;
  }
  
  .time-slot-control {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .time-slot-control .btn-toggle {
    width: 100%;
  }
  
  .availability-calendar-container {
    margin-top: 1rem;
  }
  
  .reminder-section {
    padding: 1rem;
  }
  
  .upcoming-bookings-list {
    gap: 0.5rem;
  }
  
  .upcoming-booking-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
    padding: 0.75rem;
  }
}

@media (max-width: 480px) {
  .admin-calendar-grid {
    gap: 0.2rem;
  }
  
  .admin-calendar-day {
    padding: 0.2rem;
    font-size: 0.7rem;
    min-height: 36px;
  }
  
  .calendar-day-header {
    font-size: 0.65rem;
    padding: 0.2rem;
  }
  
  .view-toggle-btn {
    min-width: 100px;
    font-size: 0.85rem;
    padding: 0.4rem 0.75rem;
  }
  
  .booking-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .booking-details {
    gap: 0.5rem;
  }
  
  .booking-detail-item {
    font-size: 0.85rem;
  }
  
  .calendar-header-controls h4 {
    font-size: 0.9rem;
  }
}

/* Analytics Styles */
.analytics-stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
}

.analytics-stats-grid .stat-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
}

.analytics-stats-grid .stat-icon {
  font-size: 2.5rem;
  line-height: 1;
}

.analytics-stats-grid .stat-content {
  flex: 1;
}

.analytics-stats-grid .stat-label {
  font-size: 0.875rem;
  color: rgba(245, 247, 250, 0.7);
  margin-bottom: 0.5rem;
}

.analytics-stats-grid .stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: #5B2096;
  line-height: 1.2;
}

.analytics-period-selector {
  display: flex;
  gap: 0.75rem;
  margin: 2rem 0;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid rgba(91, 32, 150, 0.2);
}

.period-btn {
  padding: 0.75rem 1.5rem;
  background: rgba(91, 32, 150, 0.1);
  border: 1px solid rgba(91, 32, 150, 0.2);
  border-radius: 8px;
  color: rgba(245, 247, 250, 0.8);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.period-btn:hover {
  background: rgba(91, 32, 150, 0.15);
  border-color: rgba(91, 32, 150, 0.3);
}

.period-btn.active {
  background: rgba(91, 32, 150, 0.2);
  border-color: #5B2096;
  color: #F5F7FA;
}

.analytics-charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 2rem;
  margin: 2rem 0;
}

.chart-card {
  background: rgba(245, 247, 250, 0.03);
  border: 1px solid rgba(91, 32, 150, 0.2);
  border-radius: 12px;
  padding: 1.5rem;
}

.chart-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #F5F7FA;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(91, 32, 150, 0.2);
}

.chart-wrapper {
  min-height: 300px;
}

.analytics-country-list {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(91, 32, 150, 0.2);
}

.section-subtitle {
  font-size: 1.125rem;
  font-weight: 600;
  color: #F5F7FA;
  margin-bottom: 1.5rem;
}

.country-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.country-item {
  display: grid;
  grid-template-columns: 40px 1fr auto 200px;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(245, 247, 250, 0.03);
  border: 1px solid rgba(91, 32, 150, 0.2);
  border-radius: 8px;
  transition: all 0.2s;
}

.country-item:hover {
  border-color: rgba(91, 32, 150, 0.4);
  background: rgba(245, 247, 250, 0.05);
}

.country-rank {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: rgba(91, 32, 150, 0.2);
  border-radius: 50%;
  font-weight: 700;
  color: #5B2096;
  font-size: 0.875rem;
}

.country-name {
  font-weight: 500;
  color: #F5F7FA;
}

.country-count {
  font-size: 0.875rem;
  color: rgba(245, 247, 250, 0.7);
  text-align: right;
}

.country-bar {
  height: 8px;
  background: rgba(91, 32, 150, 0.1);
  border-radius: 4px;
  overflow: hidden;
}

.country-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #5B2096, #8A2BE2);
  border-radius: 4px;
  transition: width 0.3s ease;
}

@media (max-width: 768px) {
  .analytics-stats-grid {
    grid-template-columns: 1fr;
  }
  
  .analytics-charts-grid {
    grid-template-columns: 1fr;
  }
  
  .country-item {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
  
  .country-rank {
    width: 28px;
    height: 28px;
    font-size: 0.75rem;
  }
  
  .country-count {
    text-align: left;
  }
  
  .country-bar {
    grid-column: 1 / -1;
  }
  
  .analytics-period-selector {
    flex-wrap: wrap;
  }
  
  .period-btn {
    flex: 1;
    min-width: 100px;
  }
  
  .selected-date-bookings {
    margin-top: 1rem;
    padding-top: 1rem;
  }
  
  .availability-date-controls {
    margin-top: 1rem;
    padding-top: 1rem;
  }
}

/* Maintenance Mode Styles */
.maintenance-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.maintenance-status-card {
  background: rgba(34, 197, 94, 0.1);
  border: 2px solid rgba(34, 197, 94, 0.3);
  border-radius: 12px;
  padding: 1.5rem;
}

.maintenance-status-card.active {
  background: rgba(239, 68, 68, 0.1);
  border-color: rgba(239, 68, 68, 0.3);
}

.status-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.status-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #22c55e;
  animation: pulse 2s ease-in-out infinite;
}

.status-indicator.active {
  background: #ef4444;
}

.status-header h4 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #F5F7FA;
}

.status-details {
  margin: 0;
  color: rgba(245, 247, 250, 0.7);
  font-size: 0.95rem;
}

.maintenance-actions {
  display: flex;
  gap: 1rem;
}

.btn-large {
  padding: 0.875rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-danger {
  background: #ef4444;
  color: white;
  border: none;
}

.btn-danger:hover:not(:disabled) {
  background: #dc2626;
}

.btn-success {
  background: #22c55e;
  color: white;
  border: none;
}

.btn-success:hover:not(:disabled) {
  background: #16a34a;
}

.pending-requests-section,
.maintenance-history-section {
  margin-top: 2rem;
}

.subsection-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #F5F7FA;
  margin-bottom: 1rem;
}

.requests-list,
.history-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.request-card,
.history-item {
  background: rgba(245, 247, 250, 0.05);
  border: 1px solid rgba(91, 32, 150, 0.2);
  border-radius: 8px;
  padding: 1.25rem;
}

.request-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.request-info h5 {
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: #F5F7FA;
}

.request-meta {
  margin: 0.25rem 0;
  font-size: 0.9rem;
  color: rgba(245, 247, 250, 0.6);
}

.request-message {
  margin: 0.5rem 0;
  padding: 0.75rem;
  background: rgba(91, 32, 150, 0.1);
  border-radius: 6px;
  color: rgba(245, 247, 250, 0.8);
  font-size: 0.9rem;
}

.request-time {
  font-size: 0.85rem;
  color: rgba(245, 247, 250, 0.5);
  margin-left: 0.5rem;
}

.request-status-badge {
  padding: 0.375rem 0.75rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
}

.request-status-badge.pending {
  background: rgba(251, 191, 36, 0.2);
  color: #fbbf24;
  border: 1px solid rgba(251, 191, 36, 0.3);
}

.request-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.history-type {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  margin-bottom: 0.5rem;
}

.history-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
}

.history-badge.turn_off {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
}

.history-badge.turn_on {
  background: rgba(34, 197, 94, 0.2);
  color: #22c55e;
}

.history-status {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
}

.history-status.active {
  background: rgba(34, 197, 94, 0.2);
  color: #22c55e;
}

.history-status.rejected {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
}

.history-meta {
  margin: 0;
  font-size: 0.9rem;
  color: rgba(245, 247, 250, 0.6);
}

.history-time {
  color: rgba(245, 247, 250, 0.5);
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>
