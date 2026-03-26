import { PrismaClient } from "@prisma/client";

interface ProductSeed {
  name: string;
  sku: string;
  unit: string;
  costPrice: number;
  salePrice: number;
  stock: number;
  lowStockThreshold: number;
  categoryName: string; // resolved at seed time
  brandName: string; // resolved at seed time
  tags: string[];
  weight?: number;
  barcode?: string;
  warrantyPeriod?: string;
}

const productData: ProductSeed[] = [
  // ── Electronics ──
  {
    name: "iPhone 15 Pro Max",
    sku: "ELEC-APL-001",
    unit: "pcs",
    costPrice: 1099,
    salePrice: 1299,
    stock: 50,
    lowStockThreshold: 10,
    categoryName: "Mobile Phones",
    brandName: "Apple",
    tags: ["smartphone", "flagship", "5g"],
    weight: 0.221,
    warrantyPeriod: "12 months",
  },
  {
    name: "Samsung Galaxy S24 Ultra",
    sku: "ELEC-SAM-001",
    unit: "pcs",
    costPrice: 1050,
    salePrice: 1249,
    stock: 40,
    lowStockThreshold: 8,
    categoryName: "Mobile Phones",
    brandName: "Samsung",
    tags: ["smartphone", "flagship", "s-pen"],
    weight: 0.233,
    warrantyPeriod: "12 months",
  },
  {
    name: "Xiaomi Redmi Note 13 Pro",
    sku: "ELEC-XIA-001",
    unit: "pcs",
    costPrice: 180,
    salePrice: 249,
    stock: 100,
    lowStockThreshold: 15,
    categoryName: "Mobile Phones",
    brandName: "Xiaomi",
    tags: ["smartphone", "mid-range", "camera"],
    weight: 0.187,
    warrantyPeriod: "12 months",
  },
  {
    name: 'MacBook Air M3 15"',
    sku: "ELEC-APL-002",
    unit: "pcs",
    costPrice: 1100,
    salePrice: 1399,
    stock: 25,
    lowStockThreshold: 5,
    categoryName: "Laptops & Computers",
    brandName: "Apple",
    tags: ["laptop", "macbook", "m3"],
    weight: 1.51,
    warrantyPeriod: "12 months",
  },
  {
    name: "Dell XPS 15",
    sku: "ELEC-DEL-001",
    unit: "pcs",
    costPrice: 950,
    salePrice: 1199,
    stock: 20,
    lowStockThreshold: 5,
    categoryName: "Laptops & Computers",
    brandName: "Dell",
    tags: ["laptop", "ultrabook", "windows"],
    weight: 1.86,
    warrantyPeriod: "24 months",
  },
  {
    name: "Sony WH-1000XM5 Headphones",
    sku: "ELEC-SNY-001",
    unit: "pcs",
    costPrice: 220,
    salePrice: 349,
    stock: 60,
    lowStockThreshold: 10,
    categoryName: "Audio & Headphones",
    brandName: "Sony",
    tags: ["headphones", "noise-cancelling", "wireless"],
    weight: 0.25,
    warrantyPeriod: "12 months",
  },
  {
    name: "Bose QuietComfort Ultra",
    sku: "ELEC-BOS-001",
    unit: "pcs",
    costPrice: 250,
    salePrice: 379,
    stock: 35,
    lowStockThreshold: 8,
    categoryName: "Audio & Headphones",
    brandName: "Bose",
    tags: ["headphones", "premium", "anc"],
    weight: 0.254,
    warrantyPeriod: "12 months",
  },
  {
    name: "Canon EOS R6 Mark II",
    sku: "ELEC-CAN-001",
    unit: "pcs",
    costPrice: 1800,
    salePrice: 2499,
    stock: 10,
    lowStockThreshold: 3,
    categoryName: "Cameras",
    brandName: "Canon",
    tags: ["camera", "mirrorless", "full-frame"],
    weight: 0.67,
    warrantyPeriod: "24 months",
  },
  {
    name: "Logitech MX Master 3S Mouse",
    sku: "ELEC-LOG-001",
    unit: "pcs",
    costPrice: 60,
    salePrice: 99,
    stock: 80,
    lowStockThreshold: 15,
    categoryName: "Laptops & Computers",
    brandName: "Logitech",
    tags: ["mouse", "wireless", "ergonomic"],
    weight: 0.141,
    warrantyPeriod: "24 months",
  },

  // ── Clothing & Apparel ──
  {
    name: "Nike Air Max 90",
    sku: "CLO-NIK-001",
    unit: "pair",
    costPrice: 70,
    salePrice: 129,
    stock: 120,
    lowStockThreshold: 20,
    categoryName: "Footwear",
    brandName: "Nike",
    tags: ["sneakers", "casual", "classic"],
    weight: 0.35,
  },
  {
    name: "Adidas Ultraboost 23",
    sku: "CLO-ADI-001",
    unit: "pair",
    costPrice: 90,
    salePrice: 159,
    stock: 80,
    lowStockThreshold: 15,
    categoryName: "Footwear",
    brandName: "Adidas",
    tags: ["running", "sneakers", "boost"],
    weight: 0.31,
  },
  {
    name: "Puma RS-X Toys Sneaker",
    sku: "CLO-PUM-001",
    unit: "pair",
    costPrice: 55,
    salePrice: 99,
    stock: 60,
    lowStockThreshold: 10,
    categoryName: "Footwear",
    brandName: "Puma",
    tags: ["sneakers", "retro", "street"],
    weight: 0.33,
  },
  {
    name: "Nike Dri-FIT Running Tee",
    sku: "CLO-NIK-002",
    unit: "pcs",
    costPrice: 15,
    salePrice: 34,
    stock: 200,
    lowStockThreshold: 30,
    categoryName: "Sportswear",
    brandName: "Nike",
    tags: ["t-shirt", "running", "dri-fit"],
    weight: 0.15,
  },
  {
    name: "Adidas Essentials Track Pants",
    sku: "CLO-ADI-002",
    unit: "pcs",
    costPrice: 25,
    salePrice: 49,
    stock: 150,
    lowStockThreshold: 20,
    categoryName: "Sportswear",
    brandName: "Adidas",
    tags: ["track-pants", "casual", "essentials"],
    weight: 0.3,
  },

  // ── Home & Kitchen ──
  {
    name: "Dyson V15 Detect Vacuum",
    sku: "HOM-DYS-001",
    unit: "pcs",
    costPrice: 500,
    salePrice: 749,
    stock: 15,
    lowStockThreshold: 3,
    categoryName: "Kitchen Appliances",
    brandName: "Dyson",
    tags: ["vacuum", "cordless", "smart"],
    weight: 3.1,
    warrantyPeriod: "24 months",
  },
  {
    name: "Philips Air Fryer XXL",
    sku: "HOM-PHI-001",
    unit: "pcs",
    costPrice: 150,
    salePrice: 249,
    stock: 30,
    lowStockThreshold: 5,
    categoryName: "Kitchen Appliances",
    brandName: "Philips",
    tags: ["air-fryer", "cooking", "healthy"],
    weight: 8.0,
    warrantyPeriod: "24 months",
  },
  {
    name: "IKEA KALLAX Shelf Unit",
    sku: "HOM-IKE-001",
    unit: "pcs",
    costPrice: 45,
    salePrice: 79,
    stock: 40,
    lowStockThreshold: 8,
    categoryName: "Furniture",
    brandName: "Ikea",
    tags: ["shelf", "storage", "modular"],
    weight: 25.5,
  },
  {
    name: "Philips Hue Starter Kit",
    sku: "HOM-PHI-002",
    unit: "set",
    costPrice: 80,
    salePrice: 129,
    stock: 45,
    lowStockThreshold: 10,
    categoryName: "Home Décor",
    brandName: "Philips",
    tags: ["smart-home", "lighting", "hue"],
    weight: 0.8,
    warrantyPeriod: "24 months",
  },

  // ── Health & Beauty ──
  {
    name: "L'Oréal Revitalift Serum",
    sku: "HB-LOR-001",
    unit: "pcs",
    costPrice: 12,
    salePrice: 28,
    stock: 200,
    lowStockThreshold: 30,
    categoryName: "Skincare",
    brandName: "L'Oréal",
    tags: ["serum", "anti-aging", "hyaluronic"],
    weight: 0.05,
  },
  {
    name: "Dyson Supersonic Hair Dryer",
    sku: "HB-DYS-001",
    unit: "pcs",
    costPrice: 280,
    salePrice: 429,
    stock: 20,
    lowStockThreshold: 5,
    categoryName: "Hair Care",
    brandName: "Dyson",
    tags: ["hair-dryer", "premium", "fast-drying"],
    weight: 0.66,
    warrantyPeriod: "24 months",
  },
];

