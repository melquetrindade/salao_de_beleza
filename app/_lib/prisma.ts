import { PrismaClient } from "@prisma/client"
import { PrismaNeon } from "@prisma/adapter-neon"

// Este código garante que a conecção com o
// Banco de dados só seja feita uma uníca vez

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required to initialize PrismaClient")
}

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL,
})

declare global {
  // eslint-disable-next-line no-var
  var cachedPrisma: PrismaClient | undefined
}

let prisma: PrismaClient
if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient({ adapter })
} else {
  if (!global.cachedPrisma) {
    global.cachedPrisma = new PrismaClient({ adapter })
  }
  prisma = global.cachedPrisma
}

export const db = prisma