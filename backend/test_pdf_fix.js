const pdf = require('pdf-parse');
const fs = require('fs');

async function testFix() {
    console.log('--- TESTING PDFParse FIX ---');
    try {
        const { PDFParse, VerbosityLevel } = pdf;
        console.log('Constructor:', typeof PDFParse);
        console.log('VerbosityLevel:', typeof VerbosityLevel);

        // Try with empty buffer but correct structure
        const parser = new PDFParse({ 
            data: Buffer.from([]),
            verbosity: VerbosityLevel ? VerbosityLevel.ERRORS : 0
        });
        
        console.log('Parser instance created');
        console.log('Calling getText()...');
        // This will likely fail with "Invalid PDF structure" but SHOULD NOT crash with "verbosity" error
        const result = await parser.getText();
        console.log('Result:', result.text);
    } catch (e) {
        console.log('CAUGHT EXPECTED ERROR:', e.message);
        if (e.stack) {
            console.log('STACK TRACE:', e.stack.split('\n').slice(0, 3).join('\n'));
        }
    }
}

testFix();
