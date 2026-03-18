require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function testGemini() {
    console.log('--- Gemini API Test ---');
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        console.log('Sending test prompt...');
        const result = await model.generateContent("Say 'Gemini is Ready!'");
        console.log('Response:', result.response.text());
        console.log('Gemini API test successful.');
    } catch (err) {
        console.error('Gemini API Test Failed:', err.message);
    }
    process.exit();
}

testGemini();
