const pdf = require('pdf-parse');
console.log('--- PDF-PARSE INSPECTION ---');
console.log('ROOT TYPE:', typeof pdf);
console.log('ROOT KEYS:', Object.keys(pdf));

if (typeof pdf === 'object' && pdf !== null) {
    for (const key of Object.keys(pdf).slice(0, 20)) {
        console.log(`KEY: ${key} | TYPE: ${typeof pdf[key]}`);
    }
}

try {
    // Some versions export a function directly
    if (typeof pdf === 'function') {
        console.log('PROBABLE MATCH: root is function');
    } else if (pdf.default && typeof pdf.default === 'function') {
        console.log('PROBABLE MATCH: pdf.default is function');
    } else {
        // Look for common function names
        const commonNames = ['parse', 'extract', 'pdf', 'getText'];
        for (const name of commonNames) {
            if (typeof pdf[name] === 'function') {
                console.log(`PROBABLE MATCH: pdf.${name} is function`);
            }
        }
    }
} catch (e) {
    console.error('Inspection error:', e.message);
}
console.log('--- END ---');
