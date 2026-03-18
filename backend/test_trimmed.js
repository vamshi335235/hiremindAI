const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

// Attempt to use a different endpoint or model
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY.trim());

async function check() {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent("Hi");
        console.log("SUCCESS:", result.response.text());
    } catch (e) {
        console.log("ERROR:", e.message);
    }
}
check();
