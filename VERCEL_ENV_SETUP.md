# 🔧 Vercel Environment Variable Setup

## Problem
Frontend shows: "Unable to fetch live data"

## Solution
Add the backend URL as an environment variable in Vercel.

---

## Step-by-Step Instructions

### 1. Go to Vercel Dashboard
Visit: https://vercel.com/dashboard

### 2. Select Your Project
Click on: `carbon-offset-marketplace-simulatio`

### 3. Go to Settings
- Click **Settings** in the top navigation
- Click **Environment Variables** in the left sidebar

### 4. Add New Variable
Click **Add New** and enter:

**Name:**
```
VITE_API_URL
```

**Value:**
```
https://carbon-offset-marketplace-simulation.onrender.com
```

**Environments:**
- ✅ Production
- ✅ Preview  
- ✅ Development

### 5. Save
Click **Save**

### 6. Redeploy
Go to **Deployments** tab → Click the three dots (...) on latest deployment → **Redeploy**

---

## Verify It Works

After redeployment (takes ~2 minutes):

1. Visit: https://carbon-offset-marketplace-simulatio.vercel.app/
2. The "Unable to fetch live data" error should be gone
3. You should see the Stats page with data
4. Test the Calculator and Chat features

---

## Still Not Working?

### Check Backend Status
Visit: https://carbon-offset-marketplace-simulation.onrender.com

Should show: "✅ Carbon Offset Marketplace API is running"

### Check API Endpoint
Visit: https://carbon-offset-marketplace-simulation.onrender.com/api/emissions

Should show JSON data with emissions information

### Check Browser Console
1. Open your deployed site
2. Press F12 to open Developer Tools
3. Go to Console tab
4. Look for any error messages
5. Check if the API URL is correct

---

## Common Issues

### Issue 1: Render Backend is Sleeping
**Symptom**: First load is slow or times out  
**Solution**: Wait 30 seconds for Render to wake up (free tier limitation)

### Issue 2: CORS Error
**Symptom**: Console shows "CORS policy" error  
**Solution**: Backend already has CORS enabled, should work automatically

### Issue 3: Wrong API URL
**Symptom**: 404 errors in console  
**Solution**: Make sure `VITE_API_URL` doesn't have a trailing slash

---

## Need More Help?

Check the browser console (F12) for specific error messages and share them for troubleshooting.
