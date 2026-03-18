const pdf = require('pdf-parse/node');
console.log('PDF-PARSE/NODE FULL EXPORT:', pdf);
console.log('Keys:', Object.keys(pdf));
if (typeof pdf === 'function') {
    console.log('It is a function');
} else if (typeof pdf.pdfParse === 'function') {
    console.log('pdf.pdfParse is a function');
} else if (typeof pdf.default === 'function') {
    console.log('pdf.default is a function');
}
