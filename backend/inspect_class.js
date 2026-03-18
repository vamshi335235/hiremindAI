const pdf = require('pdf-parse');

console.log('--- INSPECTING PDFParse CLASS ---');
const PDFParse = pdf.PDFParse;
console.log('PROTOTYPE KEYS:', Object.getOwnPropertyNames(PDFParse.prototype));

// Let's also check if there are static methods
console.log('STATIC KEYS:', Object.keys(PDFParse));

console.log('--- END ---');
