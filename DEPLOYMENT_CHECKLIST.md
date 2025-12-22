# 🚀 Quick Deployment Checklist

## Before You Deploy

- [ ] All code is committed to GitHub
- [ ] `.env` files are in `.gitignore` 
- [ ] API keys are ready (Supabase, Gemini)
- [ ] Frontend uses environment variable for API URL ✅
- [ ] Backend CORS is configured ✅

## Deploy Backend First (Render)

1. [ ] Go to https://render.com
2. [ ] Sign in with GitHub
3. [ ] New Web Service → Connect repository
4. [ ] Configure:
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
5. [ ] Add environment variables:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `GEMINI_API_KEY`
6. [ ] Deploy and copy the URL (e.g., `https://your-app.onrender.com`)

## Deploy Frontend (Vercel)

1. [ ] Go to https://vercel.com
2. [ ] Sign in with GitHub
3. [ ] New Project → Import repository
4. [ ] Configure:
   - Framework: Vite
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. [ ] Add environment variable:
   - `VITE_API_URL`: Your Render backend URL
6. [ ] Deploy

## Test Your Deployment

- [ ] Visit backend URL + `/api/health`
- [ ] Visit frontend URL
- [ ] Test calculator functionality
- [ ] Test AI chat assistant
- [ ] Test all features

## Update Repository

- [ ] Add live URLs to README.md
- [ ] Push final changes to GitHub

---

**Estimated Time**: 15-20 minutes

**Cost**: $0 (using free tiers)

See `DEPLOYMENT.md` for detailed instructions.
