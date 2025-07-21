-- AlterTable
ALTER TABLE "Merchant" ADD COLUMN     "defaultAffiliateRate" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "PendingProduct" ADD COLUMN     "affiliateRate" DOUBLE PRECISION,
ADD COLUMN     "affiliateYield" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "affiliateRate" DOUBLE PRECISION,
ADD COLUMN     "affiliateYield" DOUBLE PRECISION;
