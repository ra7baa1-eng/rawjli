-- =====================================================
-- RAWJLI Platform - Complete Database Schema
-- =====================================================

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS "OrderItem" CASCADE;
DROP TABLE IF EXISTS "BundleProduct" CASCADE;
DROP TABLE IF EXISTS "Withdrawal" CASCADE;
DROP TABLE IF EXISTS "Order" CASCADE;
DROP TABLE IF EXISTS "ProductOption" CASCADE;
DROP TABLE IF EXISTS "Product" CASCADE;
DROP TABLE IF EXISTS "Bundle" CASCADE;
DROP TABLE IF EXISTS "Offer" CASCADE;
DROP TABLE IF EXISTS "Category" CASCADE;
DROP TABLE IF EXISTS "Commune" CASCADE;
DROP TABLE IF EXISTS "ShippingPrice" CASCADE;
DROP TABLE IF EXISTS "Wilaya" CASCADE;
DROP TABLE IF EXISTS "Referral" CASCADE;
DROP TABLE IF EXISTS "Account" CASCADE;
DROP TABLE IF EXISTS "Session" CASCADE;
DROP TABLE IF EXISTS "User" CASCADE;

-- =====================================================
-- Core Tables
-- =====================================================

-- Users Table
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "firstName" TEXT, -- Added firstName field
    "lastName" TEXT, -- Added lastName field
    "password" TEXT, -- Added password field for authentication
    "role" TEXT NOT NULL DEFAULT 'USER',
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "balance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "commission" DOUBLE PRECISION NOT NULL DEFAULT 10,
    "totalEarnings" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- Create unique index for email
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- =====================================================
-- Geographic Tables
-- =====================================================

-- Wilayas Table
CREATE TABLE "Wilaya" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Wilaya_pkey" PRIMARY KEY ("id")
);

-- Create unique index for code
CREATE UNIQUE INDEX "Wilaya_code_key" ON "Wilaya"("code");

-- Communes Table
CREATE TABLE "Commune" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "wilayaId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Commune_pkey" PRIMARY KEY ("id")
);

-- Shipping Prices Table
CREATE TABLE "ShippingPrice" (
    "id" TEXT NOT NULL,
    "wilayaId" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ShippingPrice_pkey" PRIMARY KEY ("id")
);

-- =====================================================
-- Product Tables
-- =====================================================

-- Categories Table
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "image" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- Offers Table
CREATE TABLE "Offer" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "discountPercentage" DOUBLE PRECISION NOT NULL,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Offer_pkey" PRIMARY KEY ("id")
);

-- Products Table (FIXED - includes all required fields)
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "marketingTitle" TEXT,
    "marketingDescription" TEXT,
    "basePrice" DOUBLE PRECISION NOT NULL,
    "priceAfterDiscount" DOUBLE PRECISION,
    "images" TEXT[],
    "stock" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "categoryId" TEXT,
    "offerId" TEXT,
    "marketerId" TEXT,
    "commission" DOUBLE PRECISION NOT NULL DEFAULT 10,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- Product Options Table
CREATE TABLE "ProductOption" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "productId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductOption_pkey" PRIMARY KEY ("id")
);

-- Bundles Table
CREATE TABLE "Bundle" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bundle_pkey" PRIMARY KEY ("id")
);

-- Bundle Products Table (Many-to-Many)
CREATE TABLE "BundleProduct" (
    "id" TEXT NOT NULL,
    "bundleId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BundleProduct_pkey" PRIMARY KEY ("id")
);

-- =====================================================
-- Order Tables
-- =====================================================

-- Orders Table
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "orderNumber" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "shippingCost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "customerName" TEXT NOT NULL,
    "customerPhone" TEXT NOT NULL,
    "customerAddress" TEXT NOT NULL,
    "customerWilaya" TEXT NOT NULL,
    "customerCommune" TEXT NOT NULL,
    "marketerId" TEXT,
    "commission" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- Order Items Table
CREATE TABLE "OrderItem" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- =====================================================
-- Financial Tables
-- =====================================================

-- Withdrawals Table
CREATE TABLE "Withdrawal" (
    "id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "method" TEXT NOT NULL,
    "details" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Withdrawal_pkey" PRIMARY KEY ("id")
);

-- =====================================================
-- Referral System
-- =====================================================

-- Referrals Table
CREATE TABLE "Referral" (
    "id" TEXT NOT NULL,
    "referrerId" TEXT NOT NULL,
    "referredId" TEXT NOT NULL,
    "commission" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Referral_pkey" PRIMARY KEY ("id")
);

-- =====================================================
-- NextAuth Tables (if using NextAuth)
-- =====================================================

-- Accounts Table
CREATE TABLE "Account" (
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("provider", "providerAccountId")
);

-- Sessions Table
CREATE TABLE "Session" (
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("sessionToken")
);

-- =====================================================
-- Foreign Key Constraints
-- =====================================================

