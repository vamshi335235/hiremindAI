const fs = require('fs');
const content = fs.readFileSync('node_modules/pdf-parse/dist/pdf-parse/cjs/index.cjs', 'utf8');
const index = content.indexOf('verbosity');
if (index !== -1) {
    console.log('CONTEXT:', content.substring(index - 100, index + 100));
} else {
    console.log('NOT FOUND');
}
