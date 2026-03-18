const fs = require('fs');
const dotenv = require('dotenv');

const envContent = fs.readFileSync('.env', 'utf8');
const env = dotenv.parse(envContent);
const key = env.GEMINI_API_KEY;

console.log('KEY_START');
console.log(key);
console.log('KEY_END');
console.log('KEY_LENGTH:', key ? key.length : 0);
console.log('HEX:', key ? Buffer.from(key).toString('hex') : '');
