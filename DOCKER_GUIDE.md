# Docker Guide - AI Resume Screener

## Understanding Docker Setup

### What is Docker?
Docker containerizes your application so it runs the same way on your laptop, your teammate's machine, and production servers.

### Two Dockerfiles in This Project

#### **Dockerfile** (Production)
```dockerfile
Multi-stage build:
Stage 1: Builder - Install deps, build Next.js
Stage 2: Runtime - Copy built app, run server

Result: ~300MB image, optimized for production
```

**When to use:**
- Deploying to production (Vercel, AWS, etc.)
- Creating a production image
- Sharing with team/users

**Why it's efficient:**
- Builder stage has all build tools
- Runtime stage only has essentials
- Smaller final image = faster deploys

#### **Dockerfile.dev** (Development)
```dockerfile
Simple single-stage build:
Install deps, copy code, run dev server

Result: ~1GB image, includes all dev tools
```

**When to use:**
- Local development
- Debugging
- Testing
- Using `docker-compose up`

**Why it's different:**
- Includes all npm dev dependencies
- Easier to modify and rebuild quickly
- Slower startup (but only happens once)

---

## How hot reload works in Docker

### Without Docker
```
Edit file → Next.js watches file → Browser auto-refreshes
```

### With Docker Volume Mount
```
Edit file on host
    ↓
File synced to container (via volume mount)
    ↓
Next.js dev server watches (with polling)
    ↓
Browser auto-refreshes
```

**Volume mounts** in docker-compose.yml:
```yaml
volumes:
  - .:/app                 # Mount entire project
  - /app/node_modules      # Don't sync node_modules
  - /app/.next            # Don't sync build cache
```

This allows:
- ✅ Edit code on your laptop
- ✅ Changes appear in container
- ✅ Next.js dev server rebuilds
- ✅ Browser refreshes

---

## How to Update Features Later

### Scenario 1: Modify Existing Code

```bash
# 1. Container is already running
docker-compose up

# 2. Edit code in your IDE
# (changes sync automatically via volume mount)

# 3. Browser refreshes automatically
# No rebuild needed!
```

**That's it!** The volume mount handles everything.

### Scenario 2: Add New npm Dependencies

```bash
# 1. Stop container
docker-compose down

# 2. Add dependency
npm install new-package

# 3. Rebuild container
docker-compose up --build

# 4. Container is ready with new dependency
```

**Important:** `--build` rebuilds the image with new dependencies.

### Scenario 3: Add New Files (API routes, components, etc.)

```bash
# 1. Files are mounted via volume
# 2. Just create files in your IDE
# 3. Container picks them up automatically
# 4. No rebuild needed!
```

### Scenario 4: Change Environment Variables

```bash
# 1. Edit .env.local
GROQ_API_KEY=new_key

# 2. Restart container
docker-compose restart

# 3. New env vars loaded
```

---

## Rebuilding Containers After Changes

### When to Rebuild

| Change Type | Rebuild Needed? | Command |
|-------------|-----------------|---------|
| Edit code | ❌ No | Just save file |
| Add npm dependency | ✅ Yes | `docker-compose up --build` |
| Change Dockerfile | ✅ Yes | `docker-compose up --build` |
| Change docker-compose.yml | ⚠️ Sometimes | `docker-compose up --build` |
| Change environment variables | ❌ No (restart only) | `docker-compose restart` |
| Change Next.js config | ❌ No (hot reload) | Just save file |

### Rebuild Command

```bash
# Rebuild and restart
docker-compose up --build

# Force rebuild even if nothing changed
docker-compose up --build --force-recreate

# Rebuild without starting
docker-compose build --no-cache
```

---

## Development vs Production Containers

### Development (docker-compose.yml + Dockerfile.dev)

```
🟢 Running locally with docker-compose
├─ Hot reload enabled
├─ All npm dev tools included
├─ Slow startup (1-2 minutes)
├─ Large image size (~1GB)
└─ Perfect for development
```

**Usage:**
```bash
docker-compose up
# App runs on http://localhost:3000
```

### Production (Dockerfile)

```
🟢 Running on Vercel/AWS/server
├─ No dev tools
├─ Multi-stage build
├─ Fast startup (~30 seconds)
├─ Small image size (~300MB)
└─ Optimized for performance
```

**Usage:**
```bash
# Build production image
docker build -t ai-resume-screener:latest .

# Run production container
docker run -p 3000:3000 \
  -e GROQ_API_KEY=your_key \
  ai-resume-screener:latest
```

### Key Differences

| Aspect | Development | Production |
|--------|-------------|-----------|
| Dockerfile | Dockerfile.dev | Dockerfile |
| Image size | ~1GB | ~300MB |
| Startup time | 60-90s | 20-30s |
| Hot reload | ✅ Yes | ❌ No |
| Dev tools | ✅ Yes | ❌ No |
| Source maps | ✅ Yes | ❌ No |
| Best for | Local dev | Server/cloud |

