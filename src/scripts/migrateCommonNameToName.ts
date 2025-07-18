import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const herbs = await prisma.herb.findMany({ where: { name: null, commonName: { not: null } } });
  for (const herb of herbs) {
    await prisma.herb.update({
      where: { id: herb.id },
      data: { name: herb.commonName }
    });
    console.log(`Migrated commonName to name for herb id ${herb.id}`);
  }
}

main().finally(() => prisma.$disconnect()); 