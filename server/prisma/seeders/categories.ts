import { PrismaClient } from "@prisma/client";

// Categories with subcategories
const categoryData = [
  {
    name: "Electronics",
    children: [
      { name: "Mobile Phones" },
      { name: "Laptops & Computers" },
      { name: "Tablets" },
      { name: "Audio & Headphones" },
      { name: "Cameras" },
    ],
  },
  {
    name: "Clothing & Apparel",
    children: [
      { name: "Men's Clothing" },
      { name: "Women's Clothing" },
      { name: "Kids' Clothing" },
      { name: "Footwear" },
      { name: "Accessories" },
    ],
  },
  {
    name: "Home & Kitchen",
    children: [
      { name: "Furniture" },
      { name: "Kitchen Appliances" },
      { name: "Home Décor" },
      { name: "Bedding & Bath" },
    ],
  },
  {
    name: "Health & Beauty",
    children: [
      { name: "Skincare" },
      { name: "Hair Care" },
      { name: "Fragrances" },
      { name: "Supplements" },
    ],
  },
  {
    name: "Sports & Outdoors",
    children: [{ name: "Gym Equipment" }, { name: "Outdoor Gear" }, { name: "Sportswear" }],
  },
  {
    name: "Books & Stationery",
    children: [{ name: "Books" }, { name: "Office Supplies" }, { name: "Art Supplies" }],
  },
];

export async function seedCategories(prisma: PrismaClient) {
  console.log("📂 Seeding categories...\n");

  let count = 0;

  for (const cat of categoryData) {
    const parent = await prisma.category.upsert({
      where: { name: cat.name },
      update: {},
      create: { name: cat.name },
    });
    count++;
    console.log(`  📁 ${parent.name}`);

    if (cat.children) {
      for (const child of cat.children) {
        let existing = await prisma.category.findFirst({
          where: { name: child.name },
        });

        if (!existing) {
          existing = await prisma.category.create({
            data: { name: child.name },
          });
        }

        // Use raw SQL to set parentId (Prisma v7 + pg adapter doesn't expose it in the API)
        await (prisma as any).$executeRawUnsafe(
          `UPDATE "Category" SET "parentId" = $1 WHERE "id" = $2`,
          parent.id,
          existing.id
        );

        count++;
        console.log(`     └─ ${child.name}`);
      }
    }
  }

  console.log(`\n  ✅ ${count} categories seeded\n`);
}
