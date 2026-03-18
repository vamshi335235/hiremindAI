const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listModels() {
    try {
        // There isn't a direct listModels in the client library in the same way, 
        // but we can try common ones.
        const models = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-pro'];
        for (const m of models) {
            try {
                const model = genAI.getGenerativeModel({ model: m });
                const result = await model.generateContent("test");
                console.log(`MODEL ${m}: SUCCESS`);
            } catch (e) {
                console.log(`MODEL ${m}: FAILED - ${e.message}`);
            }
        }
        process.exit(0);
    } catch (error) {
        console.error("LIST MODELS FAILED:", error.message);
        process.exit(1);
    }
}

listModels();
