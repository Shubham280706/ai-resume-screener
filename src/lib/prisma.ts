import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import * as dns from 'dns'
import { URL } from 'url'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Force IPv4 DNS resolution
dns.setDefaultResultOrder('ipv4first')

// Parse DATABASE_URL to extract components
const databaseUrl = process.env.DATABASE_URL
if (!databaseUrl) {
  throw new Error('DATABASE_URL is not set')
}

const url = new URL(databaseUrl)
const config = {
  host: url.hostname,
  port: parseInt(url.port || '5432', 10),
  database: url.pathname.slice(1),
  user: url.username,
  password: url.password,
  ssl: true,
  family: 4, // Force IPv4
}

// Create pool with explicit config
const pool = new Pool(config)

const adapter = new PrismaPg(pool)

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma
