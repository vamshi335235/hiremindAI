const fs = require('fs');
const dotenv = require('dotenv');

const envContent = fs.readFileSync('.env', 'utf8');
const env = dotenv.parse(envContent);
const key = env.GEMINI_API_KEY;

if (key) {
    console.log('KEY:', key);
    console.log('HEX:', Buffer.from(key).toString('hex'));
    console.log('LENGTH:', key.length);
} else {
    console.log('KEY NOT FOUND');
}
