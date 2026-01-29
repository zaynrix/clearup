



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
            <h2>Admin Panel</h2>
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
          <div v-if="activeTab === 'hero'" class="editor-section">
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
          <div v-if="activeTab === 'cta'" class="editor-section">
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
          <div v-if="activeTab === 'who-we-are'" class="editor-section">
            <div class="section-header">
              <div class="section-title-group">
                <div class="section-icon">👥</div>
                <div>
                  <h3>Who We Are Section</h3>
                  <p class="section-description">Company introduction and key statistics</p>
                </div>
              </div>
            </div>
            
            <div class="form-grid">
              <div class="form-group full-width">
                <label>
                  <span class="label-text">Section Title</span>
                </label>
                <input v-model="formData.whoWeAreTitle" type="text" placeholder="Who We Are" class="form-input" />
              </div>
              
              <div class="form-group full-width">
                <label>
                  <span class="label-text">Description</span>
                </label>
                <textarea v-model="formData.whoWeAreDescription" rows="3" placeholder="We are your marketing growth partner." class="form-textarea"></textarea>
              </div>
            </div>

            <!-- Video Section -->
            <div class="subsection">
              <h4 class="subsection-title">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 10L19.553 7.276C19.8337 7.10733 20.1433 7.02267 20.482 7.022C20.8207 7.02133 21.1307 7.106 21.412 7.276C21.6933 7.446 21.904 7.68067 22.044 7.98C22.184 8.27933 22.254 8.61267 22.254 8.98V15.02C22.254 15.3873 22.184 15.7207 22.044 16.02C21.904 16.3193 21.6933 16.554 21.412 16.724C21.1307 16.894 20.8207 16.9787 20.482 16.978C20.1433 16.9773 19.8337 16.8927 19.553 16.724L15 14V10Z" stroke="#5B2096" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <rect x="2" y="6" width="13" height="12" rx="2" stroke="#5B2096" stroke-width="2"/>
                </svg>
                Video
              </h4>
              
              <div class="video-manager">
                <div class="video-options">
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
                  <label class="video-option-label">
                    <input 
                      type="radio" 
                      name="videoType" 
                      value="upload" 
                      v-model="formData.videoType"
                      @change="formData.videoUrl = ''"
                    />
                    <span>Upload Video File</span>
                  </label>
                </div>

                <!-- Video Link Input -->
                <div v-if="formData.videoType === 'link'" class="form-group full-width">
                  <label>
                    <span class="label-text">Video URL</span>
                    <span class="label-hint">YouTube, Vimeo, or direct video link</span>
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

                <!-- Video Upload -->
                <div v-if="formData.videoType === 'upload'" class="form-group full-width">
                  <label>
                    <span class="label-text">Video File</span>
                    <span class="label-hint">Upload MP4, WebM, or other video formats (max 100MB)</span>
                  </label>
                  <div class="video-upload-area">
                    <input 
                      type="file" 
                      accept="video/*" 
                      @change="handleVideoUpload"
                      ref="videoFileInput"
                      id="video-upload-input"
                      class="video-file-input"
                    />
                    <label for="video-upload-input" class="video-upload-label">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M14 2V8H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M12 18V12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M9 15L12 12L15 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                      <span v-if="!uploadingVideo">{{ selectedVideoFile ? selectedVideoFile.name : 'Choose video file or drag and drop' }}</span>
                      <span v-else>Uploading... {{ uploadProgress }}%</span>
                    </label>
                    <div v-if="formData.videoFileUrl" class="video-preview">
                      <p class="preview-label">Current Video:</p>
                      <video controls :src="formData.videoFileUrl" class="video-preview-player"></video>
                      <button @click="removeVideo" class="btn-danger" style="margin-top: 0.5rem; padding: 0.5rem 1rem;">
                        Remove Video
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="subsection">
              <h4 class="subsection-title">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 11L12 14L22 4" stroke="#5B2096" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M21 12V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16" stroke="#5B2096" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Statistics
              </h4>
              <div class="stats-editor">
                <div class="stat-card">
                  <div class="stat-header">
                    <div class="stat-icon">💰</div>
                    <h5>Revenue</h5>
                  </div>
                  <div class="stat-fields">
                    <input v-model="formData.stats.revenue.title" placeholder="Title" class="form-input" />
                    <input v-model="formData.stats.revenue.value" placeholder="Value (e.g., $4.7M)" class="form-input" />
                    <textarea v-model="formData.stats.revenue.description" placeholder="Description" rows="2" class="form-textarea"></textarea>
                  </div>
                </div>
                
                <div class="stat-card">
                  <div class="stat-header">
                    <div class="stat-icon">📊</div>
                    <h5>Leads</h5>
                  </div>
                  <div class="stat-fields">
                    <input v-model="formData.stats.leads.title" placeholder="Title" class="form-input" />
                    <input v-model="formData.stats.leads.value" placeholder="Value (e.g., 1.2M)" class="form-input" />
                    <textarea v-model="formData.stats.leads.description" placeholder="Description" rows="2" class="form-textarea"></textarea>
                  </div>
                </div>
                
                <div class="stat-card">
                  <div class="stat-header">
                    <div class="stat-icon">🌍</div>
                    <h5>Reach</h5>
                  </div>
                  <div class="stat-fields">
                    <input v-model="formData.stats.reach.title" placeholder="Title" class="form-input" />
                    <input v-model="formData.stats.reach.value" placeholder="Value (e.g., 28)" class="form-input" />
                    <textarea v-model="formData.stats.reach.description" placeholder="Description" rows="2" class="form-textarea"></textarea>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- System Section Editor -->
          <div v-if="activeTab === 'system'" class="editor-section">
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
          <div v-if="activeTab === 'services'" class="editor-section">
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
          <div v-if="activeTab === 'what-we-do'" class="editor-section">
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
              <h4 class="subsection-title">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 11L12 14L22 4" stroke="#5B2096" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M21 12V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16" stroke="#5B2096" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Process Steps
              </h4>
              <div class="steps-list">
                <div v-for="(step, index) in formData.steps" :key="index" class="step-card">
                  <div class="step-number">{{ step.number }}</div>
                  <textarea v-model="step.content" rows="2" :placeholder="`Step ${step.number} content`" class="form-textarea"></textarea>
                </div>
              </div>
            </div>
          </div>

          <!-- What You Get Editor -->
          <div v-if="activeTab === 'what-you-get'" class="editor-section">
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
              
              <div class="form-group full-width">
                <label>
                  <span class="label-text">Benefits</span>
                  <span class="label-hint">One benefit per line</span>
                </label>
                <textarea v-model="benefitsTextarea" rows="6" placeholder="Predictable leads&#10;Scalable system&#10;Higher customer lifetime value&#10;Increased conversions, sales" class="form-textarea"></textarea>
                <div class="input-footer">
                  <span class="char-count">{{ benefitsTextarea.split('\n').filter(l => l.trim()).length }} benefits</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Bonuses Editor -->
          <div v-if="activeTab === 'bonuses'" class="editor-section">
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
              
              <div class="form-group full-width">
                <label>
                  <span class="label-text">Bonuses</span>
                  <span class="label-hint">One bonus per line</span>
                </label>
                <textarea v-model="bonusesTextarea" rows="4" placeholder="Full access to personal brand course&#10;Full access to social media course&#10;Full access to business coaching" class="form-textarea"></textarea>
                <div class="input-footer">
                  <span class="char-count">{{ bonusesTextarea.split('\n').filter(l => l.trim()).length }} bonuses</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Clients & Testimonials Editor -->
          <div v-if="activeTab === 'clients'" class="editor-section">
            <div class="section-header">
              <div class="section-title-group">
                <div class="section-icon">💼</div>
                <div>
                  <h3>Clients & Testimonials</h3>
                  <p class="section-description">Social proof sections</p>
                </div>
              </div>
            </div>
            
            <div class="form-grid">
              <div class="form-group">
                <label>
                  <span class="label-text">Clients Title</span>
                </label>
                <input v-model="formData.clientsTitle" type="text" placeholder="Our Clients" class="form-input" />
              </div>
              
              <div class="form-group">
                <label>
                  <span class="label-text">Clients Subtitle</span>
                </label>
                <input v-model="formData.clientsSubtitle" type="text" placeholder="We work with leading brands and businesses." class="form-input" />
              </div>
              
              <div class="form-group">
                <label>
                  <span class="label-text">Testimonials Title</span>
                </label>
                <input v-model="formData.testimonialsTitle" type="text" placeholder="What Our Clients Say" class="form-input" />
              </div>
              
              <div class="form-group">
                <label>
                  <span class="label-text">Testimonials Subtitle</span>
                </label>
                <input v-model="formData.testimonialsSubtitle" type="text" placeholder="Read testimonials from clients who worked with us." class="form-input" />
              </div>
            </div>

            <!-- Testimonials Management -->
            <div class="subsection">
              <h4 class="subsection-title">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="#5B2096" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="#5B2096" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="#5B2096" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="#5B2096" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Manage Testimonials
              </h4>

              <div class="testimonials-manager">
                <button @click="addNewTestimonial" class="btn-primary" style="margin-bottom: 1.5rem;">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                  Add New Testimonial
                </button>

                <div v-if="formData.testimonials && formData.testimonials.length === 0" class="empty-state">
                  <p>No testimonials yet. Click "Add New Testimonial" to get started.</p>
                </div>

                <div v-else class="testimonials-list">
                  <div v-for="(testimonial, index) in formData.testimonials" :key="testimonial.id || index" class="testimonial-editor-card">
                    <div class="testimonial-editor-header">
                      <h5>Testimonial #{{ index + 1 }}</h5>
                      <button @click="removeTestimonial(index)" class="btn-danger" style="padding: 0.25rem 0.75rem; font-size: 0.875rem;">
                        Delete
                      </button>
                    </div>

                    <div class="form-grid">
                      <div class="form-group">
                        <label>
                          <span class="label-text">Name *</span>
                        </label>
                        <input v-model="testimonial.name" type="text" placeholder="John Doe" class="form-input" required />
                      </div>

                      <div class="form-group">
                        <label>
                          <span class="label-text">Star Rating *</span>
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
                        </label>
                        <textarea v-model="testimonial.review" rows="4" placeholder="Enter the review text..." class="form-textarea" required></textarea>
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
                              accept="image/*" 
                              @change="handlePhotoUpload($event, index)"
                              :id="`photo-upload-${index}`"
                              class="photo-file-input"
                            />
                            <label :for="`photo-upload-${index}`" class="photo-upload-label">
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M17 8L12 3L7 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M12 3V15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                              </svg>
                              <span>{{ testimonial.photoFileUrl ? 'Change Photo' : 'Choose photo file' }}</span>
                            </label>
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
                              accept="image/*" 
                              @change="handleVideoThumbnailUpload($event, index)"
                              :id="`video-thumbnail-upload-${index}`"
                              class="photo-file-input"
                            />
                            <label :for="`video-thumbnail-upload-${index}`" class="photo-upload-label">
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M17 8L12 3L7 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M12 3V15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                              </svg>
                              <span>{{ testimonial.videoThumbnailFileUrl ? 'Change Thumbnail' : 'Choose thumbnail image' }}</span>
                            </label>
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
                              accept="video/*" 
                              @change="handleTestimonialVideoUpload($event, index)"
                              :id="`testimonial-video-upload-${index}`"
                              class="video-file-input"
                            />
                            <label :for="`testimonial-video-upload-${index}`" class="video-upload-label">
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M14 2V8H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                              </svg>
                              <span>{{ testimonial.videoFileUrl ? 'Change Video' : 'Choose video file' }}</span>
                            </label>
                          </div>

                          <div v-if="(testimonial.videoUrl || testimonial.videoFileUrl) && testimonial.videoType !== 'none'" class="video-preview">
                            <div v-if="testimonial.videoType === 'link'" class="video-preview-container">
                              <iframe :src="getVideoEmbedUrl(testimonial.videoUrl || '')" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                            </div>
                            <video v-else-if="testimonial.videoType === 'upload'" :src="testimonial.videoFileUrl" controls class="video-preview-player"></video>
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
          <div v-if="activeTab === 'real-results'" class="editor-section">
            <div class="section-header">
              <div class="section-title-group">
                <div class="section-icon">📊</div>
                <div>
                  <h3>Real Results, Real Impact</h3>
                  <p class="section-description">Showcase measurable outcomes and results</p>
                </div>
              </div>
            </div>
            
            <div class="form-grid">
              <div class="form-group full-width">
                <label>
                  <span class="label-text">Section Title</span>
                </label>
                <input v-model="formData.realResultsTitle" type="text" placeholder="Real Results, Real Impact." class="form-input" />
              </div>
              
              <div class="form-group full-width">
                <label>
                  <span class="label-text">Subtitle</span>
                </label>
                <input v-model="formData.realResultsSubtitle" type="text" placeholder="We focus on measurable outcomes that help brands grow, scale, and stand out." class="form-input" />
              </div>
            </div>

            <!-- Real Results Cases Management -->
            <div class="subsection">
              <h4 class="subsection-title">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 11L12 14L22 4" stroke="#5B2096" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M21 12V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16" stroke="#5B2096" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Real Results Cases
              </h4>

              <div class="real-results-manager">
                <button @click="addNewRealResultsCase" class="btn-primary" style="margin-bottom: 1.5rem;">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                  Add New Case
                </button>

                <div v-if="!formData.realResultsCases || formData.realResultsCases.length === 0" class="empty-state">
                  <p>No cases yet. Click "Add New Case" to get started.</p>
                </div>

                <div v-else class="real-results-cases-list">
                  <div v-for="(resultCase, caseIndex) in formData.realResultsCases" :key="resultCase.id || caseIndex" class="real-results-case-editor">
                    <div class="case-editor-header">
                      <h5>Case #{{ caseIndex + 1 }}</h5>
                      <button @click="removeRealResultsCase(caseIndex)" class="btn-danger" style="padding: 0.25rem 0.75rem; font-size: 0.875rem;">
                        Delete Case
                      </button>
                    </div>

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

                      <!-- Small Cards -->
                      <div class="form-group full-width">
                        <label>
                          <span class="label-text">Small Cards</span>
                        </label>
                        
                        <div class="multiple-images-manager">
                          <button 
                            type="button"
                            @click="addCaseCard(caseIndex)" 
                            class="btn-secondary"
                            style="margin-bottom: 1rem; padding: 0.5rem 1rem;"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                            </svg>
                            Add Card
                          </button>

                          <div v-if="!resultCase.cards || resultCase.cards.length === 0" class="empty-state-small">
                            <p>No cards yet. Click "Add Card" to add cards.</p>
                          </div>

                          <div v-else class="real-results-cards-list">
                            <div v-for="(card, cardIndex) in resultCase.cards" :key="card.id || cardIndex" class="real-results-card-editor">
                              <div class="card-editor-header">
                                <h6>Card #{{ cardIndex + 1 }}</h6>
                                <button @click="removeCaseCard(caseIndex, cardIndex)" class="btn-danger" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;">
                                  Delete
                                </button>
                              </div>

                              <div class="form-grid">
                                <div class="form-group">
                                  <label>
                                    <span class="label-text">Title *</span>
                                  </label>
                                  <input v-model="card.title" type="text" placeholder="In revenue generated from Instagram" class="form-input" required />
                                </div>

                                <div class="form-group">
                                  <label>
                                    <span class="label-text">Metric *</span>
                                  </label>
                                  <input v-model="card.metric" type="text" placeholder="+380K" class="form-input" required />
                                </div>

                                <div class="form-group">
                                  <label>
                                    <span class="label-text">Subtitle *</span>
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
                        </label>
                        <input v-model="resultCase.ctaText" type="text" placeholder="Explore the Results" class="form-input" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer Editor -->
          <div v-if="activeTab === 'footer'" class="editor-section">
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

          <!-- User Management (Admin Only) -->
          <div v-if="activeTab === 'users' && isAdmin" class="editor-section">
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
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
              <button @click="createUser" :disabled="isAdminLoading" class="btn-primary" style="margin-top: 1rem;">
                Create User
              </button>
            </div>

            <!-- Users List -->
            <div class="admin-table-card">
              <h4>All Users</h4>
              <div v-if="isAdminLoading" class="loading-text">Loading users...</div>
              <table v-else class="admin-table">
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Name</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="u in users" :key="u.id">
                    <td>{{ u.email }}</td>
                    <td>{{ u.displayName || '-' }}</td>
                    <td>
                      <select 
                        :value="u.role" 
                        @change="updateUserRole(u.id, ($event.target as HTMLSelectElement).value)"
                        class="form-input"
                        style="width: auto; padding: 0.25rem 0.5rem;"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td>
                      <div style="display: flex; gap: 0.5rem; align-items: center;">
                        <button 
                          @click="resetUserPassword(u.email)" 
                          class="btn-warning"
                          style="padding: 0.25rem 0.75rem; font-size: 0.875rem;"
                          title="Send password reset email"
                        >
                          Reset Password
                        </button>
                        <button 
                          @click="deleteUser(u.id)" 
                          class="btn-danger"
                          style="padding: 0.25rem 0.75rem; font-size: 0.875rem;"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Role Management (Admin Only) -->
          <div v-if="activeTab === 'roles' && isAdmin" class="editor-section">
            <div class="section-header">
              <div class="section-title-group">
                <div class="section-icon">🔐</div>
                <div>
                  <h3>Role Management</h3>
                  <p class="section-description">Create and manage roles</p>
                </div>
              </div>
            </div>

            <!-- Create Role Form -->
            <div class="admin-form-card">
              <h4>Create New Role</h4>
              <div class="form-grid">
                <div class="form-group">
                  <label>Role Name</label>
                  <input v-model="newRoleForm.name" type="text" placeholder="editor" class="form-input" />
                </div>
                <div class="form-group full-width">
                  <label>Description</label>
                  <textarea v-model="newRoleForm.description" rows="2" placeholder="Role description" class="form-textarea"></textarea>
                </div>
              </div>
              <button @click="createRole" :disabled="isAdminLoading" class="btn-primary" style="margin-top: 1rem;">
                Create Role
              </button>
            </div>

            <!-- Roles List -->
            <div class="admin-table-card">
              <h4>All Roles</h4>
              <div v-if="isAdminLoading" class="loading-text">Loading roles...</div>
              <div v-else class="roles-list">
                <div v-for="role in roles" :key="role.id" class="role-card">
                  <div>
                    <h5>{{ role.name }}</h5>
                    <p>{{ role.description || 'No description' }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Site Settings (Admin Only) -->
          <div v-if="activeTab === 'site-settings' && isAdmin" class="editor-section">
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
              <div v-else class="sections-list">
                <div v-for="section in availableSections" :key="section.id" class="section-toggle-item">
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

          <!-- Activity Logs (Admin Only) -->
          <div v-if="activeTab === 'activity-logs' && isAdmin" class="editor-section">
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

          <!-- Fixed Action Bar -->
          <div class="action-bar" v-if="!['users', 'roles', 'site-settings', 'activity-logs'].includes(activeTab)">
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
                <button @click="resetContent" :disabled="isSaving" class="btn-secondary">
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '@/features/auth/services/AuthService'
import { storageService } from '@/shared/services'
import { AuthViewController } from '@/features/auth/controllers/AuthViewController'
import { homeContentController } from '@/features/home/controllers/HomeContentController'
import { adminUserController } from '../controllers/UserController'
import { adminUserService } from '../services/UserService'
import { roleController } from '../controllers/RoleController'
import { activityLogController } from '../controllers/ActivityLogController'
import { siteSettingsController } from '../controllers/SiteSettingsController'
import type { SiteSettings } from '../models/SiteSettings'
import type { HomeContent } from '@/features/home/models/HomeContent'
import type { User } from '@/features/auth/models/User'
import type { Role } from '../models/Role'
import type { ActivityLog } from '../models/ActivityLog'

const router = useRouter()
const userViewController = new AuthViewController()

const user = computed(() => userViewController.user)
const isLoading = ref(true)
const isSaving = ref(false)
const errorMessage = ref('')
const saveMessage = ref('')
const saveMessageType = ref<'success' | 'error'>('success')

const activeTab = ref('hero')
const isAdmin = ref(false)
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
  { id: 'footer', label: 'Footer' }
]
const adminTabs = [
  { id: 'users', label: 'User Management' },
  { id: 'roles', label: 'Role Management' },
  { id: 'site-settings', label: 'Site Settings' },
  { id: 'activity-logs', label: 'Activity Logs' }
]
const tabs = computed(() => {
  return isAdmin.value ? [...baseTabs, ...adminTabs] : baseTabs
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
const selectedVideoFile = ref<File | null>(null)
const uploadingVideo = ref(false)
const uploadProgress = ref(0)
const videoFileInput = ref<HTMLInputElement | null>(null)
const availableSections = [
  { id: 'hero', label: 'Hero Section' },
  { id: 'cta', label: 'CTA Section' },
  { id: 'social-proof', label: 'Social Proof' },
  { id: 'who-we-are', label: 'Who We Are' },
  { id: 'stats', label: 'Statistics' },
  { id: 'system', label: 'System Section' },
  { id: 'services', label: 'Services' },
  { id: 'what-we-do', label: 'What We Do' },
  { id: 'what-you-get', label: 'What You Get' },
  { id: 'bonuses', label: 'Bonuses' },
  { id: 'clients', label: 'Clients' },
  { id: 'real-results', label: 'Real Results' },
  { id: 'testimonials', label: 'Testimonials' },
  { id: 'footer', label: 'Footer' }
]
const newUserForm = ref({
  email: '',
  password: '',
  displayName: '',
  role: 'user'
})
const newRoleForm = ref({
  name: '',
  description: '',
  permissions: [] as string[]
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
  realResultsTitle: '',
  realResultsSubtitle: '',
  realResultsCases: [],
  testimonialsTitle: '',
  testimonialsSubtitle: '',
  testimonials: [],
  footerTagline: ''
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

const benefitsTextarea = computed({
  get: () => formData.value.benefits.join('\n'),
  set: (value: string) => {
    formData.value.benefits = value.split('\n').filter(line => line.trim())
  }
})

const bonusesTextarea = computed({
  get: () => formData.value.bonuses.join('\n'),
  set: (value: string) => {
    formData.value.bonuses = value.split('\n').filter(line => line.trim())
  }
})

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
    'footer': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
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

const handleVideoUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (!file) return
  
  // Validate file type
  if (!file.type.startsWith('video/')) {
    saveMessage.value = 'Please select a valid video file'
    saveMessageType.value = 'error'
    setTimeout(() => { saveMessage.value = '' }, 4000)
    return
  }
  
  // Validate file size (100MB max)
  const maxSize = 100 * 1024 * 1024 // 100MB
  if (file.size > maxSize) {
    saveMessage.value = 'Video file is too large. Maximum size is 100MB'
    saveMessageType.value = 'error'
    setTimeout(() => { saveMessage.value = '' }, 4000)
    return
  }
  
  selectedVideoFile.value = file
  uploadingVideo.value = true
  uploadProgress.value = 0
  
  try {
    const userId = user.value?.id || authService.getCurrentUser()?.uid || 'unknown'
    const timestamp = Date.now()
    const fileName = `videos/${userId}/${timestamp}-${file.name}`
    
    // Upload video to Firebase Storage
    const videoUrl = await storageService.uploadAndGetUrl(
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

const removeVideo = () => {
  formData.value.videoFileUrl = ''
  formData.value.videoUrl = ''
  formData.value.videoType = 'link'
  selectedVideoFile.value = null
  if (videoFileInput.value) {
    videoFileInput.value.value = ''
  }
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

const handlePhotoUpload = async (event: Event, index: number) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (!file) return
  
  // Validate file type
  if (!file.type.startsWith('image/')) {
    saveMessage.value = 'Please select a valid image file'
    saveMessageType.value = 'error'
    setTimeout(() => { saveMessage.value = '' }, 4000)
    return
  }
  
  // Validate file size (5MB max)
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
    const fileName = `testimonials/${userId}/${timestamp}-${file.name}`
    
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
  }
}

const handleTestimonialVideoUpload = async (event: Event, index: number) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (!file) return
  
  // Validate file type
  if (!file.type.startsWith('video/')) {
    saveMessage.value = 'Please select a valid video file'
    saveMessageType.value = 'error'
    setTimeout(() => { saveMessage.value = '' }, 4000)
    return
  }
  
  // Validate file size (100MB max)
  const maxSize = 100 * 1024 * 1024 // 100MB
  if (file.size > maxSize) {
    saveMessage.value = 'Video file is too large. Maximum size is 100MB'
    saveMessageType.value = 'error'
    setTimeout(() => { saveMessage.value = '' }, 4000)
    return
  }
  
  try {
    const userId = user.value?.id || authService.getCurrentUser()?.uid || 'unknown'
    const timestamp = Date.now()
    const fileName = `testimonials/${userId}/${timestamp}-${file.name}`
    
    // Upload video to Firebase Storage
    const videoUrl = await storageService.uploadAndGetUrl(
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
  }
}

const handleVideoThumbnailUpload = async (event: Event, index: number) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (!file) return
  
  // Validate file type
  if (!file.type.startsWith('image/')) {
    saveMessage.value = 'Please select a valid image file'
    saveMessageType.value = 'error'
    setTimeout(() => { saveMessage.value = '' }, 4000)
    return
  }
  
  // Validate file size (5MB max)
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
    const fileName = `testimonials/${userId}/thumbnails/${timestamp}-${file.name}`
    
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
    } else {
      errorMessage.value = result.error || 'Failed to load content'
    }
    
    // Load admin data if admin
    if (isAdmin.value) {
      await loadAdminData()
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
  if (newTab === 'activity-logs' && isAdmin.value) {
    refreshActivityLogs()
  }
})

const saveContent = async () => {
  isSaving.value = true
  saveMessage.value = ''
  
  try {
    const userId = user.value?.id || authService.getCurrentUser()?.uid
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

onMounted(() => {
  loadContent()
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

.stat-icon {
  font-size: 1.5rem;
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
.steps-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}

.step-card {
  background: rgba(91, 32, 150, 0.08);
  border: 1px solid rgba(91, 32, 150, 0.2);
  border-radius: 12px;
  padding: 1.25rem;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  transition: all 0.2s;
}

.step-card:hover {
  border-color: rgba(91, 32, 150, 0.4);
  transform: translateY(-2px);
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

.step-card .form-textarea {
  flex: 1;
  margin: 0;
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
}

.btn-danger:hover {
  background: rgba(204, 51, 51, 0.3);
  border-color: rgba(204, 51, 51, 0.5);
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
}

.role-card h5 {
  margin: 0 0 0.5rem 0;
  color: #F5F7FA;
  font-size: 1rem;
  font-weight: 600;
}

.role-card p {
  margin: 0;
  color: rgba(245, 247, 250, 0.6);
  font-size: 0.875rem;
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

.preview-label {
  margin: 0 0 0.75rem 0;
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

/* Testimonials Manager Styles */
.testimonials-manager {
  margin-top: 1rem;
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

.photo-upload-label:hover {
  border-color: rgba(91, 32, 150, 0.5);
  background: rgba(91, 32, 150, 0.1);
}

.photo-upload-label svg {
  color: #5B2096;
}

.photo-preview {
  margin-top: 1rem;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
}

.photo-preview-img {
  width: 100%;
  max-width: 200px;
  height: auto;
  border-radius: 8px;
  object-fit: cover;
}

.testimonial-video-section {
  margin-top: 0.5rem;
}

/* Real Results Manager Styles */
.real-results-manager {
  margin-top: 1rem;
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
</style>
