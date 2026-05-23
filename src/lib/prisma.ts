import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

if (!globalForPrisma.prisma) {
  // Force SSL to accept self-signed certs
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
    max: 3,
    connectionTimeoutMillis: 15000,
    idleTimeoutMillis: 30000,
  })

  const adapter = new PrismaPg(pool)
  globalForPrisma.prisma = new PrismaClient({
    adapter,
    log: ['error'],
  })
}

export const prisma = globalForPrisma.prisma
export default prisma
