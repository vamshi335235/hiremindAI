const pdf = require('./node_modules/pdf-parse/dist/pdf-parse/cjs/index.cjs');
console.log('PDF-PARSE CJS FULL EXPORT:', pdf);
console.log('Keys:', Object.keys(pdf));
if (typeof pdf === 'function') {
    console.log('It is a function');
} else if (typeof pdf.pdfParse === 'function') {
    console.log('pdf.pdfParse is a function');
} else if (typeof pdf.default === 'function') {
    console.log('pdf.default is a function');
}
