# Deployment to Railway

> **Best for:** Production apps, team collaboration, automatic deployments  
> **Difficulty:** ⭐ Easy  
> **Time:** ~10 minutes

## Overview

Deploy your Todo API to Railway directly from GitHub. Every time you push to your repository, Railway automatically redeploys your application.

## Prerequisites

- ✅ GitHub account
- ✅ Railway account ([signup here](https://railway.app))
- ✅ Todo API code pushed to a GitHub repository
- ✅ Git installed locally

---

## Step 1: Prepare Your GitHub Repository

### 1.1 Push Your Code to GitHub

If you haven't already:

```bash
# Initialize git (if not done)
git init

# Add all files
git add .

# Commit
git commit -m "Prepare for Railway deployment"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/todo-api.git
git branch -M main
git push -u origin main
```

### 1.2 Verify Configuration Files

Ensure these files exist in your repository:
- ✅ `railway.json` - Railway configuration (created for you)
- ✅ `package.json` - Dependencies and scripts
- ✅ `.gitignore` - Excludes sensitive files

---

## Step 2: Create Railway Project

### 2.1 Sign Up/Login to Railway

1. Go to [railway.app](https://railway.app)
2. Click **"Login"** or **"Start a New Project"**
3. Sign in with GitHub (recommended)

### 2.2 Create New Project

1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. **Authorize Railway** to access your GitHub account
4. Select your **todo-api** repository
5. Click **"Deploy Now"**

Railway will immediately start deploying, but it will fail because we don't have a database yet. That's expected!

---

## Step 3: Add PostgreSQL Database

### 3.1 Add Database Service

1. In your Railway project dashboard, click **"+ New"**
2. Select **"Database"** → **"PostgreSQL"**
3. Railway automatically creates a PostgreSQL database

### 3.2 Connect Database to Your App

Railway automatically sets the `DATABASE_URL` environment variable. No manual configuration needed!

---

## Step 4: Configure Environment Variables

### 4.1 Access Variables Settings

1. Click on your **todo-api service** (not the database)
2. Go to **"Variables"** tab
3. Click **"+ Add Variable"**

### 4.2 Add Required Variables

Add these environment variables:

| Variable | Value | Example |
|----------|-------|---------|
| `JWT_SECRET` | A random strong secret | `your_super_secret_jwt_key_here_make_it_long` |
| `ADMIN_SECRET` | A random strong secret | `your_admin_secret_key_here` |
| `ALLOWED_ORIGINS` | Your frontend URL | `https://your-frontend.vercel.app` |
| `NODE_ENV` | production | `production` |

**Generate strong secrets:**
```bash
# On Windows PowerShell
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | % {[char]$_})

# On Linux/Mac
openssl rand -base64 32
```

> **Note:** `DATABASE_URL` and `PORT` are automatically set by Railway.

### 4.3 Save Variables

Click **"Add"** for each variable. Railway will automatically redeploy.

---

## Step 5: Run Database Migrations

### 5.1 Option A: Auto-run on Deploy (Recommended)

Your `railway.json` already includes migrations in the start command:
```json
{
  "deploy": {
    "startCommand": "npm run migrate:up && npm start"
  }
}
```

Migrations run automatically on every deploy! ✅

### 5.1 Option B: Manual Migration via Railway CLI

If you prefer manual control:

1. Install Railway CLI:
```bash
# Windows (PowerShell)
iwr https://railway.app/install.ps1 | iex

# Mac/Linux
curl -fsSL https://railway.app/install.sh | sh
```

2. Login and link project:
```bash
railway login
railway link
```

3. Run migrations:
```bash
railway run npm run migrate:up
```

---

## Step 6: Verify Deployment

### 6.1 Check Deployment Status

1. In Railway dashboard, go to **"Deployments"** tab
2. Wait for **"Success"** status (usually 2-3 minutes)
3. Click on the deployment to view logs

### 6.2 Get Your App URL

1. Go to **"Settings"** tab
2. Under **"Domains"**, click **"Generate Domain"**
3. Railway creates a public URL: `https://your-app.up.railway.app`

### 6.3 Test Your API

**Test the root endpoint:**
```bash
curl https://your-app.up.railway.app
# Should return: "Welcome to the Todo API! Try GET /todos or visit /api-docs for documentation"
```

**Access Swagger UI:**
```
https://your-app.up.railway.app/api-docs
```

**Test user signup:**
```bash
curl -X POST https://your-app.up.railway.app/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password123"}'
```

---

## Step 7: Enable Auto-Deployments

### 7.1 Configure Deploy Settings

Auto-deployments are enabled by default! Every push to your GitHub repository triggers a new deployment.

**To customize:**
1. Go to **"Settings"** tab
2. Under **"Deploy Triggers"**:
   - ✅ Enable: Deploy on push to main branch
   - ✅ Enable: Deploy on pull request

### 7.2 Test Auto-Deploy

1. Make a small change to your code locally
2. Commit and push:
```bash
git add .
git commit -m "Test auto-deploy"
git push
```
3. Watch Railway automatically deploy! 🎉

---

## Troubleshooting

### Issue: Deployment Failed

**Check logs:**
1. Go to **"Deployments"** tab
2. Click on the failed deployment
3. Click **"View Logs"**

**Common issues:**
- Missing environment variables → Add in Variables tab
- Migration errors → Check DATABASE_URL is set
- Port errors → Railway sets PORT automatically, don't hardcode

### Issue: Database Connection Error

**Solution:**
1. Verify PostgreSQL service is running
2. Check that DATABASE_URL is linked
3. Restart your application service

### Issue: 502 Bad Gateway

**Solution:**
- App is starting up (wait 30 seconds)
- Check if app is listening on `process.env.PORT`
- Review logs for startup errors

---

## Managing Your Deployment

### View Logs
```bash
# Real-time logs
railway logs

# Or in dashboard: Deployments → Click deployment → View Logs
```

### Rollback Deployment
1. Go to **"Deployments"** tab
2. Find previous successful deployment
3. Click **"⋮"** → **"Redeploy"**

### Scale Your App
1. Go to **"Settings"** tab
2. Adjust **CPU** and **Memory**
3. Railway automatically applies changes

---

## Cost Estimation

**Free Tier ($5 credit/month):**
- Web Service: ~$3-4/month
- PostgreSQL: ~$1-2/month
- **Total: ~$5/month** ✅ Fits free tier!

**Monitoring Usage:**
- Dashboard → **"Usage"** tab
- Shows current month's consumption

---

## Next Steps

✅ **Deployment complete!**

**Consider:**
- [ ] Add custom domain in Settings → Domains
- [ ] Set up monitoring/alerts
- [ ] Configure backup strategy for PostgreSQL
- [ ] Add CI/CD tests before deploy
- [ ] Review security settings

---

## Summary

**What we did:**
1. ✅ Connected GitHub repository to Railway
2. ✅ Added PostgreSQL database
3. ✅ Configured environment variables
4. ✅ Ran database migrations
5. ✅ Generated public domain
6. ✅ Enabled auto-deployments

**Your app is live at:** `https://your-app.up.railway.app` 🎉

**Every git push automatically deploys!** 🚀