-- User Foreign Keys
ALTER TABLE "User" ADD CONSTRAINT "User_referrerId_fkey" FOREIGN KEY ("id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Commune Foreign Key
ALTER TABLE "Commune" ADD CONSTRAINT "Commune_wilayaId_fkey" FOREIGN KEY ("wilayaId") REFERENCES "Wilaya"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Shipping Price Foreign Key
ALTER TABLE "ShippingPrice" ADD CONSTRAINT "ShippingPrice_wilayaId_fkey" FOREIGN KEY ("wilayaId") REFERENCES "Wilaya"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Product Foreign Keys
ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Product" ADD CONSTRAINT "Product_offerId_fkey" FOREIGN KEY ("offerId") REFERENCES "Offer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Product" ADD CONSTRAINT "Product_marketerId_fkey" FOREIGN KEY ("marketerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Product Option Foreign Key
ALTER TABLE "ProductOption" ADD CONSTRAINT "ProductOption_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Bundle Product Foreign Keys
ALTER TABLE "BundleProduct" ADD CONSTRAINT "BundleProduct_bundleId_fkey" FOREIGN KEY ("bundleId") REFERENCES "Bundle"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "BundleProduct" ADD CONSTRAINT "BundleProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Order Foreign Keys
ALTER TABLE "Order" ADD CONSTRAINT "Order_marketerId_fkey" FOREIGN KEY ("marketerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Order Item Foreign Keys
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Withdrawal Foreign Key
ALTER TABLE "Withdrawal" ADD CONSTRAINT "Withdrawal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Referral Foreign Keys
ALTER TABLE "Referral" ADD CONSTRAINT "Referral_referrerId_fkey" FOREIGN KEY ("referrerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Referral" ADD CONSTRAINT "Referral_referredId_fkey" FOREIGN KEY ("referredId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- NextAuth Foreign Keys
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- =====================================================
-- Indexes for Performance
-- =====================================================

-- User Indexes
CREATE INDEX "User_role_idx" ON "User"("role");
CREATE INDEX "User_isActive_idx" ON "User"("isActive");
CREATE INDEX "User_marketer_idx" ON "User"("role") WHERE "role" = 'MARKETER';

-- Product Indexes
CREATE INDEX "Product_categoryId_idx" ON "Product"("categoryId");
CREATE INDEX "Product_marketerId_idx" ON "Product"("marketerId");
CREATE INDEX "Product_offerId_idx" ON "Product"("offerId");
CREATE INDEX "Product_isActive_idx" ON "Product"("isActive");
CREATE INDEX "Product_name_idx" ON "Product"("name");
CREATE INDEX "Product_basePrice_idx" ON "Product"("basePrice");

-- Order Indexes
CREATE INDEX "Order_marketerId_idx" ON "Order"("marketerId");
CREATE INDEX "Order_status_idx" ON "Order"("status");
CREATE INDEX "Order_createdAt_idx" ON "Order"("createdAt");

-- Order Item Indexes
CREATE INDEX "OrderItem_orderId_idx" ON "OrderItem"("orderId");
CREATE INDEX "OrderItem_productId_idx" ON "OrderItem"("productId");

-- Withdrawal Indexes
CREATE INDEX "Withdrawal_userId_idx" ON "Withdrawal"("userId");
CREATE INDEX "Withdrawal_status_idx" ON "Withdrawal"("status");

-- Shipping Price Indexes
CREATE INDEX "ShippingPrice_wilayaId_idx" ON "ShippingPrice"("wilayaId");
CREATE INDEX "ShippingPrice_price_idx" ON "ShippingPrice"("price");

-- =====================================================
-- Initial Data
-- =====================================================

-- Insert default admin user
INSERT INTO "User" ("id", "email", "name", "role", "isActive", "createdAt", "updatedAt") 
VALUES (
    'admin_001',
    'admin@rojli.com',
    'Admin User',
    'ADMIN',
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Insert sample wilayas
INSERT INTO "Wilaya" ("id", "code", "name", "createdAt", "updatedAt") VALUES
('wilaya_001', '1', 'Adrar', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('wilaya_002', '2', 'Chlef', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('wilaya_003', '3', 'Laghouat', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('wilaya_016', '16', 'Alger', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert sample shipping prices
INSERT INTO "ShippingPrice" ("id", "wilayaId", "price", "createdAt", "updatedAt") VALUES
('ship_001', 'wilaya_001', 800, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('ship_002', 'wilaya_002', 600, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('ship_003', 'wilaya_003', 1000, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('ship_016', 'wilaya_016', 500, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert sample categories
INSERT INTO "Category" ("id", "name", "description", "isActive", "createdAt", "updatedAt") VALUES
('cat_001', 'إلكترونيات', 'أجهزة إلكترونية وهواتف', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('cat_002', 'ملابس', 'ملابس رجالية ونسائية', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('cat_003', 'أثاث', 'أثاث منزلي ومكتبي', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- =====================================================
-- Final Setup
-- =====================================================

-- Create sequence for auto-incrementing IDs (if needed)
CREATE SEQUENCE IF NOT EXISTS global_id_sequence START 1;

-- Create function for generating CUID-like IDs
CREATE OR REPLACE FUNCTION generate_id()
RETURNS TEXT AS $$
BEGIN
    RETURN 'id_' || LPAD(nextval('global_id_sequence')::TEXT, 10, '0');
END;
$$ LANGUAGE plpgsql;

-- Grant permissions (adjust as needed for your setup)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres;

COMMIT;

-- =====================================================
-- Verification Queries
-- =====================================================

-- Check if all tables were created
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Check Product table structure
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'Product' AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check if basePrice column exists
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'Product' AND column_name = 'basePrice' AND table_schema = 'public';
