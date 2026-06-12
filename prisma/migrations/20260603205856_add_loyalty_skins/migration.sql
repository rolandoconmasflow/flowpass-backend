-- AlterTable
ALTER TABLE "LoyaltyLevel" ADD COLUMN     "isSystem" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "skinConfig" JSONB,
ADD COLUMN     "skinType" TEXT NOT NULL DEFAULT 'SYSTEM';

-- AlterTable
ALTER TABLE "Merchant" ADD COLUMN     "levelsEnabled" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "WalletPass" ADD COLUMN     "skinVersion" INTEGER NOT NULL DEFAULT 0;
