const pdf = require('pdf-parse');
console.log('PDF-PARSE FULL EXPORT:', pdf);
console.log('Keys:', Object.keys(pdf));
if (pdf.default) {
    console.log('Found .default');
}
if (typeof pdf === 'function') {
    console.log('Is a function');
} else if (typeof pdf.default === 'function') {
    console.log('default is a function');
}
