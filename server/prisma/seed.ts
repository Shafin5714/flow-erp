import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { seedCategories } from "./seeders/categories.js";
import { seedBrands } from "./seeders/brands.js";
import { seedProducts } from "./seeders/products.js";
import { seedVendors } from "./seeders/index.js";

// Initialize Prisma with pg adapter (matching db.ts pattern)
const connectionString = process.env.DATABASE_URL!;
const pool = new Pool({ connectionString });
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const adapter = new PrismaPg(pool as any);
const prisma = new PrismaClient({ adapter });

interface SeedUser {
  email: string;
  name: string;
  password: string;
  role: "ADMIN" | "MANAGER" | "STAFF";
}

const seedUsers: SeedUser[] = [
  {
    email: "admin@flow-erp.com",
    name: "Admin User",
    password: "admin123",
    role: "ADMIN",
  },
  {
    email: "manager@flow-erp.com",
    name: "Manager User",
    password: "manager123",
    role: "MANAGER",
  },
  {
    email: "staff@flow-erp.com",
    name: "Staff User",
    password: "staff123",
    role: "STAFF",
  },
];

async function main() {
  console.log("🌱 Seeding database...\n");

  // 1. Seed Users
  console.log("👤 Seeding users...\n");
  for (const user of seedUsers) {
    const hashedPassword = await bcrypt.hash(user.password, 10);

    const createdUser = await prisma.user.upsert({
      where: { email: user.email },
      update: {
        name: user.name,
        password: hashedPassword,
        role: user.role,
      },
      create: {
        email: user.email,
        name: user.name,
        password: hashedPassword,
        role: user.role,
      },
    });

    console.log(
      `  ✅ ${createdUser.role.padEnd(7)} → ${createdUser.email} (password: ${user.password})`
    );
  }
  console.log();

  // 2. Seed Categories
  await seedCategories(prisma);

  // 3. Seed Brands
  await seedBrands(prisma);

  // 3.5 Seed Vendors
  await seedVendors(prisma);

  // 4. Seed Products (depends on categories & brands)
  await seedProducts(prisma);

  console.log("🎉 Seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
