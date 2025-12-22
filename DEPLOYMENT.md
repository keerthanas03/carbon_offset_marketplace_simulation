# 🚀 Deployment Guide

This guide will help you deploy your Carbon Offset Marketplace to production.

## 📋 Deployment Overview

- **Frontend**: Deploy to Vercel (recommended) or Netlify
- **Backend**: Deploy to Render (recommended) or Railway
- **Database**: Already hosted on Supabase ✅

---

## 🎨 Frontend Deployment (Vercel)

### Step 1: Prepare Frontend for Production

First, we need to update the API URL in your frontend to point to your deployed backend.

1. Create a `.env` file in the `frontend` folder:

```env
VITE_API_URL=https://your-backend-url.onrender.com
```

2. Update your frontend code to use this environment variable (if not already done).

### Step 2: Deploy to Vercel

#### Option A: Using Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to frontend folder
cd frontend

# Deploy
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? carbon-offset-marketplace
# - In which directory is your code? ./
# - Override settings? No
```

#### Option B: Using Vercel Dashboard (Easier)

1. Go to https://vercel.com and sign in with GitHub
2. Click **"Add New Project"**
3. Import your repository: `keerthanas03/carbon_offset_marketplace_simulation`
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add Environment Variables:
   - `VITE_API_URL`: (leave empty for now, we'll add after backend deployment)
6. Click **"Deploy"**

---

## ⚙️ Backend Deployment (Render)

### Step 1: Prepare Backend for Production

1. Update `backend/index.js` to handle production CORS:

Add this to your CORS configuration:
```javascript
const allowedOrigins = [
  'http://localhost:3000',
  'https://your-vercel-app.vercel.app' // Add your Vercel URL here
];
```

### Step 2: Deploy to Render

1. Go to https://render.com and sign in with GitHub
2. Click **"New +"** → **"Web Service"**
3. Connect your repository: `keerthanas03/carbon_offset_marketplace_simulation`
4. Configure:
   - **Name**: `carbon-offset-backend`
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free

5. Add Environment Variables (click "Advanced"):
   - `SUPABASE_URL`: Your Supabase URL
   - `SUPABASE_ANON_KEY`: Your Supabase anon key
   - `GEMINI_API_KEY`: Your Gemini API key
   - `PORT`: 5001 (or leave empty, Render will assign)

6. Click **"Create Web Service"**

### Step 3: Get Your Backend URL

After deployment completes, Render will give you a URL like:
```
https://carbon-offset-backend.onrender.com
```

---

## 🔗 Connect Frontend to Backend

### Update Frontend Environment Variable

1. Go back to Vercel dashboard
2. Select your project → **Settings** → **Environment Variables**
3. Add:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://carbon-offset-backend.onrender.com`
4. Redeploy your frontend (Vercel will auto-redeploy)

---

## ✅ Verify Deployment

1. **Test Backend**: Visit `https://your-backend.onrender.com/api/health`
   - Should return: `{"status":"ok"}`

2. **Test Frontend**: Visit your Vercel URL
   - Should load the application
   - Test the calculator
   - Test the AI chat

---

## 🎯 Alternative Deployment Options

### Frontend Alternatives

#### **Netlify**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Navigate to frontend
cd frontend

# Build
npm run build

# Deploy
netlify deploy --prod
```

#### **GitHub Pages** (Static only)
- Not recommended for this project (needs environment variables)

### Backend Alternatives

#### **Railway**
1. Go to https://railway.app
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Set root directory to `backend`
5. Add environment variables
6. Deploy

#### **Heroku** (No longer free)
- Requires paid plan

---

## 🔐 Security Checklist

Before deploying, ensure:

- ✅ `.env` files are in `.gitignore`
- ✅ All API keys are set as environment variables
- ✅ CORS is configured for your production domain
- ✅ Supabase Row Level Security (RLS) is enabled
- ✅ Rate limiting is implemented (optional but recommended)

---

## 📊 Post-Deployment

### Monitor Your Application

**Render Dashboard**:
- View logs
- Monitor performance
- Check deployment status

**Vercel Dashboard**:
- View analytics
- Monitor build status
- Check performance metrics

### Update Your README

Add your live URLs to the README:

```markdown
## 🌐 Live Demo

- **Frontend**: https://your-app.vercel.app
- **Backend API**: https://your-backend.onrender.com
```

---

## 🐛 Troubleshooting

### Frontend Issues

**Build fails on Vercel**:
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify build command is correct

**API calls failing**:
- Check `VITE_API_URL` environment variable
- Verify CORS settings in backend
- Check browser console for errors

### Backend Issues

**Render deployment fails**:
- Check logs in Render dashboard
- Verify all environment variables are set
- Ensure `package.json` has correct start script

**API not responding**:
- Check Render logs for errors
- Verify Supabase credentials
- Test health endpoint: `/api/health`

---

## 💡 Tips

1. **Free Tier Limitations**:
   - Render free tier may sleep after inactivity (takes ~30s to wake up)
   - Consider upgrading for production use

2. **Custom Domain**:
   - Both Vercel and Render support custom domains
   - Configure in respective dashboards

3. **Automatic Deployments**:
   - Both platforms auto-deploy when you push to GitHub
   - No manual redeployment needed!

---

## 📞 Need Help?

If you encounter issues:
1. Check deployment logs
2. Verify environment variables
3. Test API endpoints individually
4. Check CORS configuration

Happy Deploying! 🚀
