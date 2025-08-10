const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

// This script will help you switch to main branch and create a backup
console.log('Database Backup Strategy for Both Branches\n');
console.log('==========================================\n');

console.log('STEP 1: Current Status');
console.log('✓ Development branch backup created: database_backup_corrected_2025-08-10T15-55-01-237Z.json (632KB)');
console.log('✓ Contains data from: Herb, Supplement, BlogPage, QualitySpecification, Merchant, Product, Indication, ShoppingList\n');

console.log('STEP 2: To backup main branch, you need to:');
console.log('1. Change your .env DATABASE_URL to point to main branch');
console.log('2. Run: npx prisma db pull');
console.log('3. Run: node backup-database-corrected.js\n');

console.log('STEP 3: Current .env DATABASE_URL:');
console.log('postgresql://neondb_owner:npg_tx6oS9aQqiUI@ep-royal-mode-abfztnno-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require');
console.log('This appears to be your main branch (neondb)\n');

console.log('STEP 4: To get development branch URL:');
console.log('1. Go to Neon Dashboard → Your Project → Branches');
console.log('2. Find your development branch');
console.log('3. Copy the connection string\n');

console.log('STEP 5: Backup both branches:');
console.log('1. Set .env to development branch → run backup script');
console.log('2. Set .env to main branch → run backup script');
console.log('3. You\'ll have two complete backups\n');

console.log('Current backup files available:');
const files = fs.readdirSync('.').filter(f => f.startsWith('database_backup'));
files.forEach(file => {
  const stats = fs.statSync(file);
  console.log(`  - ${file} (${(stats.size / 1024).toFixed(1)}KB)`);
});

console.log('\nWould you like me to help you:');
console.log('1. Create a backup of your current main branch?');
console.log('2. Help you find the development branch connection string?');
console.log('3. Create a comprehensive backup strategy?');
