import { PrismaClient } from "../prisma/generated/prisma";

interface Global {
	prisma: PrismaClient | undefined;
}

const globalForPrisma = globalThis as any as Global;

export const db = globalForPrisma.prisma || new PrismaClient({ log: ['query', 'info', 'warn', 'error'], });

if (process.env.NODE_ENV !== "production") {
	globalForPrisma.prisma = db;
}
