/*
  Warnings:

  - The values [AVAILABLE,NOTAVAILABLE] on the enum `StockStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `icon` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `prize` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `products` table. All the data in the column will be lost.
  - Added the required column `brandId` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `purchasePrize` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `regularSalePrize` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stockQuantity` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "StockStatus_new" AS ENUM ('INSTOCK', 'OUTOFFSTOCK');
ALTER TABLE "products" ALTER COLUMN "stockStatus" DROP DEFAULT;
ALTER TABLE "products" ALTER COLUMN "stockStatus" TYPE "StockStatus_new" USING ("stockStatus"::text::"StockStatus_new");
ALTER TYPE "StockStatus" RENAME TO "StockStatus_old";
ALTER TYPE "StockStatus_new" RENAME TO "StockStatus";
DROP TYPE "StockStatus_old";
ALTER TABLE "products" ALTER COLUMN "stockStatus" SET DEFAULT 'INSTOCK';
COMMIT;

-- AlterTable
ALTER TABLE "products" DROP COLUMN "icon",
DROP COLUMN "prize",
DROP COLUMN "quantity",
ADD COLUMN     "brandId" TEXT NOT NULL,
ADD COLUMN     "discount" DOUBLE PRECISION,
ADD COLUMN     "images" TEXT[],
ADD COLUMN     "purchasePrize" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "regularSalePrize" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "stockQuantity" INTEGER NOT NULL,
ALTER COLUMN "stockStatus" SET DEFAULT 'INSTOCK';

-- CreateTable
CREATE TABLE "brands" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "icon" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "brands_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "brands"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
