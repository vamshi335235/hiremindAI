const pdf = require('pdf-parse');

async function testPatterns() {
    console.log('--- PATTERN TESTING ---');
    const buffer = Buffer.from('%PDF-1.4\n1 0 obj\n<< /Title (Test) >>\nendobj\ntrailer\n<< /Root 1 0 R >>\n%%EOF');

    console.log('\nPattern 1: new PDFParse({ data: buffer })');
    try {
        const { PDFParse } = pdf;
        const parser = new PDFParse({ data: buffer });
        console.log('Instance created');
        const res = await parser.getText();
        console.log('Success P1');
    } catch (e) {
        console.log('Fail P1:', e.message);
    }

    console.log('\nPattern 2: new PDFParse(buffer)');
    try {
        const { PDFParse } = pdf;
        const parser = new PDFParse(buffer);
        console.log('Instance created');
        const res = await parser.getText();
        console.log('Success P2');
    } catch (e) {
        console.log('Fail P2:', e.message);
    }

    console.log('\nPattern 3: pdf root function (if exists)');
    try {
        const res = await pdf(buffer);
        console.log('Success P3');
    } catch (e) {
        console.log('Fail P3:', e.message);
    }
}

testPatterns();
