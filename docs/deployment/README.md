# Railway Deployment Guide

Complete guide for deploying the Todo API to Railway using three different methods.

## 🚀 Deployment Options

Choose the method that best fits your workflow:

| Method | Best For | Difficulty | Auto-Deploy | Time |
|--------|----------|------------|-------------|------|
| [**GitHub**](./01-github-deployment.md) | Production, Teams | ⭐ Easy | ✅ Yes | ~10 min |
| [**CLI**](./02-cli-deployment.md) | Quick Deploys, Testing | ⭐⭐ Moderate | ❌ No | ~15 min |
| [**Docker**](./03-docker-deployment.md) | Custom Environments | ⭐⭐⭐ Advanced | ✅ Yes | ~20 min |

---

## 📖 Quick Start Guides

### Option 1: GitHub Deployment (Recommended)

**Perfect for:** Production apps and team collaboration

```bash
# 1. Push code to GitHub
git push origin main

# 2. Connect repository to Railway
# → Visit railway.app → New Project → Deploy from GitHub

# 3. Add PostgreSQL database
# → Click "+ New" → Database → PostgreSQL

# 4. Set environment variables
# → Variables tab → Add JWT_SECRET, ADMIN_SECRET, etc.

# Done! ✅ Auto-deploys on every push
```

**[📚 Full GitHub Guide →](./01-github-deployment.md)**

---

### Option 2: CLI Deployment

**Perfect for:** Quick iterations and local control

```bash
# 1. Install Railway CLI
iwr https://railway.app/install.ps1 | iex  # Windows
# OR
curl -fsSL https://railway.app/install.sh | sh  # Mac/Linux

# 2. Login and initialize
railway login
railway init

# 3. Add database
railway add  # Select PostgreSQL

# 4. Set variables
railway variables --set JWT_SECRET="your_secret"
railway variables --set ADMIN_SECRET="your_admin_secret"

# 5. Deploy
railway up

# Done! ✅
```

**[📚 Full CLI Guide →](./02-cli-deployment.md)**

---

### Option 3: Docker Deployment

**Perfect for:** Production-grade consistency

```bash
# 1. Test Docker build locally
docker build -t todo-api:latest .

# 2. Push to GitHub (Dockerfile included)
git push origin main

# 3. Railway auto-detects Dockerfile
# → Automatically builds Docker image

# 4. Add database and set variables
# → Same as GitHub deployment

# Done! ✅ Containerized deployment
```

**[📚 Full Docker Guide →](./03-docker-deployment.md)**

---

## 🎯 Which Method Should I Choose?

### Choose GitHub Deployment if:
- ✅ You want automatic deployments on every push
- ✅ You're building a production app
- ✅ Working with a team
- ✅ You want easy rollbacks
- ✅ You prefer web UI over CLI

### Choose CLI Deployment if:
- ✅ You need quick, manual control
- ✅ Working with private repositories
- ✅ Testing different configurations
- ✅ You're comfortable with command line
- ✅ Need to deploy from multiple branches

### Choose Docker Deployment if:
- ✅ You need custom runtime environment
- ✅ Require exact reproducibility
- ✅ Planning to use container orchestration later
- ✅ Your app has complex dependencies
- ✅ You want production-grade consistency

---

## 📋 Prerequisites

All methods require:

