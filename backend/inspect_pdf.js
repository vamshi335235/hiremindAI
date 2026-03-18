const pdf = require('pdf-parse');
console.log('PDF-PARSE EXPORT:', pdf);
console.log('TYPE:', typeof pdf);
console.log('KEYS:', Object.keys(pdf));
if (pdf.default) {
    console.log('DEFAULT TYPE:', typeof pdf.default);
}
