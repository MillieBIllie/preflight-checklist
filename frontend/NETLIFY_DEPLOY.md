# Netlify Deployment Guide

This guide will help you deploy the Preflight Checklist frontend to Netlify.

## Prerequisites

1. **Backend deployed**: Your backend API must be deployed first (Railway, Render, Heroku, etc.)
2. **Netlify account**: Sign up at [netlify.com](https://www.netlify.com) (free tier is fine)
3. **GitHub repository**: Your code should be in a GitHub repository

## Step 1: Deploy Backend First

Before deploying the frontend, deploy your backend to a platform like:
- **Railway** (recommended): https://railway.app
- **Render**: https://render.com
- **Heroku**: https://heroku.com

Once deployed, note your backend URL (e.g., `https://your-backend.railway.app`)

## Step 2: Prepare for Deployment

### Option A: Deploy via Netlify UI (Easiest)

1. **Push your code to GitHub** (if not already):
   ```bash
   git add .
   git commit -m "Prepare for Netlify deployment"
   git push origin main
   ```

2. **Go to Netlify**:
   - Visit https://app.netlify.com
   - Click "Add new site" → "Import an existing project"
   - Connect to GitHub and select your repository

3. **Configure build settings**:
   - **Base directory**: `frontend` (if your frontend is in a subdirectory)
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`

4. **Set environment variables**:
   - Go to Site settings → Environment variables
   - Add: `VITE_API_URL` = `https://your-backend-url.com/api`
   - Replace `your-backend-url.com` with your actual backend URL

5. **Deploy**:
   - Click "Deploy site"
   - Wait for the build to complete
   - Your site will be live at `https://your-site-name.netlify.app`

### Option B: Deploy via Netlify CLI

1. **Install Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**:
   ```bash
   netlify login
   ```

3. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

4. **Initialize Netlify site**:
   ```bash
   netlify init
   ```
   - Follow the prompts to create a new site or link to existing one
   - Set build command: `npm run build`
   - Set publish directory: `dist`

5. **Set environment variable**:
   ```bash
   netlify env:set VITE_API_URL "https://your-backend-url.com/api"
   ```

6. **Deploy**:
   ```bash
   netlify deploy --prod
   ```

## Step 3: Update Backend CORS Settings

Make sure your backend allows requests from your Netlify domain:

In `backend/src/server.js`, update CORS to include your Netlify URL:

```javascript
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://your-site-name.netlify.app'
  ]
}));
```

Or for development, allow all origins (not recommended for production):

```javascript
app.use(cors({
  origin: '*'
}));
```

## Step 4: Verify Deployment

1. Visit your Netlify site URL
2. Open browser console (F12)
3. Check for any errors
4. Test CRUD operations to ensure API connection works

## Troubleshooting

### Build Fails
- Check Netlify build logs
- Ensure all dependencies are in `package.json`
- Verify build command is correct

### API Connection Issues
- Verify `VITE_API_URL` environment variable is set correctly
- Check backend CORS settings
- Ensure backend is deployed and accessible

### 404 Errors on Refresh
- The `_redirects` file should handle this
- Verify `netlify.toml` has the redirect rule

### Environment Variables Not Working
- Restart the Netlify build after adding environment variables
- Use `VITE_` prefix for Vite environment variables
- Check variable name matches exactly (case-sensitive)

## Continuous Deployment

Netlify automatically deploys when you push to your main branch. To disable:

1. Go to Site settings → Build & deploy
2. Under "Continuous Deployment", click "Stop auto publishing"

## Custom Domain

To add a custom domain:

1. Go to Site settings → Domain management
2. Click "Add custom domain"
3. Follow the DNS configuration instructions

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `https://api.example.com/api` |

## Support

For issues:
- Check Netlify build logs
- Review browser console for errors
- Verify backend is running and accessible
- Check CORS configuration

