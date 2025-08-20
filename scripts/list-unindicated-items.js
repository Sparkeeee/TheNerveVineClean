// Read-only: list herbs and supplements with no indications and no variant links
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
	try {
    const [herbs, supplements] = await Promise.all([
			prisma.herb.findMany({
				select: {
					id: true,
					name: true,
					slug: true,
					_count: { select: { indicationTags: true, symptomVariants: true } },
				},
				orderBy: { name: 'asc' },
			}),
			prisma.supplement.findMany({
				select: {
					id: true,
					name: true,
					slug: true,
					_count: { select: { indicationTags: true, symptomVariants: true } },
				},
				orderBy: { name: 'asc' },
			}),
		]);

		const herbsWithNoIndications = herbs.filter(
			(h) => (h._count.indicationTags === 0) && (h._count.symptomVariants === 0)
		);
		const supplementsWithNoIndications = supplements.filter(
			(s) => (s._count.indicationTags === 0) && (s._count.symptomVariants === 0)
		);

    console.log('=== HERBS WITH NO INDICATIONS (and no variant links) ===');
		if (herbsWithNoIndications.length === 0) {
			console.log('(none)');
		} else {
			herbsWithNoIndications.forEach((h) => console.log(`- ${h.name || '(unnamed)'} (${h.slug || 'no-slug'})`));
		}

    console.log('\n=== SUPPLEMENTS WITH NO INDICATIONS (and no variant links) ===');
		if (supplementsWithNoIndications.length === 0) {
			console.log('(none)');
		} else {
			supplementsWithNoIndications.forEach((s) => console.log(`- ${s.name} (${s.slug || 'no-slug'})`));
		}

    console.log('\nCOUNTS');
    console.log(`Herbs total: ${herbs.length}, unindicated: ${herbsWithNoIndications.length}`);
    console.log(`Supplements total: ${supplements.length}, unindicated: ${supplementsWithNoIndications.length}`);

    // Also write to a JSON file to avoid console truncation
    const fs = require('fs');
    const payload = {
      herbsTotal: herbs.length,
      supplementsTotal: supplements.length,
      unindicatedHerbs: herbsWithNoIndications.map(h => ({ name: h.name || '(unnamed)', slug: h.slug || null })),
      unindicatedSupplements: supplementsWithNoIndications.map(s => ({ name: s.name, slug: s.slug || null })),
    };
    fs.writeFileSync('unindicated-items.json', JSON.stringify(payload, null, 2));
    console.log('\nWrote unindicated-items.json');
	} catch (err) {
		console.error('Error:', err);
	} finally {
		await prisma.$disconnect();
	}
}

main();


