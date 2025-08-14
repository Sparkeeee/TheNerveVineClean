// Read-only helper: list available herbs and supplements from the DB
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
	try {
		const [herbs, supplements] = await Promise.all([
			prisma.herb.findMany({ select: { id: true, name: true, slug: true }, orderBy: { name: 'asc' } }),
			prisma.supplement.findMany({ select: { id: true, name: true, slug: true }, orderBy: { name: 'asc' } })
		]);

		console.log('=== HERBS (' + herbs.length + ') ===');
		herbs.forEach(h => console.log(`- ${h.name} (${h.slug})`));

		console.log('\n=== SUPPLEMENTS (' + supplements.length + ') ===');
		supplements.forEach(s => console.log(`- ${s.name} (${s.slug})`));

		// Also print JSON arrays for programmatic reuse if needed
		console.log('\nHERB_NAMES_JSON=' + JSON.stringify(herbs.map(h => h.name)));
		console.log('SUPPLEMENT_NAMES_JSON=' + JSON.stringify(supplements.map(s => s.name)));
	} catch (err) {
		console.error('Error listing items:', err);
	} finally {
		await prisma.$disconnect();
	}
}

main();



