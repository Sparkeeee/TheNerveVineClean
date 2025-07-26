const symptoms = require('./dist/scripts/data/symptoms.cjs');

console.log('Symptoms keys:', Object.keys(symptoms.symptoms));
console.log('Number of symptoms:', Object.keys(symptoms.symptoms).length);
console.log('First symptom:', Object.keys(symptoms.symptoms)[0]); 