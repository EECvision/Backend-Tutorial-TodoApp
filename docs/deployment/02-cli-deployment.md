# Option 2: CLI Deployment to Railway

> **Best for:** Quick deploys, local development, testing, private repos  
> **Difficulty:** ⭐⭐ Moderate  
> **Time:** ~15 minutes

## Overview

Deploy your Todo API using the Railway Command Line Interface (CLI). This method lets you deploy directly from your local machine without needing GitHub integration.

## Prerequisites

- ✅ Railway account ([signup here](https://railway.app))
- ✅ Node.js installed (v18+)
- ✅ Todo API project on your local machine
- ✅ Git installed

---

## Step 1: Install Railway CLI

### Windows (PowerShell)

```powershell
iwr https://railway.app/install.ps1 | iex
```

### macOS/Linux

```bash
curl -fsSL https://railway.app/install.sh | sh
```

### Verify Installation

```bash
railway --version
```

Expected output: `railway version x.x.x`

---

## Step 2: Login to Railway

### 2.1 Authenticate

```bash
railway login
```

This opens your browser to authenticate. Click **"Authorize"** to link the CLI to your Railway account.

### 2.2 Verify Login

```bash
railway whoami
```

Should display your Railway username/email.

---

## Step 3: Initialize Railway Project

### 3.1 Navigate to Project Directory

```bash
cd d:\TUTORIALS\Backend-development\todo
```

### 3.2 Initialize Railway

```bash
railway init
```

**You'll be prompted:**
1. **Create new project or link existing?** → Select **"Create new project"**
2. **Project name:** → Enter `todo-api` (or your preferred name)
3. **Environment:** → Select **"production"** (or create new)

Railway creates a new project and generates `.railway` directory locally.

### 3.3 Verify Project Link

```bash
railway status
```

Should show:
- ✅ Project name
- ✅ Environment
- ✅ Linked service

---

## Step 4: Add PostgreSQL Database

### 4.1 Add Database via CLI

```bash
railway add
```

Select **"Database"** → **"PostgreSQL"**

Railway provisions a PostgreSQL database and automatically links it to your project.

### 4.2 Verify Database

```bash
railway variables
```

You should see `DATABASE_URL` in the list.

---

## Step 5: Configure Environment Variables

### 5.1 Set Variables via CLI

```bash
# Set JWT secret
railway variables --set JWT_SECRET="your_super_secret_jwt_key_here"

# Set admin secret
railway variables --set ADMIN_SECRET="your_admin_secret_key_here"

# Set allowed origins
railway variables --set ALLOWED_ORIGINS="https://your-frontend.com"

# Set Node environment
railway variables --set NODE_ENV="production"
```

**Generate strong secrets (Windows):**
```powershell
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | % {[char]$_})
```

**Generate strong secrets (Linux/Mac):**
```bash
openssl rand -base64 32
```

### 5.2 Verify Variables

```bash
railway variables
```

Should list all your environment variables (DATABASE_URL, PORT, JWT_SECRET, etc.)

---

## Step 6: Deploy Your Application

### 6.1 Deploy with CLI

```bash
railway up
```

Railway will:
1. 📦 Package your code
2. ⬆️ Upload to Railway
3. 🔨 Build your application
4. 🚀 Deploy the service

**Expected output:**
```
🚀 Deploying...
📦 Packaging code...
⬆️  Uploading...
Build Logs:
...
✅ Deployment successful!
```

### 6.2 Watch Deployment Logs

```bash
railway logs
```

Press `Ctrl+C` to exit log stream.

---

## Step 7: Run Database Migrations

### 7.1 Option A: One-time Migration Command

```bash
railway run npm run migrate:up
```

This runs migrations using your Railway environment variables.

### 7.2 Option B: Shell into Railway Environment

```bash
# Open shell with Railway environment
railway shell

# Run migrations
npm run migrate:up

# Exit shell
exit
```

### 7.3 Verify Migrations

Check the logs:
```bash
railway logs --tail 50
```

Look for migration success messages.

---

## Step 8: Access Your Deployed Application

### 8.1 Generate Public Domain

```bash
railway domain
```

Railway generates a domain: `https://todo-api-production-xxxx.up.railway.app`

**Or via Dashboard:**
1. Go to [railway.app](https://railway.app)
2. Select your project
3. Settings → Domains → Generate Domain

### 8.2 Test Your API

**Test root endpoint:**
```bash
curl https://your-app.up.railway.app
```

**Access Swagger UI:**
Open in browser: `https://your-app.up.railway.app/api-docs`

**Test signup:**
```bash
curl -X POST https://your-app.up.railway.app/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password123"}'
```

---

## Useful Railway CLI Commands

### Deployment Commands

```bash
# Deploy current directory
railway up

# Deploy specific directory
railway up --service <service-name>

# Check deployment status
railway status
```

### Environment & Variables

```bash
# List all variables
railway variables

# Set a variable
railway variables --set KEY="value"

# Delete a variable
railway variables --unset KEY

# Open shell with environment loaded
railway shell
```

### Logs & Debugging

```bash
# Stream logs (real-time)
railway logs

# Get last N lines
railway logs --tail 100

# Follow logs
railway logs --follow
```

### Project Management

```bash
# Link to existing project
railway link

# Show current project
railway status

# List all projects
railway list

# Open project in browser
railway open
```

### Database Commands

```bash
# Connect to PostgreSQL
railway connect postgres

# Run SQL file
railway run psql -f schema.sql
```

---

## Redeploy Your Application

### After Code Changes

```bash
# 1. Make your changes
# 2. Deploy
railway up

# Migrations will run automatically (from railway.json)
```

### Force Rebuild

```bash
railway up --detach
```

---

## Troubleshooting

### Issue: CLI Not Found After Installation

**Solution (Windows):**
1. Close and reopen PowerShell
2. Or restart your terminal
3. Check PATH: `$env:PATH`

**Solution (Mac/Linux):**
```bash
# Reload shell
source ~/.bashrc  # or ~/.zshrc
```

### Issue: "Not logged in"

**Solution:**
```bash
railway login
# Then re-run your command
```

### Issue: Deployment Fails

**Check logs:**
```bash
railway logs --tail 100
```

**Common causes:**
- Missing environment variables
- Build errors (check `package.json` scripts)
- Database connection issues

### Issue: Can't Connect to Database

**Verify DATABASE_URL:**
```bash
railway variables | grep DATABASE_URL
```

**Test connection:**
```bash
railway shell
node -e "console.log(process.env.DATABASE_URL)"
```

### Issue: Migrations Don't Run

**Manual run:**
```bash
railway run npm run migrate:up
```

**Check migration logs:**
```bash
railway logs | grep migration
```

---

## Environment Management

### Multiple Environments

```bash
# Create staging environment
railway environment create staging

# Switch to staging
railway environment staging

# Deploy to staging
railway up
```

### Link Different Services

```bash
# List services
railway service list

# Link to specific service
railway service link <service-id>
```

---

## Cost Estimation

Same as GitHub deployment:

**Free Tier ($5 credit/month):**
- Web Service: ~$3-4/month
- PostgreSQL: ~$1-2/month
- **Total: ~$5/month** ✅

**Check usage:**
```bash
railway open
# Navigate to Usage tab
```

---

## Advantages of CLI Deployment

✅ **Works with private repos** (no GitHub needed)  
✅ **Quick iterations** during development  
✅ **Local control** over deployments  
✅ **Scripting support** for CI/CD pipelines  
✅ **Direct access** to Railway environment  

## Disadvantages

❌ **No automatic deployments** (must run `railway up` manually)  
❌ **Requires CLI installation** on every machine  
❌ **Less audit trail** compared to GitHub deploys  

---

## CI/CD Integration

### GitHub Actions Example

`.github/workflows/deploy.yml`:

```yaml
name: Deploy to Railway

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Install Railway
        run: npm i -g @railway/cli
      
      - name: Deploy to Railway
        run: railway up --service ${{ secrets.RAILWAY_SERVICE_ID }}
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
```

**Get Railway Token:**
```bash
railway token
```

Add to GitHub Secrets as `RAILWAY_TOKEN`.

---

## Next Steps

✅ **Deployment complete!**

**Consider:**
- [ ] Set up CI/CD with GitHub Actions
- [ ] Create staging environment
- [ ] Add health check endpoint
- [ ] Configure monitoring

---

## Summary

**What we did:**
1. ✅ Installed Railway CLI
2. ✅ Created Railway project
3. ✅ Added PostgreSQL database
4. ✅ Configured environment variables
5. ✅ Deployed with `railway up`
6. ✅ Ran database migrations
7. ✅ Generated public domain

**Deploy anytime with:** `railway up` 🚀

**Monitor logs with:** `railway logs` 📊
