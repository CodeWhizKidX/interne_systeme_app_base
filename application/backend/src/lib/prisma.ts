/**
 * Prismaクライアント
 */
import { PrismaClient } from "@prisma/client";

// Prismaクライアントのシングルトンインスタンス
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === "development" 
    ? ["query", "error", "warn"] 
    : ["error"],
});

/**
 * すべてのPrismaクライアントを切断
 * アプリケーション終了時に呼び出す
 */
export async function disconnectAllPrismaClients(): Promise<void> {
  await prisma.$disconnect();
  console.log("[Prisma] Client disconnected");
}

export { prisma };
export default prisma;

