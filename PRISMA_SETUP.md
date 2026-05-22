# Prisma v7 Setup Guide - Permanent Solution

## The Problem: Engine Type Mismatch

Prisma v7 introduced a new architecture with different engine types:
- **`node`** - For Node.js/Bun backends (default for `npx prisma`)
- **`client`** - For Edge Runtime (Cloudflare Workers, Vercel Edge Functions, etc.)

Without proper configuration, Prisma v7 defaults to the "client" engine in some contexts, which requires additional adapters (`adapter` or `accelerateUrl`) that we don't need for Node.js.

## The Solution: Multi-Layer Configuration

This project uses three complementary layers to ensure Prisma always uses the Node.js engine:

### 1. Schema Generator Configuration (`prisma/schema.prisma`)
```prisma
generator client {
  provider = "prisma-client-js"
  engineType = "node"  // Explicitly specify Node.js engine
}
```
This ensures the Prisma Client is generated specifically for Node.js runtime.

### 2. Environment Variables (`.env.local`)
```bash
PRISMA_CLIENT_ENGINE_TYPE=node
PRISMA_QUERY_ENGINE_TYPE=node
```
These environment variables:
- Are loaded at runtime by Next.js
- Ensure the Prisma Client uses the correct engine
- Act as a fallback if schema configuration isn't picked up

### 3. Docker Configuration (`Dockerfile.dev`)
```dockerfile
# Set environment variables EARLY (before any Prisma operations)
ENV NODE_ENV=development
ENV PRISMA_CLIENT_ENGINE_TYPE=node
ENV PRISMA_QUERY_ENGINE_TYPE=node
```
These ensure the build process and runtime both use Node.js engine.

## Why All Three Layers?

- **Schema config**: Makes the intent explicit in code, applies everywhere
- **Environment variables**: Fallback for runtime, ensures consistency
- **Docker ENV**: Ensures build-time Prisma generation works correctly

## How to Verify It's Working

After rebuilding Docker:

```bash
docker-compose down
docker-compose build --no-cache
docker-compose up
```

You should see:
1. ✓ Docker build completes without engine type errors
2. ✓ Next.js starts successfully ("Ready in Xms")
3. ✓ API requests don't throw `PrismaClientConstructorValidationError`

## If You Still Get Engine Errors

1. **Clear Prisma cache**:
   ```bash
   rm -rf node_modules/.prisma
   npm install
   npx prisma generate
   ```

2. **Verify environment variables are loaded**:
   ```bash
   echo $PRISMA_CLIENT_ENGINE_TYPE  # Should output: node
   ```

3. **Check Docker volumes aren't stale**:
   ```bash
   docker-compose down -v
   docker-compose up --build
   ```

## Future Development

When updating Prisma:
1. Always verify the generator block has `engineType = "node"`
2. Keep the environment variables in `.env.local`
3. Rebuild Docker with `--no-cache` if engine errors appear

This permanent solution ensures Prisma v7 works correctly across:
- ✓ Local development (`npm run dev`)
- ✓ Docker development (`docker-compose up`)
- ✓ CI/CD pipelines
- ✓ Future team members