- ✅ Railway account ([Sign up here](https://railway.app) - free tier available)
- ✅ Todo API code
- ✅ Git installed

**Method-specific requirements:**

| Requirement | GitHub | CLI | Docker |
|-------------|--------|-----|--------|
| GitHub account | ✅ | ❌ | ❌ |
| Railway CLI | ❌ | ✅ | ⚙️ Optional |
| Docker Desktop | ❌ | ❌ | ✅ |

---

## 🗂️ Configuration Files

Your project includes these deployment configuration files:

### `railway.json`
Railway-specific configuration for build and deployment.

```json
{
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm install"
  },
  "deploy": {
    "startCommand": "npm run migrate:up && npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

**Key features:**
- ✅ Automatic migrations on deploy
- ✅ Auto-restart on failure
- ✅ Works with all deployment methods

### `Dockerfile`
Container definition for Docker deployments.

```dockerfile
FROM node:20-alpine
RUN apk add --no-cache postgresql-client
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 8080
CMD ["sh", "-c", "npm run migrate:up && npm start"]
```

**Key features:**
- ✅ Alpine Linux (small size)
- ✅ Production dependencies only
- ✅ Automatic migrations
- ✅ PostgreSQL client included

### `.dockerignore`
Excludes unnecessary files from Docker image.

```
node_modules
.env
.git
docs
*.md
```

**Benefits:**
- ✅ Smaller image size
- ✅ Faster builds
- ✅ Better security

---

## 🔐 Environment Variables

All deployment methods require these environment variables:

| Variable | Description | Example | Auto-Set? |
|----------|-------------|---------|-----------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` | ✅ Yes |
| `PORT` | Server port | `8080` | ✅ Yes |
| `JWT_SECRET` | JWT signing secret | `super_secret_key_32_chars_long` | ❌ **You set** |
| `ADMIN_SECRET` | Admin creation secret | `admin_secret_key_here` | ❌ **You set** |
| `ALLOWED_ORIGINS` | CORS allowed origins | `https://your-frontend.com` | ❌ **You set** |
| `NODE_ENV` | Node environment | `production` | ❌ **You set** |

### Generate Strong Secrets

**Windows (PowerShell):**
```powershell
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | % {[char]$_})
```

**Linux/Mac:**
```bash
openssl rand -base64 32
```

---

## 🗄️ Database Setup

All methods use Railway's managed PostgreSQL:

### Features
- ✅ Automatic backups
- ✅ Free tier: 1GB storage
- ✅ High availability
- ✅ Connection pooling
- ✅ Automatic `DATABASE_URL` injection

### Migrations

**Automatic (On Deploy):**
```json
// railway.json
{
  "deploy": {
    "startCommand": "npm run migrate:up && npm start"
  }
}
```

**Manual (Via CLI):**
```bash
railway run npm run migrate:up
```

---

## 💰 Cost Estimation

Railway's free tier includes **$5 credit per month**:

| Resource | Usage | Cost/Month |
|----------|-------|------------|
| **Web Service** | Your Todo API | ~$3-4 |
| **PostgreSQL** | Database | ~$1-2 |
| **Total** | | **~$5** ✅ |

**Fits perfectly in the free tier!** 🎉

### Monitor Usage
- Railway Dashboard → **Usage** tab
- View current month's consumption
- Set up billing alerts

---

## 🔍 Verification Checklist

After deployment, verify:

- [ ] ✅ Service is running (green status in Railway dashboard)
- [ ] ✅ Database is connected
- [ ] ✅ Migrations have run successfully
- [ ] ✅ Domain is generated
- [ ] ✅ API responds: `curl https://your-app.up.railway.app`
- [ ] ✅ Swagger UI accessible: `/api-docs`
- [ ] ✅ Can create user: `POST /auth/signup`
- [ ] ✅ Can login: `POST /auth/login`
- [ ] ✅ Can create todo: `POST /todos`
- [ ] ✅ Admin endpoint works: `GET /admin/todos`

---

## 🐛 Troubleshooting

### Common Issues

#### 1. Deployment Failed

**Check logs:**
```bash
railway logs --tail 100
```

**Common causes:**
- Missing environment variables
- Build errors (check `package.json`)
- Database connection issues

#### 2. Database Connection Error

**Verify DATABASE_URL:**
```bash
railway variables | grep DATABASE_URL
```

**Check database is running:**
- Railway Dashboard → Database service → Status should be green

#### 3. Migrations Don't Run

**Manual run:**
```bash
railway run npm run migrate:up
```

**Check migration history:**
```bash
railway run npm run migrate:down  # Rollback
railway run npm run migrate:up    # Re-run
```

#### 4. Port Binding Error

**Solution:** Don't hardcode port. Use:
```javascript
const port = process.env.PORT || 8080;
```

Railway automatically sets `PORT` - respect it!

#### 5. CORS Errors

**Check ALLOWED_ORIGINS:**
```bash
railway variables | grep ALLOWED_ORIGINS
```

**Update if needed:**
```bash
railway variables --set ALLOWED_ORIGINS="https://your-frontend.com,http://localhost:3000"
```

---

## 📊 Monitoring

### View Logs

**Real-time:**
```bash
railway logs
```

**Last N lines:**
```bash
railway logs --tail 100
```

**In Dashboard:**
- Deployments → Click deployment → View Logs

### Health Checks

Add to your app (`index.js`):
```javascript
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISO String() 
  });
});
```

Test:
```bash
curl https://your-app.up.railway.app/health
```

---

## 🚦 Deployment Workflow

### Development Workflow

```
Local Development
    ↓
Test Locally (npm run dev)
    ↓
Commit Changes (git commit)
    ↓
Push to GitHub (git push)
    ↓
[GitHub Method: Auto-deploy]
[CLI Method: railway up]
[Docker Method: Auto-deploy if using GitHub]
    ↓
Verify Deployment
    ↓
Test Production API
```

### Rollback Strategy

**GitHub/Docker:**
1. Go to Deployments tab
2. Find last working deployment
3. Click "Redeploy"

**CLI:**
```bash
# Deploy specific commit
git checkout <commit-hash>
railway up
git checkout main
```

---

## 🔗 Useful Resources

### Official Documentation
- [Railway Docs](https://docs.railway.app)
- [Railway CLI Reference](https://docs.railway.app/develop/cli)
- [Railway Dockerfile Guide](https://docs.railway.app/deploy/dockerfiles)

### Community
- [Railway Discord](https://discord.gg/railway)
- [Railway Twitter](https://twitter.com/Railway)

### Related Guides
- [../plans/](../plans/) - All implementation plans
- [Swagger API Docs](http://localhost:8080/api-docs) - Local API documentation

---

## 📝 Summary

| Feature | GitHub | CLI | Docker |
|---------|--------|-----|--------|
| **Ease of Use** | ⭐⭐⭐ | ⭐⭐ | ⭐ |
| **Auto-Deploy** | ✅ | ❌ | ✅ |
| **Control** | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| **Team Friendly** | ✅ | ❌ | ✅ |
| **Reproducible** | ⭐⭐ | ⭐ | ⭐⭐⭐ |
| **Best For** | Production | Testing | Enterprise |

---

## 🎉 Next Steps

After successful deployment:

- [ ] Set up custom domain
- [ ] Configure environment-specific variables
- [ ] Add monitoring/alerting
- [ ] Set up staging environment
- [ ] Configure backup strategy
- [ ] Review security settings
- [ ] Add health check monitoring

**Your Todo API is now live on Railway!** 🚀

Choose a deployment method above and start deploying!
