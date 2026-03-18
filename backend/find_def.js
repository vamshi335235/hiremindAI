const fs = require('fs');
const content = fs.readFileSync('node_modules/pdf-parse/dist/pdf-parse/cjs/index.cjs', 'utf8');
const search = 'exports.PDFParse';
const index = content.indexOf(search);
if (index !== -1) {
    console.log('CONTEXT:', content.substring(index, index + 500));
} else {
    console.log('NOT FOUND');
}
