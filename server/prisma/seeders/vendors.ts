import { PrismaClient } from "@prisma/client";

const vendors = [
  {
    name: "Acme Supplies",
    email: "contact@acmesupplies.com",
    phone: "+1-555-0100",
    address: "123 Supplier Blvd, Industrial Park",
    balance: 0,
  },
  {
    name: "Global Tech Distribution",
    email: "sales@globaltechdist.com",
    phone: "+1-555-0200",
    address: "456 Tech Avenue, Silicon Valley",
    balance: 1500.0,
  },
  {
    name: "Prime Wholesale",
    email: "orders@primewhole.net",
    phone: "+1-555-0300",
    address: "789 Market Street",
    balance: 500.5,
  },
  {
    name: "Nexus Electronics",
    email: "vendor@nexuselec.com",
    phone: "+1-555-0400",
    address: "321 Circuit Road",
    balance: 0,
  },
  {
    name: "Office Essentials Co.",
    email: "supply@officeessentials.co",
    phone: "+1-555-0500",
    address: "654 Business Center Drive",
    balance: 0,
  },
];

export async function seedVendors(prisma: PrismaClient) {
  console.log("🏢 Seeding vendors...\n");

  for (const vendor of vendors) {
    const existing = await prisma.vendor.findFirst({
      where: { name: vendor.name },
    });

    if (!existing) {
      await prisma.vendor.create({
        data: vendor,
      });
      console.log(`  ✅ ${vendor.name}`);
    } else {
      console.log(`  ⚡ ${vendor.name} (already exists)`);
    }
  }

  console.log(`\n  ✅ Vendors seeding complete.\n`);
}
