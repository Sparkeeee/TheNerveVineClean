-- CreateTable
CREATE TABLE "public"."Indication" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "color" TEXT NOT NULL DEFAULT 'blue',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Indication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_HerbIndications" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_HerbIndications_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "public"."_SupplementIndications" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_SupplementIndications_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Indication_name_key" ON "public"."Indication"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Indication_slug_key" ON "public"."Indication"("slug");

-- CreateIndex
CREATE INDEX "_HerbIndications_B_index" ON "public"."_HerbIndications"("B");

-- CreateIndex
CREATE INDEX "_SupplementIndications_B_index" ON "public"."_SupplementIndications"("B");

-- AddForeignKey
ALTER TABLE "public"."_HerbIndications" ADD CONSTRAINT "_HerbIndications_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Herb"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_HerbIndications" ADD CONSTRAINT "_HerbIndications_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Indication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_SupplementIndications" ADD CONSTRAINT "_SupplementIndications_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Indication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_SupplementIndications" ADD CONSTRAINT "_SupplementIndications_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Supplement"("id") ON DELETE CASCADE ON UPDATE CASCADE;
