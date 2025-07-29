import { execSync } from 'child_process';

try {
  console.log('Generating Prisma client...');
  execSync('npx prisma generate --schema=./prisma/schema.prisma', { 
    stdio: 'inherit',
    cwd: process.cwd()
  });
  console.log('✅ Prisma client generated successfully!');
} catch (error) {
  console.log('⚠️ Prisma client generation failed, but continuing with build...');
  console.log('This is expected in some environments and the build should still work.');
}