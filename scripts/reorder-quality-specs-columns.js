const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function reorderColumns() {
  try {
    console.log('🔄 Reordering QualitySpecification table columns for better UX...\n');
    
    console.log('📋 Creating new table with better column order...');
    
    // Create new table with better column order
    await prisma.$executeRaw`
      CREATE TABLE "QualitySpecification_new" (
        "id" SERIAL PRIMARY KEY,
        "productType" TEXT NOT NULL,
        "herbSlug" TEXT,
        "herbName" TEXT,
        "supplementSlug" TEXT,
        "supplementName" TEXT,
        "formulationTypeId" INTEGER,
        "approach" TEXT DEFAULT 'traditional',
        "standardised" BOOLEAN DEFAULT false,
        "customSpecs" TEXT,
        "notes" TEXT,
        "herbId" INTEGER,
        "supplementId" INTEGER,
        "requiredTerms" JSONB NOT NULL,
        "preferredTerms" JSONB NOT NULL,
        "avoidTerms" JSONB NOT NULL,
        "standardization" JSONB,
        "alcoholSpecs" JSONB,
        "dosageSpecs" JSONB,
        "priceRange" JSONB NOT NULL,
        "ratingThreshold" DOUBLE PRECISION NOT NULL,
        "reviewCountThreshold" INTEGER NOT NULL,
        "brandPreferences" JSONB,
        "brandAvoid" JSONB,
        "formulationName" TEXT,
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
      );
    `;
    
    console.log('✅ New table created');
    
    console.log('📦 Migrating data to new table...');
    
    // Migrate all data to new table
    await prisma.$executeRaw`
      INSERT INTO "QualitySpecification_new" (
        "id", "productType", "herbSlug", "herbName", "supplementSlug", "supplementName",
        "formulationTypeId", "approach", "standardised", "customSpecs", "notes",
        "herbId", "supplementId", "requiredTerms", "preferredTerms", "avoidTerms",
        "standardization", "alcoholSpecs", "dosageSpecs", "priceRange", "ratingThreshold",
        "reviewCountThreshold", "brandPreferences", "brandAvoid", "formulationName", "updatedAt"
      )
      SELECT 
        "id", "productType", "herbSlug", "herbName", "supplementSlug", "supplementName",
        "formulationTypeId", "approach", "standardised", "customSpecs", "notes",
        "herbId", "supplementId", "requiredTerms", "preferredTerms", "avoidTerms",
        "standardization", "alcoholSpecs", "dosageSpecs", "priceRange", "ratingThreshold",
        "reviewCountThreshold", "brandPreferences", "brandAvoid", "formulationName", "updatedAt"
      FROM "QualitySpecification";
    `;
    
    console.log('✅ Data migrated');
    
    console.log('🗑️  Dropping old table...');
    
    // Drop old table
    await prisma.$executeRaw`DROP TABLE "QualitySpecification";`;
    
    console.log('✅ Old table dropped');
    
    console.log('🔄 Renaming new table...');
    
    // Rename new table to original name
    await prisma.$executeRaw`ALTER TABLE "QualitySpecification_new" RENAME TO "QualitySpecification";`;
    
    console.log('✅ Table renamed');
    
    console.log('🔍 Verifying new column order...');
    
    const result = await prisma.$queryRaw`
      SELECT column_name, ordinal_position, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'QualitySpecification' 
      ORDER BY ordinal_position;
    `;
    
    console.log('\n📋 New table structure:');
    result.forEach(col => {
      console.log(`  ${col.ordinal_position}. ${col.column_name} (${col.data_type})`);
    });
    
    console.log('\n🎉 Column reordering completed successfully!');
    console.log('💡 Key fields are now at the beginning for better UX');
    
  } catch (error) {
    console.error('❌ Error during column reordering:', error);
  } finally {
    await prisma.$disconnect();
  }
}

reorderColumns();
