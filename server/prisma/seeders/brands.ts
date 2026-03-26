import { PrismaClient } from "@prisma/client";

const brandNames = [
  "Apple",
  "Samsung",
  "Sony",
  "Nike",
  "Adidas",
  "LG",
  "HP",
  "Dell",
  "Lenovo",
  "Xiaomi",
  "Logitech",
  "Canon",
  "Puma",
  "Philips",
  "Dyson",
  "Ikea",
  "Unilever",
  "L'Oréal",
  "Nestlé",
  "Bose",
];

export async function seedBrands(prisma: PrismaClient) {
  console.log("🏷️  Seeding brands...\n");

  for (const name of brandNames) {
    await (prisma as any).brand.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    console.log(`  ✅ ${name}`);
  }

  console.log(`\n  ✅ ${brandNames.length} brands seeded\n`);
}
