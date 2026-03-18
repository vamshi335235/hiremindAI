const pdf = require('pdf-parse');
console.log('KEYS:', Object.keys(pdf));
console.log('CONSTRUCTOR:', pdf.constructor.name);
if (typeof pdf === 'function') {
    console.log('It is a function');
} else {
    console.log('It is an object');
}
