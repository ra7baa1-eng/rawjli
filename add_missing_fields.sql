-- =====================================================
-- Add Missing Fields to User Table
-- =====================================================

-- Add firstName field if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='User' AND column_name='firstName'
    ) THEN
        ALTER TABLE "User" ADD COLUMN "firstName" TEXT;
    END IF;
END $$;

-- Add lastName field if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='User' AND column_name='lastName'
    ) THEN
        ALTER TABLE "User" ADD COLUMN "lastName" TEXT;
    END IF;
END $$;

-- Add password field if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='User' AND column_name='password'
    ) THEN
        ALTER TABLE "User" ADD COLUMN "password" TEXT;
    END IF;
END $$;

-- Add username field if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='User' AND column_name='username'
    ) THEN
        ALTER TABLE "User" ADD COLUMN "username" TEXT;
    END IF;
END $$;

-- Add avatar field if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='User' AND column_name='avatar'
    ) THEN
        ALTER TABLE "User" ADD COLUMN "avatar" TEXT;
    END IF;
END $$;

-- Add mobile field if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='User' AND column_name='mobile'
    ) THEN
        ALTER TABLE "User" ADD COLUMN "mobile" TEXT;
    END IF;
END $$;

-- Add city field if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='User' AND column_name='city'
    ) THEN
        ALTER TABLE "User" ADD COLUMN "city" TEXT;
    END IF;
END $$;

-- Add country field if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='User' AND column_name='country'
    ) THEN
        ALTER TABLE "User" ADD COLUMN "country" TEXT;
    END IF;
END $$;

-- Add zipCode field if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='User' AND column_name='zipCode'
    ) THEN
        ALTER TABLE "User" ADD COLUMN "zipCode" TEXT;
    END IF;
END $$;

-- Add totalSales field if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='User' AND column_name='totalSales'
    ) THEN
        ALTER TABLE "User" ADD COLUMN "totalSales" DOUBLE PRECISION NOT NULL DEFAULT 0;
    END IF;
END $$;

-- Add referralCode field if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='User' AND column_name='referralCode'
    ) THEN
        ALTER TABLE "User" ADD COLUMN "referralCode" TEXT;
    END IF;
END $$;

-- Add referredBy field if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='User' AND column_name='referredBy'
    ) THEN
        ALTER TABLE "User" ADD COLUMN "referredBy" TEXT;
    END IF;
END $$;

-- Add isBanned field if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='User' AND column_name='isBanned'
    ) THEN
        ALTER TABLE "User" ADD COLUMN "isBanned" BOOLEAN NOT NULL DEFAULT false;
    END IF;
END $$;

-- Add banReason field if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='User' AND column_name='banReason'
    ) THEN
        ALTER TABLE "User" ADD COLUMN "banReason" TEXT;
    END IF;
END $$;

-- Add lastLoginAt field if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='User' AND column_name='lastLoginAt'
    ) THEN
        ALTER TABLE "User" ADD COLUMN "lastLoginAt" TIMESTAMP(3);
    END IF;
END $$;

-- =====================================================
-- Add Missing Fields to Product Table
-- =====================================================

-- Add basePrice field if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='Product' AND column_name='basePrice'
    ) THEN
        ALTER TABLE "Product" ADD COLUMN "basePrice" DOUBLE PRECISION NOT NULL DEFAULT 0;
    END IF;
END $$;

-- Add marketingTitle field if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='Product' AND column_name='marketingTitle'
    ) THEN
        ALTER TABLE "Product" ADD COLUMN "marketingTitle" TEXT;
    END IF;
END $$;

-- Add marketingDescription field if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='Product' AND column_name='marketingDescription'
    ) THEN
        ALTER TABLE "Product" ADD COLUMN "marketingDescription" TEXT;
    END IF;
END $$;

-- Add priceAfterDiscount field if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='Product' AND column_name='priceAfterDiscount'
    ) THEN
        ALTER TABLE "Product" ADD COLUMN "priceAfterDiscount" DOUBLE PRECISION;
    END IF;
END $$;

-- Add commission field if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='Product' AND column_name='commission'
    ) THEN
        ALTER TABLE "Product" ADD COLUMN "commission" DOUBLE PRECISION NOT NULL DEFAULT 10;
    END IF;
END $$;

-- =====================================================
-- Create Missing Indexes
-- =====================================================

-- Create username index if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE tablename='User' AND indexname='User_username_key'
    ) THEN
        CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
    END IF;
END $$;

-- Create role index if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE tablename='User' AND indexname='User_role_idx'
    ) THEN
        CREATE INDEX "User_role_idx" ON "User"("role");
    END IF;
END $$;

-- Create referralCode index if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE tablename='User' AND indexname='User_referralCode_idx'
    ) THEN
        CREATE INDEX "User_referralCode_idx" ON "User"("referralCode");
    END IF;
END $$;

-- =====================================================
-- Verification
-- =====================================================

-- Check User table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'User' AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check Product table structure  
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'Product' AND table_schema = 'public'
ORDER BY ordinal_position;

COMMIT;
