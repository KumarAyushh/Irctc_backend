import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { config } from "./index.js";
import dotenv from "dotenv";
dotenv.config();

const connectionString = process.env.DATABASE_URL;

const globalForPrisma = globalThis;

if (!globalForPrisma.prisma) {
  const pool = new Pool({
    connectionString,
  });

  const adapter = new PrismaPg(pool);

  globalForPrisma.prisma = new PrismaClient({
    adapter,
    log: ["error", "warn"],
  });
}

const prisma = globalForPrisma.prisma;

export default prisma;