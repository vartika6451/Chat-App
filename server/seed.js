import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  const dummyPassword = await bcrypt.hash("password123", 10);

  const aiUsers = [
    {
      name: "Jarvis AI",
      username: "jarvis",
      email: "jarvis@blink.ai",
      password: dummyPassword,
      bio: "At your service. Virtual assistant powered by Blink.",
      profileImage: "https://api.dicebear.com/7.x/bottts/svg?seed=Jarvis"
    },
    {
      name: "Blink Copilot",
      username: "copilot",
      email: "copilot@blink.ai",
      password: dummyPassword,
      bio: "Let's build something amazing together! I can help with code and ideas.",
      profileImage: "https://api.dicebear.com/7.x/bottts/svg?seed=Copilot"
    },
    {
      name: "Echo Bot",
      username: "echo_bot",
      email: "echo@blink.ai",
      password: dummyPassword,
      bio: "I repeat everything you say! Try me.",
      profileImage: "https://api.dicebear.com/7.x/bottts/svg?seed=Echo"
    }
  ];

  for (const user of aiUsers) {
    const upsertedUser = await prisma.user.upsert({
      where: { username: user.username },
      update: {
        name: user.name,
        bio: user.bio,
        profileImage: user.profileImage,
      },
      create: user,
    });
    console.log(`Created or found AI User: ${upsertedUser.name} (@${upsertedUser.username})`);
  }

  console.log("🌱 Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
