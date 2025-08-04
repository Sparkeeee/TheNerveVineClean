/*
  Warnings:

  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "password" TEXT;

-- Update existing users with a default password
UPDATE "public"."User" SET "password" = 'password123' WHERE "password" IS NULL;

-- Make password required
ALTER TABLE "public"."User" ALTER COLUMN "password" SET NOT NULL;
