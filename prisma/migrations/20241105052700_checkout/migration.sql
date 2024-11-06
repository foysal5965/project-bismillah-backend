-- CreateEnum
CREATE TYPE "paymentMethod" AS ENUM ('CASHONDELIVERY', 'ONLINEPAYMENT');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELED');

-- CreateTable
CREATE TABLE "checkout" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "cartId" TEXT NOT NULL,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "paymentStatus" "PaymentStatus" NOT NULL,
    "paymentMethod" "paymentMethod" NOT NULL DEFAULT 'CASHONDELIVERY',
    "checkoutDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "billingAddressId" TEXT NOT NULL,
    "discountCode" TEXT,
    "discountAmount" DOUBLE PRECISION,
    "taxAmount" DOUBLE PRECISION,
    "shippingFee" DOUBLE PRECISION,
    "orderNotes" TEXT,
    "orderStatus" "OrderStatus" NOT NULL,
    "trackingNumber" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "checkout_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "checkout_trackingNumber_key" ON "checkout"("trackingNumber");

-- CreateIndex
CREATE INDEX "checkout_userId_paymentStatus_idx" ON "checkout"("userId", "paymentStatus");

-- AddForeignKey
ALTER TABLE "checkout" ADD CONSTRAINT "checkout_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "checkout" ADD CONSTRAINT "checkout_billingAddressId_fkey" FOREIGN KEY ("billingAddressId") REFERENCES "addresses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "checkout" ADD CONSTRAINT "checkout_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "carts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
