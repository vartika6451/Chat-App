// config/db.js
import { prisma } from "./prisma.js";

export const connectDB = async () => {
  console.log("⏳ [DATABASE] Connection request initialized...");
  try {
    await prisma.$connect();
    console.log("✅ [DATABASE] Connected to PostgreSQL via Prisma successfully");
  } catch (error) {
    console.error(`❌ [DATABASE] Connection failed: ${error.message}`);
    process.exit(1);
  }
};
