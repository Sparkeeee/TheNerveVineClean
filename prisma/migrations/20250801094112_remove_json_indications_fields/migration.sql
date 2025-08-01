/*
  Warnings:

  - You are about to drop the column `indications` on the `Herb` table. All the data in the column will be lost.
  - You are about to drop the column `indications` on the `Supplement` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Herb" DROP COLUMN "indications";

-- AlterTable
ALTER TABLE "public"."Supplement" DROP COLUMN "indications";
