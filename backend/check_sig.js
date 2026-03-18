const pdf = require('pdf-parse');

async function checkSignature() {
    const PDFParse = pdf.PDFParse;
    const parser = new PDFParse();
    console.log('getText function:', parser.getText.toString().split('\n')[0]);
}

checkSignature();
