const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

async function test() {
    try {
        const prompt = "Say 'Gemini is working' if you can read this.";
        const result = await model.generateContent(prompt);
        const response = await result.response;
        console.log("RESPONSE:", response.text());
        process.exit(0);
    } catch (error) {
        console.error("GEMINI TEST FAILED:", error.message);
        process.exit(1);
    }
}

test();
