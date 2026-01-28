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

### 5. Environment Variables (Firebase)

For Firebase to work in production, you'll need to:

1. Set up environment variables in GitHub Actions (if needed)
2. Or configure Firebase directly in the code for public access
3. Make sure your Firebase project allows the GitHub Pages domain

### Notes

- The base path is set to `/clearup/` in `vite.config.ts` for GitHub Pages
- If you want to use a custom domain, update the `base` in `vite.config.ts` to `/`
- The workflow runs automatically on every push to `main` branch
- You can also trigger it manually from the **Actions** tab

