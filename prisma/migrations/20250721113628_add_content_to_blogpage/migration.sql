-- AlterTable
ALTER TABLE "BlogPage" ADD COLUMN     "content" TEXT,
ALTER COLUMN "fileUrl" DROP NOT NULL;
