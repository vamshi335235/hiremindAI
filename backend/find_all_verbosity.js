const fs = require('fs');
const content = fs.readFileSync('node_modules/pdf-parse/dist/pdf-parse/cjs/index.cjs', 'utf8');
const search = 'verbosity';
let lastIndex = 0;
while (true) {
    const index = content.indexOf(search, lastIndex);
    if (index === -1) break;
    console.log(`--- MATCH AT ${index} ---`);
    console.log(content.substring(index - 50, index + 50));
    lastIndex = index + 1;
}