export async function seedProducts(prisma: PrismaClient) {
  console.log("📦 Seeding products...\n");

  // Build lookup maps
  const categories = await prisma.category.findMany();
  const brands = await (prisma as any).brand.findMany();

  const categoryMap = new Map(categories.map((c: any) => [c.name, c.id]));
  const brandMap = new Map(brands.map((b: any) => [b.name, b.id]));

  let count = 0;

  for (const p of productData) {
    const categoryId = categoryMap.get(p.categoryName);
    const brandId = brandMap.get(p.brandName);

    if (!categoryId) {
      console.warn(`  ⚠️  Skipping "${p.name}" — category "${p.categoryName}" not found`);
      continue;
    }

    await prisma.product.upsert({
      where: { sku: p.sku },
      update: {
        name: p.name,
        costPrice: p.costPrice,
        salePrice: p.salePrice,
        stock: p.stock,
        categoryId,
        brandId: brandId ?? null,
      } as any,
      create: {
        name: p.name,
        sku: p.sku,
        unit: p.unit,
        costPrice: p.costPrice,
        salePrice: p.salePrice,
        stock: p.stock,
        lowStockThreshold: p.lowStockThreshold,
        categoryId,
        brandId: brandId ?? null,
        tags: p.tags,
        weight: p.weight,
        barcode: p.barcode,
        warrantyPeriod: p.warrantyPeriod,
      } as any,
    });

    count++;
    console.log(`  ✅ ${p.sku} — ${p.name}`);
  }

  console.log(`\n  ✅ ${count} products seeded\n`);
}
