import { PrismaClient } from '@prisma/client'

// Prevent instantiation during build when DATABASE_URL might not be truly available
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Only create the client if we have a DATABASE_URL
// During build time, even with a dummy URL, we export undefined to avoid connection attempts
const prisma =
  globalForPrisma.prisma ??
  (process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('dummy')
    ? new PrismaClient()
    : undefined)

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

export default prisma as PrismaClient
