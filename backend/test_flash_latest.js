const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY.trim());

async function check() {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
        const result = await model.generateContent("Check if flash-latest works.");
        console.log("SUCCESS:", result.response.text());
        process.exit(0);
    } catch (e) {
        console.log("ERROR:", e.message);
        process.exit(1);
    }
}
check();
