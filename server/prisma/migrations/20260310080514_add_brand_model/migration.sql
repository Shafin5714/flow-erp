-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "barcode" TEXT,
ADD COLUMN     "brandId" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "dimensionH" DOUBLE PRECISION,
ADD COLUMN     "dimensionL" DOUBLE PRECISION,
ADD COLUMN     "dimensionW" DOUBLE PRECISION,
ADD COLUMN     "discountPrice" DOUBLE PRECISION,
ADD COLUMN     "expiryDate" TIMESTAMP(3),
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "mainImage" TEXT,
ADD COLUMN     "supportingImages" TEXT[],
ADD COLUMN     "tags" TEXT[],
ADD COLUMN     "taxRate" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "warrantyPeriod" TEXT,
ADD COLUMN     "weight" DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "Brand" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Brand_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Brand_name_key" ON "Brand"("name");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE SET NULL ON UPDATE CASCADE;
