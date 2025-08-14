// Read-only check for cannabis-related items in DB and in the v2 mapping doc
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

const terms = ['cannabis', 'cbd', 'hemp', 'cannabidiol', 'marijuana'];

async function main() {
	try {
		const docPath = path.join(process.cwd(), 'SYMPTOM_INDICATION_MAP_MVP_v2.md');
		const doc = fs.existsSync(docPath) ? fs.readFileSync(docPath, 'utf8') : '';
		const docLower = doc.toLowerCase();
		const inDoc = terms.filter(t => docLower.includes(t));

		const herbMatches = await prisma.herb.findMany({
			where: {
				OR: terms.map(t => ({ name: { contains: t, mode: 'insensitive' } })),
			},
			select: { id: true, name: true, slug: true },
			orderBy: { name: 'asc' },
		});

		const supplementMatches = await prisma.supplement.findMany({
			where: {
				OR: terms.map(t => ({ name: { contains: t, mode: 'insensitive' } })),
			},
			select: { id: true, name: true, slug: true },
			orderBy: { name: 'asc' },
		});

		console.log('V2 doc mentions:', inDoc.length ? inDoc.join(', ') : '(none)');
		console.log('\nDB Herb matches:');
		if (herbMatches.length === 0) console.log('(none)');
		else herbMatches.forEach(h => console.log(`- ${h.name} (${h.slug || 'no-slug'})`));

		console.log('\nDB Supplement matches:');
		if (supplementMatches.length === 0) console.log('(none)');
		else supplementMatches.forEach(s => console.log(`- ${s.name} (${s.slug || 'no-slug'})`));
	} catch (err) {
		console.error('Error:', err);
	} finally {
		await prisma.$disconnect();
	}
}

main();


