# 🚀 Netlify Deployment Guide for BrainFuel

## 📋 Prerequisites

- GitHub repository with your BrainFuel project
- Netlify account (free tier available)
- Node.js 18+ (Netlify will use this automatically)

## 🔧 Netlify Configuration

### 1. Build Settings
- **Build command:** `npm run build`
- **Publish directory:** `dist`
- **Node version:** 18 (automatically set)

### 2. Environment Variables
Set these in Netlify dashboard under **Site settings > Environment variables**:

```bash
# API Configuration (if you have a backend)
VITE_API_URL=https://your-backend-domain.com/api

# Gemini AI API (for AI chat features)
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# Optional: Analytics
VITE_ANALYTICS_ID=your_analytics_id_here
```

## 🚀 Deployment Steps

### Method 1: Git Integration (Recommended)

1. **Connect to Git:**
   - Go to Netlify dashboard
   - Click "New site from Git"
   - Choose your Git provider (GitHub, GitLab, etc.)
   - Select your BrainFuel repository

2. **Configure Build:**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Click "Deploy site"

3. **Set Environment Variables:**
   - Go to Site settings > Environment variables
   - Add the variables listed above

### Method 2: Manual Deploy

1. **Build Locally:**
   ```bash
   npm install
   npm run build
   ```

2. **Upload to Netlify:**
   - Drag and drop the `dist` folder to Netlify
   - Or use Netlify CLI: `netlify deploy --prod --dir=dist`

## ✅ What's Already Configured

- **SPA Routing:** All routes redirect to `index.html`
- **Security Headers:** XSS protection, frame options, etc.
- **Caching:** Optimized caching for static assets
- **Build Optimization:** Code splitting and chunk optimization
- **3D Assets:** GLB files properly configured for web

## 🔍 Post-Deployment Checklist

- [ ] Site loads without errors
- [ ] All routes work (try `/card`, `/support`, etc.)
- [ ] 3D mascot displays correctly
- [ ] Images load properly
- [ ] AI chat works (if Gemini API key is set)
- [ ] Mobile responsiveness works
- [ ] Performance is acceptable

## 🐛 Common Issues & Solutions

### Issue: 404 on Route Refresh
**Solution:** Already fixed with `_redirects` file

### Issue: 3D Model Not Loading
**Solution:** Check that GLB file is in `public/` folder

### Issue: API Calls Failing
**Solution:** Set `VITE_API_URL` environment variable

### Issue: Build Failing
**Solution:** Check Node version (should be 18+)

## 📱 Performance Optimization

- **Code Splitting:** React, Three.js, and Framer Motion are split
- **Asset Caching:** Images and 3D models cached for 1 year
- **Bundle Analysis:** Check build output for large chunks

## 🔒 Security Features

- XSS Protection enabled
- Frame embedding disabled
- Content type sniffing disabled
- Secure referrer policy

## 📊 Monitoring

- Netlify provides built-in analytics
- Performance monitoring included
- Form submissions tracking available

## 🆘 Support

If you encounter issues:
1. Check Netlify build logs
2. Verify environment variables
3. Test locally with `npm run build && npm run preview`
4. Check browser console for errors

---

**Your BrainFuel website is now ready for Netlify deployment! 🎉**
