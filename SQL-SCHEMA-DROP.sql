-- Complete SQL Schema for Rawjli E-commerce Platform with DROP IF EXISTS
-- Copy and paste this into Supabase SQL Editor

-- Drop existing tables in reverse order of dependencies
DROP TABLE IF EXISTS "OrderItem" CASCADE;
DROP TABLE IF EXISTS "BundleItem" CASCADE;
DROP TABLE IF EXISTS "BundleProduct" CASCADE;
DROP TABLE IF EXISTS "Bundle" CASCADE;
DROP TABLE IF EXISTS "Order" CASCADE;
DROP TABLE IF EXISTS "Withdrawal" CASCADE;
DROP TABLE IF EXISTS "Offer" CASCADE;
DROP TABLE IF EXISTS "ShippingPrice" CASCADE;
DROP TABLE IF EXISTS "Commune" CASCADE;
DROP TABLE IF EXISTS "Wilaya" CASCADE;
DROP TABLE IF EXISTS "User" CASCADE;
DROP TABLE IF EXISTS "Category" CASCADE;
DROP TABLE IF EXISTS "Product" CASCADE;
DROP TABLE IF EXISTS "ProductOption" CASCADE;
DROP TABLE IF EXISTS "ProductVariant" CASCADE;

-- Drop existing types
DROP TYPE IF EXISTS "UserRole" CASCADE;
DROP TYPE IF EXISTS "OrderStatus" CASCADE;
DROP TYPE IF EXISTS "WithdrawalStatus" CASCADE;
DROP TYPE IF EXISTS "WithdrawalMethod" CASCADE;
DROP TYPE IF EXISTS "DeliveryMethod" CASCADE;

-- Create User Role Enum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'MARKETER');

-- Create Order Status Enum
CREATE TYPE "OrderStatus" AS ENUM ('PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED');

-- Create Withdrawal Status Enum
CREATE TYPE "WithdrawalStatus" AS ENUM ('PENDING', 'PAID');

-- Create Withdrawal Method Enum
CREATE TYPE "WithdrawalMethod" AS ENUM ('BARIDI_MOB', 'CCP', 'PHONE_CREDIT');

-- Create Delivery Method Enum
CREATE TYPE "DeliveryMethod" AS ENUM ('HOME', 'OFFICE');

-- Create Users Table
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'MARKETER',
    "firstName" TEXT,
    "lastName" TEXT,
    "phone" TEXT,
    "baridiMobNumber" TEXT,
    "ccpNumber" TEXT,
    "phoneForCredit" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- Create unique constraint on email
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- Create Categories Table
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- Create Products Table
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DECIMAL(10,2) NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "image" TEXT,
    "categoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- Create foreign key for Product-Category
ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" 
    FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Create Wilayas Table
CREATE TABLE "Wilaya" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Wilaya_pkey" PRIMARY KEY ("id")
);

-- Create Communes Table
CREATE TABLE "Commune" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "wilayaId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Commune_pkey" PRIMARY KEY ("id")
);

-- Create foreign key for Commune-Wilaya
ALTER TABLE "Commune" ADD CONSTRAINT "Commune_wilayaId_fkey" 
    FOREIGN KEY ("wilayaId") REFERENCES "Wilaya"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Create Shipping Prices Table
CREATE TABLE "ShippingPrice" (
    "id" TEXT NOT NULL,
    "wilayaId" TEXT NOT NULL,
    "homeDeliveryPrice" DECIMAL(10,2) NOT NULL,
    "officeDeliveryPrice" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ShippingPrice_pkey" PRIMARY KEY ("id")
);

-- Create foreign key for ShippingPrice-Wilaya
ALTER TABLE "ShippingPrice" ADD CONSTRAINT "ShippingPrice_wilayaId_fkey" 
    FOREIGN KEY ("wilayaId") REFERENCES "Wilaya"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Create Orders Table
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "customerPhone" TEXT NOT NULL,
    "customerAddress" TEXT NOT NULL,
    "communeId" TEXT NOT NULL,
    "totalAmount" DECIMAL(10,2) NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'PROCESSING',
    "deliveryMethod" "DeliveryMethod" NOT NULL,
    "marketerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- Create foreign key for Order-Commune
ALTER TABLE "Order" ADD CONSTRAINT "Order_communeId_fkey" 
    FOREIGN KEY ("communeId") REFERENCES "Commune"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Create foreign key for Order-Marketer
ALTER TABLE "Order" ADD CONSTRAINT "Order_marketerId_fkey" 
    FOREIGN KEY ("marketerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Create Order Items Table
CREATE TABLE "OrderItem" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- Create foreign key for OrderItem-Order
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" 
    FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Create foreign key for OrderItem-Product
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_productId_fkey" 
    FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Create Bundles Table
CREATE TABLE "Bundle" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "totalPrice" DECIMAL(10,2) NOT NULL,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bundle_pkey" PRIMARY KEY ("id")
);

-- Create Bundle Items Table
CREATE TABLE "BundleItem" (
    "id" TEXT NOT NULL,
    "bundleId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BundleItem_pkey" PRIMARY KEY ("id")
);

-- Create foreign key for BundleItem-Bundle
ALTER TABLE "BundleItem" ADD CONSTRAINT "BundleItem_bundleId_fkey" 
    FOREIGN KEY ("bundleId") REFERENCES "Bundle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Create foreign key for BundleItem-Product
ALTER TABLE "BundleItem" ADD CONSTRAINT "BundleItem_productId_fkey" 
    FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Create Withdrawals Table
CREATE TABLE "Withdrawal" (
    "id" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "method" "WithdrawalMethod" NOT NULL,
    "status" "WithdrawalStatus" NOT NULL DEFAULT 'PENDING',
    "marketerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Withdrawal_pkey" PRIMARY KEY ("id")
);

-- Create foreign key for Withdrawal-Marketer
ALTER TABLE "Withdrawal" ADD CONSTRAINT "Withdrawal_marketerId_fkey" 
    FOREIGN KEY ("marketerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Create Offers Table
CREATE TABLE "Offer" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "discountPercentage" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Offer_pkey" PRIMARY KEY ("id")
);

-- Insert Default Admin User
INSERT INTO "User" ("id", "email", "password", "role", "firstName", "lastName", "isActive", "createdAt", "updatedAt")
VALUES (
    'admin-001',
    'alumabdo0@gmail.com',
    '$2a$10$.MyMvCNy8UDHenldPdzbVuNr44ui.D7eBv0Ml3lUc08NCMLj2g37C',
    'ADMIN',
    'Admin',
    'Rawjli',
    true,
    NOW(),
    NOW()
);

-- Create indexes for better performance
CREATE INDEX "User_role_idx" ON "User"("role");
CREATE INDEX "User_isActive_idx" ON "User"("isActive");
CREATE INDEX "Product_categoryId_idx" ON "Product"("categoryId");
CREATE INDEX "Order_marketerId_idx" ON "Order"("marketerId");
CREATE INDEX "Order_status_idx" ON "Order"("status");
CREATE INDEX "Withdrawal_marketerId_idx" ON "Withdrawal"("marketerId");
CREATE INDEX "Withdrawal_status_idx" ON "Withdrawal"("status");
CREATE INDEX "ShippingPrice_wilayaId_idx" ON "ShippingPrice"("wilayaId");
CREATE INDEX "Commune_wilayaId_idx" ON "Commune"("wilayaId");
