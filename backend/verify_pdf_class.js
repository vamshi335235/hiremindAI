const { PDFParse } = require('pdf-parse');
console.log('PDFParse type:', typeof PDFParse);
if (PDFParse) {
    const fs = require('fs');
    // We don't have a real PDF here but we can try to instantiate it
    try {
        const dummyBuffer = Buffer.from('%PDF-1.4');
        const parser = new PDFParse({ data: dummyBuffer });
        console.log('Parser instantiated successfully');
    } catch (e) {
        console.log('Instantiation error:', e.message);
    }
}
