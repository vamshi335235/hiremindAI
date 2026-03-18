require('dotenv').config();
const mongoose = require('mongoose');
const OpenAI = require('openai');

async function testEnv() {
    console.log('--- Environment Check ---');
    console.log('MONGODB_URI:', process.env.MONGODB_URI === 'mongodb://localhost:27017/hiremind' ? 'PLACEHOLDER' : 'CUSTOM');
    console.log('OPENAI_API_KEY:', process.env.OPENAI_API_KEY === 'your_openai_api_key_here' ? 'PLACEHOLDER' : 'PROVIDED');

    try {
        console.log('\nTesting MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected successfully.');
    } catch (err) {
        console.error('MongoDB Connection Failed:', err.message);
    }

    try {
        console.log('\nTesting OpenAI API...');
        if (process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
            throw new Error('Using placeholder API key.');
        }
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: "Hello" }],
            max_tokens: 5
        });
        console.log('OpenAI API test successful.');
    } catch (err) {
        console.error('OpenAI API Test Failed:', err.message);
    }

    await mongoose.disconnect();
    process.exit();
}

testEnv();
