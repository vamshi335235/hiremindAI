const pdf = require('pdf-parse');
const buffer = Buffer.from('%PDF-1.4\n1 0 obj\n<< /Title (Test) >>\nendobj\ntrailer\n<< /Root 1 0 R >>\n%%EOF');

async function test() {
    try {
        console.log('Starting PDF parse test...');
        const data = await pdf(buffer);
        console.log('Parsed text:', data.text);
        console.log('Success!');
    } catch (err) {
        console.error('PDF Parse Error:', err);
    }
}

test();
