# Quick Start: Deploy to Netlify

## Prerequisites Checklist

- [ ] Backend deployed (Railway/Render/Heroku)
- [ ] Backend URL ready (e.g., `https://your-backend.railway.app`)
- [ ] GitHub repository with your code
- [ ] Netlify account (free tier works)

## Quick Deployment Steps

### 1. Deploy Backend First (if not done)

**Option A: Railway (Recommended)**
1. Go to https://railway.app
2. New Project → Deploy from GitHub
3. Select your repo, choose `backend` folder
4. Add environment variables:
   - `DATABASE_URL` (from Railway PostgreSQL or your DB)
   - `PORT` (usually auto-set)
5. Note your backend URL (e.g., `https://your-app.railway.app`)

**Option B: Render**
1. Go to https://render.com
2. New → Web Service
3. Connect GitHub repo, select `backend` folder
4. Add environment variables
5. Note your backend URL

### 2. Deploy Frontend to Netlify

**Method 1: Via Netlify UI (Easiest)**

1. **Push code to GitHub**:
   ```bash
   git add .
   git commit -m "Ready for Netlify deployment"
   git push origin main
   ```

2. **Go to Netlify**:
   - Visit https://app.netlify.com
   - Click "Add new site" → "Import an existing project"
   - Connect to GitHub → Select your repository

3. **Configure Build Settings**:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`

4. **Add Environment Variable**:
   - Click "Show advanced" → "New variable"
   - **Key**: `VITE_API_URL`
   - **Value**: `https://your-backend-url.com/api` (replace with your actual backend URL)
   - Click "Deploy site"

5. **Wait for deployment** (usually 1-2 minutes)

6. **Your site is live!** Visit `https://your-site-name.netlify.app`

**Method 2: Via Netlify CLI**

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Navigate to frontend
cd frontend

# Initialize and deploy
netlify init
# Follow prompts:
# - Create & configure a new site
# - Build command: npm run build
# - Publish directory: dist

# Set environment variable
netlify env:set VITE_API_URL "https://your-backend-url.com/api"

# Deploy
netlify deploy --prod
```

### 3. Update Backend CORS (Important!)

After getting your Netlify URL, update backend CORS:

1. **If using Railway/Render**, add environment variable:
   - `FRONTEND_URL` = `https://your-site-name.netlify.app`

2. **Or update backend code** (`backend/src/server.js`):
   ```javascript
   const allowedOrigins = [
     'http://localhost:5173',
     'https://your-site-name.netlify.app', // Add your Netlify URL here
   ];
   ```

3. **Redeploy backend** for changes to take effect

### 4. Test Your Deployment

1. Visit your Netlify site
2. Open browser console (F12)
3. Test creating/editing/deleting checklist items
4. Check for any CORS errors in console

## Troubleshooting

**"Failed to load checklist" error:**
- Check `VITE_API_URL` is set correctly in Netlify
- Verify backend is running and accessible
- Check backend CORS allows your Netlify domain

**Build fails:**
- Check Netlify build logs
- Ensure `package.json` has all dependencies
- Verify build command is `npm run build`

**404 on page refresh:**
- The `_redirects` file should fix this
- Verify `netlify.toml` exists in frontend folder

**Environment variable not working:**
- Restart Netlify build after adding variables
- Use exact name: `VITE_API_URL` (case-sensitive)
- Variables starting with `VITE_` are exposed to frontend

## Files Created for Deployment

- ✅ `frontend/netlify.toml` - Netlify configuration
- ✅ `frontend/public/_redirects` - SPA routing support
- ✅ `frontend/NETLIFY_DEPLOY.md` - Detailed deployment guide
- ✅ API client updated to use environment variables

## Next Steps

- Set up custom domain (optional)
- Enable HTTPS (automatic with Netlify)
- Set up continuous deployment (automatic with GitHub)

## Support

If you encounter issues:
1. Check Netlify build logs
2. Check browser console for errors
3. Verify backend is accessible
4. Review `NETLIFY_DEPLOY.md` for detailed troubleshooting

