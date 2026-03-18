const pdf = require('pdf-parse');
const fs = require('fs');

async function testExtraction() {
    console.log('--- TESTING EXTRACTION ---');
    if (pdf.PDFParse && typeof pdf.PDFParse === 'function') {
        console.log('Found pdf.PDFParse function. Attempting to call...');
        try {
            // We need a real-ish buffer or just test if it's a constructor/function
            // Standard pdf-parse is a function: pdf(buffer)
            // Let's see if pdf.PDFParse(buffer) works or if it's a class.
            
            // Just for safety, let's also check if the root 'pdf' itself is callable 
            // even if typeof says object (unlikely in JS but good to be thorough)
            
            console.log('Trying to call pdf.PDFParse as a function...');
            // We'll skip actual buffer call to avoid crash, just check if it returns a promise
            const p = pdf.PDFParse(Buffer.from([]));
            console.log('Called pdf.PDFParse, result type:', typeof p);
        } catch (e) {
            console.log('Call to pdf.PDFParse failed (expected if buffer is empty):', e.message);
        }
    } else {
        console.log('pdf.PDFParse is not a function');
    }
}

testExtraction();