---

## Architecture for Future Scalability

### Current Setup (Single Container)

```
┌─────────────────────┐
│   Docker Container  │
│                     │
│  • Next.js app      │
│  • API routes       │
│  • File parsing     │
│  • AI integration   │
└─────────────────────┘
```

### Future Setup (Multiple Services)

When you add PostgreSQL, Redis, or workers:

```yaml
version: '3.8'

services:
  app:
    # Next.js application (unchanged)
    
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: resume_screener
    volumes:
      - postgres_data:/var/lib/postgresql/data
  
  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

**How to add services:**

1. Add service definition to docker-compose.yml
2. Update environment variables to point to new service
3. Run `docker-compose up --build`

**Example: Adding PostgreSQL**

```yaml
# In docker-compose.yml
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: resume_db
      POSTGRES_PASSWORD: dev_password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

**In .env.local:**
```
DATABASE_URL=postgresql://postgres:dev_password@postgres:5432/resume_db
```

---

## File Watching & Hot Reload Details

### How it Works in Docker

Next.js uses file watchers to detect changes. In Docker:

1. **Volume Mount** - Host files sync to container
2. **Polling** - Next.js checks for changes every 1 second
3. **Rebuild** - Changes detected, Next.js rebuilds
4. **Broadcast** - WebSocket notifies browser
5. **Refresh** - Browser refreshes with new code

### Turbopack Configuration

```typescript
// next.config.ts
turbopack: {
  resolveAlias: {},  // Empty for default behavior
}
```

This enables Turbopack (Next.js 16 default) which:
- ✅ Watches file changes
- ✅ Hot module replacement (HMR)
- ✅ Fast rebuild times
- ✅ Works in Docker containers

### If Hot Reload Isn't Working

1. **Check volumes are mounted:**
   ```bash
   docker-compose exec app ls -la /app
   ```

2. **Restart container:**
   ```bash
   docker-compose restart app
   ```

3. **Check file permissions:**
   ```bash
   docker-compose exec app whoami
   ```

4. **View logs:**
   ```bash
   docker-compose logs -f app
   ```

---

## Performance Tips

### For Development

```yaml
# docker-compose.yml - limit resource usage
services:
  app:
    # Limit memory to 2GB (don't use all laptop RAM)
    deploy:
      resources:
        limits:
          memory: 2G
```

### For Production

```dockerfile
# Dockerfile - use Alpine for small size
FROM node:20-alpine  # Only 186MB
# vs
FROM node:20         # 1.1GB
```

---

## Common Workflows

### Workflow 1: Daily Development

```bash
# Start of day
docker-compose up

# Edit code, test, iterate
# (hot reload handles everything)

# End of day
docker-compose down
```

### Workflow 2: Adding a Feature

```bash
# 1. Start container
docker-compose up

# 2. Add new component/API route
# (files in components/ or app/api/)

# 3. Edit code, test
# (hot reload works automatically)

# 4. Done! No rebuild needed
```

### Workflow 3: Adding Dependencies

```bash
# 1. Stop container
docker-compose down

# 2. Install package
npm install new-package

# 3. Rebuild with dependencies
docker-compose up --build

# 4. Continue development
```

### Workflow 4: Debugging Issues

```bash
# View container logs
docker-compose logs -f app

# Run command in container
docker-compose exec app npm run build

# Access container shell
docker-compose exec app sh

# Check environment variables
docker-compose exec app env | grep GROQ
```

---

## Security in Docker

### Development (Less Critical)
- Running on localhost only
- Dev environment variables
- No secrets exposed

### Production (Important)
- Non-root user (nextjs:1001)
- No build tools included
- Minimal attack surface
- Environment variables from secrets

**Example production run:**
```bash
docker run -p 3000:3000 \
  -e GROQ_API_KEY=$(aws secretsmanager get-secret-value ...) \
  ai-resume-screener:latest
```

---

## Next Steps

When ready to add features:

1. **Database (PostgreSQL)**
   - Add `postgres` service to docker-compose.yml
   - Add `DATABASE_URL` to .env.local
   - Install Prisma: `npm install @prisma/client`
   - Use Prisma client in API routes

2. **Redis (Caching/Queues)**
   - Add `redis` service to docker-compose.yml
   - Install Redis client: `npm install redis`
   - Use in API routes for caching

3. **Background Workers (BullMQ)**
   - Add `bull-api` service
   - Install bull: `npm install bull`
   - Queue resume processing jobs

4. **Authentication**
   - Keep in Next.js (no separate service)
   - Use Clerk or Auth0
   - No Docker changes needed

All without changing your current setup! Just add services to docker-compose.yml.
