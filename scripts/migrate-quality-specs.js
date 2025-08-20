const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function migrateQualitySpecs() {
  try {
    console.log('🔄 Starting QualitySpecification migration...');
    
    // Step 1: Create FormulationType table manually
    console.log('📋 Creating FormulationType table...');
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "FormulationType" (
        "id" SERIAL PRIMARY KEY,
        "name" TEXT UNIQUE NOT NULL,
        "category" TEXT NOT NULL,
        "template" TEXT NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `;
    
    // Step 2: Add new columns to QualitySpecification
    console.log('🔧 Adding new columns to QualitySpecification...');
    
    // Add herbId column
    try {
      await prisma.$executeRaw`ALTER TABLE "QualitySpecification" ADD COLUMN IF NOT EXISTS "herbId" INTEGER;`;
      console.log('✅ Added herbId column');
    } catch (e) {
      console.log('ℹ️ herbId column already exists or error:', e.message);
    }
    
    // Add supplementId column
    try {
      await prisma.$executeRaw`ALTER TABLE "QualitySpecification" ADD COLUMN IF NOT EXISTS "supplementId" INTEGER;`;
      console.log('✅ Added supplementId column');
    } catch (e) {
      console.log('ℹ️ supplementId column already exists or error:', e.message);
    }
    
    // Add formulationTypeId column
    try {
      await prisma.$executeRaw`ALTER TABLE "QualitySpecification" ADD COLUMN IF NOT EXISTS "formulationTypeId" INTEGER;`;
      console.log('✅ Added formulationTypeId column');
    } catch (e) {
      console.log('ℹ️ formulationTypeId column already exists or error:', e.message);
    }
    
    // Add standardised column
    try {
      await prisma.$executeRaw`ALTER TABLE "QualitySpecification" ADD COLUMN IF NOT EXISTS "standardised" BOOLEAN DEFAULT false;`;
      console.log('✅ Added standardised column');
    } catch (e) {
      console.log('ℹ️ standardised column already exists or error:', e.message);
    }
    
    // Add customSpecs column
    try {
      await prisma.$executeRaw`ALTER TABLE "QualitySpecification" ADD COLUMN IF NOT EXISTS "customSpecs" TEXT;`;
      console.log('✅ Added customSpecs column');
    } catch (e) {
      console.log('ℹ️ customSpecs column already exists or error:', e.message);
    }
    
    // Add updatedAt column
    try {
      await prisma.$executeRaw`ALTER TABLE "QualitySpecification" ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;`;
      console.log('✅ Added updatedAt column');
    } catch (e) {
      console.log('ℹ️ updatedAt column already exists or error:', e.message);
    }
    
    // Step 3: Create foreign key constraints
    console.log('🔗 Creating foreign key constraints...');
    
    try {
      await prisma.$executeRaw`
        ALTER TABLE "QualitySpecification" 
        ADD CONSTRAINT "QualitySpecification_formulationTypeId_fkey" 
        FOREIGN KEY ("formulationTypeId") REFERENCES "FormulationType"("id") ON DELETE SET NULL ON UPDATE CASCADE;
      `;
      console.log('✅ Added formulationTypeId foreign key');
    } catch (e) {
      console.log('ℹ️ formulationTypeId foreign key already exists or error:', e.message);
    }
    
    try {
      await prisma.$executeRaw`
        ALTER TABLE "QualitySpecification" 
        ADD CONSTRAINT "QualitySpecification_herbId_fkey" 
        FOREIGN KEY ("herbId") REFERENCES "Herb"("id") ON DELETE SET NULL ON UPDATE CASCADE;
      `;
      console.log('✅ Added herbId foreign key');
    } catch (e) {
      console.log('ℹ️ herbId foreign key already exists or error:', e.message);
    }
    
    try {
      await prisma.$executeRaw`
        ALTER TABLE "QualitySpecification" 
        ADD CONSTRAINT "QualitySpecification_supplementId_fkey" 
        FOREIGN KEY ("supplementId") REFERENCES "Supplement"("id") ON DELETE SET NULL ON UPDATE CASCADE;
      `;
      console.log('✅ Added supplementId foreign key');
    } catch (e) {
      console.log('ℹ️ supplementId foreign key already exists or error:', e.message);
    }
    
    // Step 4: Create indexes
    console.log('📊 Creating indexes...');
    
    try {
      await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "QualitySpecification_herbId_idx" ON "QualitySpecification"("herbId");`;
      await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "QualitySpecification_supplementId_idx" ON "QualitySpecification"("supplementId");`;
      await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "QualitySpecification_formulationTypeId_idx" ON "QualitySpecification"("formulationTypeId");`;
      console.log('✅ Created indexes');
    } catch (e) {
      console.log('ℹ️ Indexes already exist or error:', e.message);
    }
    
    console.log('✅ Migration completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Run the create-quality-templates.js script');
    console.log('2. Update existing QualitySpecification records to link to herbs/supplements');
    console.log('3. Then you can safely drop old columns');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

migrateQualitySpecs();
