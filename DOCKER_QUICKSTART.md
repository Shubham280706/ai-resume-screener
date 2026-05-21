# Docker Quick Start - Commands & Workflows

## 🚀 First Time Setup

### 1. Prerequisites
```bash
# Check Docker is installed
docker --version
# Output: Docker version 25.0.0+

# Check Docker Compose is installed
docker-compose --version
# Output: Docker Compose version 2.20.0+
```

If not installed:
- **Mac:** Download Docker Desktop from https://www.docker.com/products/docker-desktop
- **Linux:** Follow Docker installation guide
- **Windows:** Download Docker Desktop with WSL 2

### 2. Start Your Project

```bash
# Navigate to project directory
cd /Users/shubham/coding/ai-resume-screener

# Start the container (first run takes 2-3 minutes)
docker-compose up

# Output:
# ai-resume-screener | ready - started server on 0.0.0.0:3000, url: http://localhost:3000
```

### 3. Open in Browser
```
http://localhost:3000
```

**That's it!** Your app is running in Docker. 🎉

---

## 📝 Essential Commands

### ✅ Starting & Stopping

**Start containers**
```bash
docker-compose up

# Run in background
docker-compose up -d
```

**Stop containers**
```bash
docker-compose down

# Keep volumes (database data)
docker-compose down -v
```

**Restart containers**
```bash
docker-compose restart

# Restart specific service
docker-compose restart app
```

---

### 🔨 Building & Rebuilding

**Rebuild after adding npm dependencies**
```bash
docker-compose down
npm install new-package
docker-compose up --build
```

**Force rebuild (clear cache)**
```bash
docker-compose up --build --no-cache
```

**Just rebuild without starting**
```bash
docker-compose build

# Without cache
docker-compose build --no-cache
```

---

### 📊 Viewing Logs

**View all logs**
```bash
docker-compose logs

# Last 100 lines
docker-compose logs --tail=100

# Follow logs (real-time)
docker-compose logs -f
```

**View specific service logs**
```bash
# Only app logs
docker-compose logs -f app
```

**View detailed logs with timestamps**
```bash
docker-compose logs --timestamps
```

---

### 🔧 Debugging & Troubleshooting

**Run command in container**
```bash
# Run npm command
docker-compose exec app npm run build

# Check environment variables
docker-compose exec app env | grep GROQ

# Check file system
docker-compose exec app ls -la /app
```

**Access container shell**
```bash
docker-compose exec app sh

# Inside container:
# npm run build
# npm run dev
# npm test
# node -v
# exit
```

**Check container status**
```bash
docker-compose ps

# Output:
# NAME                  COMMAND           STATUS
# ai-resume-screener    npm run dev       Up 5 minutes
```

---

### 🗑️ Cleanup

**Remove stopped containers**
```bash
docker-compose rm
```

**Remove unused images**
```bash
docker image prune
```

**Complete cleanup (stop + remove containers)**
```bash
docker-compose down

# Also remove volumes (data)
docker-compose down -v

# Also remove images
docker-compose down -v --rmi all
```

---

## 🔄 Common Workflows

### Workflow 1: Daily Development Cycle

```bash
# 1. Start work
docker-compose up

# 2. Edit code in your IDE
# (hot reload works automatically)

# 3. Test in browser
# http://localhost:3000

# 4. View logs if needed
docker-compose logs -f

# 5. End of day
docker-compose down
```

**You rarely need to rebuild!** The volume mount + hot reload handles everything.

---

### Workflow 2: Adding npm Package

```bash
# 1. Stop container
docker-compose down

# 2. Install package
npm install axios

# 3. Rebuild container with new dependency
docker-compose up --build

# 4. Use package in your code immediately
```

**Wait for "ready - started server"** before opening browser.

---

### Workflow 3: Fixing File Upload Parsing Issues

```bash
# 1. View container logs to see error
docker-compose logs -f app

# 2. Access container shell to test
docker-compose exec app sh

# 3. Inside container - test parsing
npm run build

# 4. Exit shell
exit

# 5. Fix code in IDE

# 6. Hot reload handles the rest!
```

---

### Workflow 4: Testing Production Build Locally

```bash
# 1. Build production image
docker build -t ai-resume-screener:latest .

# 2. Run production container
docker run -p 3000:3000 \
  -e GROQ_API_KEY=your_key_here \
  ai-resume-screener:latest

# 3. Test at http://localhost:3000

# 4. Stop with Ctrl+C

# 5. Back to development
docker-compose up
```

---

### Workflow 5: Sharing Setup with Team

```bash
# Team member 1 (you):
git add Dockerfile Dockerfile.dev docker-compose.yml .dockerignore
git commit -m "Add Docker setup"
git push

# Team member 2:
git pull
docker-compose up

# Done! They have identical environment
```

---

## ⚙️ Configuration Files Explained

