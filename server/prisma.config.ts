import { defineConfig } from "prisma/config";
import "dotenv/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    // @ts-expect-error process is available in node
    url: process.env.DATABASE_URL,
  },
});
