# Option 3: Docker Deployment to Railway

> **Best for:** Production-grade deployments, custom environments, consistency  
> **Difficulty:** ⭐⭐⭐ Advanced  
> **Time:** ~20 minutes

## Overview

Deploy your Todo API as a Docker container to Railway. This method gives you complete control over the runtime environment and ensures consistency across development and production.

## Prerequisites

- ✅ Railway account ([signup here](https://railway.app))
- ✅ Docker Desktop installed ([download here](https://www.docker.com/products/docker-desktop))
- ✅ Railway CLI installed (optional, but recommended)
- ✅ Basic Docker knowledge

---

## Step 1: Understand the Dockerfile

Your project already includes a `Dockerfile`. Let's review it:

```dockerfile
# Use official Node.js LTS image
FROM node:20-alpine AS base

# Install dependencies for node-gyp and PostgreSQL
RUN apk add --no-cache python3 make g++ postgresql-client

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Expose port (Railway will override this)
EXPOSE 8080

# Run migrations and start server
CMD ["sh", "-c", "npm run migrate:up && npm start"]
```

**Key features:**
- 📦 Alpine Linux (small image size)
- 🔧 PostgreSQL client for migrations
- 🚀 Production dependencies only
- ⚙️ Automatic migrations on startup

---

## Step 2: Test Docker Build Locally

**Why test locally?** Catch errors before deploying.

### 2.1 Build Docker Image

```bash
cd d:\TUTORIALS\Backend-development\todo

docker build -t todo-api:latest .
```

**Expected output:**
```
[+] Building 45.2s (12/12) FINISHED
 => [internal] load .dockerignore
 => [internal] load build definition from Dockerfile
 => [base 1/6] FROM docker.io/library/node:20-alpine
 ...
 => => naming to docker.io/library/todo-api:latest
```

### 2.2 Check Image Size

```bash
docker images todo-api
```

Expected size: ~200-300 MB

### 2.3 Test Run Locally (Optional)

```bash
# Create .env.docker for local testing
cp .env .env.docker

# Run container
docker run --rm \
  --env-file .env.docker \
  -p 8080:8080 \
  todo-api:latest
```

**Note:** This requires local PostgreSQL. For full testing, use Docker Compose (not covered here).

### 2.4 Stop Container

```bash
# Press Ctrl+C
# Or in another terminal:
docker ps
docker stop <container-id>
```

---

## Step 3: Optimize Dockerfile (Optional)

### Multi-stage Build for Smaller Images

```dockerfile
# Builder stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

# Production stage
FROM node:20-alpine
RUN apk add --no-cache postgresql-client
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app .
EXPOSE 8080
CMD ["sh", "-c", "npm run migrate:up && npm start"]
```

This reduces image size by ~30%.

---

## Step 4: Deploy to Railway with Docker

### 4.1 Option A: Deploy via GitHub (Recommended)

Railway automatically detects Dockerfile in your repository.

**Steps:**
1. Push your code to GitHub (including Dockerfile)
2. Follow [GitHub deployment guide](./01-github-deployment.md)
3. Railway will automatically use your Dockerfile! ✅

**Verification:**
- In Railway dashboard → Deployments → Build Logs
- Look for: `"Found Dockerfile, using Docker builder"`

### 4.2 Option B: Deploy via Railway CLI

```bash
# Login to Railway
railway login

# Initialize project (if not done)
railway init

# Deploy
railway up
```

Railway detects `Dockerfile` and builds automatically.

---

## Step 5: Configure Railway for Docker

### 5.1 Create railway.json (Docker-specific)

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "DOCKERFILE",
    "dockerfilePath": "Dockerfile"
  },
  "deploy": {
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### 5.2 Environment Variables

Docker containers get environment variables from Railway.

**Required variables** (set in Railway dashboard or CLI):
- `DATABASE_URL` - Auto-set by Railway
- `PORT` - Auto-set by Railway  
- `JWT_SECRET` - **You must set this**
- `ADMIN_SECRET` - **You must set this**
- `ALLOWED_ORIGINS` - **You must set this**
- `NODE_ENV` - Set to `production`

**Set via Railway CLI:**
```bash
railway variables --set JWT_SECRET="your_secret"
railway variables --set ADMIN_SECRET="your_admin_secret"
railway variables --set ALLOWED_ORIGINS="https://your-frontend.com"
railway variables --set NODE_ENV="production"
```

---

## Step 6: Add PostgreSQL Database

Same as other deployment methods:

```bash
# Via CLI
railway add

# Select: Database → PostgreSQL
```

Or via Railway dashboard:
1. Click "+ New"
2. Select "Database" → "PostgreSQL"

Railway automatically sets `DATABASE_URL` environment variable.

---

## Step 7: Deploy and Verify

### 7.1 Trigger Deployment

**If using GitHub:**
```bash
git add .
git commit -m "Add Dockerfile for Railway deployment"
git push
```

**If using CLI:**
```bash
railway up
```

### 7.2 Monitor Build Logs

```bash
# Via CLI
railway logs

# Or in Railway dashboard:
# Deployments → Click latest → View Logs
```

**Look for:**
```
✅ Building Docker image...
✅ Step 1/8 : FROM node:20-alpine
✅ Step 8/8 : CMD npm run migrate:up && npm start
✅ Successfully built image
✅ Deploying...
✅ Running migrations...
✅ Server running at http://localhost:8080
```

### 7.3 Generate Domain

```bash
railway domain
```

Or in dashboard: Settings → Domains → Generate Domain

### 7.4 Test Deployment

```bash
# Test root endpoint
curl https://your-app.up.railway.app

# Test Swagger UI
# Open in browser: https://your-app.up.railway.app/api-docs

# Test signup
curl -X POST https://your-app.up.railway.app/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"dockertest","password":"password123"}'
```

---

## Step 8: Advanced Docker Features

### 8.1 Health Checks

Add to Dockerfile:

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s \
  CMD node -e "require('http').get('http://localhost:8080', (r) => r.statusCode === 200 ? process.exit(0) : process.exit(1))"
```

### 8.2 Docker Compose for Local Development

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "8080:8080"
    environment:
      DATABASE_URL: postgresql://user:password@db:5432/tododb
      JWT_SECRET: local_jwt_secret
      ADMIN_SECRET: local_admin_secret
      ALLOWED_ORIGINS: http://localhost:3000
      NODE_ENV: development
    depends_on:
      - db

  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: tododb
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

**Run locally:**
```bash
docker-compose up
```

### 8.3 Multi-architecture Builds

For deploying to ARM-based servers:

```bash
docker buildx build --platform linux/amd64,linux/arm64 -t todo-api:latest .
```

---

## Troubleshooting

### Issue: Build Fails - "npm install" Error

**Solution:**
Check `package.json` has all dependencies listed.

```bash
# Test locally
docker build --no-cache -t todo-api:test .
```

### Issue: Container Starts But Crashes

**Check logs:**
```bash
railway logs --tail 100
```

**Common causes:**
- Missing environment variables
- Database connection failure
- Port binding issues

**Verify environment inside container:**
```bash
railway run env
```

### Issue: Migrations Don't Run

**Check if migrations are included in image:**
```bash
# Verify .dockerignore doesn't exclude migrations/
cat .dockerignore
```

**Manually run migrations:**
```bash
railway run npm run migrate:up
```

### Issue: Image Too Large

**Current size:**
```bash
docker images todo-api
```

**Optimization tips:**
1. Use multi-stage builds
2. Use `.dockerignore` properly
3. Remove dev dependencies
4. Use Alpine base images

**Check what's in the image:**
```bash
docker run --rm todo-api:latest ls -lah /app
```

### Issue: "Cannot find module"

**Solution:** Ensure `node_modules` is copied correctly.

```dockerfile
# Make sure this is in your Dockerfile
COPY package*.json ./
RUN npm ci --only=production
COPY . .
```

---

## Docker Best Practices

### ✅ Do's

- ✅ Use `.dockerignore` to exclude unnecessary files
- ✅ Use multi-stage builds for smaller images
- ✅ Run as non-root user (for security)
- ✅ Cache dependencies layer separately
- ✅ Use specific image tags (`:20-alpine` not `:latest`)
- ✅ Add health checks

### ❌ Don'ts

- ❌ Don't include `.env` in image
- ❌ Don't hardcode secrets in Dockerfile
- ❌ Don't use `:latest` tag in production
- ❌ Don't run as root user
- ❌ Don't skip `.dockerignore`

---

## Security Hardening

### Run as Non-Root User

Add to Dockerfile:

```dockerfile
# Create app user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Change ownership
RUN chown -R nodejs:nodejs /app
USER nodejs

# Then run app
CMD ["sh", "-c", "npm run migrate:up && npm start"]
```

### Scan for Vulnerabilities

```bash
# Using Docker Scout
docker scout cves todo-api:latest

# Using Trivy
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
  aquasec/trivy:latest image todo-api:latest
```

---

## Cost Estimation

**Same as other deployment methods:**
- Web Service: ~$3-4/month
- PostgreSQL: ~$1-2/month
- **Total: ~$5/month** ✅ Fits free tier!

**Docker doesn't increase costs** - you're still running the same app!

---

## Advantages of Docker Deployment

✅ **Consistency** - Same environment everywhere  
✅ **Control** - Full control over runtime  
✅ **Reproducible** - Exact same setup every time  
✅ **Portable** - Easy to move between platforms  
✅ **Scalable** - Container orchestration ready  

## Disadvantages

❌ **Complexity** - Requires Docker knowledge  
❌ **Build time** - Longer than Nixpacks  
❌ **Maintenance** - Need to update base images  

---

## Next Steps

✅ **Docker deployment complete!**

**Consider:**
- [ ] Set up Docker Compose for local development
- [ ] Add health check endpoint
- [ ] Implement multi-stage builds
- [ ] Configure container security scanning
- [ ] Set up container monitoring

---

## Summary

**What we did:**
1. ✅ Created optimized Dockerfile
2. ✅ Added .dockerignore
3. ✅ Tested build locally
4. ✅ Deployed to Railway
5. ✅ Configured environment variables
6. ✅ Verified deployment

**Your containerized app is live!** 🐳🚀

**Advantages:**
- Production-grade consistency
- Full environment control
- Easy to replicate
