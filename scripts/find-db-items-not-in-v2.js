// Read-only utility: list DB herbs/supplements not mentioned in SYMPTOM_INDICATION_MAP_MVP_v2.md
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

function normalizeName(name) {
	return (name || '').trim();
}

async function main() {
	try {
		const docPath = path.join(process.cwd(), 'SYMPTOM_INDICATION_MAP_MVP_v2.md');
		const doc = fs.readFileSync(docPath, 'utf8');
		const docLower = doc.toLowerCase();

		const [herbs, supplements] = await Promise.all([
			prisma.herb.findMany({ select: { name: true, slug: true }, orderBy: { name: 'asc' } }),
			prisma.supplement.findMany({ select: { name: true, slug: true }, orderBy: { name: 'asc' } }),
		]);

		const herbsNotInDoc = herbs
			.map(h => ({ name: normalizeName(h.name), slug: h.slug }))
			.filter(h => h.name && !docLower.includes(h.name.toLowerCase()));

		const suppsNotInDoc = supplements
			.map(s => ({ name: normalizeName(s.name), slug: s.slug }))
			.filter(s => s.name && !docLower.includes(s.name.toLowerCase()));

		console.log('=== HERBS NOT IN v2 DOC ===');
		if (herbsNotInDoc.length === 0) console.log('(none)');
		else herbsNotInDoc.forEach(h => console.log(`- ${h.name} (${h.slug || 'no-slug'})`));

		console.log('\n=== SUPPLEMENTS NOT IN v2 DOC ===');
		if (suppsNotInDoc.length === 0) console.log('(none)');
		else suppsNotInDoc.forEach(s => console.log(`- ${s.name} (${s.slug || 'no-slug'})`));

		fs.writeFileSync('not-in-v2.json', JSON.stringify({ herbsNotInDoc, suppsNotInDoc }, null, 2));
		console.log('\nWrote not-in-v2.json');
	} catch (err) {
		console.error('Error:', err);
	} finally {
		await prisma.$disconnect();
	}
}

main();



