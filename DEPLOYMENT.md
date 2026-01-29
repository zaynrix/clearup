# Deployment Guide

## GitHub Pages Setup

### 1. Push Code to GitHub

The code has been prepared and committed. To push to GitHub, run:

```bash
git push -u origin main
```

If you encounter authentication issues, you can either:

**Option A: Use SSH (Recommended)**
```bash
git remote set-url origin git@github.com:zaynrix/clearup.git
git push -u origin main
```

**Option B: Use GitHub CLI**
```bash
gh auth login
git push -u origin main
```

**Option C: Use Personal Access Token**
1. Go to GitHub Settings > Developer settings > Personal access tokens > Tokens (classic)
2. Generate a new token with `repo` permissions
3. Use the token as password when pushing:
```bash
git push -u origin main
# Username: your-github-username
# Password: your-personal-access-token
```

### 2. Enable GitHub Pages

After pushing the code:

1. Go to your repository: https://github.com/zaynrix/clearup
2. Navigate to **Settings** > **Pages**
3. Under **Source**, select:
   - **Source**: `GitHub Actions`
4. Save the settings

### 3. GitHub Actions Workflow

The workflow file (`.github/workflows/deploy.yml`) is already configured and will:

- ✅ Build the Vue.js application
- ✅ Deploy to GitHub Pages automatically on every push to `main`
- ✅ Use the latest GitHub Actions v4 for optimal performance

### 4. Access Your Site

Once deployed, your site will be available at:
**https://zaynrix.github.io/clearup/**

### 5. Environment Variables (Firebase) - **REQUIRED**

For Firebase to work in production, you **MUST** set up environment variables as GitHub Secrets:

#### Step 1: Get Your Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Click the gear icon ⚙️ next to "Project Overview"
4. Select **"Project settings"**
5. Scroll down to **"Your apps"** section
6. Find your web app and click the **⚙️ Settings** icon
7. Copy all the configuration values

#### Step 2: Add Secrets to GitHub

1. Go to your repository: https://github.com/zaynrix/clearup
2. Navigate to **Settings** > **Secrets and variables** > **Actions**
3. Click **"New repository secret"** for each of the following:

   Add these secrets (use the exact names shown):
   - `VITE_FIREBASE_API_KEY` - Your Firebase API Key
   - `VITE_FIREBASE_AUTH_DOMAIN` - Your auth domain (e.g., `your-project.firebaseapp.com`)
   - `VITE_FIREBASE_PROJECT_ID` - Your project ID
   - `VITE_FIREBASE_STORAGE_BUCKET` - Your storage bucket (e.g., `your-project.appspot.com`)
   - `VITE_FIREBASE_MESSAGING_SENDER_ID` - Your messaging sender ID
   - `VITE_FIREBASE_APP_ID` - Your app ID
   - `VITE_FIREBASE_MEASUREMENT_ID` - Your measurement ID (optional, for Analytics)

4. After adding all secrets, trigger a new deployment:
   - Go to **Actions** tab
   - Click **"Deploy to GitHub Pages"** workflow
   - Click **"Run workflow"** button
   - Select `main` branch and click **"Run workflow"**

#### Step 3: Configure Firebase Authorized Domains

Firebase needs to allow requests from your GitHub Pages domain:

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Go to **Authentication** > **Settings** > **Authorized domains**
4. Click **"Add domain"** and add:
   - `zaynrix.github.io`
   - `localhost` (for local development)
5. Click **"Add"**

**Important:** Without these steps, you'll see errors like:
- "API key not valid"
- "Failed to get document because the client is offline"

### Notes

- The base path is set to `/clearup/` in `vite.config.ts` for GitHub Pages
- If you want to use a custom domain, update the `base` in `vite.config.ts` to `/`
- The workflow runs automatically on every push to `main` branch
- You can also trigger it manually from the **Actions** tab