### docker-compose.yml
```yaml
version: '3.8'
services:
  app:
    build:
      context: .
      dockerfile: Dockerfile.dev
    # ↑ Use Dockerfile.dev for development

    ports:
      - "3000:3000"
    # ↑ Map host port 3000 to container port 3000

    volumes:
      - .:/app
      # ↑ Mount local code into container
      # Files sync automatically for hot reload

      - /app/node_modules
      # ↑ Don't sync node_modules (too large)

    environment:
      NODE_ENV: development
      GROQ_API_KEY: ${GROQ_API_KEY}
      # ↑ Load from .env.local
```

### .dockerignore
```
node_modules          # Too large, install in container
.next                 # Build cache, recreate in container
.git                  # Not needed in image
.env                  # Security, don't copy

# With these, Docker builds faster!
```

---

## 🐛 Troubleshooting

### Issue: "Port 3000 is already in use"

```bash
# Find what's using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or use different port in docker-compose.yml
ports:
  - "3001:3000"
```

### Issue: "Cannot find node_modules"

```bash
# Rebuild containers
docker-compose down
docker-compose up --build

# This reinstalls all dependencies
```

### Issue: Hot reload not working

```bash
# Check volume is mounted correctly
docker-compose exec app ls -la /app/src

# Restart container
docker-compose restart

# Check logs
docker-compose logs app
```

### Issue: "npm ERR! code ERESOLVE"

```bash
# Clear npm cache and rebuild
docker-compose down
npm cache clean --force
npm install
docker-compose up --build
```

### Issue: Container using too much RAM

```bash
# Check memory usage
docker stats ai-resume-screener

# Limit memory in docker-compose.yml
services:
  app:
    deploy:
      resources:
        limits:
          memory: 2G
```

---

## 📦 File Structure for Docker

```
project/
├── Dockerfile              ← Production image
├── Dockerfile.dev          ← Development image  
├── docker-compose.yml      ← Dev services
├── .dockerignore          ← Exclude files from Docker
├── next.config.ts         ← Docker-optimized config
├── src/
│   ├── app/
│   │   └── api/analyze/route.ts
│   └── components/
├── package.json
└── .env.local             ← Your secrets (loaded by docker-compose)
```

---

## 🔐 Security Best Practices

### Development
```bash
# ✅ OK: Secrets in .env.local
GROQ_API_KEY=gsk_xxxx

# ✅ OK: docker-compose loads from .env.local
env_file:
  - .env.local
```

### Production
```bash
# ❌ DON'T: Hardcode secrets in Dockerfile
ENV GROQ_API_KEY=xxx

# ✅ DO: Pass at runtime
docker run -e GROQ_API_KEY=$(get-secret) app:latest

# ✅ DO: Use cloud secret manager
# AWS: docker run -e GROQ_API_KEY=$(aws secretsmanager ...) 
# Vercel: Set environment variables in Vercel dashboard
```

---

## ✨ Advanced Commands

### View container resource usage
```bash
docker stats ai-resume-screener

# Output:
# CONTAINER   CPU %   MEM USAGE / LIMIT
# ai-resume   0.2%    280MB / 8GB
```

### Inspect container
```bash
docker-compose ps -a

# Get container ID
docker inspect <container_id>
```

### View container network
```bash
docker network ls

docker network inspect ai-resume-screener_app-network
```

---

## 🚢 When Ready for Production

### Deploy to Vercel (Recommended)
```bash
# Vercel automatically builds Next.js
# No need for Docker

vercel deploy
```

### Deploy to AWS
```bash
# Build production image
docker build -t ai-resume-screener:latest .

# Push to ECR
aws ecr get-login-password | docker login --username AWS --password-stdin <ecr-url>
docker tag ai-resume-screener:latest <ecr-url>:latest
docker push <ecr-url>:latest

# Run on ECS/EC2
docker run -p 3000:3000 -e GROQ_API_KEY=xxx <image>
```

### Deploy to DigitalOcean/Self-hosted
```bash
# Build image
docker build -t ai-resume-screener:latest .

# Transfer to server
docker save ai-resume-screener:latest | gzip > image.tar.gz
scp image.tar.gz user@server:

# On server
docker load < image.tar.gz
docker run -p 3000:3000 -e GROQ_API_KEY=xxx ai-resume-screener
```

---

## 📞 Need Help?

### View comprehensive guide
```bash
cat DOCKER_GUIDE.md
```

### Check container logs for errors
```bash
docker-compose logs app
```

### Run tests inside container
```bash
docker-compose exec app npm test
```

### Check Next.js build output
```bash
docker-compose exec app npm run build
```

---

## 🎯 Quick Reference

| Task | Command |
|------|---------|
| Start dev | `docker-compose up` |
| Stop dev | `docker-compose down` |
| Rebuild | `docker-compose up --build` |
| Logs | `docker-compose logs -f` |
| Shell | `docker-compose exec app sh` |
| npm command | `docker-compose exec app npm run build` |
| Cleanup | `docker-compose down -v --rmi all` |
| Status | `docker-compose ps` |
| Production | `docker build -t app:latest . && docker run app:latest` |

---

**Happy containerizing!** 🐳 Your app is now production-ready with Docker.
